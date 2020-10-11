const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (client, message, _args, level) => {
        const msg = message.channel.send(new MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .setDescription(`Your permission level is: \n> **${client.permLevels[level].name}**.`)
            .setColor('#2C2F33'));
        await msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD });  
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'User'
    },
    help: {
        name: 'la',
        category: 'System',
        description: 'Returns your current permission level.',
        usage: 'la,  ||  systemctl -la'
    }
};
