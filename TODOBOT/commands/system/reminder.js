const { formatDistance, formatDistanceToNow } = require('date-fns');

exports.run = async (client, message, args, level) => {

    // imports
    const { remindermodel } = require('../../modules/models/remindermodel');
    const { format, parseISO, formatDistance } = require('date-fns');
    const { RichEmbed } = require('discord.js');
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
            msg.delete(60000).catch(console.error())
        })
        break;
    }

    // Functions
    // TODO: add mentioning users for admins
    async function reminderviewer() {
        remindermodel.find({ user: message.author.id })
        .limit(25)
        .sort("systime");
        let cache = [];
        let output = 0;
        for await (const doc of remindermodel.find({ user: message.author.id })) {
            //console.log(doc); // Prints documents one at a time
            output++
            cache.push(doc)
        }
        let cursor = 0;
        let em = new RichEmbed()
        .setAuthor(`${message.author.username}'s Reminders [${output}]`, message.author.avatarURL)
        .setFooter(`[${cursor+1}/${output}]`)
        console.log(output, cache[0])
        if (cache[0]) {
            const test = parseISO(cache[cursor].expires)
            em.addField(`${cursor+1})  ID: ${cache[cursor]._id}`, `Content: \n> ${cache[cursor].content} \n:clock10: [${format(test, 'PPPP')}]`)
        }
        message.channel.send(em)
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
    aliases: [],
    permLevel: "STAFF"
};

exports.help = {
    name: "reminder",
    category: "Reminder",
    description: "Create, view and delete reminders.",
    usage: "reminder -v => View all your current reminders. \n> reminder -c -1h Food! => Create a reminder in 1h from now.\n> reminder -rm -ID => Delete the reminder with the given ID.",
    flags: ['-v => View all your reminders.', '-c => Create a new reminder.', '-rm => Remove/delete the given reminder.']
};