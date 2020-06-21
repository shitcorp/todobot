const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const Discord = require('discord.js')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  message.delete().catch(console.error());

  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  
  const msg = await message.channel.send(".");
  
  const statembed = new Discord.RichEmbed()
  .setAuthor(`${client.user.username} Statistics`, client.user.avatarURL)
  .addField("• Mem Usage", `> ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
  .addField("• Uptime", `> ${duration}`, true)
  .addField("• Users ", `> ${client.users.size.toLocaleString()}`, true)
  .addField("• Servers", `> ${client.guilds.size.toLocaleString()}`, true)
  .addField("• Discord.js", `> v${version}`, true)
  .addField("• Node", `> ${process.version}`, true)
  .addField("• Ping", `> ${msg.createdTimestamp - message.createdTimestamp}ms.`, true)
  .addField("• API Latency", `> ${Math.round(client.ping)}ms`, true)
  .addField("• Author", `> MeerBiene#7060 (<@686669011601326281>)`, true)
  .setColor("#2C2F33")


  msg.channel.send(`Update worked.`)
msg.edit(statembed).then(ms => {
  ms.delete(10000).catch(error => {client.discordlog(error, ms, "MESSAGE DELETE")})
})
};


exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 'User'
};


exports.help = {
  name: "stats",
  category: "System",
  description: "Gives some useful bot statistics",
  usage: "stats"
};
