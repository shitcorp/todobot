const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (client, message, args, _level) => {
        await message.delete();
        if(!args[0]) 
            return message.channel.send(client.error(`You forgot to give a suggestion text. \n\n__**Command help:**__\nTo add an image, pass a screenshot URL right after the command, prefixed with a dash(-). \nTo hide where the suggestion was created pass the -hide flag (after the image flag if you use an image).`))
                .then(async (msg) => await msg.delete({ timeout: 60000 }));
    
        const embed = new MessageEmbed()
            .setTitle(`New Suggestion:`)
            .setThumbnail(message.author.avatarURL)
            .setColor('#2C2F33')
            .setDescription(`> ${args.join(' ')} \n\nSubmitted by: ${message.author.tag} (${message.author}) `);
    
        if (message.guild.id !== '710022036252262485' && !message.flags.includes('hide'))
            embed.addField(`Sent in server:`, `${message.guild.name}`);
    
        if (message.flags[0] && message.flags[0].startsWith(`https://`))
            embed.setImage(message.flags[0]);
    
        const channel = client.guilds.cache.get('710022036252262485').channels.cache.get('724024609682489375');
    
        try {
            const msg = await channel.send(embed);
            await msg.react('⬆️');
            await msg.react('⬇️');
            message.channel.send(client.success(`Your feature request has been submitted.`))
                .then(async (ms) => await ms.delete({ timeout: 60000 }));
        } catch(e) {
            await message.channel.send(client.error(`There was an error trying to post your suggestions. Was your image URL well formatted?`));
        }
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'User'
    },
    help: {
        name: 'suggest',
        category: 'Bot_Support',
        description: 'Suggest feature requests.',
        usage: 'suggest <suggestiontext> \n> To add an image, pass a screenshot URL right after the command, prefixed with a dash(-). \n> To hide where the suggestion was created pass the -hide flag (after the image flag if you use an image).',
        flags: ['-hide => Hides the server, where the suggestion was sent in.']
    }
};
