import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'participations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('association_id').unsigned().notNullable()
      table.integer('year_id').unsigned().notNullable()
      table.integer('trophy_id').unsigned().nullable()

      table.text('description').nullable()

      table.json('image').nullable()
      table.json('document').nullable()

      table.unique(['year_id', 'association_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
