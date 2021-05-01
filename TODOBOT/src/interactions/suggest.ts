import MyClient from '../classes/client'
import Interaction from '../classes/interaction'

const { MessageEmbed } = require('discord.js-light')
const messages = require('../localization/messages')

const raw = {
    name: 'suggest',
    description: 'Suggest new features to be added into the bot',
    options: [
        {
            name: 'text',
            description: 'Your suggestion',
            type: 3,
            required: true,
        },
        {
            name: 'image',
            description: 'If you want to attach an image, paste the link here',
            type: 3,
            required: false,
        },
        {
            name: 'hidden',
            description: 'Hide the server where this suggestion was sent',
            // type 5 == boolean
            type: 5,
            required: false,
        },
    ],
}

export default {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        premium: false,
        production: true,
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description,
    },
    run: async (client: MyClient, interaction: Interaction) => {
        let text, image, hidden
        for (let i = 0; i < interaction.data.options.length; i++) {
            if (interaction.data.options[i].name === 'text') text = interaction.data.options[i].value
            if (interaction.data.options[i].name === 'image') image = interaction.data.options[i].value
            if (interaction.data.options[i].name === 'hidden') hidden = interaction.data.options[i].value
        }
        const embed = new MessageEmbed().setTitle(`New Suggestion:`).setColor('BLUE')

        let footer = `Submitted by: ${interaction.member.user.username}#${interaction.member.user.discriminator}`
        if (interaction.guild_id !== process.env.MOTHER_GUILD && !hidden) {
            footer += `; Sent in server: ${client.guilds.cache.get(interaction.guild_id).name}`
        }
        if (image && image.startsWith(`https://`)) {
            embed.setImage(image)
        }
        //cdn.discordapp.com/avatars/ user.id + user.avatar + .png
        embed.setThumbnail(
            'https://cdn.discordapp.com/avatars/' +
                interaction.member.user.id +
                '/' +
                interaction.member.user.avatar +
                '.png',
        )
        embed.setDescription(`> ${text}`)
        embed.setFooter(footer)

        let G = client.guilds.cache
            .get(process.env.MOTHER_GUILD)
            .channels.cache.get(process.env.SUGGESTIONS_CHANNEL)
        try {
            // @ts-expect-error
            G.send(embed).then(async (msg) => {
                await msg.react(client.util.get('emojiMap').upvote)
                await msg.react(client.util.get('emojiMap').downvote)
            })
            interaction.replyWithMessageAndDeleteAfterAWhile(
                client.embed.success(
                    messages.requestsubmitted[
                        interaction.conf ? (interaction.conf.lang ? interaction.conf.lang : 'en') : 'en'
                    ],
                ),
            )
        } catch (e) {
            interaction.errorDisplay(
                messages.errorposting[
                    interaction.conf ? (interaction.conf.lang ? interaction.conf.lang : 'en') : 'en'
                ],
            )
        }
    },
}
