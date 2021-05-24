import { Client } from 'discord.js-light'
import { promisify } from 'util'
import redis from 'redis'
import Agent from 'elastic-apm-node'
import EmbedManager from './EmbedManager'
import TodoManager from './TodoManager'
import ConfigManager from './ConfigManager'
import ReminderManager from './ReminderManager'
import Logger from './Logger'

export default class MyClient extends Client {
  cooldown: number

  commands: Map<string | number, any>

  aliases: Map<string | number, any>

  interactions: Map<string | number, any>

  apm: typeof Agent

  util: Map<string, any>

  cache: redis.RedisClient

  embed: EmbedManager

  todos: TodoManager

  config: ConfigManager

  reminder: ReminderManager

  getAsync: any

  emojiMap: any

  logger: Logger

  private _token: string

  // apm instance
  constructor(clientOpts: any, apm: typeof Agent, token: string) {
    super(clientOpts)

    this._token = token

    this.cooldown = Number(process.env.CMD_COOLDOWN)

    this.commands = new Map()
    this.aliases = new Map()
    this.interactions = new Map()

    this.apm = apm
    this.util = new Map()

    this.logger = new Logger(this.apm)

    this.cache = redis.createClient({
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_ADDRESS,
    })

    this.cache.on('warn', this.logger.warn)
    this.cache.on('error', this.logger.debug)
    this.cache.on('ready', () => this.logger.redis(`Redis client is ready.`))

    this.embed = new EmbedManager(this)
    this.config = new ConfigManager(this)
    this.todos = new TodoManager()
    this.reminder = new ReminderManager()

    this.emojiMap = {
      1: '1️⃣',
      2: '2️⃣',
      3: '3️⃣',
      4: '4️⃣',
      5: '5️⃣',
      6: '6️⃣',
      7: '7️⃣',
      8: '8️⃣',
      9: '9️⃣',
      10: '🔟',
      '-': '🟥',
      '+': '🟩',
      edit: '<:edit:820577055342985216>',
      finish: '<:finish:820576533059600394>',
      assign: '<:assign_yourself:820577858081521675>',
      github: '<:github:820639615990890496>',
      share: '<:share:820419979719344139>',
      task_open: '<:task_open:820381667881517118>',
      task_finished: '<:task_finished:820384679562838046>',
      upvote: '<:upvote:820678243828105216>',
      downvote: '<:downvote:820677972645642290>',
      expand: '<:expand:822466806211543080>',
      collapse: '<:collapse:822467028983873606>',
      accept: '<:accept_todo:822495794602442814>',
    }
  }

  bindAsync() {
    this.getAsync = promisify(this.cache.get).bind(this.cache)
  }

  decorate(key: string, value: any) {
    this.util.set(key, value)
  }

  getUtil(key: string) {
    return this.util.get(key)
  }

  deleteUtil(key) {
    return this.util.delete(key)
  }

  setCommand(name: string, run) {
    this.logger.log({
      module: `COMMAND_LOADER`,
      message: `Loading: ${name}`,
    })
    this.commands.set(name, run)
  }

  getCommand(name: string) {
    return this.commands.get(name)
  }

  setAlias(alias: string, name: string) {
    this.aliases.set(alias, name)
  }

  getAlias(alias: string) {
    return this.aliases.get(alias)
  }

  setInteraction(name: string, run) {
    this.logger.log({
      module: `INTERACTION_LOADER`,
      message: `Loading: ${name}`,
    })
    this.interactions.set(name, run)
  }

  getInteraction(name: string) {
    return this.interactions.get(name)
  }

  getInteractions() {
    return this.interactions
  }

  getEmoji(emojiName: string) {
    return this.util.get('emojiMap')[emojiName]
  }

  start() {
    this.bindAsync()
    this.login(this._token)
  }
}
