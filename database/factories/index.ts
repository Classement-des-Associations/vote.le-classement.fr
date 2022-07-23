import Factory from '@ioc:Adonis/Lucid/Factory'

import School from 'App/Models/School'

export const SchoolFactory = Factory.define(School, ({ faker }) => ({
  name: faker.lorem.words(),
})).build()
