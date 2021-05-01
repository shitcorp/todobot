import { stati } from '../data/stati.json'
import { Agenda } from 'agenda'
import blapi from 'blapi'

const agenda = new Agenda({
    db: {
        address: process.env.MONGO_CONNECTION ?? 'mongodb://localhost:27017/todobot',
        options: {
            useUnifiedTopology: true,
        },
    },
})

export default async (client) => {
    // Log that the bot is online.
    client.logger.log(
        `${client.user.tag}, ready to serve ${await client.users.cache.size} users in ${
            client.guilds.cache.size
        } servers.`,
        'ready',
    )
    client.user.setActivity('you', { type: 'WATCHING' })
    let i = 0
    agenda.define('botstatusjob', async (job) => {
        client.user.setActivity(stati[i], { type: 'WATCHING' })
        client.updater.updateAll()
        i++
        if (i >= stati.length) i = 0
    })
    ;(async function () {
        // IIFE to give access to async/await
        await agenda.start()
        // Alternatively, you could also do: (every 10 minutes)
        await agenda.every('*/20 * * * *', 'botstatusjob')
    })()

    /**
     * Botlist updater
     **/
    blapi.setLogging({
        logger: client.logger,
    })
    const apiKeys = {
        'top.gg': process.env.TOPGG_TOKEN,
    }
    blapi.handle(client, apiKeys, 60)
}
