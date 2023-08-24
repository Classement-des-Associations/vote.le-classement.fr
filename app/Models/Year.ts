import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Vote from './Vote'
import Participation from './Participation'

export default class Year extends BaseModel {
  public static routeLookupKey = 'slug'

  @column({ isPrimary: true })
  public id: number

  @column()
  @slugify({
    strategy: 'simple',
    fields: ['year'],
    allowUpdates: true,
  })
  public slug: string

  @column()
  public year: string

  @hasMany(() => Vote)
  public votes: HasMany<typeof Vote>

  @hasMany(() => Participation)
  public participations: HasMany<typeof Participation>
}
