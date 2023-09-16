import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Vote from 'App/Models/Vote'
import Year from 'App/Models/Year'
import { DateTime } from 'luxon'

export default class ChartsController {
  public async index({ view }: HttpContextContract) {
    const years = await Year.query().orderBy('year', 'desc')
    return view.render('votes/charts/index', { years })
  }

  public async totalByDay({ view, request }: HttpContextContract) {
    const qs = request.qs()

    const result = await Database.from(Vote.filter(qs).as('votes'))
      .select(Database.raw("date_trunc('day', created_at) as date"))
      .count('id as value')
      .groupByRaw("date_trunc('day', created_at)")
      .orderBy('date')

    const votes = result as { value: Number; date: Date }[]

    return view.render('votes/charts/total-by-day', {
      votes: {
        labels: [
          ...votes.map((vote) => DateTime.fromISO(vote.date.toISOString()).toFormat('dd/LL')),
        ],
        data: [...votes.map((vote) => vote.value)],
      },
    })
  }

  public async totalByHour({ view, request }: HttpContextContract) {
    const qs = request.qs()

    const result = await Database.from(Vote.filter(qs).as('votes'))
      .select(Database.raw("date_trunc('hour', created_at) as date"))
      .count('id as value')
      .groupByRaw("date_trunc('hour', created_at)")
      .orderBy('date')

    const votes = result as { value: Number; date: Date }[]

    return view.render('votes/charts/total-by-hour', {
      votes: {
        labels: [
          ...votes.map((vote) =>
            DateTime.fromISO(vote.date.toISOString()).toFormat('HH:mm - dd/LL')
          ),
        ],
        data: [...votes.map((vote) => vote.value)],
      },
    })
  }

  @bind()
  public async topAssociations({ request, view }: HttpContextContract, year: Year) {
    const limit = request.input('limit', 10)

    const votes = await Database.from('votes')
      .select('associations.name as label')
      .where('votes.year_id', year.id)
      .count('votes.id as value')
      .join('participations', 'votes.participation_id', '=', 'participations.id')
      .join('associations', 'participations.association_id', '=', 'associations.id')
      .groupBy('votes.participation_id', 'associations.name')
      .orderBy('value', 'desc')
      .limit(limit)

    return view.render('votes/charts/top-associations', {
      votes: {
        labels: JSON.stringify(votes.map((vote) => vote.label)),
        data: JSON.stringify(votes.map((vote) => vote.value)),
      },
      backgroundColors: JSON.stringify(
        votes.map((_, index) => 'hsl(' + Math.floor((360 / 10) * index + 12) + ', 100%, 84%)')
      ),
      borderColors: JSON.stringify(
        votes.map((_, index) => 'hsl(' + Math.floor((360 / 10) * index + 12) + ', 100%, 58%)')
      ),
      numberOfAssociations: votes.length,
    })
  }

  /**
   * Used to draw a chart of the most voted association day by day
   */
  @bind()
  public async topAssociationsByDay({ view, request }: HttpContextContract, year: Year) {
    const limit = request.input('limit', 10)

    // Get the ten most voted associations ids for the given year
    const participationsIds = Database.from(
      Database.from('votes')
        .select('participation_id')
        .where('votes.year_id', year.id)
        .count('id')
        .groupBy('participation_id')
        .orderBy('count', 'desc')
        .limit(limit)
        .as('most_voted')
    ).select('participation_id')

    // Group votes by date and association id
    const result = await Database.from('votes')
      .select('name')
      .select(Database.raw("date_trunc('day', votes.created_at) as date"))
      .where('votes.year_id', year.id)
      .whereIn('votes.participation_id', participationsIds)
      .count('participation_id')
      .join('participations', 'votes.participation_id', '=', 'participations.id')
      .join('associations', 'participations.association_id', '=', 'associations.id')
      .groupBy('name')
      .groupByRaw("date_trunc('day', votes.created_at)")
      .orderBy('name')
      .orderBy('date')

    const votes = result as unknown as {
      date: Date
      count: number
      name: string
    }[]

    const votesByAssociation = votes.reduce((acc, vote) => {
      const index = acc.findIndex((v) => v.label === vote.name)

      if (index === -1) {
        acc.push({
          fill: false,
          borderColor: 'hsl(' + Math.floor((360 / 10) * acc.length + 12) + ', 100%, 63%)',
          tension: 0.1,
          label: vote.name,
          data: [
            {
              x: vote.date.toISOString(),
              y: vote.count,
            },
          ],
        })
      } else {
        acc[index].data.push({
          x: vote.date.toISOString(),
          y: vote.count,
        })
      }

      return acc
    }, [] as { fill: boolean; borderColor: string; tension: number; label: string; data: { x: string; y: number }[] }[])

    return view.render('votes/charts/top-associations-by-day', {
      votes: JSON.stringify(votesByAssociation),
      numberOfAssociations: votesByAssociation.length,
    })
  }

  // public async acceptNewsClassement({ view }) {
  //   const result = await Database.from('votes')
  //     .select('accept_classement')
  //     .count('id')
  //     .groupBy('accept_classement')
  //     .orderBy('accept_classement')

  //   return view.render('votes/charts/accept-news-classement', {
  //     votes: {
  //       labels: JSON.stringify(result.map((vote) => (vote.accept_classement ? 'Oui' : 'Non'))),
  //       data: JSON.stringify(result.map((vote) => vote.count)),
  //     },
  //   })
  // }

  // public async acceptNewsActivities({ view }) {
  //   const result = await Database.from('votes')
  //     .select('accept_activities')
  //     .count('id')
  //     .groupBy('accept_activities')
  //     .orderBy('accept_activities')

  //   return view.render('votes/charts/accept-news-activities', {
  //     votes: {
  //       labels: JSON.stringify(result.map((vote) => (vote.accept_activities ? 'Oui' : 'Non'))),
  //       data: JSON.stringify(result.map((vote) => vote.count)),
  //     },
  //   })
  // }
}
