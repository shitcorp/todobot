const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args, level) => {

    let cmd = client.commands.get(args[0])
    if (!cmd) return message.channel.send(client.error("This command does not seem to exist.")).then(msg => {
        msg.delete({ timeout: 60000 });
    })
    cmd.manual ? main(cmd.manual, message) : 
        message.channel.send(client.error("This command does not seem to have a manual.")).then(msg => {
            msg.delete({ timeout: 60000 });
        })

     async function main(manual, message) {

        let em = new MessageEmbed()

        console.log(manual)

        manual.name ? em.addField("Command-Name:", manual.name) : 
            manual.description ? em.addField("Description", manual.name) :
                console.log("This is a working test.")

        message.channel.send(em)
    }

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: ['man'],
    permLevel: "STAFF"
};

exports.help = {
    name: "manual",
    category: "Utility",
    description: "View the bots manual.",
    usage: "reminder -v => View all your current reminders. \n> reminder -c -1h Food! => Create a reminder in 1h from now.\n> reminder -rm -ID => Delete the reminder with the given ID.",
    flags: ['-v => View all your reminders.', '-c => Create a new reminder.', '-rm => Remove/delete the given reminder.']
};

exports.manual = {
    name: "This is a default name dont mind me in just vibing here.",
    description: "This is a default description dont mind me.",
    text: "This is some text that you can ignore.",
    media: {
        img: "https://cdn.discordapp.com/attachments/697140747681398965/751185356602474577/unknown.png",
        file: "./example.txt"
    }
};