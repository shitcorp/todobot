const messages = require('../../localization/messages.js');
const { v4: uuidv4 } = require("uuid");

module.exports = {
    id: "",
    name: "todo",
    run: async (client, interaction) => {       
        const conf = await client.getconfig(interaction.guild_id)
        let lang = conf.lang ?  conf.lang : "en";
        if (!conf) return interactionhandler.embed.error(interaction, messages.addbottoguild[lang]);
       
            
            if (!interaction.data.options || interaction.data.options.length < 1) return interactionhandler.embed.error(interaction, messages.todonoargs[lang])
            
            const todoobject = { 
                _id: uuidv4(), 
                guildid: interaction.guild_id, 
                state: "open", 
                submittedby: interaction.member.user.id, 
                timestamp: Date.now(), 
                assigned: [], 
                severity: 5 
            };
            
            for (const index in interaction.data.options) {
                if (interaction.data.options[index].name === "title") {
                    if (interaction.data.options[index].value === "") return interactionhandler.embed.error(interaction, messages.emptytitle[lang])
                    todoobject.title = interaction.data.options[index].value;
                }
                if (interaction.data.options[index].name === "content") {
                    if (interaction.data.options[index].value === "") return;
                    todoobject.content = interaction.data.options[index].value;
                }
                if (interaction.data.options[index].name === "attachment") {
                    if (interaction.data.options[index].value === "") return;
                    todoobject.attachlink = interaction.data.options[index].value;
                }
                if (interaction.data.options[index].name === "tasks") {
                    if (interaction.data.options[index].value === "") return;
                    if (interaction.data.options[index].value.includes(';')) {
                        let temp = interaction.data.options[index].value.split(';').filter(task => task !== '');
                        if (temp.length > 10) { 
                            temp.length = 10;
                            console.log(interaction);
                            //interactionhandler.embed.error(interaction, messages.only10tasksallowed[lang]); 
                        }
                        todoobject.tasks = temp
                    } else {
                        todoobject.tasks = [ interaction.data.options[index].value ];
                    } 
                }
                // option for loop    
            }
            let todomsg;
            try {
                todomsg = await client.guilds.cache.get(interaction.guild_id).channels.cache.get(conf.todochannel).send(await client.todo(todoobject))
            } catch(e) {
                client.logger.debug(e);
                return interactionhandler.embed.error(interaction, messages.unabletoposttodo[lang])
            } 
            if (!todomsg) return interactionhandler.embed.error(interaction, messages.unabletoposttodo[lang]);
            interactionhandler.reply(interaction, messages.todoposted[lang]);
            
            // were saving the channel for future reference, if the todo channel gets changed
            // and we repost a task/todo and put the link to the original message. Dont know
            // how to handle deletion of the todo channel but it is what it is
            todoobject.todomsg = todomsg.id;
            todoobject.todochannel = conf.todochannel;
            await todomsg.react("✏️")
            await todomsg.react("📌")
            await client.settodo(todoobject)
        
    }
};