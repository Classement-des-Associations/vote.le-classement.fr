import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { SchoolFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run() {
    await SchoolFactory.createMany(20)
  }
}
