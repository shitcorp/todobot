import express, { Application } from 'express'
import { RedisClient } from 'redis'
import { MessageEmbed } from 'discord.js-light'
import MyClient from './client'

export default class API {
    PORT: number

    app: Application

    redisClient: RedisClient

    constructor(client: MyClient, PORT: number) {
        this.PORT = PORT
        this.app = express()
        this.redisClient = client.cache
        this.app.use(express.json())
        this.app.get('/', (req, res) => {
            res.redirect('/health')
            client.logger.http({ req, res })
        })
        this.app.get('/health', (req, res) => {
            res.json({ healthy: true })
            client.logger.http({ req, res })
        })
        this.app.post('/webhook', async function topggwebhook(req, res) {
            // making sure only topgg posts to this endpoint
            if (
                !req.headers.authorization ||
                req.headers.authorization !== process.env.TOPGG_WEBHOOK_SECRET
            ) {
                res.sendStatus(403)
            } else {
                try {
                    // set the voting user to cache
                    this.redisClient.set(req.body.user, JSON.stringify(req.body))

                    this.redisClient.expire(req.body.user, 86400)

                    res.sendStatus(200)
                    const votingUser = await client.users.fetch(req.body.user)
                    const votedEmbed = new MessageEmbed().setColor('RANDOM').setDescription(`
                    🥳 **${votingUser.username}#${votingUser.discriminator}** just voted on **[top.gg](https://top.gg/bot/709541772295929909/vote)** 🎉
                    `)
                    client.guilds.cache
                        .get(process.env.MOTHER_GUILD)
                        .channels.cache.get(process.env.VOTING_WEBHOOK_CHANNEL)
                        // @ts-expect-error
                        .send(votedEmbed)
                } catch (e) {
                    client.logger.debug(e)
                    res.sendStatus(500)
                }
            }
            client.logger.http({ req, res })
        })

        this.app.listen(this.PORT, () => {
            client.logger.log({
                module: 'API',
                port: PORT,
                message: `App is listening on port ${PORT}`,
            })
        })
    }

    getappInstance() {
        return this.app
    }
}
