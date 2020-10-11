const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (client, message, _args, _level) => {
        await message.delete();
        await message.channel.send(new MessageEmbed()
            .setAuthor(`${client.user.username}`, client.user.avatarURL())
            .setDescription(`To join the bots support server [click here](https://discord.gg/yJUbads 'https://discord.gg/yJUbads').`)
            .setColor('YELLOW'));
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'User'
    },
    help: {
        name: 'support',
        category: 'Bot_Support',
        description: 'Gives you the invite to this bots support server.',
        usage: 'support [no args]'
    }
};
