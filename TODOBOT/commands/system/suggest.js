const { RichEmbed } = require('discord.js')

exports.run = async (client, message, args, level) => {

    message.delete().catch(console.error());
    
    if(!args[0]) return message.channel.send(client.error(`You forgot to give a suggestion text. \n\n__**Command help:**__\nTo add an image, pass a screenshot URL right after the command, prefixed with a dash(-). \nTo hide where the suggestion was created pass the -hide flag (after the image flag if you use an image).`)).then(msg => {
        msg.delete(60000).catch(console.error())
    })


    const embed = new RichEmbed()
    .setTitle(`New Suggestion:`)
    .setThumbnail(message.author.avatarURL)
    .setColor("#2C2F33")

    if (message.guild.id !== "710022036252262485" && !message.flags.includes("hide")) {
        embed.addField(`Sent in server:`, `${message.guild.name}`)
    }

    if (message.flags[0] && message.flags[0].startsWith(`https://`)) {
        embed.setImage(message.flags[0])        
    }

    const sugtext = args.join(' ')
    embed.setDescription(`> ${sugtext} \n\nSubmitted by: ${message.author.tag} (${message.author}) `)

    let G = client.guilds.get("710022036252262485").channels.get("724024609682489375")

    try {
        G.send(embed).then(async msg => {
            await msg.react("⬆️");
            await msg.react("⬇️");
        })
        message.channel.send(client.success(`Your feature request has been submitted.`)).then(ms => {
            ms.delete(60000).catch(console.error())
        })
    } catch(e) {
        message.channel.send(client.error(`There was an error trying to post your suggestions. Was your image URL well formatted?`))
    }

    
    


}



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "suggest",
    category: "System",
    description: "Suggest feature requests.",
    usage: "suggest <suggestiontext> \n> To add an image, pass a screenshot URL right after the command, prefixed with a dash(-). \n> To hide where the suggestion was created pass the -hide flag (after the image flag if you use an image).",
    flags: ['-hide => Hides the server, where the suggestion was sent in.']
};