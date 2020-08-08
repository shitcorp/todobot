const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, level) => {

    message.delete().catch(console.error());
    
    let embed = new MessageEmbed()
        .setAuthor(`${client.user.tag}`, client.user.avatarURL)
        .setDescription(`To join the bots support server [click here](https://discord.gg/yJUbads "https://discord.gg/yJUbads").`)
        .setColor("#2C2F33")
    
    message.channel.send(embed).then(msg => { msg.delete({timeout:90000}).catch(error => {}) })

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
    category: "Bot_Support",
    description: "Gives you the invite to this bots support server.",
    usage: "support [no args]"
};