const os = require('os');
const { MessageEmbed } = require('discord.js-light');
const { todomodel }= require('../modules/models/todomodel');

const raw = {
    name: 'stats',
    description: 'Show some bot statistics like memory or CPU Usage.'
};

module.exports = {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        premium: false,
        production: true,
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
    run: async (client, interaction) => {
        const all = await todomodel.find({});
        const pkg = require('../../package.json');
        const load = os.loadavg();
        const chan = await client.guilds.cache.get(interaction.guild_id).channels.fetch(interaction.channel_id);
        const msg = await chan.send('ping.');
        const statembed = new MessageEmbed()
            .setAuthor(client.user.username + ' Statistics', client.user.avatarURL())
            .addField("• Mem Usage", `> ${(process.memoryUsage().heapUsed / 1000 / 1000).toFixed(2)} MB`, true)
            .addField("• Load Avg (Unix)", `> ${load.join(', ')}`, true)
            .addField("• Uptime", `> ${Math.round(client.uptime / 3600000)}h`, true)
            .addField("• TODOs ", `> ${all.length}`, true)
            .addField("• Guilds", `> ${client.guilds.cache.size}`, true)
            .addField("• Version", `> v${pkg.version}`, true)
            .addField("• Ping", `> ${msg.createdTimestamp - interaction.timestamp}ms.`, true)
            .addField("• API Latency", `> ${Math.round(client.ws.ping)}ms`, true)
            .addField("• Repo", `${client.emojiMap['github']} [Github](${pkg.repository.url})`, true)
            //cdn.discordapp.com/avatars/ user.id + user.avatar + .png
            .setFooter(`Requested by ${interaction.member.user.username}#${interaction.member.user.discriminator}   •    www.todo-bot.xyz`, 'https://cdn.discordapp.com/avatars/' + interaction.member.user.id + '/' + interaction.member.user.avatar + '.png')
            .setColor("BLUE")
        try {
            msg.delete();
            interaction.replyWithMessageAndDeleteAfterAWhile(statembed);
        } catch (e) {
            client.logger.debug(e);
            interaction.errorDisplay('An error occured, please try again.');
        }
    }
};