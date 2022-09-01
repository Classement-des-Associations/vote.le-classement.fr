import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Vote from 'App/Models/Vote'

export default class VoteFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Vote, Vote>

  public orderBy(field: string) {
    this.$query.orderBy(field, this.$input['order'] ?? 'asc')
  }

  public email(email: string) {
    this.$query.whereLike('email', `%${email}%`)
  }

  public association(id: number) {
    this.$query.where('association_id', id)
  }
}
