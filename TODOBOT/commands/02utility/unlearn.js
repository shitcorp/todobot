const 
    { configmodel } = require('../../modules/models/configmodel'),
    messages = require('../../localization/messages.js');

exports.run = async (client, message, args, level) => {

    const conf = await client.getconfig(message.guild.id);
    if (!conf) return message.channel.send(client.error(messages.noguildconfig["en"]));
    const lang = conf.lang || "en";
 
    if (!args[0]) return message.channel.send(client.error(messages.forgottagtounlearn[lang]))

configmodel.find({ _id: message.guild.id }).then(res => {
    if (!res[0]) return message.channel.send(client.error(messages.noguildconfig[lang]))
    let tag = args[0];
    let check = res[0].tags.get(tag)
    if (!check) return message.channel.send(client.error(messages.tagdoesnotexist[lang]))  
    res[0].tags.delete(tag)
    configmodel.updateOne({ _id: message.guild.id }, res[0], function(err, affected, resp) {
        if (err) console.log(err)
        message.channel.send(client.success(messages.tagunlearned[lang] + `\`${tag}\`.`))
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
    name: "unlearn",
    category: "Utility",
    description: "Unlearn tags that you dont need anymore.",
    usage: "unlearn <tag> \n> Example: //unlearn sql \n\nTo view all available tags, use \`systemctl -v tags\` \nTo view the manual, use \`systemctl -v -man tags\`"
};