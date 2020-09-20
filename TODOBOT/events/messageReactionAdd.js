const { todomodel } = require("../modules/models/todomodel")

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


    if (messageReaction.message.channel.type === "dm") return;

    const react = messageReaction.emoji.name
    const userinio = user.id

    // if the reacting user is us we should return
    if (userinio === client.user.id) return;

    const settings = await client.getconfig(messageReaction.message.guild.id)

    if (settings === null) return;
    if (messageReaction.message.channel.id !== settings.todochannel) return;

    let todoobj;

    // TODO remove reactions when permission level is too low
    switch (react) {
        case "📌":
            todoobj = await client.gettodobymsg(messageReaction.message.id, messageReaction.message.guild.id)
            if (typeof todoobj !== "object") return;
            // add the reacting user to the assigned array,
            // mark the todo as assigned and edit the todo
            // message, then react with the white checkmark

            let assigned = [userinio]

            todoobj.state = "assigned";
            todoobj.assigned = assigned;

            await todomodel.updateOne({ _id: todoobj._id }, { $push: { assigned }, state: "assigned" })

            messageReaction.message.edit(client.todo(todoobj)).then(async () => {
                await messageReaction.message.reactions.removeAll().catch(error => { client.logger.debug(error) })
                await messageReaction.message.react("✏️")
                await messageReaction.message.react("✅")
                await messageReaction.message.react("➕")
            })

            break;
        case "✅":
            // mark the todo as finished (closed), or
            // restart/repost the todo when its repeating

            // (!) Make sure only assigned users can close the task
            todoobj = await client.gettodobymsg(messageReaction.message.id, messageReaction.message.guild.id)
            if (typeof todoobj !== "object") return;
            let arse = []
            Object.keys(todoobj.assigned).forEach(key => {
                arse.push(todoobj.assigned[key])
            })
            if (arse.includes(userinio) == true) {
                if (todoobj.loop === true) {
                    todoobj.state = "open";
                    await todomodel.updateOne({ _id: todoobj._id }, { state: "open" })
                    messageReaction.message.edit(client.todo(todoobj)).then(async (msg) => {
                        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error))
                        await msg.react("✏️")
                        await msg.react("📌")
                    })
                } else {
                todoobj.state = "closed";
                await todomodel.updateOne({ _id: todoobj._id }, { state: "closed" })
                messageReaction.message.edit(client.todo(todoobj)).then(async () => {
                    await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error))
                    await messageReaction.message.react("⬇️")
                    })
                }
            } else await client.clearReactions(messageReaction.message, userinio)
            break;
        case "➕":
            //add the reacting user to the assigned array
            // and edit the todo msg/embed 

            todoobj = await client.gettodobymsg(messageReaction.message.id, messageReaction.message.guild.id)
            if (typeof todoobj !== "object") return;

            let ass = []
            Object.keys(todoobj.assigned).forEach(key => {
                ass.push(todoobj.assigned[key])
            })
            if (ass.includes(userinio)) {
                return await client.clearReactions(messageReaction.message, userinio);
            } else {
                todoobj.assigned[ass.length + 1] = userinio;
                await messageReaction.message.edit(client.todo(todoobj))
                await todomodel.updateOne({ _id: todoobj._id }, { $push: { assigned: userinio } })
                await client.clearReactions(messageReaction.message, userinio);
            }
            break;
        case "✏️":
            // edit the task and edit the todo msg when finished

            todoobj = await client.gettodobymsg(messageReaction.message.id, messageReaction.message.guild.id)
            if (typeof todoobj !== "object") return;

            let as = []
            if (todoobj.assigned === [] && userinio !== todoobj.submittedby) return await client.clearReactions(messageReaction.message, userinio)
            if (todoobj.assigend !== []) {
                Object.keys(todoobj.assigned).forEach(key => as.push(todoobj.assigned[key]))
            }
            if (as.length > 0 && as.includes(userinio) === false && todoobj.submittedby !== userinio) return await client.clearReactions(messageReaction.message, userinio)

            await client.clearReactions(messageReaction.message, userinio)
            edit(messageReaction.message, userinio)
            break;
        case "⬇️":
            // Show more details
            showmore()
            break;
        case "⬆️":
            showless()
            break;
    }




    async function edit(message, user) {

        const timeout = 10000
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
                            update(args)
                            break;
                        case "loop":
                            update(args)
                            break;
                        case "state":
                            update(args)
                            break;
                        case "content":
                            update(args)
                            break;
                        case "category":
                            update(args)
                            break;
                        default:
                            message.channel.send(client.error(`
                            This is not a valid key to edit. Valid keys are: title, loop, state, content and category
                            `)).then(async (msg) => {
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
        if (typeof todoobj !== "object") return;
        todoobj.state = "detail";
        messageReaction.message.edit(client.todo(todoobj, "yes"))
        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error.toString()))
        await messageReaction.message.react("⬆️")
    }

    async function showless() {
        todoobj = await client.gettodobymsg(messageReaction.message.id, messageReaction.message.guild.id)
        if (typeof todoobj !== "object") return;
        todoobj.state = "closed";
        messageReaction.message.edit(client.todo(todoobj))
        await messageReaction.message.reactions.removeAll().catch(error => client.logger.debug(error.toString()))
        await messageReaction.message.react("⬇️")
    }


};