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
        premium: false,
        // USER - BOT_USER - STAFF
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
    run: async (client, interaction) => {

        interaction.reply(`${client.user.username} is thinking ...`);
        interaction.delete();

        const guildTodos = await client.getguildtodos(interaction.guild_id);

        const embeds = [];
        for (const doc of guildTodos) {
            if (doc.state === 'closed') continue;
            let em = client.todo(doc, true);
            em.footer = `
            🔄 - Repost the current todo
            `;
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
                    //TODO: important: repost todomessage in todo channel, not current channel
                    const dcbase = "https://discordapp.com/channels/"
                    const URL = dcbase + interaction.guild_id + "/" + guildTodos[instance.page - 1].todochannel + "/" + guildTodos[instance.page - 1].todomsg
                    interaction.channel.send(client.todo(guildTodos[instance.page - 1]));
                    interaction.channel.send(client.embed(`[Original Message](${URL})`));
                    console.log(guildTodos[instance.page - 1])
                },
                "❌": async (user, i) => {

                }
            })


        await FieldsEmbed.build();



    }

};