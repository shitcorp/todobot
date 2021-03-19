const systime = Date.now();
const { v4: uuidv4 } = require('uuid');
const messages = require('../localization/messages');
const { formatDistanceToNow } = require('date-fns');
const Pagination = require('discord-paginationembed');
const { remindermodel } = require('../modules/models/remindermodel');


const raw = {
    name: 'reminder',
    description: 'Create, edit and view reminders',
    options: [
        {
            name: 'create',
            description: 'Create a new reminder.',
            type: 1,
            options: [
                {
                    name: 'time',
                    description: 'After this timespan you will be reminded.',
                    // type 4 = integer
                    type: 4,
                    required: true
                },
                {
                    name: 'unit',
                    description: 'Minutes? Hours? Seconds? Choose now.',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'hours',
                            value: 'h'
                        },
                        {
                            name: 'minutes',
                            value: 'm'
                        },
                        {
                            name: 'days',
                            value: 'd'
                        }
                    ]
                },
                {
                    name: 'content',
                    description: 'Reminder Text that will be shown when the reminder expires.',
                    type: 3,
                    required: true
                },
                {
                    name: 'participants',
                    description: 'Choose another user or users that should also be reminded.',
                    type: 6,
                    required: false
                },
                {
                    name: 'participatingRoles',
                    description: 'Choose a role that should be reminded.',
                    type: 8,
                    required: false
                }
            ]
        },
        {
            name: 'view',
            description: 'View your reminder(s).',
            type: 1
        }
    ]
}


module.exports = {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        permLevel: 'STAFF',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
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
                for await (const doc of remindermodel.find({ user: interaction.member.user.id })) cache.push(doc)
                // Make sure theres something in the array for
                // the embed paginator, else return an error
                cache.length > 0 ? newviewer(client, interaction, cache) :
                    interaction.embed.error(messages.noopenreminders[lang])
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
                        expires = systime + time * 60000
                        break;
                    case 'h':
                        expires = systime + time * 3600000
                        break;
                    case 'd':
                        expires = systime + time * 86400000
                        break;
                }
                if (content.length > 400) return interaction.embed.error(messages.contenttoolarge[lang])
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
                        : interaction.embed.success(messages.remindercreated[lang])
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
        .setChannel(await client.guilds.cache.get(interaction.guild_id).channels.fetch(interaction.channel_id))
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
                                interaction.embed.success(`Updated your reminder.`)
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
                    interaction.embed.success(`Deleted your reminder.`)
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
