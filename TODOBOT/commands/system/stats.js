const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  message.delete().catch(console.error());

  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

  const msg = await message.channel.send(".");

  const pkg = require('../../package.json')

  let output = "";

  for (const key in pkg.dependencies) {
    let value = pkg.dependencies[key]
    output += `>> \`${key}\` \`${value}\`\n`
  }

  const statembed = new MessageEmbed()
  .setAuthor(`${client.user.username} Statistics`, client.user.avatarURL)
  .addField("• Mem Usage", `> ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
  .addField("• Uptime", `> ${duration}`, true)
  .addField("• Users ", `> ${client.users.cache.size}`, true)
  .addField("• Guilds", `> ${client.guilds.cache.size}`, true)
  .addField("• Version", `> v${pkg.version}`, true)
  .addField("• Node", `> ${process.version}`, true)
  .addField("• Ping", `> ${msg.createdTimestamp - message.createdTimestamp}ms.`, true)
  .addField("• API Latency", `> ${Math.round(client.ping)}ms`, true)
  .addField("• Author", `> MeerBiene#7060 (<@686669011601326281>)`, true)
  .setColor("#2C2F33")

  if (message.flags.includes("l") || message.flags.includes("lib")) {
    statembed.addField("Used Libraries:", output)
    statembed.addField("License:", pkg.license)
  }



msg.edit(statembed).then(ms => {
  ms.delete({timeout: 60000}).catch(error => {client.discordlog(error, ms, "MESSAGE DELETE")})
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
  description: "Gives some useful bot statistics. \n> To learn about the used libraries, use the -l or -lib flag.",
  usage: "stats | stats -l | stats -lib"
};
