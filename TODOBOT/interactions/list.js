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
            let em = client.todo(doc, true);
            em.footer = null;
            if (doc.todochannel && doc.todomsg) {
                const dcbase = "https://discordapp.com/channels/";
                const URL = dcbase + doc.guildid + "/" + doc.todochannel + "/" + doc.todomsg;
                em.addField('\u200b', `[Original Message](${URL})`);
            }
            embeds.push(em);
        }

        const FieldsEmbed = new Pagination.Embeds()
            .setArray(embeds)
            .setAuthorizedUsers([interaction.member.user.id])
            .setChannel(await client.guilds.cache.get(interaction.guild_id).channels.fetch(interaction.channel_id))
            .setTimeout(parseInt(process.env.EMBED_DELETE) ?? 120000)
            .setDeleteOnTimeout(true)
            // Initial page on deploy
            //.setPage(1)
            .setPageIndicator(true)

            .setFunctionEmojis({
                '🔄': (user, instance) => {
                    //TODO: repost todomessage, delete old message and set new channel + msg id to db

                    const dcbase = "https://discordapp.com/channels/"
                    const URL = dcbase + interaction.guild_id + "/" + guildTodos[instance.page - 1].todochannel + "/" + guildTodos[instance.page - 1].todomsg
                    interaction.channel.send(client.todo(guildTodos[instance.page - 1]));
                    interaction.channel.send(client.embed(`[Original Message](${URL})`));
                    console.log(guildTodos[instance.page - 1])
                },
                "🔗": async (user, instance) => {
                    // TODO: only post link to todo message
                    const dcbase = "https://discordapp.com/channels/"
                    const URL = dcbase + interaction.guild_id + "/" + guildTodos[instance.page - 1].todochannel + "/" + guildTodos[instance.page - 1].todomsg
                    interaction.channel.send(client.embed(`[Original Message](${URL})`));
                },
                "❌": async (user, i) => {

                }
            })


        await FieldsEmbed.build();



    }

};