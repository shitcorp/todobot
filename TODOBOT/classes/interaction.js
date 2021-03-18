const { Colors } = require('../modules/util/colors');

class interaction {
    constructor(client, interaction) {
        
        this.application_id = interaction.application_id;
        this.id = interaction.id;
        this.token = interaction.token;
        this.guild_id = interaction.guild_id;
        this.channel_id = interaction.channel_id;
        this.data = interaction.data;
        this.member = interaction.member;
        this.type = interaction.type;

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

        const embed = {
            default: async (msg, type = 4, color = "BLUE") => {
                return client.api.interactions(this.id, this.token).callback.post({
                    data: {
                        type, 
                        data: {
                            embeds: [
                                {
                                    description: msg,
                                    color: Colors[color]
                                }
                            ]
                        }
                    }
                        
                }) 
            },
            success: async (msg, type = 3, color = "GREEN") => {
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
            error: async(msg, type = 4, color = "RED") => {
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
        this.embed = {
            success: (msg, type, color) => embed.success(msg, type, color),
            default: (msg, type, color) => embed.default(msg, type, color),
            error: (msg, type, color) => embed.error(msg, type, color)
        }
    }
}

module.exports = interaction;
