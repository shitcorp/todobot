const messages = require('../localization/messages.js');
const { v4: uuidv4 } = require('uuid');

const raw = {
    name: "todo",
    description: "Create a new TODO object",
    options: [
        {
            name: "title",
            description: "Title of the TODO object",
            required: true,
            type: 3
        },
        {
            name: "tasks",
            description: "The tasks that belong to this todo. Seperate them with a semicolon (;). Maximum 10 tasks allowed!",
            type: 3
        },
        {
            name: "content",
            description: "Content of the TODO object",
            type: 3
        },
        {
            name: "attachment",
            description: "Attach something to the task",
            type: 3
        },
        {
            name: "loop",
            description: "Create repeating tasks",
            type: 5
        }
    ],
}


module.exports = {
    raw,
    id: "",
    name: raw.name,
    conf: {
        enabled: true,
        permLevel: 'STAFF',
    },
    help: {
        category: 'todo',
        description: raw.description,
        tutorial: {
            text: '',
            media: '',
        }
    },
    run: async (client, interaction) => {
        const conf = await client.getconfig(interaction.guild_id)
        let lang = conf.lang ? conf.lang : "en";
        if (!conf) return interaction.embed.error(messages.addbottoguild[lang]);


        if (!interaction.data.options || interaction.data.options.length < 1) return interaction.embed.error(messages.todonoargs[lang])

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
                if (interaction.data.options[index].value === "") return interaction.embed.error(messages.emptytitle[lang])
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
                    // split the string containing the tasks at the semicolon and filter out all empty
                    // tasks as well as task strings that are too long. If theres more than 10, were just 
                    // capping the array by setting the length to 10
                    let temp = interaction.data.options[index].value.split(';').filter(task => task !== '' && task.length < 110);
                    if (temp.length > 10) temp.length = 10;
                    todoobject.tasks = temp
                } else {
                    todoobject.tasks = [interaction.data.options[index].value];
                }
            }
            // option for loop    
        }
        let todomsg;
        try {
            todomsg = await client.guilds.cache.get(interaction.guild_id).channels.cache.get(conf.todochannel).send(await client.todo(todoobject))
        } catch (e) {
            client.logger.debug(e);
            return interaction.embed.error(messages.unabletoposttodo[lang])
        }
        if (!todomsg) return interaction.embed.error(messages.unabletoposttodo[lang]);
        interaction.reply(messages.todoposted[lang]);

        // were saving the channel for future reference, if the todo channel gets changed
        // and we repost a task/todo and put the link to the original message. Dont know
        // how to handle deletion of the todo channel but it is what it is
        todoobject.todomsg = todomsg.id;
        todoobject.todochannel = conf.todochannel;
        todoobject.shared = false;
        await todomsg.react("✏️")
        await todomsg.react("📌")
        await client.settodo(todoobject)

    }
};