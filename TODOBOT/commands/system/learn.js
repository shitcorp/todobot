const Discord = require('discord.js');
const mongoose = require('mongoose');
const { configmodel } = require('../../modules/models/configmodel')

exports.run = async (client, message, args, level) => {

 if (!args[0]) return message.channel.send(client.error(`You forgot to give a tag.`))
 if (!args[1]) return message.channel.send(client.error(`You forgot to give a description for your tag.`))

configmodel.find({ _id: message.guild.id }).then(res => {
    if (!res[0]) return message.channel.send(client.error(`There was no config found for your guild.`))
    let tag = args[0];
    let cmdcheck = client.commands.get(tag)
    if (cmdcheck) return message.channel.send(client.error(`You cant override bot commands with tags.`))
    let check = res[0].tags.get(tag)
    if (check && !message.flags.includes(`force`)) return message.channel.send(client.error(`This tag already exists, unlearn it first before overwriting, or use this command with the \`-force\` flag.`))
    args.shift();
    let desc = args.join(' ')   
    res[0].tags.set(tag, desc)
    configmodel.updateOne({ _id: message.guild.id }, res[0], function(err, affected, resp) {
        if (err) console.log(err)
        message.channel.send(client.success(`Saved the tag \`${tag}\` with the description \`${desc}\` for you.`))
    })
})
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "Staff"
};

exports.help = {
    name: "learn",
    category: "System",
    description: "Let the bot learn a new tag...",
    usage: "learn tag description \n>Example: //learn sql Sql stands for structured query language and is used..."
};