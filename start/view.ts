import View from '@ioc:Adonis/Core/View'
import Year from 'App/Models/Year'
import { edgeIconify, addCollection } from 'edge-iconify'
import { icons as heroIcons } from '@iconify-json/heroicons'
import { DateTime } from 'luxon'
import Env from '@ioc:Adonis/Core/Env'

View.use(edgeIconify)
addCollection(heroIcons)

View.global('daysRemaining', () => {
  const endDate = new Date(Env.get('END_VOTE_DATE'))
  const end = DateTime.fromJSDate(endDate)
  const now = DateTime.now()

  const diff = end.diff(now)

  if (diff.as('seconds') < 0) return null

  return Math.round(diff.as('days'))
})

View.global('allYears', async () => {
  const years = await Year.query().orderBy('year', 'desc')

  return years
})

View.global('currentYear', async () => {
  const year = await Year.query().orderBy('year', 'desc').firstOrFail()

  return year
})
