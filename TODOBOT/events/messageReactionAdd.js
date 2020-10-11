const Todo = require('../modules/models/todo')

module.exports = async (client, messageReaction, user) => {
    if (messageReaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch();
        } catch (error) {
            client.logger.debug('Something went wrong when fetching the message: ', error.toString());
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    if (messageReaction.message.channel.type === 'dm' || user.id === client.user.id) 
        return;

    const react = messageReaction.emoji.name;
    const settings = await client.getConfig(messageReaction.message.guild.id);

    if (settings === null) return;
    if (messageReaction.message.channel.id !== settings.todochannel) return;

    let todo;

    // TODO remove reactions when permission level is too low
    switch (react) {
        case '📌':
            todo = await client.gettodobymsg(messageReaction.message.id, messageReaction.message.guild.id)
            if (typeof todo !== 'object') return;

            let assigned = [user.id];

            todo.state = 'assigned';
            todo.assigned = assigned;

            await todomodel.updateOne({ _id: todo._id }, { $push: { assigned }, state: 'assigned' });
            messageReaction.message.edit(client.todo(todo)).then(async () => {
                await messageReaction.message.reactions.removeAll().catch(error => { client.logger.debug(error) });
                await Promise.all(messageReaction.message.react('✏️'), messageReaction.message.react('✅'), messageReaction.message.react('➕'));
            })
            break;
        case '✅':
            todo = await client.getTodoByMsg(messageReaction.message.id, messageReaction.message.guild.id)
            if (typeof todo !== 'object') return;
            let arse = todo.assigned.values();
            if (arse.includes(user.id) == true) {
                if (todo.loop === true) {
                    todo.state = 'open';
                    await todomodel.updateOne({ _id: todo._id }, { state: 'open' });
                    messageReaction.message.edit(client.todo(todo)).then(async (msg) => {
                        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error));
                        await Promise.all(msg.react('✏️'), msg.react('📌'));
                    });
                } else {
                    todo.state = 'closed';
                    await todomodel.updateOne({ _id: todo._id }, { state: 'closed' })
                    messageReaction.message.edit(client.todo(todo)).then(async () => {
                        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error));
                        await messageReaction.message.react('⬇️');
                    });
                }
            } else await client.clearReactions(messageReaction.message, user.id);
            break;
        case '➕':
            todo = await client.getTodoByMsg(messageReaction.message.id, messageReaction.message.guild.id);
            if (typeof todo !== 'object') return;
            let ass = todo.assigned.values();
            if (ass.includes(user.id)) {
                return await client.clearReactions(messageReaction.message, user.id);
            } else {
                todo.assigned[ass.length + 1] = user.id;
                await messageReaction.message.edit(client.todo(todo))
                await todomodel.updateOne({ _id: todo._id }, { $push: { assigned: user.id } })
                await client.clearReactions(messageReaction.message, user.id);
            }
            break;
        case '✏️':
            todo = await client.getTodoByMsg(messageReaction.message.id, messageReaction.message.guild.id);
            if (typeof todo !== 'object') return;
            let as = []
            if (todo.assigned === [] && user.id !== todo.submittedby) 
                return await client.clearReactions(messageReaction.message, user.id)
            if (todo.assigend !== []) 
                Object.keys(todo.assigned).forEach(key => as.push(todo.assigned[key]));
            if (as.length > 0 && as.includes(user.id) === false && todo.submittedby !== user.id) 
                return await client.clearReactions(messageReaction.message, user.id);
            await client.clearReactions(messageReaction.message, user.id);
            edit(messageReaction.message, user.id);
            break;
        case '⬇️':
            // Show more details
            showMore();
            break;
        case '⬆️':
            showLess();
            break;
    }

    async function edit(message, user) {
        const timeout = 10000;
        const filter = m => m.author.id === user;
        message.channel.send(client.embed(`
        __**Usage:**__

        Enter the key you want to edit followed by the new value seperated by a comma and a space. **The space after the comma is important and not optional!**

        __**Examples:**__

        > title, this is the new title

        > content, this is my new content

        > loop, true

        > state, open

        > category, important
        `)).then((msg) => {
            message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                .then(collected => {

                    if (msg.deletable) msg.delete();
                    if (collected.first().deletable) collected.first().delete();

                    let args = collected.first().content.split(', ');

                    // argument handler
                    switch (args[0]) {
                        case 'title':
                        case 'loop':
                        case 'state':
                        case 'content':
                        case 'category':
                            update(args)
                            break;
                        default:
                            message.channel.send(client.error(`
                            This is not a valid key to edit. Valid keys are: title, loop, state, content and category
                            `)).then(async (msg) => msg.deletable && await msg.delete({ timeout }))
                    }

                    function update(args) {
                        let obj = {}
                        obj[args[0]] = args[1]
                        todo[args[0]] = args[1]
                        todomodel.updateOne({ _id: todo._id }, obj, (err) => {
                            if (err) client.logger.debug(err)
                            messageReaction.message.edit(client.todo(todo))
                        })
                    }

                })
                .catch(collected => {
                    // Delete message here
                    client.logger.debug(collected)
                });
        })
    };

    async function showMore() {
        todo = await client.getTodoByMsg(messageReaction.message.id, messageReaction.message.guild.id)
        if (typeof todo !== 'object') return;
        todo.state = 'detail';
        messageReaction.message.edit(client.todo(todo, 'yes'))
        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error.toString()))
        await messageReaction.message.react('⬆️')
    }

    async function showLess() {
        todo = await client.getTodoByMsg(messageReaction.message.id, messageReaction.message.guild.id)
        if (typeof todo !== 'object') return;
        todo.state = 'closed';
        messageReaction.message.edit(client.todo(todo))
        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error.toString()))
        await messageReaction.message.react('⬇️')
    }
};
