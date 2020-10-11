const { RichEmbed } = require('discord.js')

module.exports = (client, guild) => {
    let channel = client.guilds.cache.get('710022036252262485').channels.cache.get('724031336351793263')
    channel.send(new RichEmbed()
        .setTitle(`Bot has been removed from a guild.`)
        .setThumbnail(guild.iconURL)
        .setDescription(`${guild.name} (ID: ${guild.id})`)
        .addField(`Owner:`, `> ${guild.owner} (${client.users.get(guild.owner.id).tag})`, true)
        .addField(`Region:`, `> ${guild.region}`, true)
        .addField(`Membercount:`, `> ${guild.memberCount}`, true)
        .setColor('RED'));
}
