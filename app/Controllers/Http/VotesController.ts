import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Vote from 'App/Models/Vote'

export default class VotesController {
  public async index({ view }: HttpContextContract) {
    const votes = await Vote.query()
      .preload('association', (loader) => {
        loader.select('name', 'slug')
      })
      .orderBy('created_at', 'desc')

    const total = await Database.from('votes').count('* as total')

    return view.render('votes/index', { votes, total: total[0].total })
  }
}
