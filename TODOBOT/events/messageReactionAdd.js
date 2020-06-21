const Discord = require('discord.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/data.sqlite');

module.exports = async (client, messageReaction, user) => {

    if (messageReaction.message.channel.type === "dm") return

    let reac = messageReaction.emoji.name
    let userinio = user.id

    if (userinio === client.user.id) return


    let settingschannel = client.dbgetconfig(messageReaction.message)

    if (!settingschannel[0]) return

    if (messageReaction.message.channel.id !== settingschannel[0].todochannel) return

    let checkmsg = sql.prepare(`SELECT * FROM '${messageReaction.message.guild.id}-todo' WHERE bugmsg=?;`).all(messageReaction.message.id)

    if (!checkmsg[0]) return

    let msgId = messageReaction.message.id




    //const modRole = message.guild.roles.get(realsettings[0].staffrole);
    //(message.member.roles.has(modRole.id))
  
    //(message.member.hasPermission("ADMINISTRATOR"));






    if (reac === "📌") {
        // TODO: check user perms
        console.log(settingschannel[0]);
        const modRole = messageReaction.message.guild.roles.get(settingschannel[0].staffrole);
        

        let Guild = messageReaction.message.guild;
        let ownerID = user.id;
        let mainGuild = client.guilds.find(c => c.id === client.config.motherguildid)
        let PremiumCheck = Guild.roles.get(settingschannel[0].staffrole).members.map(m => m.user.id);
    
        
        if (PremiumCheck.includes(ownerID) !== true) {
            
            return messageReaction.message.clearReactions().then(msg => {
                msg.react("📌");
                let roletomention = Guild.roles.get(settingschannel[0].staffrole)
                if (typeof roletomention === "undefined") {
                    roletomention = "**Not Set.**"
                }
                msg.channel.send(client.error(`You dont have the role ${roletomention}, so you cant assign yourself to TODOs.`)).then(ms => {
                    ms.delete(60000).catch(console.error);
                })
            })

        } 

        

        messageReaction.message.channel.fetchMessages({
                around: msgId,
                limit: 1
        })
            .then(async msg => {
                const fetchedMsg = msg.first();
                fetchedMsg.clearReactions();
                let embed = new Discord.RichEmbed()
                    .setColor("#FFFF00")
                    .setTitle(checkmsg[0].bugtitle)
                    //.setDescription(`> <@${user.id}>`)
                    .setThumbnail(user.avatarURL)
                    //.addField("⠀", "```" + checkmsg[0].bugtitle + "```")
                    .addField("ᴄᴏɴᴛᴇɴᴛ", `> ${checkmsg[0].bugrecreation}`)
                    .addField("ꜱᴜʙᴍɪᴛᴛᴇᴅ", `<@${checkmsg[0].submittedby}>`, true)
                    .addField(`ᴀꜱꜱɪɢɴᴇᴅ`, `<@${user.id}>`, true)
                    //.setFooter("ID: " + checkmsg[0].bugid)

                if (checkmsg[0].screenshoturl !== "None") {
                    embed.setImage(checkmsg[0].screenshoturl)
                }

                client.dbupdatetodo(messageReaction.message, "assigned", `${user.id}`, checkmsg[0].bugid)
                client.dbupdatetodo(messageReaction.message, "state", "active", checkmsg[0].bugid)

                fetchedMsg.edit(embed).then(msg => {
                    msg.react("✅")
                })
            })

       


    } else if (reac === "✅") {

        if (userinio !== checkmsg[0].assigned) {
            
            messageReaction.message.clearReactions().then(msg => {
                msg.react("✅")
            })
            
            return

        }

        if (checkmsg[0].state === "closed") {

            messageReaction.message.clearReactions().then(msg => {
                
                let embed = new Discord.RichEmbed()
                    .setColor("GREEN")
                    .setTitle(checkmsg[0].bugtitle)
                    .setDescription(`This TODO has been closed. Expand: ⬇️`)
                    .setFooter("ID: " + checkmsg[0].bugid)
                
                msg.edit(embed).then(m => {
                    msg.react("⬇️")
                })
            
            })
            
            return

        }


        messageReaction.message.channel.fetchMessages({
                around: msgId,
                limit: 1
            })
            .then(async msg => {
                const preview1 = checkmsg[0].bugrecreation.slice(0, 18);
                let preview2 = checkmsg[0].bugrecreation.slice(18, 41);
                if (typeof preview2 === undefined) {
                    preview2 = ""
                }
                const fetchedMsg = msg.first();
                fetchedMsg.clearReactions();
                let embed = new Discord.RichEmbed()
                    .setColor("GREEN")
                    .setTitle(checkmsg[0].bugtitle)
                    .setFooter("ᴘʀᴏᴄᴇꜱꜱᴇᴅ:" + ` ${client.users.get(checkmsg[0].assigned).username}`)

                    if (checkmsg[0].bugrecreation.length > 18) {
                        embed.setDescription(`ᴛʜɪꜱ ᴛᴏᴅᴏ ɪꜱ ᴄʟᴏꜱᴇᴅ. ᴇxᴘᴀɴᴅ: ⬇️ \nᴘʀᴇᴠɪᴇᴡ: \`${preview1}\n${preview2}...\``)
                    } else {
                        embed.setDescription(`ᴛʜɪꜱ ᴛᴏᴅᴏ ɪꜱ ᴄʟᴏꜱᴇᴅ. ᴇxᴘᴀɴᴅ: ⬇️ \nᴘʀᴇᴠɪᴇᴡ: \`${preview1}\``)
                    }
                    
                client.dbupdatetodo(messageReaction.message, "state", "closed", checkmsg[0].bugid)

                fetchedMsg.edit(embed).then(msg => {
                    msg.react("⬇️")
                })
            })




    } else if (reac === "⬇️") {
        
        if (checkmsg[0].state !== "closed") return

        let userus = client.users.get(checkmsg[0].assigned)

        messageReaction.message.channel.fetchMessages({
                around: msgId,
                limit: 1
            })
            .then(async msg => {
                const fetchedMsg = msg.first();
                fetchedMsg.clearReactions();


                let embed = new Discord.RichEmbed()
                    .setColor("GREEN")
                    .setTitle(checkmsg[0].bugtitle)
                    //.setDescription(`> <@${checkmsg[0].assigned}>`)
                    .setThumbnail(userus.avatarURL)
                    //.addField("⠀", "```" + checkmsg[0].bugtitle + "```")
                    .addField("ᴄᴏɴᴛᴇɴᴛ", `> ${checkmsg[0].bugrecreation}`)
                    .addField("ꜱᴜʙᴍɪᴛᴛᴇᴅ", `<@${checkmsg[0].submittedby}>`, true)
                    .addField(`ᴘʀᴏᴄᴇꜱꜱᴇᴅ`, `<@${checkmsg[0].assigned}>`, true)
                    //.setFooter("ID: " + checkmsg[0].bugid)

                if (checkmsg[0].screenshoturl !== "None") {
                    embed.setImage(checkmsg[0].screenshoturl)
                }

                fetchedMsg.edit(embed).then(msg => { msg.react("⬆️") })

            })



    } else if (reac === "⬆️") {
        
        if (checkmsg[0].state !== "closed") return

        messageReaction.message.channel.fetchMessages({
                around: msgId,
                limit: 1
            })
            .then(async msg => {
                const preview1 = checkmsg[0].bugrecreation.slice(0, 18);
                let preview2 = checkmsg[0].bugrecreation.slice(18, 41);
                if (typeof preview2 === undefined) {
                    preview2 = ""
                }
                const fetchedMsg = msg.first();
                fetchedMsg.clearReactions();
                let embed = new Discord.RichEmbed()
                    .setColor("GREEN")
                    .setTitle(checkmsg[0].bugtitle)
                    .setFooter("ᴘʀᴏᴄᴇꜱꜱᴇᴅ:" + ` ${client.users.get(checkmsg[0].assigned).username}`)

                if (checkmsg[0].bugrecreation.length > 18) {
                    embed.setDescription(`ᴛʜɪꜱ ᴛᴏᴅᴏ ɪꜱ ᴄʟᴏꜱᴇᴅ. ᴇxᴘᴀɴᴅ: ⬇️ \nᴘʀᴇᴠɪᴇᴡ: \`${preview1}\n${preview2}...\``)
                } else {
                    embed.setDescription(`ᴛʜɪꜱ ᴛᴏᴅᴏ ɪꜱ ᴄʟᴏꜱᴇᴅ. ᴇxᴘᴀɴᴅ: ⬇️ \nᴘʀᴇᴠɪᴇᴡ: \`${preview1}\``)
                }
                fetchedMsg.edit(embed).then(msg => { msg.react("⬇️") })
            })

    } else return





};