
const Discord = require('discord.js')

module.exports = (client, guild) => {
  client.logger.dba(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);

  let object = {
    guildId: guild.id,
    prefix: process.env.PREFIX || '//',
    color: '',
    staffrole: '', 
    todochannel: '',
  };

  client.setConfig(object);

  const channel = guild.channels.filter(c => c.type === 'text').find(x => x.name === 'bot-commands')
    || guild.channels.filter(c => c.type === 'text').find(x => x.name === 'general')
    || guild.channels.filter(c => c.type === 'text').find(x => x.position === 0);
  channel.send(new Discord.RichEmbed()
    .setAuthor('Hello!')
    .setFooter(client.user.username)
    .setTimestamp()
    .setThumbnail(client.user.avatarURL)
    .setDescription(`Thank you for adding me to your server! \n \nTo start the bot setup, go into your bot-command channel and run the command \`//setup\`. \n\n__**Note:**__ \nThe setup command requires you to have the \`ADMINISTRATOR\` permission. Make sure you have it.`)
    .setColor('#2C2F33'));

  let channel = client.guilds.get('710022036252262485').channels.get('724031336351793263');
  channel.send(new Discord.RichEmbed()
    .setTitle(`New guild has been joined.`)
    .setThumbnail(guild.iconURL)
    .setDescription(`${guild.name} (ID: ${guild.id})`)
    .addField(`Owner:`, `> ${guild.owner} (${client.users.get(guild.owner.id).tag})`, true)
    .addField(`Region:`, `> ${guild.region}`, true)
    .addField(`Membercount:`, `> ${guild.memberCount}`, true)
    .setColor('GREEN'));
};
