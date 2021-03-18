const messages = require('../localization/messages');

const raw = {
    name: 'support',
    description: 'Get information on how to contact the developer(s).'
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
        description: raw.description,
        tutorial: {
            text: '',
            media: '',
        }
    },
    run: async (client, interaction) => interaction.embed.default(messages.supportmessage['en'])
    
};