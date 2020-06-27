const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {

    let embed = new Discord.RichEmbed()
        .setAuthor(`${message.author.tag}`, message.author.avatarURL)
        .addField("update", "worked")
        .setColor("#2C2F33")
    
    message.channel.send(embed)

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "bug",
    category: "Bot_Support",
    description: "Report a bug to the developer(s).",
    usage: "bug <describe your bug here> \n__Example:__\n> //bug The render command is not working pls fix."
};