const { MessageEmbed } = require('discord.js-light');

exports.run = async (client, message, args) => {
    // TODO: show available tags for guild here, if there are none, show message about slash commands 
    if (message.author.id === '686669011601326281') message.reply('die.');
    message.channel.send(client.embed('Hey there! This bot now uses discords new slash commands. If the bot is still on your server from when slash commands werent a thing, just reinvite the bot in order for them to work. Heres the link: [Invite](http://invite.todo-bot.xyz)'))
        .then(m => m.delete({ timeout: process.env.MSG_DELETE }).catch(e => client.logger.debug(e)));

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "user"
};
exports.help = {
    name: "help",
    category: "System",
    description: "Show all available bot commands.",
    usage: "//help"
};