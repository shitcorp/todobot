import MyClient from '../classes/client'
import Interaction from '../classes/interaction'

const Pagination = require('discord-paginationembed')

const raw = {
    name: 'list',
    description:
        'List todos for your server. Use the 🔄 emoji to repot the currently open todo. Use the arrow emojis to navigate.',
}

export default {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        premium: false,
        production: true,
        // USER - BOT_USER - STAFF
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description,
    },
    run: async (client: MyClient, interaction: Interaction) => {
        await interaction.reply(`${client.user.username} is thinking ...`)
        await interaction.deleteOriginal(10)
        const getGuildTodos = client.getUtil('getguildtodos')
        const guildTodos = await getGuildTodos(interaction.guild_id)
        const embeds = []
        for (const doc of guildTodos) {
            if (doc.state === 'closed') continue
            let em = client.embed.todo(doc, true)
            em.setFooter(`
            🔄 - Repost the current todo
            `)
            if (doc.todochannel && doc.todomsg) {
                const dcbase = 'https://discordapp.com/channels/'
                const URL = dcbase + doc.guildid + '/' + doc.todochannel + '/' + doc.todomsg
                em.addField('\u200b', `[Original Message](${URL})`)
            }
            embeds.push(em)
        }
        const FieldsEmbed = new Pagination.Embeds()
            .setArray(embeds)
            .setAuthorizedUsers([interaction.member.user.id])
            .setChannel(
                await client.guilds.cache.get(interaction.guild_id).channels.fetch(interaction.channel_id),
            )
            .setTimeout(parseInt(process.env.EMBED_DELETE) ?? 120000)
            .setDeleteOnTimeout(true)
            // Initial page on deploy
            //.setPage(1)
            .setPageIndicator(true)
            .setFunctionEmojis({
                '🔄': async (user, instance) => {
                    //TODO FIXME Delete old message in channel
                    const newTodoMsg = await client.guilds.cache
                        .get(interaction.guild_id)
                        .channels.cache.get(interaction.conf.todochannel)
                        //@ts-expect-error
                        .send(client.embed.todo(guildTodos[instance.page - 1]))
                    const emoMap = client.getUtil('emojiMap')
                    const update = client.getUtil('updatetodo')
                    await newTodoMsg.react(emoMap.edit)
                    await newTodoMsg.react(emoMap.accept)
                    guildTodos[instance.page - 1].todomsg = newTodoMsg.id
                    guildTodos[instance.page - 1].todochannel = interaction.conf.todochannel
                    await update(guildTodos[instance.page - 1]._id, guildTodos[instance.page - 1])
                },
                // "❌": async (user, i) => {
                //     // TODO: delete todo in db and original message on discord

                // }
            })
        try {
            await FieldsEmbed.build()
        } catch (e) {
            interaction.errorDisplay('There are currently no open todos on your guild.')
            setTimeout(() => {
                interaction.deleteOriginal()
            }, Number(process.env.EMBED_DELETE))
        }
    },
}
