const moment = require('moment'),
  { MessageEmbed } = require('discord.js'),
  pkg = require('../../package.json');
require('moment-duration-format');

module.exports = {
  run: async (client, message, _args, _level) => { 
    await message.delete();
    const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
    const msg = await message.channel.send('.');
    const statEmbed = new MessageEmbed()
      .setAuthor(`${client.user.username} Statistics`, client.user.avatarURL)
      .addField('• Mem Usage', `> ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
      .addField('• Uptime', `> ${duration}`, true)
      .addField('• Users ', `> ${client.users.cache.size}`, true)
      .addField('• Guilds', `> ${client.guilds.cache.size}`, true)
      .addField('• Version', `> v${pkg.version}`, true)
      .addField('• Node', `> ${process.version}`, true)
      .addField('• Ping', `> ${msg.createdTimestamp - message.createdTimestamp}ms.`, true)
      .addField('• API Latency', `> ${Math.round(client.ws.ping)}ms`, true)
      .addField('• Author', `> MeerBiene#7060 (<@686669011601326281>)`, true)
      .setColor('#2C2F33');
  
    if (message.flags.includes('l') || message.flags.includes('lib')) {
      let output = pkd.dependencies.entries().map(([k, v]) => `>> \`${k}\` \`${v}\``).join('\n');
      statEmbed.addField('Used Libraries:', output);
      statEmbed.addField('License:', pkg.license);
    }
    msg.edit(statembed).then(async (ms) => ms.deleteable && await ms.delete());
  },
  conf: {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'User'
  },
  help: {
    name: 'stats',
    category: 'System',
    description: 'Gives some useful bot statistics. \n> To learn about the used libraries, use the -l or -lib flag.',
    usage: 'stats | stats -l | stats -lib'
  }
};
