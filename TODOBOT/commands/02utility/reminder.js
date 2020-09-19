const { formatDistanceToNow } = require('date-fns');
const Pagination = require('discord-paginationembed');

exports.run = async (client, message, args, level) => {

    // imports
    const { remindermodel } = require('../../modules/models/remindermodel');
    const uniqid = require('uniqid');
    const timeout = client.config.msgdelete

    //Handler
    switch(message.flags[0]) {
        case "v":
            reminderviewer()
        break;
        case "c":
            remindercreator()
        break;
        default: 
        message.channel.send(client.error(`You forgot to give a flag. Use one of the following: \n> \`-v\` => View all your reminders. \n> \`-c\` \`-3h\` => Create a new reminder.`)).then(msg => {
            if (msg.deletable) msg.delete({ timeout })
        })
        break;
    }

    // Functions
    // TODO: add mentioning users for admins
    async function reminderviewer() {
        
        let cache = [];
        // query db for reminders by user
        for await (const doc of remindermodel.find({ user: message.author.id })) {
            cache.push(doc)
        }

        // Make sure theres something in the array for
        // the embed showing thingy
        cache.length > 0 ? newviewer(cache) :
            message.channel.send(client.error(`You have no open reminders at the moment. 
            To learn more about the reminder feature run \`//help reminder\`.`))

    }




    const newviewer = async (arr) => {


        const FieldsEmbed = new Pagination.FieldsEmbed()
            .setArray(arr)
            .setAuthorizedUsers([message.author.id])
            .setChannel(message.channel)
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
                                remindermodel.updateOne({ _id: arr[i.page -1]._id }, { content: collected.first().content }, (err) => {
                                    if (err) client.logger.debug(err)
                                    message.channel.send(client.success(`Updated your reminder.`)).then(m => { if (m.deletable) m.delete({ timeout }) })
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
                    remindermodel.deleteOne({ _id: arr[i.page -1]._id }, (err) => {
                        if (err) client.logger.debug(err)
                        message.channel.send(client.success(`Deleted your reminder.`)).then(m => { if (m.deletable) m.delete({ timeout }) })
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

        // Will not log until the instance finished awaiting user responses
        // (or techinically emitted either `expire` or `finish` event)
        // console.log('done');



    }






    async function remindercreator() {
        if (!message.flags[1]) return message.channel.send(client.error(`You forgot to give a time for your reminder.`))
        const ID = uniqid('rmndrid-')
        const systime = Date.now();
        let expires;
        if (message.flags[1].includes('m')) {
            const finalint = parseInt(message.flags[1].replace("m", ""))
            const finaltime = finalint*60000
            expires = systime+finaltime;
        } else if (message.flags[1].includes('h')) {
            const finalint = parseInt(message.flags[1].replace("h", ""))
            const finaltime = finalint*3600000
            expires = systime+finaltime;
        } else if (message.flags[1].includes('d')) {
            const finalint = parseInt(message.flags[1].replace("d", ""))
            const finaltime = finalint*86400000
            expires = systime+finaltime;
        } 
        
        const content = args.join(' ')
        
        if (content.lenght > 700) return message.channel.send(client.error(`Your content is too large, you used \`${content.lenght}\` out of \`700\` available characters.`))
        
        const rem = {
            _id: ID,
            user: message.author.id,
            systime,
            expires,
            content,
            guild: {
                id: message.guild.id,
                channel: message.channel.id
            }
        }
        
        const newreminder = new remindermodel(rem)
        
        newreminder.save(function(err) {
            if (err) client.logger.debug(err)
            message.channel.send(client.success(`Created your new reminder.`))
        })
    }

    

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: ["r"],
    permLevel: "STAFF"
};

exports.help = {
    name: "reminder",
    category: "Reminder",
    description: "Create, view and delete reminders.",
    usage: "reminder -v => View all your current reminders. \n> reminder -c -1h Food! => Create a reminder in 1h from now.",
    flags: ['-v => View all your reminders.', '-c => Create a new reminder.']
};