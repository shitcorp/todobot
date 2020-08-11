const { MessageEmbed, MessageCollector } = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./data/data.sqlite');
const { getconfig } = require('../../modules/mongohandler');
const dateFormat = require('dateformat');
const { settodo } = require('../../modules/mongohandler');

// TODO: make repeating todos

exports.run = async (client, message, args) => {

    const msgdel = client.config.msgdelete
    const guildconf = await getconfig(message.guild.id);
    

    if (guildconf.todochannel === "") return message.channel.send(client.warning(`I couldn't find any configuration file for this guild. If you just added the bot, run the setup command.`)).then(msg => {
        msg.delete({ timeout: msgdel }).catch(error => { console.error(error) })
    });

    
    message.delete().catch(error => {
        console.error(error)
    });


    var todoobj = {
        title: "",
        recreate: "",
        screenshotURL: "None"
    }

    console.log(message.persists);

    async function quicksave() {
        
        
        /**
         *  Idea: First persists => title
         *        Second persist => content
         *        Third persist  => Screenshot/Attachlink
         *        Fourth persist => Category
         */
        
        todoobj.title = message.persists[0]
        if (message.persists[1]) todoobj.recreate = message.persists[1]
        if (message.persists[2]) todoobj.screenshotURL = message.persists[2]
        let sanitizedobjet = {
            _id: message.id,
            guildid: message.guild.id,
            title: todoobj.title,
            content: todoobj.recreate,
            attachlink: todoobj.screenshotURL,
            submittedby: message.author.id,
            timestamp: Date.now(),
            state: "open",
            severity: 5,
            repeating: false,
            todomsg: "later",
            assigned: "",
            category: ""
        }
        await settodo(sanitizedobjet);
    };

    // TODO: make function that asks questions and returns todo object
    
    message.persists[0] ? quicksave() :
        test()

    async function questioneer() {
    
        message.channel.send(client.embed("Hey gamer! Give your new TODO a title: (1 minute)")).then(msg => {
            msg.delete({ timeout: msgdel }).catch(error => {})
        });
    
        let todotitle = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 60000
        });

        todotitle.on('collect', titlemsg => {
            titlemsg.delete({ timeout: msgdel }).catch(error => {})
            todotitle.stop();
            todoobj.title = titlemsg.content;
            // next question
            message.channel.send(client.embed("OK, next, enter the TODO message: \nType `no` if you don\`t want to set a TODO message. (1 minute)")).then(msg => {
                msg.delete({ timeout: msgdel }).catch(error => {})
            })

            let todomsg = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
                time: 60000
            });
            todomsg.on('collect', todomessagemsg => {
                todomessagemsg.delete({ timeout: msgdel }).catch(error => {})
                todomsg.stop();
                
                todomessagemsg.content.toLowerCase().includes('no') ? todoobj.recreate = '' : 
                    todoobj.recreate = todomessagemsg.content;
                
                // next question
                message.channel.send(client.embed("OK, now, do you want to attach an Image? If so, enter a link to that image now, otherwise type `no` if you don't. (1 minute)")).then(msg => {
                    msg.delete({ timeout: msgdel }).catch(error => {})
                })

                let scrnurl = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
                    time: 60000
                });
                
                scrnurl.on('collect', scrnmsg => {
                    scrnmsg.delete({ timeout: msgdel }).catch(error => {})
                    scrnurl.stop();
                    if (scrnmsg.content.toLowerCase() == "no") {
                        todoobj.screenshotURL = '';
                    } else if (!scrnmsg.content.startsWith('https://')) {
    
                        return message.channel.send(client.warning(`Please enter a real URL if you want to attach an image.`)).then(msg => {
                            msg.delete({ timeout: msgdel }).catch(error => {})
                        })
                    } else if (scrnmsg.content.startsWith('https://')) {
    
                        todoobj.screenshotURL = scrnmsg.content;
    
                    } 

                    
    
                    //send success message
                    message.channel.send(client.embed("Great! Your TODO has been posted. React with 📌 to assign it to yourself and when you're done, react with ✅ to close the TODO")).then(msg => {
                        msg.delete({ timeout: msgdel }).catch(error => {
                            client.discordlog(error, message, "MESSAGE DELETE")
                        });
                    });

                    return true;

                    

                });

            });
            
        });

        
        
    }


    async function test() {
        console.log(await questioneer());        
    };

    async function longsave() {

    
    


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
                        todotitle: todoobj.title,
                        bugrecreation: todoobj.recreate,
                        screenshoturl: todoobj.screenshotURL,
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
                        todotitle: todoobj.title,
                        bugrecreation: todoobj.recreate,
                        screenshoturl: todoobj.screenshotURL,
                        submittedby: message.author.id,
                        timestamp: dateFormat(),
                        state: "open",
                        bugmsg: "later",
                        assigned: "none"
                    }
                    client.dbsettodoobject(message, bugtableau);
                }

                // send embed to bugchannel in discord

               
                // User.findOne({ where: {user_id: message.author.id} }).then(project => {
                //   if (typeof project[0] !== "undefined") {
                //     return project[0];
                //   } else {
                //     User.create({
                //         user_id: user.id,
                //         user_name: user.username
                //       })
                //     }
                // })
              
                             

                if (thisguild[0] === undefined) {

                    //take care of very first bug

                    var embed = new MessageEmbed()
                        .setColor("#2C2F33")
                        .setTitle(todoobj.title)
                        //.setFooter("ID: " + ID)

                    if (todoobj.recreate !== '') {
                        embed.addField("Content", `> ${todoobj.recreate}`)
                    }

                    if (todoobj.screenshotURL !== "None") {
                        //embed.addField("**ᴀᴛᴛᴀᴄʜᴇᴍᴇɴᴛꜱ**", todoobj.screenshotURL)
                        embed.setImage(todoobj.screenshotURL)
                    }

                    let chan = client.dbgetconfig(message)
                    let askingchannel = message.guild.channels.cache.get(chan[0].todochannel)


                    try {

                        askingchannel.send(embed).catch(error => {

                            message.channel.send(client.warning(`This is not a valid URL!`)).then(msg => {
                                msg.delete({ timeout: msgdel }).catch(error => {})
                            })
                            return

                        }).then(async msg => {
                            //sql.prepare(`UPDATE '${message.guild.id}-bugs' SET bugsmsg='${msg.id}' WHERE bugid=?;`).run(ID)
                            await msg.react("📌");
                            client.dbupdatetodo(message, "bugmsg", `${msg.id}`, ID)
                        }).catch(error => {
                            message.channel.send(client.error(`There was an error trying to post your TODO! It was probably a malformatted Screenshot URL. Try again.`)).then(msg => {
                                msg.delete({ timeout: msgdel }).catch(error => {})
                            })
                        })

                    } catch (e) {
                        message.channel.send(client.error(`There was an error trying to post your TODO! It was probably a malformatted Screenshot URL. Try again.`)).then(msg => {
                            msg.delete({ timeout: msgdel }).catch(error => {})
                        })
                    }

                } else {

                    //every other bug

                    var embed = new MessageEmbed()
                        .setColor("#2C2F33")
                        .setTitle(todoobj.title)
                        //.setFooter("ID: " + ID)
                    
                    if (todoobj.recreate !== '') {
                        embed.addField("Content", `> ${todoobj.recreate}`)
                    }

                    if (todoobj.screenshotURL !== "None") {
                        //embed.addField("**ᴀᴛᴛᴀᴄʜᴇᴍᴇɴᴛꜱ**", todoobj.screenshotURL)
                        embed.setImage(todoobj.screenshotURL)
                    }

                    let chan = client.dbgetconfig(message)
                    let askingchannel = message.guild.channels.cache.get(chan[0].todochannel)



                    try {
                        askingchannel.send(embed)

                        .then(async msg => {
                            //sql.prepare(`UPDATE '${message.guild.id}-bugs' SET bugmsg='${msg.id}' WHERE bugid=?;`).run(ID)
                            await msg.react("📌")
                            client.dbupdatetodo(message, "bugmsg", `${msg.id}`, ID)
                        }).catch(error => {
                            //console.error(error)
                            message.channel.send(client.error(`There was an error trying to post your TODO! It was probably a malformatted Screenshot URL. Try again.`)).then(msg => {
                                msg.delete({ timeout: msgdel }).catch(error => {})
                            })
                        })

                    } catch (e) {
                        console.log(e)
                    }

                }
            

}

}



exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['t'],
    permLevel: "STAFF"
};

exports.help = {
    name: "todo",
    category: "TODO",
    description: "Submit a new TODO.",
    usage: "Run todo \n> Then simply answer the questions the bot asks you."
};