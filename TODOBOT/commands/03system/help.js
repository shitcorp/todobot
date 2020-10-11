const { MessageEmbed } = require('discord.js');

module.exports = {
    run: async (client, message, args, level) => {
        const settings = await client.getConfig(message.guild.id);
        if (args[0]) {
            await message.delete();
            if (client.commands.has(args[0])) {
                let command = client.commands[args[0]];
                let detailEmbed = new MessageEmbed();
                detailEmbed.addField(`**Command:**`, `> ${args[0]}`);
                if (command.conf.aliases && command.conf.aliases.length > 0)
                    detailEmbed.addField(`**Aliases:**`, `> ${command.conf.aliases}`);
                detailEmbed.setThumbnail(client.user.avatarURL());
                detailEmbed.addField(`**Description:**`, `> ${command.help.description}`);
                detailEmbed.addField(`**Usage:**`, `> ${command.help.usage}`);
                detailEmbed.setColor('#2C2F33');
                if (command.help.flags)
                    detailEmbed.addField(`**Flags:**`, `> ${command.help.flags.join('\n> ')}`);
                await message.channel.send(detailEmbed);
            } else
                await message.channel.send(client.warning(`I'm sorry but it seems as if there is no such command named '${args[0]}'`))
                    .then(async (msg) => msg.deletable && await msg.delete({ timeout: 10000 }));
        } else if (!args[0]) {
            const permLevel = client.permLevel(message);
            const commands = message.guild ? 
                client.commands.filter(cmd => cmd.conf.level === permLevel.name) : 
                client.commands.filter(cmd => cmd.conf.level === permLevel.name && cmd.conf.guildOnly !== true);
            const longest = commands.keys().reduce((long, str) => Math.max(long, str.length), 0);
            const toProperCase = (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            let currentCategory = '';
            let output = '';
            let embed = new MessageEmbed()
                .setThumbnail(client.user.avatarURL)
                .setTitle(`${message.guild.me.displayName}  -  Command List \n`)
                .addField(`Read More`, '\n> Use' + '`' + settings.prefix + 'help <commandname>' + '`' + 'for details ')
                .setColor('#2C2F33');
            const sorted = commands.values().sort((p, c) => p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1);
            sorted.forEach( c => {
                if (currentCategory !== c.help.category)
                    output += `\n __**${toProperCase((currentCategory = c.help.category).slice(2, 45))}:**__ \n`;
                output += `\`${c.help.name}\`${' '.repeat(longest - c.help.name.length)} |`;
            });
            embed.setDescription(`${output}`);
            const msg = await message.channel.send(embed);
            await message.delete();
            await msg.delete({ timeout: 6e5 });
        }
    },
    conf: {
        enabled: true,
        guildOnly: true,
        aliases: [],
        permLevel: 'User'
    },
    help: {
        name: 'help',
        category: 'System',
        description: 'Display available commands and their usage.',
        usage: `help`
    }
}
