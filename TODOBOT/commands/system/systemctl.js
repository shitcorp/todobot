const Discord = require('discord.js')
exports.run = async (client, message, args, level) => {

    const userMention = message.mentions.members.first() || message.guild.members.get(args[1]);
    const msgdel = client.config.msgdelete

    message.delete().catch(console.error());
    // Functions

    function showsettings() {
        const settings = client.dbgetconfig(message)
        let getembed = new Discord.RichEmbed()
            .setColor("#2C2F33")
            .setAuthor(`${message.guild.name} - Settings`)
            .setDescription("```" + `Current Values:` + "```")
            .addField(`⠀`, `__**Prefix: **__  ⠀\`${settings[0].prefix}\``)
            .addField(`⠀`, `__**Staffrole**__ ⠀\`${message.guild.roles.get(settings[0].staffrole).name}\``)
            .addField(`⠀`, `__**TODO Channel:**__ ⠀\`${message.guild.channels.get(settings[0].todochannel).name}\``)
        message.channel.send(getembed).then(msg => { msg.delete(msgdel).catch(error => { }) })
    }
    function ischannel(message, args) {
        if (!args[1].startsWith('<#')) return false;
        let tocheck = args[1].replace("<#", "").replace(">", "")
        let channelcheck = message.guild.channels.get(tocheck)
        if (typeof channelcheck === "undefined") return false;
        return channelcheck;
    }
    function isrole(message) {
        if (message.mentions.users.size > 0) return false;
        if (message.mentions.roles.size === 0) return false;
        return message.mentions.roles.first();
    }
    function setPrefix() {
        if (!args[1]) return message.channel.send(client.error(`Please enter a new value.`))
        .then(msg => {
            msg.delete(msgdel).catch(error => {
            })
        })
    client.dbupdateconfig(message, "prefix", `${args[1]}`);
    message.channel.send(client.success(`Saved ⠀\`${args[1]}\`⠀ as your new prefix!`)).then(msg => { msg.delete(msgdel).catch(error => { }) });
    }
    function settodochannel() {
        if (!args[1].startsWith(`<#`)) return message.channel.send(client.error(`Please mention a real channel.`)).then(msg => { msg.delete(msgdel).catch(error => { }) })
        if (ischannel(message, args) === false) return message.channel.send(client.error(`This channel does not seem to exist. Please try again.`))
        client.dbupdateconfig(message, "todochannel", `${ischannel(message, args).id}`);
        message.channel.send(client.success(`Saved⠀\`${ischannel(message, args).name}\`⠀as your new todo channel!`)).then(msg => { msg.delete(msgdel).catch(error => { }) });
    }

    function setstaffrole() {
        if (!message.mentions.roles.first()) return message.channel.send(client.error(`Please mention a real role.`)).then(msg => { msg.delete(msgdel).catch(error => { }) })
                client.dbupdateconfig(message, "staffrole", `${message.mentions.roles.first().id}`)
                message.channel.send(client.success(`Saved ⠀\`${message.mentions.roles.first().name}\`⠀ as your new staffrole!`)).then(msg => { msg.delete(msgdel).catch(error => { }) });
    }

    // Handler
    if (message.flags[0] === "view" || message.flags[0] === "v") {
        showsettings();
    } else if (message.flags[0] === "set" || message.flags[0] === "s") {
        switch(args[0]) {
            case "prefix":
                setPrefix();
            break;
            case "staffrole":
                setstaffrole();
            break;
            case "todochannel":
                settodochannel();
            break;
            case "color":
                message.channel.send(client.warning(`This is not implemented yet.`))
            break;
            case "init":
                message.channel.send(client.warning(`This is not implemented yet.`))
            break;
            default:
                message.channel.send(client.warning(`This is not a valid key. Available keys are: prefix, staffrole, todochannel and color.`)).then(msg => {
                    msg.delete(msgdel).catch(error => {})
                })
            break;
        }
    } else {
        let hcmd = client.commands.get("help")
        let arg = ['systemctl']
        hcmd.run(client, message, arg, level)
    }
    // TODO: make sysctl inspect command that returns if everything is set up properly and reminds users
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['sysctl'],
    permLevel: "ADMIN"
};

exports.help = {
    name: "systemctl",
    category: "System",
    description: "View or change settings for your server.",
    usage: "systemctl -[flag] <key> <value>\n> Available flags: \n> -s | -set\n> -v | -view \n> __Examples:__ \n> systemctl -s prefix %t \n> systemctl -s todochannel #channelmention"
};