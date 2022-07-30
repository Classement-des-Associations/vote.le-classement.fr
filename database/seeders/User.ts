import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    const username = Env.get('AUTH_USERNAME')
    const password = Env.get('AUTH_PASSWORD')

    await User.create({
      username,
      password,
    })
  }
}
