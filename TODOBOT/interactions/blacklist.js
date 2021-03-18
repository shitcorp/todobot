const raw = {
    name: 'blacklist',
    description: 'Blacklist user(s) and/or channel(s)',
    options: [
      {
        name: 'add',
        description: 'Add user(s) or channel(s) to the blacklist.',
        type: 1,
        options: [
          {
            name: 'user',
            description: 'The user you want to blacklist',
            type: 6,
            required: false
          },
          {
            name: 'channel',
            description: 'The channel you want to blacklist',
            type: 7,
            required: false
          }
        ]
      },
      {
        name: 'remove',
        description: 'Remove user(s) or channel(s) from the blacklist.',
        type: 1,
        options: [
          {
            name: 'user',
            description: 'The user you want to blacklist',
            type: 6,
            required: false
          },
          {
            name: 'channel',
            description: 'The channel you want to blacklist',
            type: 7,
            required: false
          }
        ]
      },
      {
        name: 'list',
        description: 'Show your current blacklists.',
        type: 1
      }
    ]
};



module.exports = {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        permLevel: 'STAFF',
    },
    help: {
        category: 'System',
        description: raw.description,
        tutorial: {
            text: '',
            media: '',
        }
    },
    run: async (client, interaction) => {
        const messages = require('../localization/messages');
        const conf = await client.getconfig(interaction.guild_id);
        const lang = conf.lang ? conf.lang : 'en';
        let action, commandopts;
        for (index in interaction.data.options) {
            if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name;
            if (interaction.data.options[index].type === 1 && interaction.data.options[index].options) commandopts = interaction.data.options[index].options;
        }
        switch (action) {
            case 'user':
                // if this doesnt exist we have to append that to the mongoose
                // doc and kindly ask the user to try again
                if (conf.blacklist_users) {
                    let blacklist = []
                    // turn the object from cache into an array for easier handling
                    Object.keys(conf.blacklist_users).forEach(key => blacklist.push(conf.blacklist_users[key]));
                    let user;
                    for (i in commandopts) {
                        if (commandopts[i].name === 'user') user = commandopts[i].value;
                    }
                    if (blacklist.includes(user)) return interactionhandler.embed.error(interaction, messages.useralreadyblacklisted[lang]);
                    blacklist.push(user);
                    conf.blacklist_users = blacklist;
                    client.updateconfig(interaction.guild_id, conf);
                    interactionhandler.embed.success(interaction, messages.updatedyourblacklist[lang]);
                }
                break;
            case 'channel':
                let blacklist = []
                // turn the object from cache into an array for easier handling
                Object.keys(conf.blacklist_channels).forEach(key => blacklist.push(conf.blacklist_users[key]));
                let channel;
                for (i in commandopts) {
                    if (commandopts[i].name === 'channel') channel = commandopts[i].value;
                }
                if (blacklist.includes(channel)) return interactionhandler.embed.error(interaction, messages.channelalreadyblacklisted[lang]);
                blacklist.push(channel);
                conf.blacklist_users = blacklist;
                client.updateconfig(interaction.guild_id, conf);
                interactionhandler.embed.success(interaction, messages.updatedyourblacklist[lang]);
                break;
        }
    }
};
