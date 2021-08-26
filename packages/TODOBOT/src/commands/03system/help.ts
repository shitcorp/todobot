const run = async (client, message) => {
    // TODO: show available tags for guild here, if there are none, show message about slash commands
    if (message.author.id === '686669011601326281') message.reply('die.')
    if (message.author.id === '582849062399901696') message.reply('Du hast TODO-Bot verbot Skulli'); // Prevent Skulli73 from using this command
    message.channel
        .send(
            client.embed(
                'Hey there! This bot now uses discords new slash commands. If the bot is still on your server from when slash commands werent a thing, just reinvite the bot in order for them to work. Heres the link: [Invite](http://invite.todo-bot.xyz)',
            ),
        )
        .then((m) => m.delete({ timeout: process.env.MSG_DELETE }).catch((e) => client.logger.debug(e)))
}

export default run

exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: 'user',
}
exports.help = {
    name: 'help',
    category: 'System',
    description: 'Show all available bot commands.',
    usage: '//help',
}
