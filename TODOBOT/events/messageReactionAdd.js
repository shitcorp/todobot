const { todomodel } = require("../modules/models/todomodel")
const todo = require('../classes/todo');
const messages = require('../localization/messages');
const timeout = process.env.MSG_DELETE

module.exports = async (client, messageReaction, user) => {

    if (messageReaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch();
        } catch (error) {
            console.error(error)
            client.logger.debug('Something went wrong when fetching the message: ' + error.toString());
            // Return as `reaction.message.author` may be undefined/undefined
            return;
        }
    }


    if (messageReaction.message.channel.type === "dm") return;

    const react = messageReaction.emoji.name
    const userinio = user.id

    const whitelisted_emojis = [
        'share',
        'assign_yourself',
        'expand',
        'collapse',
        'accept_todo',
        'finish',
        '1️⃣',
        '2️⃣',
        '3️⃣',
        '4️⃣',
        '5️⃣',
        '6️⃣',
        '7️⃣',
        '8️⃣',
        '9️⃣',
        '🔟'
    ]

    
    if (!whitelisted_emojis.includes(react)) return;

    
    // if the reacting user is us we should return
    if (userinio === client.user.id) return;
    
    const member = await client.guilds.cache.get(messageReaction.message.guild.id).members.fetch(user.id);
    
    const settings = await client.getconfig(messageReaction.message.guild.id)
    if (settings === undefined) return;

    
    if (messageReaction.message.channel.id !== settings.todochannel) return messageReaction.users.remove(userinio);
    
    let level = 0;
    if (findCommonElements(member._roles, settings.userroles)) level = 1;
    if (findCommonElements(member._roles, settings.staffroles)) level = 2;
    if (member.hasPermission('MANAGE_GUILD')) level = 2;

    // if the user is not BOT_USER they cant use the reactions
    if (level < 1) return messageReaction.users.remove(userinio);

    let lang = settings ? settings.lang ? settings.lang : 'en' : 'en';

    let todoobj = await client.gettodobymsg(messageReaction.message.id, messageReaction.message.guild.id);
    if (!todoobj) return;
    todoobj = new todo(client, todoobj);

    // TODO remove reactions when permission level is too low

    switch (react) {
        case 'accept_todo':
            // add the reacting user to the assigned array,
            // mark the todo as assigned and edit the todo
            // message, then react with the white checkmark

            if (!todoobj.assigned.includes(userinio)) todoobj.assigned.push(userinio);

            todoobj.state = "assigned";
            todoobj.time_started =  `${Date.now()}`;

            await client.updatetodo(todoobj._id, todoobj);

            messageReaction.message.edit(client.todo(todoobj)).then(async () => {
                if (todoobj.shared && todoobj.shared === true) client.emit('todochanged', todoobj, client);
                await messageReaction.message.reactions.removeAll().catch(error => { client.logger.debug(error) })
                await messageReaction.message.react(client.emojiMap['edit'])
                await messageReaction.message.react(client.emojiMap['finish'])
                await messageReaction.message.react(client.emojiMap['assign'])
                if (todoobj.shared !== true) await messageReaction.message.react(client.emojiMap['share'])
                if (todoobj.tasks) {
                    for (let i = 0; i < todoobj.tasks.length; i++) {
                        if (!todoobj.tasks[i].includes('finished_')) await messageReaction.message.react(client.emojiMap[i + 1])
                    }
                }
            })

            break;
        case 'finish':
            // mark the todo as finished (closed), or
            // restart/repost the todo when its repeating           
            if (Object.values(todoobj.assigned).includes(userinio) === true) {
                // if not all tasks are finished we dont allow the todo list to be marked as finished
                if (todoobj.tasks && todoobj.tasks.filter(task => !task.includes('finished_')).length > 0) {
                    client.clearReactions(messageReaction.message, userinio); 
                    return todoobj.errordisplay(messageReaction.message, userinio, messages.cantclosetodo[lang])
                }
                client.emit('todochanged', todoobj, client);
                if (todoobj.loop === true) {
                    todoobj.state = "open";
                    client.updatetodo(todoobj._id, todoobj);
                    messageReaction.message.edit(client.todo(todoobj)).then(async (msg) => {
                        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error))
                        await msg.react(client.emojiMap['edit'])
                        await msg.react(client.emojiMap['assign'])
                    })
                } else {
                    todoobj.state = "closed";
                    todoobj.time_finished = `${Date.now()}`;
                    client.updatetodo(todoobj._id, todoobj);
                    messageReaction.message.edit(client.todo(todoobj)).then(async () => {
                        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error))
                        await messageReaction.message.react(client.emojiMap['expand'])
                        if (todoobj.shared && todoobj.shared !== true) await messageReaction.message.react(client.emojiMap['share'])
                    })
                }
            } else await client.clearReactions(messageReaction.message, userinio)
            break;
        case "share":
            // send todo to read only channel
            if (settings.readonlychannel) {
                try {
                    if (todoobj.shared === true) return messageReaction.remove();
                    let rochan = await messageReaction.message.guild.channels.fetch(settings.readonlychannel)
                    todoobj.shared = true;
                    //todoobj.state = 'shared';
                    todoobj.readonlychannel = rochan.id;
                    let msg = await rochan.send(client.todo(todoobj));
                    todoobj.readonlymessage = msg.id;
                    await client.updatetodo(todoobj._id, todoobj);
                    // remove the reaction so users cant share again
                    messageReaction.remove();
                } catch (e) {
                    console.error(e)
                    // return and log error (sentry?)
                }
            } else {
                todoobj.errordisplay(messageReaction.message, userinio, messages.noreadonlychannel[lang])
            }
            break;
        // TODO: fix this to use another reaction
        case 'assign_yourself':
            //add the reacting user to the assigned array
            // and edit the todo msg/embed 

            if ((Object.values(todoobj.assigned).includes(userinio)) === true) {
                todoobj.errordisplay(messageReaction.message, userinio, messages.alreadyassigned[lang]);
                await client.clearReactions(messageReaction.message, userinio);
            } else {
                await todoobj.assign(userinio);
                await messageReaction.message.edit(client.todo(todoobj));
                await client.clearReactions(messageReaction.message, userinio);
                client.emit('todochanged', todoobj, client);
            }
            

            break;
        case 'edit':
            // edit the task and edit the todo msg when finished
            //!TODO remove reaction when finished and send success msg

            let as = []
            if (todoobj.assigned === [] && userinio !== todoobj.submittedby) return await client.clearReactions(messageReaction.message, userinio)
            if (todoobj.assigend !== []) {
                Object.keys(todoobj.assigned).forEach(key => as.push(todoobj.assigned[key]))
            }
            if (as.length > 0 && as.includes(userinio) === false && todoobj.submittedby !== userinio) return await client.clearReactions(messageReaction.message, userinio)

            await client.clearReactions(messageReaction.message, userinio)
            edit(messageReaction.message, userinio)
            break;
        case 'expand':
            // Show more details
            showmore()
            break;
        case 'collapse':
            showless()
            break;
        case '1️⃣':
        case '2️⃣':
        case '3️⃣':
        case '4️⃣':
        case '5️⃣':
        case '6️⃣':
        case '7️⃣':
        case '8️⃣':
        case '9️⃣':
        case '🔟':
            // function to mark task as finished
            let parse = [];
            Object.keys(todoobj.assigned).forEach(key => parse.push(todoobj.assigned[key]))
            if (parse.includes(userinio) !== true) return client.clearReactions(messageReaction.message, userinio);
            if (todoobj.tasks[client.Mapemoji[react] - 1].includes('finished_')) todoobj.tasks[client.Mapemoji[react] - 1] = todoobj.tasks[client.Mapemoji[react] - 1].replace('finished_', '')
            else todoobj.tasks[client.Mapemoji[react] - 1] = `finished_ ` + todoobj.tasks[client.Mapemoji[react] - 1];
            client.emit('todochanged', todoobj, client);
            await todomodel.updateOne({ _id: todoobj._id }, todoobj);
            await messageReaction.message.edit(client.todo(todoobj))
            await client.clearReactions(messageReaction.message, userinio);
            break;
    }




    async function edit(message, user) {

        const timeout = 10000
        const filter = m => m.author.id === user;
        message.channel.send(client.embed(messages.editReactionUsage[lang])).then((msg) => {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {

                    if (msg.deletable) msg.delete()
                    if (collected.first().deletable) collected.first().delete()

                    let args = []
                    let editargs = collected.first().content.split(", ")
                    editargs.forEach(arg => {
                        args.push(arg)
                    })

                    // argument handler
                    switch (args[0]) {
                        case "title":
                        case "loop":
                        case "state":
                        case "tasks":
                        case "content":
                        case "category":
                            update(args)
                            break;
                        default:
                            message.channel.send(client.error(messages.novalidkey[lang])).then(async (msg) => {
                                if (msg.deletable) msg.delete({ timeout })
                            })
                    }

                    function update(args) {
                        let obj = {}
                        obj[args[0]] = args[1]
                        todoobj[args[0]] = args[1]
                        todomodel.updateOne({ _id: todoobj._id }, obj, (err) => {
                            if (err) client.logger.debug(err)
                            messageReaction.message.edit(client.todo(todoobj))
                            if (todoobj.shared && todoobj.shared === true) client.emit('todochanged', todoobj, client);
                        })
                    }

                })
                .catch(collected => {
                    // Delete message here
                    client.logger.debug(collected)
                });
        })
    };




    async function showmore() {
        todoobj = await client.gettodobymsg(messageReaction.message.id, messageReaction.message.guild.id)
        if (todoobj === undefined || typeof todoobj !== "object") return;
        todoobj.state = "detail";
        messageReaction.message.edit(client.todo(todoobj, "yes"))
        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error.toString()))
        await messageReaction.message.react(client.emojiMap['collapse'])
    }

    async function showless() {
        todoobj = await client.gettodobymsg(messageReaction.message.id, messageReaction.message.guild.id)
        if (typeof todoobj !== "object") return;
        todoobj.state = "closed";
        messageReaction.message.edit(client.todo(todoobj))
        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error.toString()))
        await messageReaction.message.react(client.emojiMap['expand'])
    }


};