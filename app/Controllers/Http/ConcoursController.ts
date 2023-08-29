import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import Year from 'App/Models/Year'
import Drive from '@ioc:Adonis/Core/Drive'
import Participation from 'App/Models/Participation'
import School from 'App/Models/School'
import Env from '@ioc:Adonis/Core/Env'
import { Limiter } from '@adonisjs/limiter/build/services/index'
import StoreVoteValidator from 'App/Validators/StoreVoteValidator'
import Route from '@ioc:Adonis/Core/Route'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import { DateTime } from 'luxon'
import Trophy from 'App/Models/Trophy'
import disposableWildcardEmailDomains from 'disposable-email-domains/wildcard'

export default class ConcoursController {
  public async index({ response }: HttpContextContract) {
    const year = await Year.query().orderBy('year', 'desc').firstOrFail()

    return response.redirect().toRoute('ConcoursController.show', { year: year.slug })
  }

  @bind()
  public async show({ request, view }: HttpContextContract, year: Year) {
    const orderBy = request.input('order_by', 'votes_count')
    const order = request.input('order', 'desc')
    const name = request.input('name', '')
    const category = request.input('category_id', '')
    const school = request.input('school_id', '')
    const trophy = request.input('trophy_id', '')

    const participationsQuery = Database.query()
      .from('participations')
      .select(
        'participations.id',
        'participations.description',
        'participations.image',
        'associations.name',
        Database.raw('array_agg(distinct categories.name) as categories'),
        Database.from('votes')
          .count('votes.id')
          .whereColumn('votes.participation_id', 'participations.id')
          .as('votes_count')
      )
      .where('participations.year_id', year.id)
      .innerJoin(
        'category_participation',
        'participations.id',
        'category_participation.participation_id'
      )
      .innerJoin('categories', 'category_participation.category_id', 'categories.id')
      .innerJoin('associations', 'participations.association_id', 'associations.id')
      .groupBy('participations.id', 'associations.name')

    if (orderBy === 'rand') participationsQuery.orderByRaw('RANDOM ()')
    else participationsQuery.orderBy(orderBy, order)

    if (name) participationsQuery.whereILike('associations.name', `%${name}%`)

    if (category) {
      const dataInPivot = Database.from('category_participation')
        .select('participation_id')
        .where('category_id', category)
      participationsQuery.whereIn('participations.id', dataInPivot)
    }

    if (school) participationsQuery.where('associations.school_id', school)

    if (trophy) participationsQuery.where('participations.trophy_id', trophy)

    const participations = await participationsQuery

    for await (const participation of participations) {
      participation.image.url = await Drive.getUrl(participation.image.name)
    }

    const categories = await Category.query().orderBy('name', 'asc')
    const schools = await School.query().orderBy('name', 'asc')
    const trophies = await Trophy.query().orderBy('name', 'asc')

    return view.render('concours/show', {
      year,
      participations,
      categories: categories.map((c) => {
        return { value: c.id, label: c.name }
      }),
      schools: schools.map((s) => {
        return { value: s.id, label: s.name }
      }),
      trophies: trophies.map((t) => {
        return { value: t.id, label: t.name }
      }),
    })
  }

  @bind()
  public async showParticipation({ request, view }: HttpContextContract, year: Year) {
    const id = request.param('id')
    const participation = await Participation.query()
      .select('description', 'document', 'association_id', 'year_id', 'id')
      .where('year_id', year.id)
      .where('id', id)
      .preload('association', (loader) =>
        loader.select(
          'name',
          'slug',
          'twitter',
          'facebook',
          'instagram',
          'website',
          'tiktok',
          'linkedin',
          'youtube'
        )
      )
      .preload('categories', (loader) => loader.select('name'))
      .preload('year', (loader) => loader.select('year', 'slug'))
      .withCount('votes')
      .firstOrFail()

    const participationInPivot = Database.from('category_participation')
      .select('participation_id')
      .whereIn(
        'category_id',
        participation.categories.map((c) => c.id)
      )

    const relatedParticipations = await Participation.query()
      .whereIn('id', participationInPivot)
      .where('id', '!=', participation.id)
      .select('id', 'description', 'association_id')
      .preload('association', (loader) =>
        loader
          .select('name', 'id', 'school_id')
          .preload('school', (loader) => loader.select('name'))
      )
      .where('year_id', year.id)
      .limit(3)

    return view.render('concours/show-participation', {
      year,
      participation,
      relatedParticipations,
    })
  }

