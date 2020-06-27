const Discord = require('discord.js');
const mongoose = require('mongoose');
const { configmodel } = require('../../modules/models/configmodel')

exports.run = async (client, message, args, level) => {

 if (!args[0]) return message.channel.send(client.error(`You forgot to give a tag.`))
 if (!args[1]) return message.channel.send(client.error(`You forgot to give a description for your tag.`))

 args.shift();

 let desc = args.join(' ')

configmodel.find({ _id: message.guild.id }).then(res => {
    console.log(res)
    if (!res[0]) return message.channel.send(client.error(`There was no config found for your guild.`))
})

// message.channel.send(client.success(`The tag \`${args[0]}\` with the description \`${desc}\` has been saved successfully.`))

}



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "Staff"
};

exports.help = {
    name: "tag",
    category: "System",
    description: "Returns your current permission level.",
    usage: "la,  ||  systemctl -la"
};