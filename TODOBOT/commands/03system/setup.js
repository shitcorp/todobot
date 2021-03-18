const { MessageCollector } = require('discord.js-light')

exports.run = async (client, message, args, level) => {


    const userMention = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
    const msgdel = client.config.msgdelete

    const set = await client.getconfig(message.guild.id)

    if (set) return message.channel.send(client.warning(`You've run your setup already. From now on all your settings are controled with the \`${set.prefix}systemctl\` command. For more info on that run: \`${set.prefix}systemctl -h\``)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => {}) })

    message.delete().catch(error => {})
    message.channel.send(client.embed("Welcome to your setup! \nDo you want to use another prefix than '//' ? \nIf so, please mention it now. \n\n(1 minute)"))
        .then(msg => {
            msg.delete({ timeout: 60000 }).catch(error => {})
        });

    var prefixquestion = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
        time: 60000
    });
    
    prefixquestion.on('collect', prefixmsg => {
        prefixquestion.stop()
        prefixmsg.delete().catch(error => {})
        //success messsage
        message.channel.send(client.success(`Nice! I've set your new Prefix to \`${prefixmsg.content}\`! If you ever forget it, simply mention me and I'll tell you about my current prefix.`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => {}) })
        // next question
        message.channel.send(client.embed(`What role do you want to be able to use this Bot? Please mention it in your answer. \n\n(1 minute)`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => {}) })
        var rolequest = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 60000
        });

        rolequest.on('collect', rolemsg => {
            rolequest.stop()
            rolemsg.delete().catch(error => {})

            if (rolemsg.content.includes('@everyone') || rolemsg.content.includes('@here')) return message.channel.send(client.warning(`You can't use \`@ everyone\` or \`@ here\` as your staffrole.`)).then(msg => {
                msg.delete({ timeout: msgdel }).catch(console.error);
            })

            message.channel.send(client.success(`Okay! \`${rolemsg.mentions.roles.first().name}\` is your new Staff Role! This means that users of this role can use the \`todo\` command and assign themselves to open issues/todos. You will also need that role to assign yourself to open TODOs.\nUsers with this role will not be able to use the \`systemctl\` or any other admin commands.`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => {}) })
            // next question
            message.channel.send(client.embed(`What channel do you want your TODO's to be posted in? Please mention it in your answer. \n\n(1 minute)`)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => {}) })
             
            var todochannel = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
                time: 60000
            })

            todochannel.on('collect', channelmsg => {
                todochannel.stop()
    
                channelmsg.delete().catch(error => {})
                

                const finale = channelmsg.content.replace("<#", "").replace(">", "")
                const checkchan = message.guild.channels.cache.get(finale)                

                let newconfig = {
                    _id: message.guild.id,
                    prefix: prefixmsg.content,
                    color: "BLUE",
                    todochannel: checkchan.id,
                    suggestchannel: null,
                    approvedchannel: null,
                    bugchannel: null,
                    suggestion_vote_timeout_max: 24,
                    suggestion_vote_minimum_amount: 1,
                    suggestion_comments_enabled: true,
                    suggestion_edits_enabled: true,
                    suggestions_enabled: false,
                    bugs_enabled: false,
                    staffroles: Array.from(rolemsg.mentions.roles.keys()),
                    categories: [
                        "Example Category",
                    ],
                    tags: {
                        "example": "This is an example tag, to learn more about this feature run the command \`help tags\`"
                    },
                    blacklist_channels: [],
                    blacklist_users: []
                }

                try {
                    client.setconfig(newconfig)
                } catch (e) {
                    console.error(e);
                    message.channel.send(client.error("There was an error trying to save your config. Please try again."));
                }

                let roles = "";
                rolemsg.mentions.roles.first(5).forEach(element => {
                    roles += `\`${element.name}\` `
                });

                message.channel.send(client.success(`This ends the setup process. You can change any of these values at any time by using the \`${prefixmsg.content}systemctl -set\` command. \nFor information on that topic, run \`${prefixmsg.content}systemctl -h\` \n\n__**Summary:**__ \n\nPrefix:  \`${prefixmsg.content}\`\nStaffroles:  ${roles}\nTODO Channel:  \`${checkchan.name}\``)).then(msg => { msg.delete({ timeout: msgdel }).catch(error => {}) })
           
            })

        });
    
    
    });




};



exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "ADMIN"
};

exports.help = {
    name: "setup",
    category: "System",
    description: "Set up everything bot related.",
    usage: "setup"
};