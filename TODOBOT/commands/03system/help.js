const { MessageEmbed } = require('discord.js-light');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    
    // !TODO Refactor this
    let settings1 = await client.getconfig(message.guild.id)
    if (!settings1) settings1 = { prefix: "//", tags: { "example": "tag" } }
    const settings = [ settings1 ]
    // !till here
    if (args[0]) {
        if (client.commands.has(args[0]) || client.aliases.get(args[0])) {
            let command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
            let detailembed = new MessageEmbed()
                .addField(`**Command:**`, `> ${command.help.name}`)
                //.setTitle("TODO - Bot Wiki")
                if (command.conf.aliases && command.conf.aliases.length > 0) {
                detailembed.addField(`**Aliases:**`, `> ${command.conf.aliases}`)
                }
                detailembed.setThumbnail(client.user.avatarURL())
                detailembed.addField(`**Description:**`, `> ${command.help.description}`)
                detailembed.addField(`**Usage:**`, `> ${command.help.usage}`)
                detailembed.setColor("#2C2F33")
                if (command.help.flags) {
                    detailembed.addField(`**Flags:**`, `> ${command.help.flags.join('\n> ')}`)
                };
                message.channel.send(detailembed)
        } else {
            message.channel.send(client.warning(`I'm sorry but it seems as if there is no such command named "${args[0]}"`)).then(msg => {
                if (msg.deletable) msg.delete({ timeout: 10000 })
            })
        }
    } else if (!args[0]) return getAll(client, message, args, level)


    async function getAll(client, message, args, level) {



        // TODO: only show commands that can be used with current permission level
        const myCommands = message.guild ? client.commands : client.commands.filter(cmd => cmd.conf.guildOnly !== true);
        const commandNames = myCommands.keyArray();
        const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
        const tagMap = await client.mapBuilder(settings[0].tags)
        const toProperCase = function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        };
        

        let currentCategory = "";
        let output = "";
        let embed = new MessageEmbed()
            .setThumbnail(client.user.avatarURL)
            .setTitle(`${message.guild.me.displayName}  -  Command List \n`)
            .setColor("#2C2F33")
            if (tagMap.size > 0) embed.addField("Tags:", `To show your tags, run the \`//tags\` command.`, true)
            embed.addField(`Read More`, "\n> Use" + "`" + settings[0].prefix + "help <commandname>" + "`" + "for details ", true)
            const sorted = myCommands.array().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
        sorted.forEach( c => {
            const cat = c.help.category
            if (currentCategory !== cat) {
                output += `\n __**${toProperCase(cat.slice(2, 45))}:**__ \n`;
                currentCategory = cat;
            }
            output +=  " `" + `${c.help.name}` + "`" + `${" ".repeat(longest - c.help.name.length)} |`;
        });
        embed.setDescription(`${output}`)
        message.channel.send(embed);

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
