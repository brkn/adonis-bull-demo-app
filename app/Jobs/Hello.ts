import { JobContract } from '@ioc:Rocketseat/Bull'
import { Job } from 'bullmq'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'

/*
|--------------------------------------------------------------------------
| Job setup
|--------------------------------------------------------------------------
|
| This is the basic setup for creating a job, but you can override
| some settings.
|
| You can get more details by looking at the bullmq documentation.
| https://docs.bullmq.io/
*/

export default class HelloJob implements JobContract {
  public key = 'Hello'
  public static key = 'Hello'

  public async handle(job: Job<string, any, string>) {
    const now = () => DateTime.local().toISOTime()

    const helloTo = job.data

    Logger.info(now())

    await this.sleep(1500)
    Logger.info('sleeped 1.5')
    Logger.info(now())

    await this.sleep(1500)
    Logger.info('sleeped 1.5')
    Logger.info(now())

    Logger.info(helloTo)

    return job
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}
