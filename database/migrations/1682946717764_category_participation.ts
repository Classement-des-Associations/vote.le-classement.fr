import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_participation'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('category_id').unsigned().notNullable()
      table.integer('participation_id').unsigned().notNullable()

      table.primary(['category_id', 'participation_id'])

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
