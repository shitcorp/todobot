const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => {
    
    
   
};



exports.conf = {
    enabled: true,
    guildOnly: true,
    party: false,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "edit",
    category: "System",
    description: "Edit a task after sending.",
    usage: "la,  ||  systemctl -la"
};

exports.manual = (message) => {
  
};