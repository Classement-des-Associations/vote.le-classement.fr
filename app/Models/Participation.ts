import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import {
  BaseModel,
  BelongsTo,
  HasMany,
  ManyToMany,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Association from './Association'
import { compose } from '@ioc:Adonis/Core/Helpers'
import Vote from './Vote'
import Year from './Year'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import ConcoursFilter from './Filters/ConcoursFilter'
import Trophy from './Trophy'
import Category from './Category'

export default class Participation extends compose(BaseModel, Filterable) {
  public static $filter = () => ConcoursFilter

  @column({ isPrimary: true })
  public id: number

  @column()
  public associationId: number

  @column()
  public yearId: number

  @column()
  public trophyId: number | null

  @column()
  public description: string | null

  @attachment({ folder: 'associations/images', preComputeUrl: true })
  public image: AttachmentContract | null

  @attachment({ folder: 'associations/documents', preComputeUrl: true })
  public document: AttachmentContract | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Year)
  public year: BelongsTo<typeof Year>

  @belongsTo(() => Trophy)
  public trophy: BelongsTo<typeof Trophy>

  @belongsTo(() => Association)
  public association: BelongsTo<typeof Association>

  @hasMany(() => Vote)
  public votes: HasMany<typeof Vote>

  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>
}
