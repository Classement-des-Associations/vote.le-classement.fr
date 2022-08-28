import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'associations'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Add new columns for TikTok and YouTube
      table.string('tiktok', 255).nullable()
      table.string('youtube', 255).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
