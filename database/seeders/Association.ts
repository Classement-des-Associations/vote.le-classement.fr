import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { AssociationFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run() {
    await AssociationFactory.with('category', 1).with('school', 1).createMany(10)
  }
}
