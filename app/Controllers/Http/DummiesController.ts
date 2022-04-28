import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bull from '@ioc:Rocketseat/Bull'
import HelloJob from 'App/Jobs/Hello'

export default class DummiesController {
  public async get(ctx: HttpContextContract) {
    const helloTo = ctx.request.input('helloTo', 'world')

    const job = await Bull.add(HelloJob.key, helloTo)

    return {
      job,
    }
  }
}
