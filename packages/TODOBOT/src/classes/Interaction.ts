import { GuildMember } from 'discord.js-light'
import { http, colors } from '../modules/util'

class Interaction {
  client: any

  application_id: any

  id: any

  token: any

  guild_id: any

  guild: any

  channel_id: any

  channel: any

  data: any

  member: any

  GuildMember: GuildMember

  type: any

  timestamp: number

  lang: any

  conf: any

  level: any

  embed: {
    default: (msg: string) => any
    success: (msg: string) => any
    error: (msg: string) => any
  }

  // set this to true when reponding to the interaction
  // so in subsequent replies, we post normal messages
  responded: boolean

  subcmds: Record<any, any>[]

  commandopts: Record<any, any>[]

  constructor(client, rawInteraction) {
    this.responded = false
    this.client = client
    this.application_id = rawInteraction.application_id
    this.id = rawInteraction.id
    this.token = rawInteraction.token
    this.guild_id = rawInteraction.guild_id
    this.guild = client.guilds.cache.get(rawInteraction.guild_id)
    this.channel_id = rawInteraction.channel_id
    this.channel = this.guild.channels.cache.get(rawInteraction.channel_id)
    this.data = rawInteraction.data
    this.member = rawInteraction.member
    this.GuildMember = new GuildMember(client, rawInteraction.member, this.guild)
    this.type = rawInteraction.type
    this.timestamp = Date.now()
    this.lang = rawInteraction.lang ? rawInteraction.lang : 'en'
    this.conf = rawInteraction.conf
    // either USER or STAFF (0 - normal USER no perms, 1 - Bot user, 2- STAFF (can change bot settings))
    this.level = rawInteraction.level
    this.embed = {
      default: (msg: string) => this.defaultEmbed(msg),
      success: (msg: string) => this.successEmbed(msg),
      error: (msg) => this.errorEmbed(msg),
    }

    this.subcmds = []
    this.commandopts = []

    if (this.data.options && this.data.options.length > 0) {
      let opts
      let action
      for (let i = 0; i < this.data.options.length; i += 1) {
        /**
                 *  if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name
                    if (interaction.data.options[index].type === 1 && interaction.data.options[index].options)
                    commandopts = interaction.data.options[index].options
                 */
        if (this.data.options[i].type === 1) action = this.data.options[i].name
        if (this.data.options[i].type === 1 && this.data.options[i].options)
          opts = this.data.options[i].options
      }
      const subCmd = {
        name: null,
        options: null,
      }
      if (action) subCmd.name = action
      if (opts) subCmd.options = opts
      if (subCmd.name !== null) this.subcmds.push(subCmd)
    }
  }

  reply(msg: string, type = 4) {
    if (this.responded === true) this.responded = true
    return this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type,
        data: {
          content: msg,
        },
      },
    })
  }

  replyRawEmbed(embed) {
    return this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type: 4,
        data: {
          embeds: [embed],
        },
      },
    })
  }

  async deleteOriginal(timeout?: number) {
    http.setToken(process.env.TOKEN)
    if (!timeout)
      // eslint-disable-next-line no-return-await
      return http.delete(
        `https://discord.com/api/v8/webhooks/${process.env.APPLICATION_ID}/${this.token}/messages/@original`,
      )
    setTimeout(async () => {
      await http.delete(
        `https://discord.com/api/v8/webhooks/${process.env.APPLICATION_ID}/${this.token}/messages/@original`,
      )
    }, timeout)
    return true
  }

  replyWithMessageAndDeleteAfterAWhile(msg) {
    try {
      this.replyRawEmbed(msg)
      this.deleteOriginal(Number(process.env.MSG_DELETE))
    } catch (replyRawError) {
      this.client.logger.debug(replyRawError)
      try {
        this.reply(msg)
        this.deleteOriginal(Number(process.env.MSG_DELETE))
      } catch (replyMsgError) {
        this.client.logger.debug(replyMsgError)
      }
    }
  }

  errorDisplay(msg: string) {
    this.replyWithMessageAndDeleteAfterAWhile(this.client.embed.error(msg))
  }

  defaultEmbed(msg: string, type = 4, color = 'BLUE') {
    return this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type,
        data: {
          embeds: [
            {
              description: msg,
              color: colors[color],
              author: {
                name: this.client.user.username,
              },
              thumbnail: {
                url: this.client.user.avatarURL(),
              },
              footer: {
                text: `Requested by ${this.member.user.username}#${this.member.user.discriminator}   •    www.todo-bot.xyz`,
                // cdn.discordapp.com/avatars/ user.id + user.avatar + .png
                icon_url: `https://cdn.discordapp.com/avatars/${this.member.user.id}/${this.member.user.avatar}.png`,
              },
            },
          ],
        },
      },
    })
  }

  successEmbed(msg: string, type = 4, color = 'GREEN') {
    return this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type,
        data: {
          embeds: [
            {
              title: '✅ Success!',
              description: msg,
              color: colors[color],
            },
          ],
        },
      },
    })
  }

  errorEmbed(msg: string, type = 4, color = 'RED') {
    return this.client.api.interactions(this.id, this.token).callback.post({
      data: {
        type,
        data: {
          embeds: [
            {
              title: '❌ Error',
              description: msg,
              color: colors[color],
            },
          ],
        },
      },
    })
  }
}

export default Interaction
