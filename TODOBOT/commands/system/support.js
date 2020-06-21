const Discord = require('discord.js')

const dateFormat = require('dateformat');


exports.run = async (client, message, args, level) => {

    message.delete().catch(console.error());
    
    

    let embed = new Discord.RichEmbed()
        .setAuthor(`${client.user.tag}`, client.user.avatarURL)
        .setDescription(`To join the bots support server [click here](https://discord.gg/yJUbads "https://discord.gg/yJUbads").`)
        .setColor("#2C2F33")
    
    message.channel.send(embed).then(msg => { msg.delete(90000).catch(error => {}) })


}



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "support",
    category: "System",
    description: "Gives you the invite to this bots support server.",
    usage: "support [no args]"
};