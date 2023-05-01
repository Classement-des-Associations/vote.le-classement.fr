import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'votes'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('accept_activities')

      table.integer('participation_id').unsigned().nullable()
      table.integer('year_id').unsigned().nullable()
      table.boolean('accept_partners').nullable().defaultTo(false)
    })

    this.defer(async (db) => {
      const year = await db.from('years').select('id').where('year', '2022').firstOrFail()

      const votes = await db.from('votes').select('id', 'association_id')

      await Promise.all(
        votes.map(async (vote) => {
          const participation = await db
            .from('participations')
            .select('id')
            .where('association_id', vote.association_id)
            .firstOrFail()

          vote.participation_id = participation.id
          vote.year_id = year.id
          return db.from('votes').where('id', vote.id).update(vote)
        })
      )
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('association_id')

      table.unique(['year_id', 'email'])
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropUnique(['year_id', 'email'])

      table.integer('association_id').unsigned().nullable()
    })

    this.defer(async (db) => {
      const votes = await db.from('votes').select('id', 'participation_id')

      await Promise.all(
        votes.map(async (vote) => {
          const association = await db
            .from('participations')
            .select('association_id')
            .where('id', vote.participation_id)
            .firstOrFail()

          vote.association_id = association.association_id
          return db.from('votes').where('id', vote.id).update(vote)
        })
      )
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('accept_partners')
      table.dropColumn('year_id')
      table.dropColumn('participation_id')

      table.boolean('accept_activities').nullable().defaultTo(false)
    })
  }
}
