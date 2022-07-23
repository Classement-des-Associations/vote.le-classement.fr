import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'associations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('slug', 255).notNullable().unique()
      table.string('name', 255).notNullable().unique()
      table.text('description').nullable()

      table.string('facebook', 255).nullable()
      table.string('twitter', 255).nullable()
      table.string('instagram', 255).nullable()
      table.string('linkedin', 255).nullable()
      table.string('website', 255).nullable()

      table.integer('school_id').unsigned().references('id').inTable('schools').notNullable()
      table.integer('category_id').unsigned().references('id').inTable('categories').notNullable()

      table.json('image').nullable()
      table.json('document').nullable()

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
