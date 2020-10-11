const Config = require('../../modules/models/config')

const blacklistUser = async (msg, mentions) => {
    const settings = await client.getConfig(message.guild.id);
    if (!settings.blacklist_users) return;
    if (mentions.size == 0) 
        return await msg.channel.send(client.error(`You have to mention one or multiple user(s) to blacklist them.`));
    const blacklist = new Set(settings.blacklist_users.values(), ...mentions.keys);
    try {
        const result = await Config.updateOne({ _id: msg.guild.id }, { blacklist_users: blacklist });
        if(result.ops.length === 1)
            return await msg.channel.send(client.success(`**Updated your blacklist.**`));
        client.invalidateCache(msg.guild.id);
    }catch(err){
        client.logger.debug(err);
    }
};

const blacklistChannel = async (msg, mentions) => {
    const settings = await client.getConfig(message.guild.id);
    if (!settings.blacklist_channels) return;
    if (mentions.size == 0) 
        return await msg.channel.send(client.error(`You have to mention one or multiple channel(s) to blacklist them.`));
    const blacklist = new Set(settings.blacklist_channels.values(), ...mentions.keys);
    try {
        const result = await Config.updateOne({ _id: msg.guild.id }, { blacklist_channels: blacklist });
        if(result.ops.length === 1)
            return await msg.channel.send(client.success(`**Updated your blacklist.**`));
        client.invalidateCache(msg.guild.id);
    }catch(err){
        client.logger.debug(err);
    }
};

const viewBlacklists = () => {
    // add pagination embed
};

const throwError = () => message.channel.send(client.error(`**This flag does not seem to be supported.**
        
    __**Supported Flags are:**__ 

    > ${client.commands.get('blacklist').help.flags.join('\n> ')}
    
    *For more information run \`//help blacklist\`*`));

module.exports = {
    run: async (client, message, _args, _level) => {
        switch (message.flags[0]) {
            case 'u':
            case 'user':
                blacklistUser(message, message.mentions.users);
                break;
            case 'c':
            case 'chan':
            case 'channel':
                blacklistChannel(message, message.mentions.channels);
                break;
            case 'v':
            case 'view':
            case 's':
            case 'show':
                viewBlacklists();
                break;
            default:
                throwError();
        }
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'User'
    },
    help: {
        name: 'blacklist',
        category: 'System',
        description: 'Blacklist one or more users or channels from using the bot on your server.',
        usage: `blacklist -u @User1 @User2 => Blacklist users
        > blacklist -c #Channel1 #Channel2 => Blacklist channels
        
        You can mention mulitple users as well as channels when blacklisting. This also applies for the whitelist command.`,
        flags: [
            `-u => Blacklist user(s)`,
            `-user => Blacklist user(s)`,
            `-v => View your blacklists`,
            `-view => View your blacklists`,
            `-c => Blacklist channel(s)`,
            `-chan => Blacklist channel(s)`,
            `-channel => Blacklist channel(s)`
        ]
    }
}
