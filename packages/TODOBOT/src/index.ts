import { config } from 'dotenv'
config()
/* eslint-disable global-require */
/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
import apm from 'elastic-apm-node'

// apm.start({
//     serverUrl: process.env.DEBUG_URL_APM_SERVER,
//     serviceName: process.env.BOT_NAME,
//     environment: process.env.ELASTIC_ENV,
//     // uncomment this for troubleshooting the apm agent
//     // logLevel: 'trace',
// })

import { Agenda } from 'agenda'
import { promisify } from 'util'
import { readdir as fsreaddir } from 'fs'
import { MyClient, API } from './classes'
import { mongohandler, taghandler } from './modules/handlers'
import { functions, permissions, interactionhandler as handle } from './modules/util'

console.log(process.env)

const readdir = promisify(fsreaddir)

const agenda = new Agenda({
  db: {
    address: process.env.MONGO_CONNECTION,
    options: {
      useUnifiedTopology: true,
    },
  },
})

const clientOpts = {
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  disableMentions: 'everyone',
  cacheGuilds: true,
  cacheChannels: true,
  cacheOverwrites: false,
  cacheRoles: true,
  cacheEmojis: true,
  cachePresences: false,
  ws: { intents: ['GUILDS', 'GUILD_EMOJIS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS'] },
}

const client = new MyClient(
  clientOpts,
  apm,
  process.env.DEV === 'true' ? process.env.DEV_TOKEN : process.env.TOKEN,
)

// loading our util functions
functions(client)
permissions(client)
mongohandler(client)
taghandler(client)

// eslint-disable-next-line import/newline-after-import
;(async function init() {
  // connect to mongodb and pull guild configs into cache
  await client.util.get('dbinit')()

  async function loadCategory(category: string) {
    const cmdFilesFun = await readdir(`./commands/${category}/`)
    cmdFilesFun.forEach((f) => {
      if (!f.endsWith('.js') || f.includes('.map')) return
      const response = client.util.get('loadCommand')(category, f)
      if (response) throw new Error(response)
    })
  }

  /**
   * The foldernames where the commands are placed in will
   *  be the categories they are shown in
   */
  ;(await readdir(`${__dirname}/commands/`)).forEach((category) => loadCategory(category))
  ;(await readdir(`${__dirname}/events/`)).forEach(async (file) => {
    if (file.includes('.map')) return
    const eventName = file.split('.')[0]
    client.logger.log({
      module: `EVENTLOADER`,
      message: `Loading: ${eventName}`,
    })
    const event = require(`./events/${file}`)
    client.on(eventName, event.default.bind(null, client))
  })
  ;(await readdir(`${__dirname}/interactions/`)).forEach(async (file) => {
    if (!file.includes('.template') && !file.includes('.map'))
      client.setInteraction(file.split('.')[0], require(`./interactions/${file}`).default)
  })

  // start the API
  // eslint-disable-next-line no-new
  new API(client, Number(process.env.HEALTH_ENDPOINT_PORT))

  // start the bot
  client.start()
  // take care of scheduling
  agenda.define('reminderjob', async () => client.util.get('reminderjob')())

  await agenda.start()
  // Alternatively, you could also do: (every 1 minute)
  await agenda.every('*/1 * * * *', 'reminderjob')

  // this is for development reasons so the data for my dev server is always fresh
  const inval = client.getUtil('invalidateCache')
  inval('709541114633519177')

  // interaction"handler"
  // @ts-expect-error
  client.ws.on('INTERACTION_CREATE', async (rawInteraction) => handle(client, rawInteraction))
})()

process.on('unhandledRejection', (err, promise) => {
  console.error(err, promise)
  client.logger.debug(err)
  client.logger.debug(promise)
  // client.apm.captureError(err)
  // client.apm.captureError(promise)
  // client.discordlog({ error: err, content: `Promise: ${promise}` })
})

process.on('uncaughtException', (err) => {
  console.error(err)
  client.logger.debug(err)
  // client.discordlog({ error: err })
  // client.apm.captureError(err)
})
