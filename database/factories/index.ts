import Factory from '@ioc:Adonis/Lucid/Factory'

import School from 'App/Models/School'
import Category from 'App/Models/Category'

export const CategoryFactory = Factory.define(Category, ({ faker }) => ({
  name: faker.lorem.words(),
})).build()

export const SchoolFactory = Factory.define(School, ({ faker }) => ({
  name: faker.lorem.words(),
})).build()
