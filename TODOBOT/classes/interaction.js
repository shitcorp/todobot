const http = require('../modules/util/http');
const { Colors } = require('../modules/util/colors');
const { GuildMember } = require("discord.js-light");

class interaction {
    constructor(client, interaction) {

        this.application_id = interaction.application_id;
        this.id = interaction.id;
        this.token = interaction.token;
        this.guild_id = interaction.guild_id;
        this.guild = client.guilds.cache.get(interaction.guild_id);
        this.channel_id = interaction.channel_id;
        this.channel = this.guild.channels.cache.get(interaction.channel_id);
        this.data = interaction.data;
        this.member = interaction.member;
        this.GuildMember = new GuildMember(client, interaction.member, this.guild);
        this.type = interaction.type;
        this.timestamp = Date.now();
        this.lang = interaction.lang ? interaction.lang : 'en';
        this.conf = interaction.conf;
        // either USER or STAFF (0 - normal USER no perms, 1 - Bot user, 2- STAFF (can change bot settings))
        this.level = interaction.level;


        const reply = async (msg, type = 4) => {
            return client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type,
                    data: {
                        content: msg
                    }
                }
            })
        }

        const replyRawEmbed = async (embed) => {
            await client.api.interactions(this.id, this.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [
                            embed
                        ]
                    }
                }
            })
        }

        const deleteOriginal = async (timeout) => {
            http.setToken(process.env.TOKEN);
            if (!timeout) return await http.delete(`https://discord.com/api/v8/webhooks/${process.env.APPLICATION_ID}/${this.token}/messages/@original`)
            setTimeout(async () => {
                await http.delete(`https://discord.com/api/v8/webhooks/${process.env.APPLICATION_ID}/${this.token}/messages/@original`)
            }, timeout);
        }

        const replyWithMessageAndDeleteAfterAWhile = (msg) => {
            // acknowledge the interaction
            try {
                replyRawEmbed(msg);
                deleteOriginal(process.env.MSG_DELETE);
            } catch (e) {
                client.logger.debug(e);
                try {
                    reply(msg);
                    deleteOriginal(process.env.MSG_DELETE);
                } catch (e) {
                    client.logger.debug(e);
                }
            }
        }

        const errorDisplay = (msg) => {
            replyWithMessageAndDeleteAfterAWhile(client.error(msg))
        }

        const embed = {
            default: async (msg, type = 4, color = "BLUE") => {
                return client.api.interactions(this.id, this.token).callback.post({
                    data: {
                        type,
                        data: {
                            embeds: [
                                {
                                    description: msg,
                                    color: Colors[color],
                                    author: {
                                        name: client.user.username
                                    },
                                    thumbnail: {
                                        url: client.user.avatarURL()
                                    },
                                    footer: {
                                        text: `Requested by ${this.member.user.username}#${this.member.user.discriminator}   •    www.todo-bot.xyz`,
                                        //cdn.discordapp.com/avatars/ user.id + user.avatar + .png
                                        icon_url: 'https://cdn.discordapp.com/avatars/' + this.member.user.id + '/' + this.member.user.avatar + '.png'
                                    }
                                }
                            ]
                        }
                    }

                })
            },
            success: async (msg, type = 4, color = "GREEN") => {
                return client.api.interactions(this.id, this.token).callback.post({
                    data: {
                        type,
                        data: {
                            embeds: [
                                {
                                    title: "✅ Success!",
                                    description: msg,
                                    color: Colors[color]
                                }
                            ]
                        }
                    }
                })
            },
            error: async (msg, type = 4, color = "RED") => {
                return client.api.interactions(this.id, this.token).callback.post({
                    data: {
                        type,
                        data: {
                            embeds: [
                                {
                                    title: "❌ Error",
                                    description: msg,
                                    color: Colors[color]
                                }
                            ]
                        }
                    }
                })
            }
        }

        this.reply = (msg, type) => reply(msg, type);
        this.replyRawEmbed = (embed) => replyRawEmbed(embed);
        this.delete = (timeout) => deleteOriginal(timeout);
        this.errorDisplay = (msg) => errorDisplay(msg);
        this.replyWithMessageAndDeleteAfterAWhile = (msg) => replyWithMessageAndDeleteAfterAWhile(msg);
        this.embed = {
            success: (msg, type, color) => embed.success(msg, type, color),
            default: (msg, type, color) => embed.default(msg, type, color),
            error: (msg, type, color) => embed.error(msg, type, color)
        }
    }
}

module.exports = interaction;
