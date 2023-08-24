import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import VoteFilter from './Filters/VoteFilter'
import Participation from './Participation'
import Year from './Year'

export default class Vote extends compose(BaseModel, Filterable) {
  public static $filter = () => VoteFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public associationId: number

  @column()
  public yearId: number

  @column()
  public participationId: number

  @column()
  public email: string

  @column()
  public acceptClassement: boolean

  @column()
  public acceptPartners: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Year)
  public year: BelongsTo<typeof Year>

  @belongsTo(() => Participation)
  public participation: BelongsTo<typeof Participation>
}
