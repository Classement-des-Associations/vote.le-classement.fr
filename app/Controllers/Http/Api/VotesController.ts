import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class VotesController {
  public async index({}: HttpContextContract) {
    const votes = await Database.from('votes')
      .select(
        'votes.id',
        'votes.email',
        'votes.association_id',
        'votes.created_at',
        'votes.accept_activities',
        'votes.accept_classement',
        'associations.name as association_name'
      )
      .join('associations', 'associations.id', '=', 'votes.association_id')

    return votes
  }
}
