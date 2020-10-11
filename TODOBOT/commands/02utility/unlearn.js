const Config = require('../../modules/models/config');

module.exports = {
    run: async (client, message, args, _level) => {
        if (!args[0]) return message.channel.send(client.error(`You forgot to give a tag.`))
       Config.find({ _id: message.guild.id }).then(async res => {
            if (!res[0]) 
                return await message.channel.send(client.error(`There was no config found for your guild.`));
            let tag = args[0];
            let check = res[0].tags[tag];
            if (!check) 
                return await message.channel.send(client.error(`This tag does not seem to exist.`));
            delete res[0].tags[tag];
            Config.updateOne({ _id: message.guild.id }, res[0], async (err, _affected, _resp) => {
                if (err) client.logger.error(err);
                await message.channel.send(client.success(`Successfully unlearned the tag \`${tag}\`.`));
            });
       });
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'STAFF'
    },
    help: {
        name: 'unlearn',
        category: 'Utility',
        description: 'Unlearn tags that you dont need anymore.',
        usage: 'unlearn <tag> \n> Example: //unlearn sql \n\nTo view all available tags, use \`systemctl -v tags\` \nTo view the manual, use \`systemctl -v -man tags\`'
    }
};