  @bind()
  public async sendVoteEmail(
    { request, response, logger, session }: HttpContextContract,
    year: Year
  ) {
    const id = request.param('id')

    if (!Env.get('ENABLE_VOTE')) {
      logger.warn(`Voting is disabled - will not send email to "${request.input('email')}"`)
      return response
        .redirect()
        .toRoute('ConcoursController.showParticipation', { year: year.slug, id })
    }

    // Voting is finished
    const end = DateTime.fromJSDate(new Date(Env.get('END_VOTE_DATE')))
    const diff = end.diffNow('days').as('seconds')
    if (diff < 0) {
      logger.warn(`Voting is finished - will not send email to "${request.input('email')}"`)
      return response
        .redirect()
        .toRoute('ConcoursController.showParticipation', { year: year.slug, id })
    }

    if (!request.hasBotFieldEmpty()) {
      logger.warn(`Bot field is not empty - will not send email to "${request.input('email')}"`)
      return response
        .redirect()
        .toRoute('ConcoursController.showParticipation', { year: year.slug, id })
    }

    const currentYear = await Year.query().orderBy('year', 'desc').firstOrFail()
    // Only allow voting for the current year
    if (year.id !== currentYear.id) {
      logger.warn(
        `Voting is not allowed for the year ${year.year} - will not send email to "${request.input(
          'email'
        )}"`
      )
      return response
        .redirect()
        .toRoute('ConcoursController.showParticipation', { year: year.slug, id })
    }

    const throttleKey = `vote_${request.ip()}`

    const limiter = Limiter.use({
      requests: 30,
      duration: '1m',
      blockDuration: '15m',
    })

    if (await limiter.isBlocked(throttleKey)) {
      logger.warn(
        `IP "${request.ip()}" blocked for sending email - will not send email to "${request.input(
          'email'
        )}"`
      )
      return response.redirect().toRoute('limited')
    }

    const { email, acceptClassement, acceptPartners } = await request.validate(StoreVoteValidator)

    await limiter.increment(throttleKey)

    const host = email.split('@')[1]
    const topDomain = host.split('.').slice(-2).join('.')
    if (hostBlacklisted.includes(host) || disposableWildcardEmailDomains.includes(topDomain)) {
      session.flash('email', email)
      session.flash('errors.email', 'Le nom de domaine de votre adresse email est blacklisté.')
      return response.redirect().back()
    }

    const participation = await Participation.query()
      .select('id', 'association_id')
      .where('id', id)
      .preload('association', (loader) => loader.select('name'))
      .firstOrFail()

    const signedUrl = Route.makeSignedUrl(
      'ConcoursController.vote',
      { year: year.slug, id: participation.id, email },
      { qs: { acceptClassement, acceptPartners } }
    )

    await new VerifyEmail(email, participation.association.name, signedUrl).sendLater()

    return response.redirect().toRoute('VotesController.checkEmail')
  }

  @bind()
  public async vote({ request, params, logger, response }: HttpContextContract, year: Year) {
    const { email, id } = params
    if (!Env.get('ENABLE_VOTE')) {
      logger.warn(`Voting is disabled - will not accept vote from "${email}"`)
      return response.redirect().toRoute('VotesController.disabled')
    }

    // Voting is finished
    const end = DateTime.fromJSDate(new Date(Env.get('END_VOTE_DATE')))
    const diff = end.diffNow('days').as('seconds')
    if (diff < 0) {
      logger.warn(`Voting is finished - will not accept vote from "${email}"`)
      return response.redirect().toRoute('VotesController.closed')
    }

    if (!request.hasValidSignature()) {
      logger.warn(`Invalid signature - will not accept vote from "${email}"`)
      return response.redirect().toRoute('VotesController.invalidated')
    }

    const { acceptClassement, acceptPartners } = request.qs()
    const participation = await Participation.query()
      .where('id', id)
      .preload('association', (loader) => loader.select('name'))
      .firstOrFail()

    const vote = await participation.related('votes').firstOrCreate(
      { email },
      {
        email,
        yearId: year.id,
        acceptClassement,
        acceptPartners,
      }
    )

    if (vote.$isLocal) {
      logger.info(`Vote created for ${participation.association.name} ${year.year} - "${email}"`)
      return response.redirect().toRoute('VotesController.validated')
    } else {
      logger.warn(`Email has already voted - will not accept vote from "${email}"`)
      return response.redirect().toRoute('VotesController.alreadyVoted')
    }
  }

  @bind()
  public async chart({ view, request }: HttpContextContract, year: Year) {
    const id = request.param('id')
    const participation = await Participation.query()
      .where('id', id)
      .preload('association', (loader) => loader.select('name'))
      .firstOrFail()

    const results = await Database.rawQuery(
      "select count(created_at) as value, date_trunc('day', created_at) as date from votes where participation_id = ? group by date_trunc('day', created_at) order by date asc",
      [participation.id]
    )

    const votes = results.rows as { value: number; date: Date }[]

    return view.render('concours/charts/per-day', {
      votes: {
        labels: [
          ...votes.map((vote) => DateTime.fromISO(vote.date.toISOString()).toFormat('dd/MM')),
        ],
        data: [...votes.map((vote) => vote.value)],
      },
      year,
      participation,
    })
  }
}

/**
 * Workaround of a bug in Adonis/Core/Validator (copy and paste email from disposable email provider)
  @see https://github.com/adonisjs/validator/issues/154
 */
const hostBlacklisted = [
  'yopmail.fr',
  'yopmail.net',
  'yopmail.com',
  'cool.fr.nf',
  'jetable.fr.nf',
  'courriel.fr.nf',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'hide.biz.st',
  'mymail.infos.st',
  'boxomail.live',
  'cdfaq.com',
  'nezid.com',
  'xcoxc.com',
  'edxplus.com',
  'dnitem.com',
  'bongcs.com',
  'dineroa.com',
  'kvhrs.com',
  'orlydns.com',
  'geekjun.com',
  'psnator.com',
  'mailo.icu',
  'teleg.eu',
  'decabg.eu',
  'pahed.com',
  'ploneix.com',
  'freedmail.xyz',
  'toppmail.xyz',
  'smashmail.de',
  'discardmail.com',
  'iunicus.com',
  'keyido.com',
  'laluxy.com',
  'esmoud.com',
  'gotgel.org',
  'mentonit.net',
  'jollyfree.com',
  'rungel.net',
  'ens-paris-saclay.com',
  'vintomaper.com',
  'labworld.org',
  'lutota.com',
  'ishyp.com',
  '163.com',
  'migonom.com',
  'deitada.com',
  'ktolike.fr',
]
