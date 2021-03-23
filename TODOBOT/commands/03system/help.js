const { MessageEmbed } = require('dicsord.js-light');

exports.run = async (client, message, args) => {

    // TODO: show available tags for guild here, if there are none, show message about slash commands 

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