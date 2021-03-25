const raw = {
    name: 'autopurge',
    description: 'Toggle whether you want to automatically purge messages that are not a todo command in the todo channel.',
    options: [
        {
            name: 'toggle',
            description: 'Toggle on or off',
            type: 3,
            choices: [
                {
                    name: 'on',
                    value: 'on'
                },
                {
                    name: 'off',
                    value: 'off'
                }
            ]
        }
    ]
};

module.exports = {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        // USER - BOT_USER - STAFF
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description
    },
    run: async (client, interaction) => {

    } 
    
};