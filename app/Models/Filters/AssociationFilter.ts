import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Association from 'App/Models/Association'

export default class AssociationFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Association, Association>

  public setup() {
    if (!this.$input['order_by']) {
      this.$query.orderBy('votes_count', 'desc')
    }
  }

  public orderBy(field: string) {
    if (field === 'rand') this.$query.orderByRaw('RANDOM ()')
    else this.$query.orderBy(field, this.$input['order'] ?? 'asc')
  }

  public name(name: string) {
    return this.$query.whereILike('name', `%${name}%`)
  }

  public category(id: number) {
    this.$query.where('category_id', id)
  }

  public school(id: number) {
    this.$query.where('school_id', id)
  }
}
