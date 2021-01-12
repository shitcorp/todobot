module.exports = (client) => {


    
    
    
    global.interactionhandler = async (interaction) => {
   
        const uniqid = require("uniqid");
        //console.log(interaction)

        const conf = await client.getconfig(interaction.guild_id)

        const todoHandler = async () => {
            
            if (!interaction.data.options || interaction.data.options.length < 1) return errorMsg(`You must at least submit a title for your task`)
            
            const todoobject = { 
                _id: uniqid(), 
                guildid: interaction.guild_id, 
                state: "open", 
                submittedby: interaction.member.user.id, 
                timestamp: Date.now(), 
                assigned: [], 
                severity: 5 
            };
            
            for (const index in interaction.data.options) {
                if (interaction.data.options[index].name === "title") {
                    if (interaction.data.options[index].value === "") return errorMsg(`Empty titles are not allowed.`)
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
                // option for loop    
            }
            let todomsg = await client.guilds.cache.get(interaction.guild_id).channels.cache.get(conf.todochannel).send(await client.todo(todoobject))
            todoobject.todomsg = todomsg.id;
            await todomsg.react("✏️")
            await todomsg.react("📌")
            await client.settodo(todoobject)
            reply(`
            Great! Your TODO has been posted. React with 📌 to assign it to yourself and when you're done, react with ✅ to close the TODO
            `);
            console.log(todoobject, todomsg.id);
        };
    
        const errorMsg = async (msg) => {
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [
                            {
                                title: "Error",
                                description: msg,
                                color: 420
                            }
                        ]
                    }
                }
            })
        };

        const reply = async (msg) => {
            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: msg
                    }
                }
            })
        }
        //console.log(interaction.data)


        switch(interaction.data.name) {
            case "todo":
            todoHandler()
            break;
        }

        console.log(`Received the command ${interaction.data.name}`)
    };

};