const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (client, message, _args, _level) => {
        await message.delete();
        const msg = await message.channel.send(new MessageEmbed()
            .setAuthor(`${client.user.tag}`, client.user.avatarURL)
            .setDescription(`[Invite me to your server.](http://invite.todo-bot.xyz 'http://invite.todo-bot.xyz')`)
            .setColor('#2C2F33'));
        await msg.delete({ timeout: 9e5 });
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'User'
    },
    help: {
        name: 'invite',
        category: 'Bot_Support',
        description: 'Returns the bots invite link.',
        usage: 'invite [no args]'
    }
};
