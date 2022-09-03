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

Route.get('/', async ({ response }) => {
  return response.redirect().toRoute('AssociationsController.index')
}).as('home')

Route.get('/understand', async ({ view }) => {
  const file = await fs.readFile(Application.makePath('content/understand.md'), 'utf8')
  const html = await Markdown.render(file)

  return view.render('layouts/content', { html })
}).as('understand')

Route.resource('associations', 'AssociationsController').middleware({
  create: ['auth'],
  store: ['auth'],
  edit: ['auth'],
  update: ['auth'],
  destroy: ['auth'],
})
Route.post('associations/:id/send-email-vote', 'AssociationsController.sendEmailVote')

Route.get('associations/:id/vote/:email', 'AssociationsController.vote')

Route.get('check-email', 'VotesController.checkEmail').as('checkEmail')
Route.get('validated', 'VotesController.validated').as('validated')
Route.get('invalidated', 'VotesController.invalidated').as('invalidated')
Route.get('already-voted', 'VotesController.alreadyVoted').as('alreadyVoted')
Route.get('closed', 'VotesController.closed').as('closed')
Route.get('limited', 'VotesController.limited').as('limited')

Route.group(() => {
  Route.get('associations/:id/image/edit', 'AssociationsController.editImage')
  Route.patch('associations/:id/image', 'AssociationsController.updateImage')
  Route.get('associations/:id/document/edit', 'AssociationsController.editDocument')
  Route.patch('associations/:id/document', 'AssociationsController.updateDocument')
  Route.resource('categories', 'CategoriesController')
  Route.resource('schools', 'SchoolsController')
  Route.get('votes', 'VotesController.index')
  Route.get('votes/graph', 'VotesController.graph')
}).middleware('auth')
