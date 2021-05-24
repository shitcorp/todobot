import { Guild } from 'discord.js-light'
import MyClient from '../classes/Client'
import configmodel from '../modules/models/configmodel'

export default async (client: MyClient, guild: Guild) => {
    await client.cache.del(guild.id)
    await configmodel.deleteOne({ _id: guild.id })
    // const { RichEmbed } = require('discord.js')
    // let G = client.guilds.cache.get("710022036252262485").channels.cache.get("724031336351793263")
    // let newserv = new RichEmbed()
    // .setTitle(`Bot has been removed from a guild.`)
    // .setThumbnail(guild.iconURL)
    // .setDescription(`${guild.name} (ID: ${guild.id})`)
    // .addField(`Owner:`, `> ${guild.owner} (${client.users.get(guild.owner.id).tag})`, true)
    // .addField(`Region:`, `> ${guild.region}`, true)
    // .addField(`Membercount:`, `> ${guild.memberCount}`, true)
    // .setColor("RED")
    // G.send(newserv);
}
