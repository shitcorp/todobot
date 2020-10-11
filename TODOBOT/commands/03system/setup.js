const { MessageCollector } = require('discord.js');

module.exports = {
    run: async (client, message, _args, _level) => {
        const settings = await client.getConfig(message.guild.id);
        if (settings) 
            return message.channel.send(client.warning(`You've run your setup already. From now on all your settings are controled with the \`${settings.prefix || process.env.PREFIX}systemctl\` command. For more info on that run: \`${settings.prefix || process.env.PREFIX}systemctl -h\``))
                .then(msg => msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD }));
    
        await message.delete();
        const msg = await message.channel.send(client.embed(`Welcome to your setup! \nDo you want to use another prefix than '//' ? \nIf so, please mention it now. \n\n(1 minute)`));
        await msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD });
        
        const prefixMsgCollector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
        prefixMsgCollector.on('collect', async (prefixMsg) => {
            prefixMsgCollector.stop();
            await prefixMsg.delete();
            let success = await message.channel.send(client.success(`Nice! I've set your new Prefix to \`${prefixmsg.content}\`! If you ever forget it, simply mention me and I'll tell you about my current prefix.`))
            await success.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD });
            
            const role = await message.channel.send(client.embed(`What role do you want to be able to use this Bot? Please mention it in your answer. \n\n(1 minute)`))
            await role.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD });
            
            const roleMsgCollector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
            roleMsgCollector.on('collect', async (roleMsg) => {
                roleMsgCollector.stop();
                await roleMsg.delete();
                if (rolemsg.content.includes('@everyone') || rolemsg.content.includes('@here')) 
                    return message.channel.send(client.warning(`You can't use \`@ everyone\` or \`@ here\` as your staffrole.`))
                    .then(msg => msg.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD }));
            });
    
            success = await message.channel.send(client.success(`Okay! \`${rolemsg.mentions.roles.first().name}\` is your new Staff Role! This means that users of this role can use the \`todo\` command and assign themselves to open issues/todos. You will also need that role to assign yourself to open TODOs.\nUsers with this role will not be able to use the \`systemctl\` or any other admin commands.`))
            await success.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD });

            const todo = await message.channel.send(client.embed(`What channel do you want your TODO's to be posted in? Please mention it in your answer. \n\n(1 minute)`))
            await todo.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD });
            const todoMsgCollector = new MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 60000 });
            todoMsgCollector.on('collect', async (channelMsg) => {
                todoMsgCollector.stop();
                await channelMsg.delete();
                const channelId = channelMsg.content.replace('<#', '').replace('>', '');
                const channel = message.guild.channels.cache.get(channelId);              

                const newConf = {
                    _id: message.guild.id,
                    prefix: prefixmsg.content,
                    color: 'BLUE',
                    todochannel: channel.id,
                    suggestchannel: null,
                    approvedchannel: null,
                    bugchannel: null,
                    suggestion_vote_timeout_max: 24,
                    suggestion_vote_minimum_amount: 1,
                    suggestion_comments_enabled: true,
                    suggestion_edits_enabled: true,
                    suggestions_enabled: false,
                    bugs_enabled: false,
                    staffroles: rolemsg.mentions.roles.keys(),
                    categories: ['Example Category'],
                    tags: { 'example': 'This is an example tag, to learn more about this feature run the command \`help tags\`' },
                    blacklist_channels: [],
                    blacklist_users: []
                };

                try {
                    await client.setConfig(newConf);
                } catch (err) {
                    client.logger.debug(err);
                    return await message.channel.send(client.error('There was an error trying to save your config. Please try again.'));
                }
                const roles = roleMsg.mentions.roles.first(5).map(role => `\`${role.name}\``).join(', ');
                success = await message.channel.send(client.success(`This ends the setup process. You can change any of these values at any time by using the \`${newConf.prefix}systemctl -set\` command. \nFor information on that topic, run \`${newConf.prefix}systemctl -h\` \n\n__**Summary:**__ \n\nPrefix:  \`${newConf.prefix}\`\nStaffroles:  ${roles}\nTODO Channel:  \`${channel.name}\``))
                await success.delete({ timeout: process.env.MSG_DELETE_THRESHHOLD });
            })
        });
    },
    conf: {
        enabled: true,
        guildOnly: true,
        aliases: [],
        permLevel: 'ADMIN'
    },
    help: {
        name: 'setup',
        category: 'System',
        description: 'Set up everything bot related.',
        usage: 'setup'
    }
};
