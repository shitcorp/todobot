const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = require('discord.js')

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  
  const msg = await message.channel.send(".");

  const pkg = require('../../package.json')

  const statembed = new MessageEmbed()
    .setAuthor(`${client.user.username} Statistics`, client.user.avatarURL)
    .addField("• Mem Usage", `> ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
    .addField("• Uptime", `> ${duration}`, true)
    .addField("• Users ", `> ${client.users.cache.size}`, true)
    .addField("• Guilds", `> ${client.guilds.cache.size}`, true)
    .addField("• Version", `> v${pkg.version}`, true)
    .addField("• Node", `> ${process.version}`, true)
    .addField("• Ping", `> ${msg.createdTimestamp - message.createdTimestamp}ms.`, true)
    .addField("• API Latency", `> ${Math.round(client.ws.ping)}ms`, true)
    .addField("• Author", `> ${pkg.author} \n> [Fork Me On Github](https://github.com/MeerBiene)`, true)
    .setColor("#2C2F33")

  if (message.flags.includes("l") || message.flags.includes("lib")) {
    let output = "";
    for (const key in pkg.dependencies) {
      let value = pkg.dependencies[key]
      output += `>> \`${key}\` \`${value}\`\n`
    }
    statembed.addField("Used Libraries:", output)
    statembed.addField("License:", pkg.license)
  }


  if (msg.deletable) msg.delete();

  message.channel.send(statembed);
 
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
  flags: [
    '-l => Show the libraries used to make this bot'
  ],
  description: "Gives some useful bot statistics. \n> To learn about the used libraries, use the -l or -lib flag.",
  usage: "stats | stats -l | stats -lib"
};
