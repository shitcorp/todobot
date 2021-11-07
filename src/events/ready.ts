import { Agenda } from 'agenda'
import { setLogging, handle } from 'blapi'
import { MyClient } from '../classes'
import { stati } from '../modules/util'

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_CONNECTION ?? 'mongodb://localhost:27017/todobot',
    options: {
      useUnifiedTopology: true,
    },
  },
})

export default async (client: MyClient) => {
  // Log that the bot is online.
  client.logger.log(
    `${client.user.tag}, ready to serve ${await client.users.cache.size} users in ${
      client.guilds.cache.size
    } servers.`,
  )
  client.user.setActivity('you', { type: 'WATCHING' })
  let i = 0
  agenda.define('botstatusjob', () => {
    client.user.setActivity(stati[i], { type: 'WATCHING' })
    i += 1
    if (i >= stati.length) i = 0
  })
  ;(async function startClientStatiAgenda() {
    // IIFE to give access to async/await
    await agenda.start()
    // Alternatively, you could also do: (every 10 minutes)
    await agenda.every('*/20 * * * *', 'botstatusjob')
  })()

  /**
   * Botlist updater
   */

  setLogging({
    logger: client.logger,
  })
  const apiKeys = {
    'top.gg': process.env.TOPGG_TOKEN,
  }
  handle(client, apiKeys, 60)
}
