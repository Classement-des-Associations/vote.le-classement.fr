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

      const associationsWithParticipations = await db
        .from('associations')
        .select('category_id', 'participations.id as participation_id')
        .join('participations', 'associations.id', '=', 'participations.association_id')
        .where('participations.year_id', year.id)

      await Promise.all(
        associationsWithParticipations.map(async (association) => {
          return db.table('category_participation').insert({
            category_id: association.category_id,
            participation_id: association.participation_id,
          })
        })
      )
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('description', 'image', 'document', 'category_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('description').nullable()
      table.json('image').nullable()
      table.json('document').nullable()
      table.integer('category_id').unsigned().nullable()
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

      const participationsWithCategories = await db
        .from('participations')
        .select(
          'category_participation.category_id as category_id',
          'participations.association_id as association_id'
        )
        .join(
          'category_participation',
          'participations.id',
          '=',
          'category_participation.participation_id'
        )
        .where('participations.year_id', year.id)

      await Promise.all(
        participationsWithCategories.map(async (participation) => {
          return db.from('associations').where('id', participation.association_id).update({
            category_id: participation.category_id,
          })
        })
      )
    })
  }
}
