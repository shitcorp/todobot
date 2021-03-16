const systime = Date.now();
const { v4: uuidv4 } = require('uuid');
const messages = require('../localization/messages');
const { formatDistanceToNow } = require('date-fns');
const Pagination = require('discord-paginationembed');
const { remindermodel } = require('../modules/models/remindermodel');

module.exports = {
    id: "",
    name: "reminder",
    run: async (client, interaction) => {
        if (!interaction.data.options) return;
        const conf = await client.getconfig(interaction.guild_id)
        let lang = conf.lang ? conf.lang : "en";
        if (!conf) return interactionhandler.embed.error(interaction, messages.addbottoguild[lang]);
        let action, commandopts;
        for (index in interaction.data.options) {
            if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name;
            if (interaction.data.options[index].type === 1 && interaction.data.options[index].options) commandopts = interaction.data.options[index].options;
        }
        if (!action) return;
        switch (action) {
            case 'view':
                // query db for reminders by user and push them
                // to the cache array to hand over to the paginator
                // function
                let cache = [];
                for await (const doc of remindermodel.find({ user: interaction.member.user.id })) {
                    cache.push(doc)
                }
                // Make sure theres something in the array for
                // the embed paginator, else return an error
                cache.length > 0 ? newviewer(client, interaction, cache) :
                    interactionhandler.embed.error(interaction, `You have no open reminders at the moment. To learn more about the reminder feature run \`//help reminder\`.`)
                break;
            case 'create':
                let time, unit, content, participants, participatingroles;
                for (i in commandopts) {
                    if (commandopts[i].name === 'time') time = commandopts[i].value
                    if (commandopts[i].name === 'unit') unit = commandopts[i].value
                    if (commandopts[i].name === 'content') content = commandopts[i].value
                    if (commandopts[i].name === 'participants') participants = commandopts[i].value
                    if (commandopts[i].name === 'participatingroles') participatingroles = commandopts[i].value
                }
                let expires;
                switch (unit) {
                    case 'm':
                    expires = systime+time*60000
                    break;
                    case 'h':
                    expires = systime+time*3600000
                    break;
                    case 'd':
                    expires = systime+time*86400000
                    break;
                }
                if (content.length > 400) return interactionhandler.embed.error(interaction, `Your content is too large, you used \`${content.length}\` out of \`400\` available characters.`)
                const ID = uuidv4();
                const rem = {
                    _id: ID,
                    user: interaction.member.user.id,
                    systime,
                    expires,
                    content,
                    guild: {
                        id: interaction.guild_id,
                        channel: interaction.channel_id
                    },
                    mentions: {},
                    loop: false
                }
                if (participants) rem['mentions'].users = participants;
                if (participatingroles) rem['mentions'].roles = participatingroles;
                const newreminder = new remindermodel(rem)
                newreminder.save(function (err) {
                    err 
                    ? client.logger.debug(err)
                    : interactionhandler.embed.success(interaction, `Created your new reminder.`)
                })
                break;
        }
    }
};


const newviewer = async (client, interaction, arr) => {

    // in order for discord to show the interaction we have to reply
    // with something. even a space will do :D its just to acknowledge
    // the interaction/slash command, so the user gets instant feedback
    interactionhandler.reply(interaction, ' ', 2);

    const FieldsEmbed = new Pagination.FieldsEmbed()
        .setArray(arr)
        .setAuthorizedUsers([interaction.member.user.id])
        .setChannel(client.guilds.cache.fetch(interaction.guild_id).channels.cache.fetch(interaction.channel_id))
        .setElementsPerPage(1)
        // Initial page on deploy
        .setPage(1)
        .setPageIndicator(true)
        .formatField('Created', i => `\`\`\`${formatDistanceToNow(parseInt(i.systime))} ago.\`\`\``, false)
        .formatField("Expires", i => `\`\`\`in ${formatDistanceToNow(parseInt(i.expires))}.\`\`\``, false)
        .formatField('Content', i => `> ${i.content}`, false)

        // Deletes the embed upon awaiting timeout
        .setDeleteOnTimeout(true)
        // Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
        //.setDisabledNavigationEmojis(['delete'])
        .setFunctionEmojis({
            "✏️": async (user, i) => {
                // edit the remider on the current page
                const filter = m => m.author.id === message.author.id;
                message.channel.send(client.embed(`
                Enter the new text for your reminder now:
                `)).then(() => {
                    if (message.deletable) message.delete({ timeout })
                    message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                        .then(collected => {
                            if (collected.first().deletable) collected.first().delete()
                            remindermodel.updateOne({ _id: arr[i.page - 1]._id }, { content: collected.first().content }, (err) => {
                                if (err) client.logger.debug(err)
                                interactionhandler.embed.success(interaction, `Updated your reminder.`)
                            })
                        })
                        .catch(collected => {
                            // Delete message here
                            client.logger.debug(collected)
                        });
                })
            },
            "❌": async (user, i) => {
                // Delete the reminder on the current page
                remindermodel.deleteOne({ _id: arr[i.page - 1]._id }, (err) => {
                    if (err) client.logger.debug(err)
                    interactionhandler.embed.success(interaction, `Deleted your reminder.`)
                })
            }
        })
        // Sets whether function emojis should be deployed after navigation emojis
        .setEmojisFunctionAfterNavigation(false);

    FieldsEmbed.embed
        .setColor("BLUE")
        .setFooter(`Manual:
✏️          Edit the reminder
❌          Delete the reminder
🗑️          Destroy this embed`);
    await FieldsEmbed.build();

}
