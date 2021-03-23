const Pagination = require('discord-paginationembed');

const raw = {
    name: 'list',
    description: 'List todos for your server.'
};

module.exports = {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        // USER - BOT_USER - STAFF
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
    run: async (client, interaction) => {

        interaction.reply(' ', 2);

        const guildTodos = await client.getguildtodos(interaction.guild_id);

        const embeds = [];
        for (const doc of guildTodos) {
            embeds.push(client.todo(doc, true));
        }

        const FieldsEmbed = new Pagination.Embeds()
            .setArray(embeds)
            .setAuthorizedUsers([interaction.member.user.id])
            .setChannel(await client.guilds.cache.get(interaction.guild_id).channels.fetch(interaction.channel_id))
            .setTimeout(parseInt(process.env.EMBED_DELETE) ?? 120000)
            // .setElementsPerPage(1)
            // Initial page on deploy
            //.setPage(1)
            .setPageIndicator(true)

            .setFunctionEmojis({
                '🔄': (user, instance) => {

                    const dcbase = "https://discord.com/channels/"
                    const URL = dcbase + message.guild.id + "/" + conf.todochannel + "/" + TODOS[instance.page - 1].todomsg
                    message.channel.send(client.todo(TODOS[instance.page - 1]));
                    message.channel.send(client.embed(`[Original Message](${URL})`));
                    console.log(TODOS[instance.page - 1])
                },
                "✏️": async (user, i) => {

                },
                "❌": async (user, i) => {

                }
            })


        await FieldsEmbed.build();



    }

};