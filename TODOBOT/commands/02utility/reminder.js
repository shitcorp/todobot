const { formatDistanceToNow } = require('date-fns'),
    Pagination = require('discord-paginationembed'),
    Reminder = require('../../modules/models/reminder'),
    uniqid = require('uniqid');
module.exports = {
    run: async (client, message, args, _level) => {
        const timeout = process.env.MSG_DELETE_THRESHHOLD;
        switch(message.flags[0]) {
            case 'v':
                viewReminder();
                break;
            case 'c':
                createReminder();
                break;
            default: 
                message.channel.send(client.error(`You forgot to give a flag. Use one of the following: \n> \`-v\` => View all your reminders. \n> \`-c\` \`-3h\` => Create a new reminder.`))
                    .then(msg => msg.deletable && msg.delete({ timeout }));
                break;
        }

        async function viewReminder() {
            if (message.deletable)
                await message.delete()

            let cache = await Reminder.find({ user: message.author.id });
            if(cache.length > 0) 
                await newViewer(cache);
            else
                message.channel.send(client.error(`You have no open reminders at the moment. 
                To learn more about the reminder feature run \`//help reminder\`.`));
        }

        const newViewer = async (arr) => {
            const fieldsEmbed = new Pagination.FieldsEmbed()
                .setArray(arr)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(1)
                .setPage(1)
                .setPageIndicator(true)
                .formatField('Created', i => `\`\`\`${formatDistanceToNow(parseInt(i.systime))} ago.\`\`\``, false)
                .formatField('Expires', i => `\`\`\`in ${formatDistanceToNow(parseInt(i.expires))}.\`\`\``, false)
                .formatField('Content', i => `> ${i.content}`, false)
                // Deletes the embed upon awaiting timeout
                .setDeleteOnTimeout(true)
                // Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
                //.setDisabledNavigationEmojis(['delete'])
                .setFunctionEmojis({
                    '✏️': async (_user, i) => {
                        // edit the remider on the current page
                        const filter = m => m.author.id === message.author.id;
                        message.channel.send(client.embed(`
                        Enter the new text for your reminder now:
                        `)).then(() => {
                            if (message.deletable) 
                                message.delete({ timeout });
                            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                                .then(collected => {
                                    if (collected.first().deletable) 
                                        collected.first().delete();
                                    Reminder.updateOne({ _id: arr[i.page -1]._id }, { content: collected.first().content }, async (err) => {
                                        if (err) 
                                            client.logger.debug(err);
                                        await message.channel.send(client.success(`Updated your reminder.`))
                                            .then(m => m.deletable && m.delete({ timeout }));
                                    })
                                })
                                .catch(collected => client.logger.debug(collected));
                            });
                    },
                    '❌': async (_user, i) => {
                        // Delete the reminder on the current page
                        Reminder.deleteOne({ _id: arr[i.page -1]._id }, async (err) => {
                            if (err) 
                                client.logger.debug(err);
                            await message.channel.send(client.success(`Deleted your reminder.`))
                                .then(m => m.deletable && m.delete({ timeout }));
                        });
                    }
                })
                // Sets whether function emojis should be deployed after navigation emojis
                .setEmojisFunctionAfterNavigation(false);

            await fieldsEmbed.embed
                .setColor('BLUE')
                .setFooter(`Manual:
    ✏️          Edit the reminder
    ❌          Delete the reminder
    🗑️          Destroy this embed`).build();
        };

        async function createReminder() {
            if (!message.flags[1]) return message.channel.send(client.error(`You forgot to give a time for your reminder.`))
            const ID = uniqid('rmndrid-');
            const systime = Date.now();
            let expires;
            if (message.flags[1].includes('m')) {
                const finalint = parseInt(message.flags[1].replace('m', ''));
                const finaltime = finalint*6e4;
                expires = systime+finaltime;
            } else if (message.flags[1].includes('h')) {
                const finalint = parseInt(message.flags[1].replace('h', ''));
                const finaltime = finalint*36e5;
                expires = systime+finaltime;
            } else if (message.flags[1].includes('d')) {
                const finalint = parseInt(message.flags[1].replace('d', ''));
                const finaltime = finalint*864e5;
                expires = systime+finaltime;
            }
            
            const content = args.join(' ');
            const userMentions = [];
            const roleMentions = [];

            if (message.mentions.everyone) 
                return;
            if (message.mentions.users.size > 0 && message.mentions.users.size < 10) 
                message.mentions.users.each(user => {
                    userMentions.push(user.id);
                    content = content.replace(`<@${user.id}>`, '');
                });
            if (message.mentions.roles.size > 0 && message.mentions.roles.size < 10) 
                message.mentions.roles.each(role => {
                    if (role.id === message.guild.id) 
                        return;
                    roleMentions.push(role.id);
                    content = content.replace(`<@&${role.id}>`, '');
                });
            
            if (content.length > 700) 
                return message.channel.send(client.error(`Your content is too large, you used \`${content.length}\` out of \`700\` available characters.`));
            
            const rem = {
                _id: ID,
                user: message.author.id,
                systime,
                expires,
                content,
                guild: {
                    id: message.guild.id,
                    channel: message.channel.id
                },
                mentions: {},
                loop: false
            };
        
            if (userMentions.length > 0) 
                rem['mentions'].users = userMentions;
            if (roleMentions.length > 0) 
                rem['mentions'].roles = roleMentions;
            
            if (message.flags.includes('loop') || message.flags.includes('l')){
                if (rem.expires - rem.systime < 3600000) 
                    return message.channel.send(client.error(`Repeating reminders can only have a minimum time of 1 hour!`));
                rem.loop = true;
            }
            
            const reminder = new Reminder(rem);
            reminder.save(async (err) => {
                if (err) 
                    return client.logger.debug(err);
                await message.channel.send(client.success(`Created your new reminder.`));
            });
        }
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: ['r'],
        permLevel: 'STAFF'
    },
    help: {
        name: 'reminder',
        category: 'Reminder',
        description: 'Create, view and delete reminders.',
        usage: 'reminder -v => View all your current reminders. \n> reminder -c -1h Food! => Create a reminder in 1h from now.  \n> reminder -c -12h Work! @SomeRole => Will mention @SomeRole in 12h.',
        flags: ['-v => View all your reminders.', '-c => Create a new reminder.']
    }
};
