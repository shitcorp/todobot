const { configmodel } = require('../../modules/models/configmodel')
const { MessageEmbed } = require('discord.js');

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
    if (desc.length > 1700) return message.channel.send(client.error(`Your description was too long. You used \`${desc.length}\` out of \`1700\` available characters.`))
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
    permLevel: "STAFF"
};

exports.help = {
    name: "learn",
    category: "Utility",
    description: "Let the bot learn a new tag...",
    usage: "learn <tag> <description> \n> Example: //learn sql Sql stands for structured query language and is used... \n\nTo view all available tags, use \`systemctl -v tags\` \nTo view the manual, use \`systemctl -v -man tags\`",
    flags: ['-force => Force overwrite a tag']
};

exports.manual = (message) => {
    const em = new MessageEmbed()
    .setTitle("Tags Manual")
    .addField(`__Manual:__`, `Add new tags by using the learn command like so: \n \`\`\`//learn example This is an example tag\`\`\` \nTo unlearn a tag, use the unlearn command like so: \n \`\`\`//unlearn example\`\`\`\nTo add a tag that sends a dm to the mentioned user, use the %%SENDDM%% keyword somewhere in your tags description. \`\`\`//learn dmtest %%SENDDM%% This is a dm tag. It will be sent to the dms of a mentioned user.\`\`\` \nFor reply tags (where the bot replies to the mentioned user) use the %%REPLY%% keyword somewhere in your tags description \`\`\` //learn replytest %%REPLY%% This tag will reply to the mentioned user. \`\`\` `)
    message.channel.send(em);
}