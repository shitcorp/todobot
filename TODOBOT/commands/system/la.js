const Discord = require('discord.js')

const dateFormat = require('dateformat');


exports.run = async (client, message, args, level) => {

    
    
    const friendly = client.config.permLevels.find(l => l.level === level).name;

    let embed = new Discord.RichEmbed()
        .setAuthor(`${message.author.tag}`, message.author.avatarURL)
        .setDescription(`Your permission level is: \n> **${friendly}**.`)
        .addField("update", "worked")
        .setColor("#2C2F33")
    
    message.channel.send(embed).then(msg => { msg.delete(client.config.msgdelete).catch(error => {}) })


}



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "la",
    category: "System",
    description: "Returns your current permission level.",
    usage: "la,  ||  systemctl -la"
};