import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'associations'

  public async up() {
    this.defer(async (db) => {
      const year = await db.from('years').select('id').where('year', '2022').firstOrFail()

      const associations = await db
        .from('associations')
        .select('id', 'description', 'image', 'document')

      await Promise.all(
        associations.map(async (association) => {
          return db.table('participations').insert({
            year_id: year.id,
            association_id: association.id,
            description: association.description,
            image: association.image,
            document: association.document,
          })
        })
      )
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('description', 'image', 'document')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('description').nullable()
      table.json('image').nullable()
      table.json('document').nullable()
    })

    this.defer(async (db) => {
      const year = await db.from('years').select('id').where('year', '2022').firstOrFail()

      const participations = await db
        .from('participations')
        .select('id', 'description', 'image', 'document')
        .where('year_id', year.id)

      await Promise.all(
        participations.map(async (participation) => {
          return db.from('associations').where('id', participation.id).update({
            description: participation.description,
            image: participation.image,
            document: participation.document,
          })
        })
      )
    })
  }
}
