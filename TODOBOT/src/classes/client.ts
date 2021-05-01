import { Client } from 'discord.js-light'
import { promisify } from 'util'
import Enmap from 'enmap'
import redis from 'redis'
import EmbedManager from './embedManager'
import TodoManager from './todoManager'
import ConfigManager from './configManager'
import ReminderManager from './reminderManager'

class MyClient extends Client {
    cooldown: number

    commands: Enmap<string | number, any>

    aliases: Enmap<string | number, any>

    interactions: Enmap<string | number, any>

    apm: any

    util: Map<any, any>

    logger: any

    cache: redis.RedisClient

    embed: EmbedManager

    todos: TodoManager

    config: ConfigManager

    reminder: ReminderManager

    private _token: string

    // apm instance
    constructor(clientOpts: any, apm: any, token: string) {
        super(clientOpts)

        this._token = token

        this.cooldown = Number(process.env.CMD_COOLDOWN)

        this.commands = new Enmap()
        this.aliases = new Enmap()
        this.interactions = new Enmap()

        this.apm = apm
        this.util = new Map()
        // eslint-disable-next-line global-require
        this.logger = require('../modules/util/Logger')
        this.logger.debug = (err) => {
            if (err.message === 'Unknown Message') return
            // eslint-disable-next-line no-console
            console.error(err)
            this.logger.Error(err)
            this.apm.captureError(err)
        }
        this.logger.error = (err) => this.logger.debug(err)

        this.cache = redis.createClient({
            port: Number(process.env.REDIS_PORT),
            host: process.env.REDIS_ADDRESS,
        })

        this.cache.on('error', (err) => this.logger.debug(err))
        this.cache.on('ready', () => this.logger.redis(`Redis client is ready.`))

        this.embed = new EmbedManager(this)
        this.config = new ConfigManager(this)
        this.todos = new TodoManager()
        this.reminder = new ReminderManager()
    }

    getAsync = () => promisify(this.cache.get).bind(this.cache)

    decorate(key: string, value: any) {
        this.util.set(key, value)
    }

    getUtil(key: string) {
        return this.util.get(key)
    }

    deleteUtil(key) {
        return this.util.delete(key)
    }

    setCommand(name, run) {
        this.logger.log({
            module: `COMMAND_LOADER`,
            message: `Loading: ${name}`,
        })
        this.commands.set(name, run)
    }

    getCommand(name) {
        return this.commands.get(name)
    }

    setAlias(alias, name) {
        this.aliases.set(alias, name)
    }

    getAlias(alias) {
        return this.aliases.get(alias)
    }

    setInteraction(name, run) {
        this.logger.log({
            module: `INTERACTION_LOADER`,
            message: `Loading: ${name}`,
        })
        this.interactions.set(name, run)
    }

    getInteraction(name) {
        return this.interactions.get(name)
    }

    start() {
        this.login(this._token)
    }
}

export default MyClient
