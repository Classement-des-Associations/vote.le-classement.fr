import View from '@ioc:Adonis/Core/View'
import { DateTime } from 'luxon'

View.global('timeRemaining', () => {
  const end = DateTime.local(2022, 10, 1, 0, 0, 0)

  const now = DateTime.local()

  const diff = end.diff(now, 'days').toObject()
  const days = diff.days

  return Math.ceil(days ?? 0)
})
