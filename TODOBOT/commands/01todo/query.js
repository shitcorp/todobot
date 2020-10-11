const Pagination = require('discord-paginationembed'),
    Todo = require('../../modules/models/todo');

module.exports = {
    run: async (client, message, args, _level) => {
        const conf = await client.getConfig(message.guild.id);
        const parser = async (argarr) => {
            /**
             *  Supported keywords after 'WHERE':
             *  => state= {open|assigned|closed}
             *  => severity= {1|2|3|4|5} [5 is lowest]
             *  => repeating= {true|false}
             *  => title= {'somestring'}
             *  => content= {'somestring'}
             *  => submittedby= {userid|usermention}
             *  => assigned= {userid|usermention}
             *  => category= {'somestring'}
             */
            let newind;
            if (argarr.includes('WHERE')) {
                newind = argarr.indexOf('WHERE');
                argind = newind + 1;
                
                if (!argarr[argind])
                    return throwError(`You didnt give any search criteria afer the \`WHERE\` keyword.`);
                
                let arg = argarr[argind]
                let parsedarguments = arg.split('=')

                switch(parsedarguments[0]) {
                    case 'state':
                    case 'severity':
                    case 'repeating':
                    case 'title':
                    case 'content':
                    case 'subittedby':
                    case 'assigned':
                    case 'category':
                        queryWhere(argarr, parsedarguments[0], parsedarguments[1])
                        break;
                    default:
                        throwError(`This is not a valid query selector. Run \`//help query\` for more information on how to use the query command.`);
                }
            }
        }    

        const queryWhere = async (argarr, key, val) => {
            let limit;
            const lastarg = argarr[argarr.length - 1];
            const result = /([1-9])\w+/g.test(lastarg);

            let obj = { guildId: message.guild.id };
            obj[key] = val;

            Todo.find(obj, (err, docs) => {
                if (err)
                    return throwError(`Something went wrong when trying to query the database.`);
                if (!docs) 
                    return throwError(`There was nothing found matching your search criteria.`);

                if (result) 
                    limit = lastarg;
                else
                    limit = docs.length;

                if (docs.length <= 0)
                    return throwError(`There was nothing found matching your search criteria.`);

                display(docs, limit);
            }, { limit: limit }); 
        };

        const display = async (todos, limit) => {
            let arr = [];
            for (let i = 0; i < limit; i++) {
                const todo = todos[i];
                if (!todo.title) return;
                let obj = {}
                todo.title ? obj.title = todo.title : 'empty';
                todo.content ? obj.content = todo.content : obj.content = 'empty';
                todo.attachlink ? obj.attachment = todo.attachlink : obj.attachment = 'empty';
                todo.category ? obj.category = todo.category : obj.category = 'empty';
                todo.processed ? obj.processed = todo.processed : obj.processed = 'empty';
                todo.state ? obj.state = todo.state : obj.state = 'open';
                obj.timestamp = todo.timestamp;
            
                arr.push({ 
                    title: 'empty',
                    content: 'empty',
                    attachlink: 'empty',
                    category: 'empty',
                    processed: 'empty',
                    state: empty,
                    ...todo
                });
            }

            /**
             * Web:
             * https://discord.com/channels/709541114633519177/710020770369110038/754594372791828521
             *                              {  guildId  }      {  CHANNEL  }      { MSG ID }
             * 
             * Client:
             * https://discordapp.com/channels/709541114633519177/710020973746716694/754719857001627740
             * 
             */
            const fieldsEmbed = new Pagination.FieldsEmbed()
                .setArray(arr)
                .setAuthorizedUsers([message.author.id])
                .setChannel(message.channel)
                .setElementsPerPage(1)
                // Initial page on deploy
                .setPage(1)
                .setPageIndicator(true)
                .formatField('Title', i => i.title)
                .formatField('Content', i => i.content)
                .formatField('Attachements', i => i.attachment)
                .formatField('Processed', i => i.processed)
                .formatField('State', i => i.state)
                // Deletes the embed upon awaiting timeout
                .setDeleteOnTimeout(true)
                // Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
                //.setDisabledNavigationEmojis(['delete'])
                // Set your own customised emojis
                .setFunctionEmojis({ 
                    '🔄': (_user, instance) => {
                        const URL = 'https://discord.com/channels/' + message.guild.id + '/' + conf.todochannel + '/' + todos[instance.page - 1].todomsg;
                        // TODO: delete reposted message after a while
                        message.channel.send(client.todo(todos[instance.page - 1]));
                        message.channel.send(client.embed(`[Original Message](${URL})`));
                    },
                    '✏️': async (_user, _instance) => { },
                    '❌': async (_user, _instance) => { }
                })
                .setEmojisFunctionAfterNavigation(false);

            await fieldsEmbed.embed
                .setColor('BLUE')
                .setFooter(`Manual:
    ✏️          Edit the TODO
    ❌          Delete the TODO
    🗑️          Destroy this embed`).build();
        };

        const queryTodo = async () => {
            const todos = await client.getUserTodos(message.author.id);
        };

        const querySuggestion = async () => {
            let index = args.indexOf('T');
            args.splice(index, 1);
            parser(args);
        };

        const throwError = async (text) => await message.channel.send(client.error(text));

        args.includes('TODOS') ? queryTodo() 
            : args.includes('T') ? querySuggestion() 
            : throwError(`**This query is not supported at the moment.**\n\ 
            Supported query keywords are \`TODO\` and \`SUGGESTIONS\`. 
            Make sure the letters are all uppercase when trying again.
            For more information on how to use the query command, 
            run the command \`//manual query\`.`);
    },
    conf: {
        enabled: true,
        guildOnly: true,
        party: false,
        aliases: [],
        permLevel: 'User'
    },
    help: {
        name: 'query',
        category: 'TODO',
        description: 'Query the database for your processed tasks.',
        usage: 'query <YOUR QUERY>'
    },
    manual: (_message) => { }
};
