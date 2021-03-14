const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, level) => {

    let embed = new MessageEmbed()
        .setAuthor(`${client.user.tag}`, client.user.avatarURL())
        .setDescription(`[Invite me to your server.](http://invite.todo-bot.xyz "http://invite.todo-bot.xyz")`)
        .setColor("BLUE")
    
    message.channel.send(embed).then(msg => { msg.delete({ timeout: 90000}).catch(error => {}) })


}



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "invite",
    category: "Bot_Support",
    description: "Returns the bots invite link.",
    usage: "invite [no args]"
};