import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'years'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('year', 4).notNullable()
      table.string('slug', 4).notNullable().unique()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer(async (db) => {
      try {
        await db
          .table('years')
          .insert({ year: '2022', slug: '2022', created_at: new Date(), updated_at: new Date() })
      } catch (error) {
        console.log(error)
      }
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
