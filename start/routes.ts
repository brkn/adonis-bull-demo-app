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
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'DummiesController.get')

import { appRoutes } from '@bull-board/api/dist/src/routes'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

Route.group(() => {
  generateBullBoardEntryRoutes()
}).prefix('/bull-board')

function generateBullBoardEntryRoutes() {
  const { route: entryRoute, method } = appRoutes.entryPoint

  const routes = Array.isArray(entryRoute) ? entryRoute : [entryRoute]

  const handler = async ({ view }: HttpContextContract) => {
    return view.render('bull_board')
  }

  return routes.map((route) => {
    Route.route(route, [method.toUpperCase()], handler)
  })
}
