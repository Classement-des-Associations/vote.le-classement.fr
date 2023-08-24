import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Participation from '../Participation'

export default class ConcoursFilter extends BaseModelFilter {
  public $query: ModelQueryBuilderContract<typeof Participation, Participation>

  public setup() {
    if (!this.$input['order']) this.$query.orderBy('votes_count', 'desc')
  }

  public orderBy(field: string) {
    if (field === 'rand') this.$query.orderByRaw('RANDOM ()')
    else
      this.$query.whereHas('association', (query) => {
        query.orderBy(field, this.$input['order'] ?? 'asc')
      })
    // must order on the association table since the field is not on the participation table
    // else this.$query.orderBy(`association.${field}`, this.$input['order'] ?? 'asc')
  }

  public name(name: string) {
    return this.$query.whereHas('association', (query) => {
      query.where('name', 'ilike', `%${name}%`)
    })
  }

  public category(id: number) {
    this.$query.whereHas('association', (query) => {
      query.where('category_id', id)
    })
  }

  public school(id: number) {
    this.$query.whereHas('association', (query) => {
      query.where('school_id', id)
    })
  }
}
