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

        await interaction.reply(`${client.user.username} is thinking ...`);
        
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

        if (embeds.length === 0) {
            await interaction.delete();
            await interaction.errorDisplay('There are currently no open todos on your guild.');
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
                '🔄': async (user, instance) => {
                   
                    const newTodoMsg = await client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.conf.todochannel).send(client.todo(guildTodos[instance.page - 1]));
                    await newTodoMsg.react(client.emojiMap['edit'])
                    await newTodoMsg.react(client.emojiMap['accept'])

                    guildTodos[instance.page - 1].todomsg = newTodoMsg.id;
                    guildTodos[instance.page - 1].todochannel = interaction.conf.todochannel;

                    await client.updatetodo(guildTodos[instance.page - 1]._id, guildTodos[instance.page - 1]);

                }
                // "❌": async (user, i) => {
                //     // TODO: delete todo in db and original message on discord

                // }
            })


        await FieldsEmbed.build();


    }

};