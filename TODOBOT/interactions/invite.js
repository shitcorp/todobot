const messages = require('../localization/messages');

const raw = {
    name: 'invite',
    description: 'Invite the bot to your server.'
};

module.exports = {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
    run: async (client, interaction) => interaction.embed.default(messages.invitemessage['en'])
    
};