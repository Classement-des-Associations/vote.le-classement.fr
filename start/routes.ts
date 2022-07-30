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

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ response }) => {
  return response.redirect().toRoute('AssociationsController.index')
}).as('home')

Route.get('/vote-accepted', () => {
  return 'Votre vote a été pris en compte'
}).as('vote-accepted')

Route.get('/vote-refused', () => {
  return "Votre vote n'a pas été pris en compte"
}).as('vote-refused')

Route.get('/vote-already-done', () => {
  return 'Vous avez déjà voté'
}).as('vote-already-done')

Route.resource('associations', 'AssociationsController').middleware({
  create: ['auth'],
  store: ['auth'],
  edit: ['auth'],
  update: ['auth'],
  destroy: ['auth'],
})
Route.post('associations/:id/send-email-vote', 'AssociationsController.sendEmailVote')
Route.get('associations/:id/vote/:email', 'AssociationsController.vote')

Route.group(() => {
  Route.get('associations/:id/image/edit', 'AssociationsController.editImage')
  Route.patch('associations/:id/image', 'AssociationsController.updateImage')
  Route.get('associations/:id/document/edit', 'AssociationsController.editDocument')
  Route.patch('associations/:id/document', 'AssociationsController.updateDocument')
  Route.resource('categories', 'CategoriesController')
  Route.resource('schools', 'SchoolsController')
}).middleware('auth')
