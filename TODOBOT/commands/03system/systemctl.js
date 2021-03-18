const { MessageEmbed } =require('discord.js-light');
const messages = require('../../localization/messages');


exports.run = async (client, message, args, level) => {

    const { configmodel } = require('../../modules/models/configmodel')
    const userMention = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    const msgdel = client.config.msgdelete
    let settings = await client.getconfig(message.guild.id)
    const lang = settings ? settings.lang : "en"; 
    
    // Functions

    async function showsettings() {
        console.log(Object.isSealed(settings))
        settings["vars"] = "To view config variables run //configvars";
        settings["tags"] = "To view tags run the command //tags";
        delete settings.__v
        let output = "";
        Object.keys(settings).forEach(key => {
            output += `> ${key}        ${settings[key]} \n`
        })
        message.channel.send(output, {
            code: "json"
        })    

    }

    function ischannel(message, args) {
        if (!args[1].startsWith('<#')) return false;
        let tocheck = args[1].replace("<#", "").replace(">", "")
        let channelcheck = message.guild.channels.cache.get(tocheck)
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
            .then(msg => { if (msg.deletable) msg.delete({ timeout: msgdel })})
    let obj = {}
    obj["prefix"] = `${args[1]}`;
    client.dbupdateconfig(message.guild.id, obj);
    message.channel.send(client.success(`Saved ⠀\`${args[1]}\`⠀ as your new prefix!`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => { }) });
    }
    function settodochannel() {
        if (!args[1].startsWith(`<#`)) return message.channel.send(client.error(`Please mention a real channel.`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => { }) })
        if (ischannel(message, args) === false) return message.channel.send(client.error(`This channel does not seem to exist. Please try again.`))
        client.dbupdateconfig(message, "todochannel", `${ischannel(message, args).id}`);
        message.channel.send(client.success(`Saved⠀\`${ischannel(message, args).name}\`⠀as your new todo channel!`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => { }) });
    }

    function setstaffrole() {
        if (!message.mentions.roles.first()) return message.channel.send(client.error(`Please mention a real role.`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => { }) })
                client.dbupdateconfig(message, "staffrole", `${message.mentions.roles.first().id}`)
                message.channel.send(client.success(`Saved ⠀\`${message.mentions.roles.first().name}\`⠀ as your new staffrole!`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => { }) });
    }



    // Handler
    
    
    switch(message.flags[0]) {
        case "v":
        case "view":
            switch(args[0]) {
                case "tags":
                    tagshower(configmodel, message, client);
                break;
                case "settings":
                    showsettings();
                break;
                default:
                    showsettings();
                break;
            }
        break;
        case "s":
        case "set":
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
                default:
                    message.channel.send(client.warning(`This is not a valid key. Available keys are: prefix, staffrole, todochannel and color.`)).then(msg => {
                        msg.delete({ timeout: msgdel }).catch(error => {})
                    })
                break;
            }
        break;
        default:
            let hcmd = client.commands.get("help")
            let arg = ['systemctl']
            hcmd.run(client, message, arg, level) 
    }

    function tagshower(configmodel, message, client) {
        configmodel.find({ _id: message.guild.id }).then(res => {
            if (!res[0])
                return message.channel.send(client.error(messages.tagnoconfigfound[lang]));
            let it = res[0].tags.values();
            let ky = res[0].tags.keys();
            let output = "";
            let embed = new MessageEmbed()
                .setTitle(`Available Tags in ${message.guild.name}`)
                .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL)
                .setColor("#2C2F33")
                .setTimestamp();
            for (var i = 0; i < res[0].tags.size; i++) {
                //embed.addField(ky.next().value, `> ${it.next().value}`, true)
                let sanitized = it.next().value.slice(0, 69);
                output += `• \`${ky.next().value}\` =>  ${sanitized} \n`;
            }
            embed.setDescription(output);
            if (message.flags.includes("m") || message.flags.includes("man") || message.flags.includes("manual")) {
                embed.addField(`__Manual:__`, `Add new tags by using the learn command like so: \n \`\`\`//learn example This is an example tag\`\`\` \nTo unlearn a tag, use the unlearn command like so: \n \`\`\`//unlearn example\`\`\`\nTo add a tag that sends a dm to the mentioned user, use the %%SENDDM%% keyword somewhere in your tags description. \`\`\`//learn dmtest %%SENDDM%% This is a dm tag. It will be sent to the dms of a mentioned user.\`\`\` \nFor reply tags (where the bot replies to the mentioned user) use the %%REPLY%% keyword somewhere in your tags description \`\`\` //learn replytest %%REPLY%% This tag will reply to the mentioned user. \`\`\` `);
            }
            message.channel.send(embed);
        });
    }
    
    // TODO: make sysctl inspect command that returns if everything is set up properly and reminds users
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['sysctl', "systemcontrol", "sys", "sysi"],
    permLevel: "ADMIN"
};

exports.help = {
    name: "systemctl",
    category: "System",
    description: "View or change settings for your server.",
    usage: "systemctl -[flag] <key> <value>\n> Available flags: \n> -s | -set\n> -v | -view \n> __Examples:__ \n> systemctl -s prefix %t \n> systemctl -s todochannel #channelmention",
    flags: ['-v => View your guilds settings.', '-s => Change your guilds settings.']
};


