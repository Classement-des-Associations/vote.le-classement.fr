import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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
}
