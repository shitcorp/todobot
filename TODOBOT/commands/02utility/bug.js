const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (_client, message, _args, _level) => {
        // IDEA: use this for server owners to let users
        // submit bugs. 
        // Important: integrate with poxel issuetracker somehow 
        await message.channel.send(new MessageEmbed()
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .addField('update', 'worked')
            .setColor('#2C2F33'));
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'User'
    },
    help: {
        name: 'bug',
        category: 'Utility',
        description: 'Report a bug.',
        usage: 'bug <describe your bug here> \n__Example:__\n> //bug The render command is not working pls fix.'
    }
};