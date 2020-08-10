const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args, level) => {

    let cmd = client.commands.get(args[0])
    if (!cmd) return message.channel.send(client.error("This command does not seem to exist.")).then(msg => {
        msg.delete({ timeout: 60000 });
    })
    cmd.manual ? cmd.manual(message) : 
        message.channel.send(client.error("This command does not seem to have a manual.")).then(msg => {
            msg.delete({ timeout: 60000 });
        })


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
    category: "System",
    description: "View the bots manual.",
    usage: "reminder -v => View all your current reminders. \n> reminder -c -1h Food! => Create a reminder in 1h from now.\n> reminder -rm -ID => Delete the reminder with the given ID.",
    flags: ['-v => View all your reminders.', '-c => Create a new reminder.', '-rm => Remove/delete the given reminder.']
};

exports.manual = (message) => {
    const em = new MessageEmbed()
        .setTitle("Manual Manual")

    message.channel.send(em)
}