import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vote from 'App/Models/Vote'

export default class VotesController {
  public async index({ view }: HttpContextContract) {
    const votes = await Vote.query()
      .preload('association', (loader) => {
        loader.select('name')
      })
      .orderBy('created_at', 'desc')

    return view.render('votes/index', { votes })
  }
}
