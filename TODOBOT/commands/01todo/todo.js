module.exports = {
    run: async (client, message, args, _level) => {
        const msgdel = process.env.MSG_DELETE_THRESHHOLD;
        const guildConf = await client.getConfig(message.guild.id);
        
        if (!guildConf) 
            return message.channel.send(client.warning(`I couldn't find any configuration file for this guild. If you just added the bot, run the setup command.`))
                .then(msg => msg.delete({ timeout: msgdel }).catch(error => { console.error(error) }));

        const todo = {
            state: 'open'
        };

        async function quickSave() {
            
            
            /**
             *  Idea: First persists => title
             *        Second persist => content
             *        Third persist  => Screenshot/Attachlink
             *        Fourth persist => Category
             * 
             *  Note: Make it possible to pass in lets say only
             *        a title and the category wherevery you want
             * 
             */
            
            todo.title = message.persists[0]

            if (message.persists.includes('loop')) {
                todo.loop = true;
                message.persists.splice(message.persists.indexOf('loop'))
            } else {
                todo.loop = false;
            }

            const index = message.persists.findIndex(value => /^category=/i.test(value));
            if (index > -1) {
                var cache = message.persists[index].replace(/^category=/i, '')
                todo.category = cache;
                message.persists[3] = cache;
                message.persists[index] = '';
            }
            message.persists[1] ? todo.content = message.persists[1] : todo.content = null;
            message.persists[2] ? todo.attachlink = message.persists[2]: todo.attachlink = null;
            message.persists[3] ? todo.category = message.persists[3] : todo.category = null;
            
            
            saverboi(todo);
            
        };

        async function saverboi(todo) {

            let chan = message.guild.channels.cache.get(guildConf.todochannel);
            if (!chan) return message.channel.send(client.error(`There seems to be a problem with your todo channel. At least I couldnt find it. Check your settings with 'systemctl -s settings'`));
            let msg = await chan.send(client.todo(todo));
            if (!msg) return message.channel.send(client.error('I wasnt able to post your todo. Please make sure I have the permission to read and write in your desired todo channel.'));
            const sanitizedObj = {
                _id: message.id,
                guildId: message.guild.id,
                title: todo.title,
                content: todo.content,
                attachlink: todo.attachlink,
                submittedby: message.author.id,
                timestamp: Date.now(),
                severity: 5,
                state: 'open',
                loop: todo.loop,
                todomsg: msg.id,
                assigned: [],
                category: todo.category
            };
            
            await client.setTodo(sanitizedObj);
            await msg.react('✏️');
            await msg.react('📌');
            await message.channel.send(`Great! Your TODO has been posted. React with 📌 to assign it to yourself and when you're done, react with ✅ to close the TODO`);
        }
        // TODO: make function that asks questions and returns todo object
        if (message.persists[0]) 
            quickSave(); 
        else 
            hardSave(todo);

        async function hardSave(todo) {
            const parsed = args.join(' ').split(' // ');
            if(parsed[0]) 
                todo.title = parsed[0];
            else
                message.channel.send(client.error('You need to at least give a title for your task.'));
            
            if (parsed.includes('loop')) {
                todo.loop = true;
                parsed.splice(parsed.indexOf('loop'), 1);
            } else 
                todo.loop = false;
            
            const index = parsed.findIndex(value => /^category=/i.test(value));
            if (index >= 0) {
                var cache = parsed[index].replace(/^category=/i, '');
                parsed[index] = '';
                todo.category = cache;
                parsed[3] = cache;
            }
        
            if(parsed[1]) 
                todo.content = parsed[1];
            else
                todo.content = null;
            if(parsed[2])
                todo.attachlink = parsed[2];
            else
                todo.attachlink = null;
            if(parsed[3])
                todo.category = parsed[3];
            else
                todo.category = null;
            save(todo);
        }
    },
    conf:{
        enabled: true,
        guildOnly: true,
        aliases: ['t'],
        permLevel: 'STAFF'
    },
    help: {
        name: 'todo',
        category: 'TODO',
        description: 'Submit a new TODO.',
        usage: 'Run todo \n> Then simply answer the questions the bot asks you.'
    }
};