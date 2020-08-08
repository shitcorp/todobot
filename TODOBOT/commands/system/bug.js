const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {

    // IDEA: use this for server owners to let users
    // submit bugs. 
    // Important: integrate with poxel issuetracker somehow 

    let embed = new MessageEmbed()
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
    category: "Utility",
    description: "Report a bug.",
    usage: "bug <describe your bug here> \n__Example:__\n> //bug The render command is not working pls fix."
};