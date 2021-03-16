const
    { MessageEmbed } = require('discord.js'),
    messages = require('../localization/messages.js'),
    Pagination = require('discord-paginationembed');

module.exports = {
    id: "",
    name: "tutorial",
    run: async (client, interaction) => {
        console.log(interaction);
        interactionhandler.reply(interaction, ' ', 2);
        const embedDataTemplate = {
            image: '',
            thumbnail: '',
            heading: 'test heading',
            body: 'test body',
            footer: 'test footer'
        }

        let arr = [
            embedDataTemplate
        ]

        const TutorialEmbed = new Pagination.FieldsEmbed()
            .setArray(arr)
            .setAuthorizedUsers([interaction.member.user.id])
            .setChannel(client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id))
            .setElementsPerPage(1)
            // Initial page on deploy
            .setPage(1)
            .setPageIndicator(true)
            .formatField('Chapter', i => `\`\`\` ${i.heading} \`\`\``, false)
            .formatField('Body', i => `\`\`\` ${i.body} \`\`\``, false)
            .formatField('Content', i => `> ${i.footer}`, false)
            // Deletes the embed upon awaiting timeout
            .setDeleteOnTimeout(true)
            // Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
            //.setDisabledNavigationEmojis(['delete'])
            // .setFunctionEmojis({
            //     "✏️": async (user, i) => {
            //         // edit the remider on the current page
            //         const filter = m => m.author.id === message.author.id;
            //         message.channel.send(client.embed(`
            //     Enter the new text for your reminder now:
            //     `)).then(() => {
            //             if (message.deletable) message.delete({ timeout })
            //             message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            //                 .then(collected => {
            //                     if (collected.first().deletable) collected.first().delete()
            //                     remindermodel.updateOne({ _id: arr[i.page - 1]._id }, { content: collected.first().content }, (err) => {
            //                         if (err) client.logger.debug(err)
            //                         interactionhandler.embed.success(interaction, `Updated your reminder.`)
            //                     })
            //                 })
            //                 .catch(collected => {
            //                     // Delete message here
            //                     client.logger.debug(collected)
            //                 });
            //         })
            //     },
            //     "❌": async (user, i) => {
            //         // Delete the reminder on the current page
            //         remindermodel.deleteOne({ _id: arr[i.page - 1]._id }, (err) => {
            //             if (err) client.logger.debug(err)
            //             interactionhandler.embed.success(interaction, `Deleted your reminder.`)
            //         })
            //     }
            // })
            // Sets whether function emojis should be deployed after navigation emojis
            .setEmojisFunctionAfterNavigation(false);

        TutorialEmbed.embed
            .setColor("BLUE")
            .setFooter(`Manual:
✏️          Edit the reminder
❌          Delete the reminder
🗑️          Destroy this embed`);
        await TutorialEmbed.build();


    }
};
