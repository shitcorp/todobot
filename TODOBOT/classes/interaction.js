const { GuildMember } = require('discord.js-light')
const http = require('../modules/util/http')
const { Colors } = require('../modules/util/colors')

class interaction {
    constructor(client, rawInteraction) {
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
        this.lang = rawInteraction.lang ? interaction.lang : 'en'
        this.conf = rawInteraction.conf
        // either USER or STAFF (0 - normal USER no perms, 1 - Bot user, 2- STAFF (can change bot settings))
        this.level = rawInteraction.level

        const reply = async (msg, type = 4) =>
            client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type,
                    data: {
                        content: msg,
                    },
                },
            })

        const replyRawEmbed = async (embed) => {
            await client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [embed],
                    },
                },
            })
        }

        const deleteOriginal = async (timeout) => {
            http.setToken(process.env.TOKEN)
            if (!timeout)
                // eslint-disable-next-line no-return-await
                return await http.delete(
                    `https://discord.com/api/v8/webhooks/${process.env.APPLICATION_ID}/${this.token}/messages/@original`,
                )
            setTimeout(async () => {
                await http.delete(
                    `https://discord.com/api/v8/webhooks/${process.env.APPLICATION_ID}/${this.token}/messages/@original`,
                )
            }, timeout)
            return true
        }

        const replyWithMessageAndDeleteAfterAWhile = (msg) => {
            // acknowledge the interaction
            try {
                replyRawEmbed(msg)
                deleteOriginal(process.env.MSG_DELETE)
            } catch (replyRawError) {
                client.logger.debug(replyRawError)
                try {
                    reply(msg)
                    deleteOriginal(process.env.MSG_DELETE)
                } catch (replyMsgError) {
                    client.logger.debug(replyMsgError)
                }
            }
        }

        const errorDisplay = (msg) => {
            replyWithMessageAndDeleteAfterAWhile(client.error(msg))
        }

        const embed = {
            default: async (msg, type = 4, color = 'BLUE') =>
                client.api.interactions(this.id, this.token).callback.post({
                    data: {
                        type,
                        data: {
                            embeds: [
                                {
                                    description: msg,
                                    color: Colors[color],
                                    author: {
                                        name: client.user.username,
                                    },
                                    thumbnail: {
                                        url: client.user.avatarURL(),
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
                }),
            success: async (msg, type = 4, color = 'GREEN') =>
                client.api.interactions(this.id, this.token).callback.post({
                    data: {
                        type,
                        data: {
                            embeds: [
                                {
                                    title: '✅ Success!',
                                    description: msg,
                                    color: Colors[color],
                                },
                            ],
                        },
                    },
                }),
            error: async (msg, type = 4, color = 'RED') =>
                client.api.interactions(this.id, this.token).callback.post({
                    data: {
                        type,
                        data: {
                            embeds: [
                                {
                                    title: '❌ Error',
                                    description: msg,
                                    color: Colors[color],
                                },
                            ],
                        },
                    },
                }),
        }

        this.reply = (msg, type) => reply(msg, type)
        this.replyRawEmbed = (embeddata) => replyRawEmbed(embeddata)
        this.delete = (timeout) => deleteOriginal(timeout)
        this.errorDisplay = (msg) => errorDisplay(msg)
        this.replyWithMessageAndDeleteAfterAWhile = (msg) => replyWithMessageAndDeleteAfterAWhile(msg)
        this.embed = {
            success: (msg, type, color) => embed.success(msg, type, color),
            default: (msg, type, color) => embed.default(msg, type, color),
            error: (msg, type, color) => embed.error(msg, type, color),
        }
    }
}

module.exports = interaction
