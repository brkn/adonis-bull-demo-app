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

import Route, { RouteHandler } from '@ioc:Adonis/Core/Route'
import { appRoutes } from '@bull-board/api/dist/src/routes'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BullMQAdapter } from '@bull-board/api/dist/src/queueAdapters/bullMQ'
import { getQueuesApi } from '@bull-board/api/dist/src/queuesApi'
import { AppControllerRoute } from '@bull-board/api/dist/typings/app'
import Bull from '@ioc:Rocketseat/Bull'
import { Exception } from '@adonisjs/core/build/standalone'

Route.get('/', 'DummiesController.get')

Route.group(() => {
  generateBullBoardEntryRoutes()
  generateBullBoardApiRoutes()
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

function generateBullBoardApiRoutes() {
  const { bullBoardQueues } = getQueuesApi(
    Object.values(Bull.queues).map((queue) => new BullMQAdapter(queue.bull))
  )

  const generateBullBoardApiRouteHandler = (bullBoardRoute: AppControllerRoute) => {
    const routeHandler: RouteHandler = async ({ request, response }) => {
      const params = request.params()
      const query = request.qs()

      try {
        const { body, status: handlerStatus = 200 } = await bullBoardRoute.handler({
          queues: bullBoardQueues,
          query,
          params,
        })

        return response.status(handlerStatus).send(body)
      } catch (error) {
        throw new Exception(error.message)
      }
    }

    return routeHandler
  }

  const routes = appRoutes.api
    .map((bullBoardRoute) => {
      const routes = Array.isArray(bullBoardRoute.route)
        ? bullBoardRoute.route
        : [bullBoardRoute.route]
      const methods = Array.isArray(bullBoardRoute.method)
        ? bullBoardRoute.method.map((method) => method.toUpperCase())
        : [bullBoardRoute.method.toUpperCase()]

      return routes.map((route) =>
        Route.route(route, methods, generateBullBoardApiRouteHandler(bullBoardRoute))
      )
    })
    .flat(2)

  return routes
}
