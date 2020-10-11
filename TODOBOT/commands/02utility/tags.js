module.exports = {
    run: async (client, message, args, level) => {
        let cmd = client.commands.get('systemctl')
        let flags = ['v']
        let argo = ['tags']
        message.flags = flags
        cmd.run(client, message, argo, level);
    },
    conf: {
        enabled: true,
        guildOnly: true,
        aliases: ['tag'],
        permLevel: 'STAFF'
    },
    help: {
        name: 'tags',
        category: 'Utility',
        description: 'Show all available tags.',
        usage: 'Run todo and the bot will display all the tags created on this server.'
    },
    manual: (message) => {
        const cmd = client.commands.get('learn');
        cmd.manual(message);
    }
};
