const { formatDistance, formatDistanceToNow } = require('date-fns');
const Pagination = require('discord-paginationembed');

exports.run = async (client, message, args, level) => {

    // imports
    const { remindermodel } = require('../../modules/models/remindermodel');
    const { format, parseISO, formatDistance } = require('date-fns');
    const { MessageEmbed } = require('discord.js');
    const uniqid = require('uniqid');

    //Handler
    switch(message.flags[0]) {
        case "v":
            reminderviewer()
        break;
        case "c":
            remindercreator()
        break;
        case "rm":
            reminderdeletor()
        break;
        default: 
        message.channel.send(client.error(`You forgot to give a flag. Use one of the following: \n> \`-v\` => View all your reminders. \n> \`-c\` \`-3h\` => Create a new reminder. \n> \`-rm\` \`-ID\` => Delete the reminder with the given ID.`)).then(msg => {
            msg.delete({ timeout: 60000 }).catch(console.error())
        })
        break;
    }

    // Functions
    // TODO: delete reminders when expired
    // TODO: add mentioning users for admins
    async function reminderviewer() {
        
        let cache = [];
        for await (const doc of remindermodel.find({ user: message.author.id })) {
            console.log(doc); // Prints documents one at a time
            cache.push(doc)
        }

        newviewer(cache)

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
            .formatField('Submitted', i => `\`\`\`${formatDistanceToNow(parseInt(i.systime))} ago.\`\`\``, false)
            .formatField("Expires", i => `\`\`\`${formatDistanceToNow(parseInt(i.expires))}.\`\`\``, false)
            .formatField('Content', i => `> ${i.content}`, false)
            
            // Deletes the embed upon awaiting timeout
            .setDeleteOnTimeout(true)
            // Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
            //.setDisabledNavigationEmojis(['delete'])
            // Set your own customised emojis
            .setFunctionEmojis({
                // '🔄': (user, instance) => {

                //     const dcbase = "https://discord.com/channels/"
                //     const URL = dcbase + message.guild.id + "/" + conf.todochannel + "/" + TODOS[instance.page - 1].todomsg
                //     // TODO: delete reposted message after a while
                //     message.channel.send(client.todo(TODOS[instance.page - 1]));
                //     message.channel.send(client.embed(`[Original Message](${URL})`))
                //     console.log(TODOS[instance.page - 1])
                // },
                "✏️": (user, i) => {
                    // edit the remider on the current page
                },
                "❌": (user, i) => {
                    // Delete the reminder on the current page

                }
            })
            // Sets whether function emojis should be deployed after navigation emojis
            .setEmojisFunctionAfterNavigation(false);

        FieldsEmbed.embed
            .setColor("BLUE")
            // .setDescription('Test Description')
            .setFooter(`Manual:
✏️          Edit the reminder
❌          Delete the reminder
🗑️          Destroy this embed`);
        await FieldsEmbed.build();

        // Will not log until the instance finished awaiting user responses
        // (or techinically emitted either `expire` or `finish` event)
        console.log('done');



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
            guild: message.guild.id,
            channel: message.channel.id,
            content
        }
        const newreminder = new remindermodel(rem)
        newreminder.save(function(err) {
            if (err) client.logger.mongo(`Error: ${err}`)
            message.channel.send(client.success(`Saved your new reminder successfully.`))
        })
    }

    async function reminderdeletor() {

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
    usage: "reminder -v => View all your current reminders. \n> reminder -c -1h Food! => Create a reminder in 1h from now.\n> reminder -rm -ID => Delete the reminder with the given ID.",
    flags: ['-v => View all your reminders.', '-c => Create a new reminder.', '-rm => Remove/delete the given reminder.']
};