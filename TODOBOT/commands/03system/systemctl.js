const { MessageEmbed } =require('discord.js'),
    Config = require('../../modules/models/config');

async function showTags(message, client) {
    const result = await Config.find({ _id: message.guild.id });
    if (!result[0])
        return await message.channel.send(client.error(`I couldnt find any config for your guild.`));
    let embed = new MessageEmbed()
        .setTitle(`Available Tags in ${message.guild.name}`)
        .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL)
        .setColor('#2C2F33')
        .setDescription(Object.entries(res[0].tags).map(([k, v]) => `• \`${k}\` =>  ${v.slice(0, 69)} \n`))
        .setTimestamp();

    if (message.flags.includes('m') || message.flags.includes('man') || message.flags.includes('manual'))
        embed.addField(`__Manual:__`, `Add new tags by using the learn command like so: \n \`\`\`//learn example This is an example tag\`\`\` \nTo unlearn a tag, use the unlearn command like so: \n \`\`\`//unlearn example\`\`\`\nTo add a tag that sends a dm to the mentioned user, use the %%SENDDM%% keyword somewhere in your tags description. \`\`\`//learn dmtest %%SENDDM%% This is a dm tag. It will be sent to the dms of a mentioned user.\`\`\` \nFor reply tags (where the bot replies to the mentioned user) use the %%REPLY%% keyword somewhere in your tags description \`\`\` //learn replytest %%REPLY%% This tag will reply to the mentioned user. \`\`\` `);
    
    await message.channel.send(embed);
}

function isChannel(message, args) {
    if (!args[1].startsWith('<#')) 
        return false;
    const channelCheck = message.guild.channels.cache.get(args[1].replace('<#', '').replace('>', ''));
    return typeof channelCheck === 'undefined' ? false : channelCheck;
}

module.exports = {
    run: async (client, message, args, level) => {
        let settings = await client.getConfig(message.guild.id);
        switch(message.flags[0]) {
            case 'v':
            case 'view':
                switch(args[0]) {
                    case 'tags':
                        showTags(message, client);
                        break;
                    case 'settings':
                    default:
                        delete settings.__v;
                        await message.channel.send(Object.entries({ tags: 'To view tags run the command //tags', ...settings })
                            .map(([k, v]) => `> ${k}        ${v} \n`));  
                }
                break;
            case 's':
            case 'set':
                switch(args[0]) {
                    case 'prefix':
                        if (!args[1]) 
                            return message.channel.send(client.error(`Please enter a new value.`))
                                .then(async (msg) => msg.deletable && await msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD }));
                        client.updateConfig(message.guild.id, { prefix: args[1], ...settings });
                        message.channel.send(client.success(`Saved ⠀\`${args[1]}\`⠀ as your new prefix!`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => { }) });
                        break;
                    case 'staffrole':
                        if (!message.mentions.roles.first() || !isChannel(message, args)) 
                            return message.channel.send(client.error(`Please mention a real role.`))
                                .then(async (msg) => await msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD }));
                        client.updateConfig(message, { staffrole: message.mentions.roles.first().id, ...settings });
                        message.channel.send(client.success(`Saved ⠀\`${message.mentions.roles.first().name}\`⠀ as your new staffrole!`))
                            .then(async (msg) => await msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD }));
                        break;
                    case 'todochannel':
                        if (!args[1].startsWith(`<#`)) 
                            return message.channel.send(client.error(`Please mention a real channel.`))
                                .then(async (msg) => await msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD }));
                        if (!isChannel(message, args)) 
                            return await message.channel.send(client.error(`This channel does not seem to exist. Please try again.`));
                        client.updateConfig(message, { todochannel: message.mentions.channels.first().id, ...settings });
                        message.channel.send(client.success(`Saved⠀\`${ischannel(message, args).name}\`⠀as your new todo channel!`))
                            .then(async (msg) => await msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD }));
                        break;
                    case 'color':
                        await message.channel.send(client.warning(`This is not implemented yet.`));
                        break;
                    default:
                        message.channel.send(client.warning(`This is not a valid key. Available keys are: prefix, staffrole, todochannel and color.`))
                            .then(async (msg) => await msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD }));
                        break;
                }
                break;
            default:
                const help = client.commands.get('help');
                help.run(client, message, ['systemctl'], level); 
        }
    },
    conf: {
        enabled: true,
        guildOnly: true,
        aliases: ['sysctl', 'systemcontrol', 'sys', 'sysi'],
        permLevel: 'ADMIN'
    },
    help: {
        name: 'systemctl',
        category: 'System',
        description: 'View or change settings for your server.',
        usage: 'systemctl -[flag] <key> <value>\n> Available flags: \n> -s | -set\n> -v | -view \n> __Examples:__ \n> systemctl -s prefix %t \n> systemctl -s todochannel #channelmention',
        flags: ['-v => View your guilds settings.', '-s => Change your guilds settings.']
    }
};
