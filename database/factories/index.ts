import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import Drive from '@ioc:Adonis/Core/Drive'
import { file } from '@ioc:Adonis/Core/Helpers'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Association from 'App/Models/Association'
import Category from 'App/Models/Category'
import Participation from 'App/Models/Participation'
import School from 'App/Models/School'
import Trophy from 'App/Models/Trophy'
import Vote from 'App/Models/Vote'
import Year from 'App/Models/Year'

export const CategoryFactory = Factory.define(Category, ({ faker }) => ({
  name: faker.lorem.words(),
})).build()

export const TrophyFactory = Factory.define(Trophy, ({ faker }) => ({
  name: faker.lorem.words(),
})).build()

export const SchoolFactory = Factory.define(School, ({ faker }) => ({
  name: faker.lorem.words(),
})).build()

export const VoteFactory = Factory.define(Vote, ({ faker }) => ({
  email: faker.internet.email(),
  acceptClassement: faker.datatype.boolean(),
  acceptPartners: faker.datatype.boolean(),
}))
  .relation('year', () => YearFactory)
  .relation('participation', () => ParticipationFactory)
  .build()

export const YearFactory = Factory.define(Year, ({ faker }) => ({
  year: faker.date.future().getFullYear().toString(),
}))
  .relation('votes', () => VoteFactory)
  .relation('participations', () => ParticipationFactory)
  .build()

export const AssociationFactory = Factory.define(Association, async ({ faker }) => {
  return {
    name: faker.lorem.words(),
    facebook: faker.internet.url(),
    instagram: faker.internet.url(),
    twitter: faker.internet.url(),
    linkedin: faker.internet.url(),
    youtube: faker.internet.url(),
    tiktok: faker.internet.url(),
  }
})
  .relation('category', () => CategoryFactory)
  .relation('school', () => SchoolFactory)
  .relation('participations', () => ParticipationFactory)
  .build()

export const ParticipationFactory = Factory.define(Participation, async ({ faker }) => {
  const image = new Attachment({
    extname: 'png',
    mimeType: 'image/png',
    size: 10 * 1000,
    name: `${faker.random.alphaNumeric(10)}.png`,
  })
  image.isPersisted = true

  await Drive.put(image.name, (await file.generatePng('1mb')).contents)

  const document = new Attachment({
    extname: 'pdf',
    mimeType: 'application/pdf',
    size: 10 * 1000,
    name: `${faker.random.alphaNumeric(10)}.pdf`,
  })
  document.isPersisted = true

  await Drive.put(document.name, (await file.generatePdf('1mb')).contents)

  return {
    description: faker.lorem.paragraph(),
    image,
    document,
  }
})
  .relation('trophy', () => TrophyFactory)
  .relation('year', () => YearFactory)
  .relation('association', () => AssociationFactory)
  .relation('votes', () => VoteFactory)
  .build()
