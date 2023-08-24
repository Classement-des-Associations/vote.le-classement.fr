/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/
import Application from '@ioc:Adonis/Core/Application'
import Route from '@ioc:Adonis/Core/Route'
import Markdown from 'App/Services/Markdown'
import fs from 'fs/promises'

Route.get('/', ({ response }) => {
  return response.redirect().toRoute('ConcoursController.index')
}).as('home')

Route.get('/concours', 'ConcoursController.index')
Route.get('/concours/:year', 'ConcoursController.show')
Route.get('/concours/:year/participations/:id', 'ConcoursController.showParticipation')
Route.post(
  '/concours/:year/participations/:id/votes/send-email',
  'ConcoursController.sendVoteEmail'
)
Route.get('/concours/:year/participations/:id/votes/validate/:email', 'ConcoursController.vote')
Route.get('/concours/:year/participations/:id/charts/per-day', 'ConcoursController.chart')

Route.get('/understand', async ({ response }) => {
  return response.redirect().status(301).toRoute('understand')
})
Route.get('/comprendre-la-plateforme', async ({ view }) => {
  const file = await fs.readFile(Application.makePath('content/understand.md'), 'utf8')
  const html = await Markdown.render(file)

  return view.render('layouts/content', { html })
}).as('understand')

Route.get('/terms', async ({ response }) => {
  return response.redirect().status(301).toRoute('terms')
})
Route.get('/cgu', async ({ view }) => {
  const file = await fs.readFile(Application.makePath('content/terms.md'), 'utf8')
  const html = await Markdown.render(file)

  return view.render('layouts/content', { html })
}).as('terms')

Route.group(() => {
  Route.get('check-email', 'VotesController.checkEmail')
  Route.get('validated', 'VotesController.validated')
  Route.get('invalidated', 'VotesController.invalidated')
  Route.get('already-voted', 'VotesController.alreadyVoted')
  Route.get('disabled', 'VotesController.disabled')
  Route.get('closed', 'VotesController.closed')
  Route.get('limited', 'VotesController.limited')
}).prefix('votes')

Route.group(() => {
  Route.resource('participations', 'ParticipationsController')
  Route.get('participations/:id/image/edit', 'ParticipationsController.editImage')
  Route.patch('participations/:id/image', 'ParticipationsController.updateImage')
  Route.get('participations/:id/document/edit', 'ParticipationsController.editDocument')
  Route.patch('participations/:id/document', 'ParticipationsController.updateDocument')

  Route.resource('associations', 'AssociationsController')
  Route.resource('trophies', 'TrophiesController')
  Route.resource('categories', 'CategoriesController')
  Route.resource('schools', 'SchoolsController')
  Route.resource('years', 'YearsController')

  // TODO: update all these charts
  Route.get('votes', 'VotesController.index')
  Route.get('votes/charts', 'ChartsController.index')
  Route.get('votes/charts/total-by-day', 'ChartsController.totalByDay')
  Route.get('votes/charts/total-by-hour', 'ChartsController.totalByHour')
  Route.get('votes/charts/top-associations', 'ChartsController.topAssociations')
  Route.get('votes/charts/top-associations-by-day', 'ChartsController.topAssociationsByDay')
  Route.get('votes/charts/accept-news-classement', 'ChartsController.acceptNewsClassement')
  Route.get('votes/charts/accept-news-activities', 'ChartsController.acceptNewsActivities')

  Route.group(() => {
    Route.get('votes', 'VotesController.index')
  })
    .prefix('api')
    .namespace('App/Controllers/Http/Api')
}).middleware('auth')
