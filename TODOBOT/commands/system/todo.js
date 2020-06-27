const Discord = require('discord.js');

const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/data.sqlite');

const dateFormat = require('dateformat');


exports.run = async (client, message, args) => {

    const msgdel = client.config.msgdelete


    let check = client.dbgetconfig(message)
    if (check[0].todochannel === "") return message.channel.send(client.warning(`I couldn't find any configuration file for this guild. If you just added the bot, run the setup command.`)).then(msg => {
        msg.delete(msgdel).catch(error => {})
    })

    


   



    message.delete().catch(error => {
        client.discordlog(error, message)
    });


    var info = {
        title: "",
        recreate: "",
        screenshotURL: "None"
    }

    function quicksave() {
        info.title = message.persists[0]
        if (message.persists[1]) info.recreate = message.persists[1]
        if (message.persists[2]) info.screenshotURL = message.persists[2]
    }

    
    if (message.persists[0]) return quicksave();



    message.channel.send(client.embed("Hey gamer! Give your new TODO a title: (1 minute)")).then(msg => {
        msg.delete(msgdel).catch(error => {})
    });

    var bugtitle = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
        time: 60000
    });
    bugtitle.on('collect', titlemsg => {
        titlemsg.delete(msgdel).catch(error => {})
        bugtitle.stop();
        info.title = titlemsg.content;
        message.channel.send(client.embed("OK, next, enter the TODO message: (1 minute)")).then(msg => {
            msg.delete(msgdel).catch(error => {})
        })
        // 300000
        var bugremake = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 60000
        });
        bugremake.on('collect', remakemsg => {
            remakemsg.delete(msgdel).catch(error => {})
            bugremake.stop();
            info.recreate = remakemsg.content;
            message.channel.send(client.embed("OK, now, do you want to attach an Image? If so, enter a link to that image now, otherwise type `no` if you don't. (1 minute)")).then(msg => {
                msg.delete(msgdel).catch(error => {})
            })
            var scrnurl = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                time: 60000
            });
            scrnurl.on('collect', scrnmsg => {
                scrnmsg.delete(msgdel).catch(error => {})
                scrnurl.stop();
                if (scrnmsg.content.toLowerCase() == "no") {

                } else if (!scrnmsg.content.startsWith('https://')) {

                   
                    
            
                    return message.channel.send(client.warning(`Please enter a real URL if you want to attach an image.`)).then(msg => {
                        msg.delete(msgdel).catch(error => {})
                    })
                } else if (scrnmsg.content.startsWith('https://')) {

                    
                    let test = new Discord.RichEmbed()
                    .setTitle(`aa`)
                    .setImage(scrnmsg.content)
                    
                    
                    

                    info.screenshotURL = scrnmsg.content;

                } 

                //send success message
                message.channel.send(client.embed("Great! Your TODO has been posted. React with 📌 to assign it to yourself and when you're done, react with ✅ to close the TODO")).then(msg => {
                    msg.delete(msgdel).catch(error => {
                        client.discordlog(error, message, "MESSAGE DELETE")
                    });
                })
                //start db stuff here


                //define bugtable and create if not exists


                client.dbcreatetodo(message);

                //get bug row in the database
                const thisguild = client.dbgettodoall(message)

                //id maker for the incoming bugs
                function makeid(length) {
                    var result = '';
                    var characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVW';
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                }

               


                var ID = makeid(12)
                
                
                
                //if theres no rows in the bugtable create the first one follwoing this scheme
                if (thisguild[0] === undefined) {
                    let bugtable = {
                        guildid: message.guild.id,
                        guildspecificindex: 1,
                        bugid: ID,
                        bugtitle: info.title,
                        bugrecreation: info.recreate,
                        screenshoturl: info.screenshotURL,
                        submittedby: message.author.id,
                        timestamp: dateFormat(),
                        state: "open",
                        bugmsg: "later",
                        assigned: "none"
                    }
                    client.dbsettodoobject(message, bugtable);
                } else {

                    //write bug to database

                    let bugtableau = {
                        guildid: message.guild.id,
                        bugid: ID,
                        bugtitle: info.title,
                        bugrecreation: info.recreate,
                        screenshoturl: info.screenshotURL,
                        submittedby: message.author.id,
                        timestamp: dateFormat(),
                        state: "open",
                        bugmsg: "later",
                        assigned: "none"
                    }
                    client.dbsettodoobject(message, bugtableau);
                }

                // send embed to bugchannel in discord

               
                User.findOne({ where: {user_id: 474334350482210870} }).then(project => {
                  if (typeof project[0] !== "undefined") {
                    return project[0];
                  } else {
                    User.create({
                        user_id: user.id,
                        user_name: user.username
                      })
                    }
                })
              
                             

                if (thisguild[0] === undefined) {

                    //take care of very first bug

                    var embed = new Discord.RichEmbed()
                        .setColor("#2C2F33")
                        .setTitle(info.title)
                        //.addField("⠀", "```" + info.title + "```")
                        .addField("ᴄᴏɴᴛᴇɴᴛ", `> ${info.recreate}`)
                        //.setFooter("ID: " + ID)

                    if (info.screenshotURL !== "None") {
                        //embed.addField("**ᴀᴛᴛᴀᴄʜᴇᴍᴇɴᴛꜱ**", info.screenshotURL)
                        embed.setImage(info.screenshotURL)
                    }

                    let chan = client.dbgetconfig(message)
                    let askingchannel = message.guild.channels.get(chan[0].todochannel)


                    try {

                        askingchannel.send(embed).catch(error => {

                            message.channel.send(client.warning(`This is not a valid URL!`)).then(msg => {
                                msg.delete(msgdel).catch(error => {})
                            })
                            return

                        }).then(async msg => {
                            //sql.prepare(`UPDATE '${message.guild.id}-bugs' SET bugsmsg='${msg.id}' WHERE bugid=?;`).run(ID)
                            await msg.react("📌");
                            client.dbupdatetodo(message, "bugmsg", `${msg.id}`, ID)
                        }).catch(error => {
                            message.channel.send(client.error(`There was an error trying to post your TODO! It was probably a malformatted Screenshot URL. Try again.`)).then(msg => {
                                msg.delete(msgdel).catch(error => {})
                            })
                        })

                    } catch (e) {
                        console.log("aa")
                    }

                } else {

                    //every other bug

                    var embed = new Discord.RichEmbed()
                        .setColor("#2C2F33")
                        .setTitle(info.title)
                        //.addField("⠀", "```" + info.title + "```")
                        .addField("ᴄᴏɴᴛᴇɴᴛ", `> ${info.recreate}`)
                        //.setFooter("ID: " + ID)

                    if (info.screenshotURL !== "None") {
                        //embed.addField("**ᴀᴛᴛᴀᴄʜᴇᴍᴇɴᴛꜱ**", info.screenshotURL)
                        embed.setImage(info.screenshotURL)
                    }

                    let chan = client.dbgetconfig(message)
                    let askingchannel = message.guild.channels.get(chan[0].todochannel)



                    try {
                        askingchannel.send(embed)

                        .then(async msg => {
                            //sql.prepare(`UPDATE '${message.guild.id}-bugs' SET bugmsg='${msg.id}' WHERE bugid=?;`).run(ID)
                            await msg.react("📌")
                            client.dbupdatetodo(message, "bugmsg", `${msg.id}`, ID)
                        }).catch(error => {
                            //console.error(error)
                            message.channel.send(client.error(`There was an error trying to post your TODO! It was probably a malformatted Screenshot URL. Try again.`)).then(msg => {
                                msg.delete(msgdel).catch(error => {})
                            })
                        })

                    } catch (e) {
                        console.log(e)
                    }

                }
            })
        })
    })
}



exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['t'],
    permLevel: "STAFF"
};

exports.help = {
    name: "todo",
    category: "System",
    description: "Submit a new TODO.",
    usage: "Run todo \n> Then simply answer the questions the bot asks you."
};