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

Route.resource('associations', 'AssociationsController')
Route.get('associations/:id/image/edit', 'AssociationsController.editImage')
Route.patch('associations/:id/image', 'AssociationsController.updateImage')
Route.get('associations/:id/document/edit', 'AssociationsController.editDocument')
Route.patch('associations/:id/document', 'AssociationsController.updateDocument')
Route.post('associations/:id/vote', 'AssociationsController.vote')

Route.resource('categories', 'CategoriesController')
Route.resource('schools', 'SchoolsController')
