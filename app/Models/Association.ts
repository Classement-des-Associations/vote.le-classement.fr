import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Category from './Category'
import AssociationFilter from './Filters/AssociationFilter'
import School from './School'
import Vote from './Vote'

export default class Association extends compose(BaseModel, Filterable) {
  public static $filter = () => AssociationFilter
  public static routeLookupKey = 'slug'

  @column({ isPrimary: true })
  public id: number

  @column()
  @slugify({
    strategy: 'simple',
    fields: ['name'],
    allowUpdates: true,
  })
  public slug: string

  @column()
  public name: string

  @column()
  public description?: string

  @column()
  public facebook?: string

  @column()
  public twitter?: string

  @column()
  public instagram?: string

  @column()
  public linkedin?: string

  @column()
  public tiktok?: string

  @column()
  public youtube?: string

  @column()
  public website?: string

  @column()
  public categoryId?: number

  @column()
  public schoolId?: number

  @attachment({ folder: 'associations/images', preComputeUrl: true })
  public image: AttachmentContract | null

  @attachment({ folder: 'associations/documents', preComputeUrl: true })
  public document: AttachmentContract | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @belongsTo(() => School)
  public school: BelongsTo<typeof School>

  @hasMany(() => Vote)
  public votes: HasMany<typeof Vote>
}
