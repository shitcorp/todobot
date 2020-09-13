const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    
    const settings1 = await client.getconfig(message.guild.id)
    const settings = [
        settings1
    ]

    if (args[0]) {
        message.delete().catch(console.error());
        if (client.commands.has(args[0])) {
            let command = client.commands.get(args[0]);
            let detailembed = new MessageEmbed()
                .addField(`**Command:**`, `> ${args[0]}`)
                if (command.conf.aliases && command.conf.aliases.length > 0) {
                detailembed.addField(`**Aliases:**`, `> ${command.conf.aliases}`)
                }
                detailembed.addField(`**Description:**`, `> ${command.help.description}`)
                detailembed.addField(`**Usage:**`, `> ${command.help.usage}`)
                detailembed.setColor("#2C2F33")
                detailembed.setFooter(`requested by ${message.author.username}#${message.author.discriminator}  -  this embed will kill itself in 1 minute.`, message.author.avatarURL)
                if (command.help.flags) {
                    detailembed.addField(`**Flags:**`, `> ${command.help.flags.join('\n> ')}`)
                };
                message.channel.send(detailembed).then(msg => {
                    msg.delete({ timeout: 60000 }).catch(console.error());
                });
        } else {
            message.channel.send(client.warning(`I'm sorry but it seems as if there is no such command named "${args[0]}"`)).then(msg => {
                setTimeout(function () {
                    msg.delete().catch(error => {})
                }, 3000)
            })
        }
    } else if (!args[0]) return getAll(client, message, args, level)


    function getAll(client, message, args, level) {




        const myCommands = message.guild ? client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level) : client.commands.filter(cmd => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);
        const commandNames = myCommands.keyArray();
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
        

        let currentCategory = "";
        let arr = [];
        let output = "";
        let embed = new MessageEmbed()
            .setThumbnail(client.user.avatarURL)
            .setTitle(`${message.guild.me.displayName}  -  Command List \n`)
            .addField(`Read More`, "\n> Use" + "`" + settings[0].prefix + "help <commandname>" + "`" + "for details ")
            .setColor("#2C2F33")
	    .setFooter("If you see no commands in here you are lacking the role that is required to interact with this bot.")
        const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
        sorted.forEach( c => {
            const cat = c.help.category
            if (currentCategory !== cat) {
                output += `\n __**${cat}:**__ \n`;
                currentCategory = cat;
            }
            output +=  " `" + `${c.help.name}` + "`" + `${" ".repeat(longest - c.help.name.length)} |`;
        });
        //${table.table(possibleInvites)}
        embed.setDescription(`${output}`)
        message.delete({ timeout: 20 }).catch(error => {});
        message.channel.send(embed).then(msg => {
            setTimeout(function () {
                msg.delete().catch(error => {})
            }, 60000)
        });

    }


};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "User"
};

exports.help = {
    name: "help",
    category: "System",
    description: "Display available commands and their usage.",
    usage: `help`
};
