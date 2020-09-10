const { MessageEmbed } = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/data.sqlite');

module.exports = async (client, messageReaction, user) => {

    if (messageReaction.message.channel.type === "dm") return

    if (messageReaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await messageReaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

    let reac = messageReaction.emoji.name
    let userinio = user.id

    if (userinio === client.user.id) return


    let settingschannel = client.dbgetconfig(messageReaction.message)

    if (!settingschannel[0]) return

    if (messageReaction.message.channel.id !== settingschannel[0].todochannel) return

    let checkmsg = sql.prepare(`SELECT * FROM '${messageReaction.message.guild.id}-todo' WHERE bugmsg=?;`).all(messageReaction.message.id)

    if (!checkmsg[0]) return

    let msgId = messageReaction.message.id



    if (reac === "📌") {
        // TODO: check user perms
        console.log(settingschannel[0]);
        const modRole = messageReaction.message.guild.roles.cache.get(settingschannel[0].staffrole);
        

        let Guild = messageReaction.message.guild;
        let ownerID = user.id;
        let mainGuild = client.guilds.cache.find(c => c.id === client.config.motherguildid)
        let PremiumCheck = Guild.roles.cache.get(settingschannel[0].staffrole).members.map(m => m.user.id);
    
        
        if (PremiumCheck.includes(ownerID) !== true) {
            
            return messageReaction.message.reactions.removeAll().then(msg => {
                msg.react("📌");
                let roletomention = Guild.roles.cache.get(settingschannel[0].staffrole)
                if (typeof roletomention === "undefined") {
                    roletomention = "**Not Set.**"
                }
                msg.channel.send(client.error(`You dont have the role ${roletomention}, so you cant assign yourself to TODOs.`)).then(ms => {
                    ms.delete({ timeout: 60000 }).catch(console.error);
                })
            })

        } 

        

        messageReaction.message.channel.messages.fetch({
                around: msgId,
                limit: 1
        })
            .then(async msg => {
                const fetchedMsg = msg.first();
                fetchedMsg.reactions.removeAll();
                let embed = new MessageEmbed()
                    .setColor("#FFFF00")
                    .setTitle(checkmsg[0].bugtitle)
                    //.setDescription(`> <@${user.id}>`)
                    .setThumbnail(user.avatarURL)
                    //.addField("⠀", "```" + checkmsg[0].bugtitle + "```")
                    .addField("Content", `> ${checkmsg[0].bugrecreation}`)
                    .addField("Submitted", `<@${checkmsg[0].submittedby}>`, true)
                    .addField(`Assigned`, `<@${user.id}>`, true)
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
            
            messageReaction.message.reactions.removeAll().then(msg => {
                msg.react("✅")
            })
            
            return

        }

        if (checkmsg[0].state === "closed") {

            messageReaction.message.reactions.removeAll().then(msg => {
                
                let embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(checkmsg[0].bugtitle)
                    .setDescription(`This TODO has been closed. Expand: ⬇️`)
                    .setFooter("ID: " + checkmsg[0].bugid)
                
                msg.edit(embed).then(m => {
                    m.react("⬇️")
                })
            
            })
            
            return

        }


        messageReaction.message.channel.messages.fetch({
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
                fetchedMsg.reactions.removeAll();
                let embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(checkmsg[0].bugtitle)
                    .setFooter("Processed:" + ` ${client.users.cache.get(checkmsg[0].assigned).username}`)

                    if (checkmsg[0].bugrecreation !== '' && checkmsg[0].bugrecreation.length > 18) {
                        embed.setDescription(`This TODO is closed. Expand: ⬇️ \nPreview: \`${preview1}\n${preview2}...\``)
                    } else if (checkmsg[0].bugrecreation !== '') {
                        embed.setDescription(`This TODO is closed. Expand: ⬇️ \nPreview: \`${preview1}\``)
                    } 
                    
                client.dbupdatetodo(messageReaction.message, "state", "closed", checkmsg[0].bugid)

                fetchedMsg.edit(embed).then(msg => {
                    msg.react("⬇️")
                })
            })




    } else if (reac === "⬇️") {
        
        if (checkmsg[0].state !== "closed") return

        let userus = client.users.cache.get(checkmsg[0].assigned)

        messageReaction.message.channel.messages.fetch({
                around: msgId,
                limit: 1
            })
            .then(async msg => {
                const fetchedMsg = msg.first();
                fetchedMsg.reactions.removeAll();


                let embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(checkmsg[0].bugtitle)
                    //.setDescription(`> <@${checkmsg[0].assigned}>`)
                    .setThumbnail(userus.avatarURL)
                    //.addField("⠀", "```" + checkmsg[0].bugtitle + "```")
                    .addField("Content", `> ${checkmsg[0].bugrecreation}`)
                    .addField("Submitted", `<@${checkmsg[0].submittedby}>`, true)
                    .addField(`Processed`, `<@${checkmsg[0].assigned}>`, true)
                    //.setFooter("ID: " + checkmsg[0].bugid)

                if (checkmsg[0].screenshoturl !== "None") {
                    embed.setImage(checkmsg[0].screenshoturl)
                }

                fetchedMsg.edit(embed).then(msg => { msg.react("⬆️") })

            })



    } else if (reac === "⬆️") {
        
        if (checkmsg[0].state !== "closed") return

        messageReaction.message.channel.messages.fetch({
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
                fetchedMsg.reactions.removeAll();
                let embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle(checkmsg[0].bugtitle)
                    .setFooter("Processed:" + ` ${client.users.cache.get(checkmsg[0].assigned).username}`)

                if (checkmsg[0].bugrecreation.length > 18) {
                    embed.setDescription(`This TODO is closed. Expand: ⬇️ \nPreview: \`${preview1}\n${preview2}...\``)
                } else {
                    embed.setDescription(`This TODO is closed Expand: ⬇️ \nPreview: \`${preview1}\``)
                }
                fetchedMsg.edit(embed).then(msg => { msg.react("⬇️") })
            })

    } else return





};