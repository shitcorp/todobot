import { MessageEmbed } from 'discord.js-light'
import configmodel from '../modules/models/configmodel'

export default async (client, guild) => {
    client.logger.mongo(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot.`)
    // if we have the guildconfig already saved or cached we should
    // return so we get no errors
    let confcheck = await configmodel.findOne({ _id: guild.id })
    let cachecheck = await client.cache.get(guild.id)
    if (confcheck) return
    if (cachecheck) return

    //create the configobject and insert the default settings
    let configobject = {
        _id: guild.id,
        prefix: '//',
        color: 'BLUE',
        todochannel: null,
        readonlychannel: null,
        staffroles: [],
        userroles: [],
        tags: new Map(),
        blacklist_channels: [],
        blacklist_users: [],
        vars: new Map(),
        lang: 'en',
    }
    await client.setconfig(configobject)
    const channel =
        guild.channels.cache.filter((c) => c.type === 'text').find((x) => x.name === 'bot-commands') ||
        guild.channels.cache.filter((c) => c.type === 'text').find((x) => x.name === 'general') ||
        guild.channels.cache.filter((c) => c.type === 'text').find((x) => x.position === 0)
    let embed = new MessageEmbed()
        .setAuthor('Hello!')
        .setFooter(client.user.username)
        .setTimestamp()
        .setThumbnail(client.user.avatarURL)
        .setDescription(
            `Thank you for adding me to your server! \n \nTo start the bot setup, go into your bot-command channel and run the command \`//setup\`. \n\n__**Note:**__ \nThe setup command requires you to have the \`ADMINISTRATOR\` permission. Make sure you have it.`,
        )
        .setColor('#2C2F33')
    channel.send(embed)

    let motherGuild = client.guilds.cache
        .get(process.env.MOTHER_GUILD)
        .channels.cache.get('724022857767583805')
    let newserv = new MessageEmbed()
        .setTitle(`New guild has been joined.`)
        .setThumbnail(guild.iconURL)
        .setDescription(`${guild.name} (ID: ${guild.id})`)
        //.addField(`Owner:`, `> ${guild.owner} (${client.users.get(guild.owner.id).tag})`, true)
        .addField(`Region:`, `> ${guild.region}`, true)
        .addField(`Membercount:`, `> ${guild.memberCount}`, true)
        .setColor('GREEN')

    if (!motherGuild) return
    try {
        motherGuild.send(newserv)
    } catch (e) {
        client.logger.debug(e)
    }
}
