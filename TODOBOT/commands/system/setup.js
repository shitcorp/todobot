const Discord = require('discord.js')

const dateFormat = require('dateformat');

exports.run = async (client, message, args, level) => {


    const userMention = message.mentions.members.first() || message.guild.members.get(args[1]);
    const msgdel = client.config.msgdelete

    const set = client.dbgetconfig(message)

    if (set[0].todochannel) return message.channel.send(client.warning(`You've run your setup already. From now on all your settings are controled with the \`${set[0].prefix}systemctl\` command. For more info on that run: \`${set[0].prefix}systemctl -h\``)).then(msg => { msg.delete(msgdel).catch(error => {}) })

    message.delete().catch(error => {})
    message.channel.send(client.embed("Welcome to your setup! \nDo you want to use another prefix than '//' ? \nIf so, please mention it now. \n\n(1 minute)"))
        .then(msg => {
            msg.delete(60000).catch(error => {})
        });

    var prefixquestion = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
        time: 60000
    });
    
    prefixquestion.on('collect', prefixmsg => {
        console.log(prefixmsg.content)
        prefixquestion.stop()
        prefixmsg.delete().catch(error => {})
        //success messsage
        message.channel.send(client.success(`Nice! I've set your new Prefix to \`${prefixmsg.content}\`! If you ever forget it, simpy mention me and I'll tell you about my current prefix.`)).then(msg => { msg.delete(msgdel).catch(error => {}) })
        // next question
        message.channel.send(client.embed(`What role do you want to be able to use this Bot? Please mention it in your answer. \n\n(1 minute)`)).then(msg => { msg.delete(msgdel).catch(error => {}) })
        var rolequest = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 60000
        });

        rolequest.on('collect', rolemsg => {
            rolequest.stop()
            console.log(rolemsg.content)
            rolemsg.delete().catch(error => {})

            message.channel.send(client.success(`Okay! \`${rolemsg.mentions.roles.first().name}\` is your new Staff Role! This means that users of this role can use the \`todo\` command and assign themselves to open issues/todos. You will also need that role to assign yourself to open TODOs.\nUsers with this role will not be able to use the \`systemctl\` or any other admin commands.`)).then(msg => { msg.delete(msgdel).catch(error => {}) })
            // next question
            message.channel.send(client.embed(`What channel do you want your TODO's to be posted in? Please mention it in your answer. \n\n(1 minute)`)).then(msg => { msg.delete(msgdel).catch(error => {}) })
             
            var todochannel = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                time: 60000
            })

            todochannel.on('collect', channelmsg => {
                todochannel.stop()
                console.log(channelmsg.content)
                channelmsg.delete().catch(error => {})
                if (channelmsg.content.includes('@everyone')) return message.channel.send(`You can't use @everyone as your staffrole.`).then(msg => {
                    msg.delete(msgdel).catch(console.error);
                })

            

                let finale = channelmsg.content.replace("<#", "").replace(">", "")
                let checkchan = message.guild.channels.get(finale)
                
                let cobject = {
                    guildid: `${message.guild.id}`,
                    prefix: `${prefixmsg.content}`,
                    color: `later`,
                    staffrole: `${rolemsg.mentions.roles.first().id}`,
                    todochannel: `${checkchan.id}`
                }
                
                client.dbsetconfigobject(message, cobject)    
                
                message.channel.send(client.success(`This ends the setup process. You can change any of these values at any time by using the \`${prefixmsg.content}systemctl -set\` command. For information on that, run \`${prefixmsg.content}systemctl -h\` \n\n__**Summary:**__ \n\nPrefix:  \`${prefixmsg.content}\`\nStaffrole:  \`${rolemsg.mentions.roles.first().name}\`\nTODO Channel:  \`${checkchan.name}\``)).then(msg => { msg.delete(msgdel).catch(error => {}) })
           
            })

        });
    
    
    })




}



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