import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { AssociationFactory, YearFactory } from 'Database/factories'

export default class extends BaseSeeder {
  public async run() {
    const createdYear = await YearFactory.create()

    await AssociationFactory.with('category', 1)
      .with('school', 1)
      .with('participations', 1, (participation) =>
        participation
          .with('trophy', 1)
          .with('votes', 10, (vote) => vote.merge({ yearId: createdYear.id }))
          .merge({ yearId: createdYear.id })
      )
      .createMany(20)
  }
}
