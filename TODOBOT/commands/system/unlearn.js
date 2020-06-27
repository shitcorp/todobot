const { configmodel } = require('../../modules/models/configmodel')

exports.run = async (client, message, args, level) => {

 if (!args[0]) return message.channel.send(client.error(`You forgot to give a tag.`))

configmodel.find({ _id: message.guild.id }).then(res => {
    if (!res[0]) return message.channel.send(client.error(`There was no config found for your guild.`))
    let tag = args[0];
    let check = res[0].tags.get(tag)
    if (!check) return message.channel.send(client.error(`This tag does not seem to exist.`))  
    res[0].tags.delete(tag)
    configmodel.updateOne({ _id: message.guild.id }, res[0], function(err, affected, resp) {
        if (err) console.log(err)
        message.channel.send(client.success(`Successfully unlearned the tag \`${tag}\`.`))
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
    name: "unlearn",
    category: "System",
    description: "Unlearn tags that you dont need anymore.",
    usage: "unlearn tag \n>Example: //unlearn sql"
};