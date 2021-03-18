const raw = {
    name: 'help',
    description: 'Show all available commands and their usage.',
    options: [
        {
            name: 'command',
            description: 'The command you want specific infomation about.',
            type: 3,
            required: false
        }
    ]
}


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


    }
};
