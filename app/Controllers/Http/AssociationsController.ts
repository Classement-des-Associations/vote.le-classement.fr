import { Limiter } from '@adonisjs/limiter/build/services/index'
import { bind } from '@adonisjs/route-model-binding'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Env from '@ioc:Adonis/Core/Env'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import VerifyEmail from 'App/Mailers/VerifyEmail'
import Association from 'App/Models/Association'
import Category from 'App/Models/Category'
import School from 'App/Models/School'
import AssociationDocumentUpdateValidator from 'App/Validators/AssociationDocumentUpdateValidator'
import AssociationImageUpdateValidator from 'App/Validators/AssociationImageUpdateValidator'
import AssociationStoreValidator from 'App/Validators/AssociationStoreValidator'
import AssociationUpdateValidator from 'App/Validators/AssociationUpdateValidator'
import VoteStoreValidator from 'App/Validators/VoteStoreValidator'
import { DateTime } from 'luxon'

export default class AssociationsController {
  public async index({ request, view }: HttpContextContract) {
    const associations = await Association.filter(request.qs())
      .withCount('votes')
      .preload('category')
      .preload('school')

    const categories = await Category.query().orderBy('name', 'asc')
    const schools = await School.query().orderBy('name', 'asc')

    return view.render('associations/index', {
      associations,
      categories: categories.map((c) => {
        return { value: c.id, label: c.name }
      }),
      schools: schools.map((s) => {
        return { value: s.id, label: s.name }
      }),
    })
  }

  public async create({ view }: HttpContextContract) {
    const categories = await Category.query().orderBy('name', 'asc')
    const schools = await School.query().orderBy('name', 'asc')

    return view.render('associations/create', {
      categories: categories.map((c) => {
        return { value: c.id, label: c.name }
      }),
      schools: schools.map((s) => {
        return { value: s.id, label: s.name }
      }),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const { image, document, ...data } = await request.validate(AssociationStoreValidator)

    const association = new Association()

    association.merge(data)

    if (image) association.image = Attachment.fromFile(image)
    if (document) association.document = Attachment.fromFile(document)

    await association.save()

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async show({ view }: HttpContextContract, association: Association) {
    await association.load((loader) => {
      loader.preload('category')
      loader.preload('school')
    })

    await association.loadCount('votes')

    const relatedAssociations = await Association.query()
      .where('category_id', association.categoryId ?? 0)
      .where('id', '!=', association.id)
      .preload('school')
      .limit(3)
    return view.render('associations/show', { association, relatedAssociations })
  }

  @bind()
  public async edit({ view }: HttpContextContract, association: Association) {
    const categories = await Category.query().orderBy('name', 'asc')
    const schools = await School.query().orderBy('name', 'asc')

    return view.render('associations/edit', {
      association,
      schools: schools.map((s) => {
        return {
          value: s.id,
          label: s.name,
        }
      }),
      categories: categories.map((c) => {
        return {
          value: c.id,
          label: c.name,
        }
      }),
    })
  }

  @bind()
  public async update({ request, response }: HttpContextContract, association: Association) {
    const data = await request.validate(AssociationUpdateValidator)

    association.merge(data)
    await association.save()

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async editImage({ view }: HttpContextContract, association: Association) {
    return view.render('associations/edit-image', { association })
  }

  @bind()
  public async updateImage({ request, response }: HttpContextContract, association: Association) {
    const { image } = await request.validate(AssociationImageUpdateValidator)

    association.image = image ? Attachment.fromFile(image) : null
    await association.save()

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async editDocument({ view }: HttpContextContract, association: Association) {
    return view.render('associations/edit-document', { association })
  }

  @bind()
  public async updateDocument(
    { request, response }: HttpContextContract,
    association: Association
  ) {
    const { document } = await request.validate(AssociationDocumentUpdateValidator)

    association.document = document ? Attachment.fromFile(document) : null
    await association.save()

    return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
  }

  @bind()
  public async destroy({ response }: HttpContextContract, association: Association) {
    await association.delete()

    return response.redirect().toRoute('AssociationsController.index')
  }

  @bind()
  public async sendEmailVote(
    { request, response, logger }: HttpContextContract,
    association: Association
  ) {
    if (!Env.get('ENABLE_VOTE')) {
      logger.warn(`Voting is disabled - Can't send email - "${request.input('email')}"`)
      return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
    }

    if (!request.hasBotFieldEmpty()) {
      logger.warn(`Bot field is not empty - "${request.input('email')}"`)
      return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
    }

    const throttleKey = `vote_${request.ip()}`

    const limiter = Limiter.use({
      requests: 30,
      duration: '1m',
      blockDuration: '15m',
    })

    if (await limiter.isBlocked(throttleKey)) {
      logger.warn(`IP blocked for sending email - "${request.ip()}"`)
      return response.redirect().toRoute('limited')
    }

    const { email, acceptClassement, acceptActivities } = await request.validate(VoteStoreValidator)

    /**
     * Workaround of a bug in Adonis/Core/Validator
      @see https://github.com/adonisjs/validator/issues/154
    */
    const hostBlacklist = [
      'yopmail.fr',
      'yopmail.net',
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
    ]

    if (hostBlacklist.includes(email.split('@')[1])) {
      logger.warn(`Host is blacklisted - ${email}`)
      return response.redirect().toRoute('AssociationsController.show', { id: association.slug })
    }

    await limiter.increment(throttleKey)

    const signedUrl = Route.makeSignedUrl(
      'AssociationsController.vote',
      { id: association.slug, email },
      {
        qs: { acceptClassement, acceptActivities },
      }
    )

    await new VerifyEmail(email, association.name, signedUrl).sendLater()

    return response.redirect().toRoute('checkEmail')
  }

  @bind()
  public async vote(
    { request, params, logger, response }: HttpContextContract,
    association: Association
  ) {
    if (!Env.get('ENABLE_VOTE')) {
      logger.warn(`Voting is disabled - Can't validate email - "${params.email}"`)
      return response.redirect().toRoute('closed')
    }

    if (!request.hasValidSignature()) {
      logger.warn(`Invalid signature - "${params.email}"`)
      return response.redirect().toRoute('invalidated')
    }

    const { email } = params
    const { acceptClassement, acceptActivities } = request.qs()

    const vote = await association.related('votes').firstOrCreate(
      { email },
      {
        email,
        acceptClassement,
        acceptActivities,
      }
    )

    if (vote.$isLocal) {
      logger.info(`Vote created - "${email}"`)
      return response.redirect().toRoute('validated')
    } else {
      logger.warn(`Email has already voted - "${email}"`)
      return response.redirect().toRoute('alreadyVoted')
    }
  }

  @bind()
  public async chart({ view }: HttpContextContract, association: Association) {
    const results = await Database.rawQuery(
      "select count(created_at) as value, date_trunc('day', created_at) as date from votes where association_id = ? group by date_trunc('day', created_at) order by date asc",
      [association.id]
    )

    const votes = results.rows as { value: number; date: Date }[]

    return view.render('associations/chart', {
      votes: {
        labels: [
          ...votes.map((vote) => DateTime.fromISO(vote.date.toISOString()).toFormat('dd/MM')),
        ],
        data: [...votes.map((vote) => vote.value)],
      },
      association,
    })
  }
}
