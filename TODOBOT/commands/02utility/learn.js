const { configmodel } = require('../../modules/models/configmodel')

exports.run = async (client, message, args, level) => {

    const messages = require('../../localization/messages.js');

    const conf = await client.getconfig(message.guild.id);
    const lang = conf.lang || "de";

 if (!args[0]) return message.channel.send(client.error(messages.forgottag[lang]))
    if (!args[1]) return message.channel.send(client.error(messages.forgotdescription[lang]))

    configmodel.find({ _id: message.guild.id }).then(res => {
        if (!res[0]) return message.channel.send(client.error(messages.noguildconfig[lang]))
        let tag = args[0];
        let cmdcheck = client.commands.get(tag)
        let alcheck = client.aliases.get(tag)
        if (cmdcheck) return message.channel.send(client.error(messages.cantoverwritecommands[lang]))
        if (alcheck) return message.channel.send(client.error(messages.cantoverwritecommands[lang]))
        let check = res[0].tags.get(tag)
        if (check && !message.flags.includes(`force`)) return message.channel.send(client.error(messages.tagalreadyexists[lang]))
        args.shift();
        let desc = args.join(' ')
        if (desc.length > 1000) return message.channel.send(client.error(messages.descriptiontoolong[lang] + desc.length))
        res[0].tags.set(tag, desc)
        configmodel.updateOne({ _id: message.guild.id }, res[0], function (err, affected, resp) {
            err ? console.error(err) :
                message.channel.send(client.success(messages.tagsaved[lang] + `\n\n> Tag:  \`${tag}\` \n\n> Description:  \`${desc}\``))
            client.invalidateCache(message.guild.id);
        })
    })
};

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
    const { MessageEmbed } = require('discord.js');
    const em = new MessageEmbed()
        //.setTitle("Tags Manual")
        .addField(`__Learn Command Manual:__`, `Add new tags by using the learn command like so: \n \`\`\`//learn example This is an example tag\`\`\` \nTo unlearn a tag, use the unlearn command like so: \n \`\`\`//unlearn example\`\`\`\nTo add a tag that sends a dm to the mentioned user, use the %%SENDDM%% keyword somewhere in your tags description. \`\`\`//learn dmtest %%SENDDM%% This is a dm tag. It will be sent to the dms of a mentioned user.\`\`\` \nFor reply tags (where the bot replies to the mentioned user) use the %%REPLY%% keyword somewhere in your tags description \`\`\` //learn replytest %%REPLY%% This tag will reply to the mentioned user. \`\`\` `)
        .setColor("RED")
    message.channel.send(em);
};