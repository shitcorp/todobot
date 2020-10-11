const Config = require('../../modules/models/config'),
    { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (client, message, args, _level) => {
        if (!args[0]) 
            return await message.channel.send(client.error(`You forgot to give a tag.`));
        if (!args[1]) 
            return await message.channel.send(client.error(`You forgot to give a description for your tag.`));

        const res = await Config.find({ _id: message.guild.id });
        if (!res[0]) 
            return await message.channel.send(client.error(`There was no config found for your guild.`));
        if (client.commands[args[0]]) 
            return await message.channel.send(client.error(`You cant override bot commands with tags.`));
        if (client.aliases[args[0]]) 
            return await message.channel.send(client.error(`You cant override bot commands or aliases with tags.`));
        let check = res[0].tags[args[0]];
        if (check && !message.flags.includes(`force`)) 
            return message.channel.send(client.error(`This tag already exists, unlearn it first before overwriting, or use this command with the \`-force\` flag.`));
        args.shift();
        let desc = args.join(' ');
        if (desc.length > 1000) 
            return await message.channel.send(client.error(`Your description was too long. You used \`${desc.length}\` out of \`1000\` available characters.`));
        res[0].tags.set(args[0], desc);
        try {
            const result = await Config.updateOne({ _id: message.guild.id }, res[0]);
            if(result.ops.length === 1)
                return await message.channel.send(client.success(`Saved the tag \`${args[0]}\` with the description \`${desc}\` for you.`));
            client.invalidateCache(message.guild.id);
        }catch(err){
            client.logger.debug(err);
        }
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'STAFF'
    },
    help: {
        name: 'learn',
        category: 'Utility',
        description: 'Let the bot learn a new tag...',
        usage: 'learn <tag> <description> \n> Example: //learn sql Sql stands for structured query language and is used... \n\nTo view all available tags, use \`systemctl -v tags\` \nTo view the manual, use \`systemctl -v -man tags\`',
        flags: ['-force => Force overwrite a tag']
    },
    manual: async (message) => await message.channel.send(new MessageEmbed()
        .addField(`__Learn Command Manual:__`, `Add new tags by using the learn command like so: \n \`\`\`//learn example This is an example tag\`\`\` \nTo unlearn a tag, use the unlearn command like so: \n \`\`\`//unlearn example\`\`\`\nTo add a tag that sends a dm to the mentioned user, use the %%SENDDM%% keyword somewhere in your tags description. \`\`\`//learn dmtest %%SENDDM%% This is a dm tag. It will be sent to the dms of a mentioned user.\`\`\` \nFor reply tags (where the bot replies to the mentioned user) use the %%REPLY%% keyword somewhere in your tags description \`\`\` //learn replytest %%REPLY%% This tag will reply to the mentioned user. \`\`\` `)
        .setColor('RED'))
};
