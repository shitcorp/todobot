/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
import { MessageReaction, User } from 'discord.js-light'
import todomodel from '../modules/models/todomodel'
import Todo from '../classes/Todo'
import messages from '../localization/messages'
import findCommonElements from '../modules/util/findCommonElements'
import MyClient from '../classes/Client'

export default async (client: MyClient, messageReaction: MessageReaction, user: User) => {
    const reactionTrans = client.apm.startTransaction('MessageReactionAddEvent', 'eventhandler')

    client.apm.setUserContext({
        id: user.id,
        username: `${user.username}#${user.discriminator}`,
    })

    if (messageReaction.partial) {
        const messageFetchSpan = reactionTrans.startSpan('fetch_partial_message')
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch()
            if (messageFetchSpan) messageFetchSpan.end()
        } catch (error) {
            // Returns as `reaction.message.author` may be undefined/undefined
            if (messageFetchSpan) messageFetchSpan.end()
            return
        }
    }

    const permSpan = reactionTrans.startSpan('permission_and_whitelist_checks')

    if (messageReaction.message.channel.type === 'dm') return

    const react = messageReaction.emoji.name
    const userinio = user.id

    const whitelistedEmojis = [
        'share',
        'edit',
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
        '🔟',
    ]

    // if the reacting user is us we should return
    if (userinio === client.user.id) return

    // make sure we only do something if the reaction is allowed
    if (!whitelistedEmojis.includes(react)) return

    const member = await client.guilds.cache.get(messageReaction.message.guild.id).members.fetch(user.id)

    const settings = await client.config.get(messageReaction.message.guild.id)
    if (settings === undefined) return

    if (
        settings.todomode &&
        settings.todomode !== 'advanced' &&
        messageReaction.message.channel.id !== settings.todochannel
    )
        return messageReaction.users.remove(userinio)
    if (!settings.todomode && messageReaction.message.channel.id !== settings.todochannel)
        return messageReaction.users.remove(userinio)

    let level = 0
    // @ts-expect-error
    if (findCommonElements(member._roles, settings.userroles)) level = 1
    // @ts-expect-error eslint-disable-next-line no-underscore-dangle
    if (findCommonElements(member._roles, settings.staffroles)) level = 2

    if (member.hasPermission('MANAGE_GUILD')) level = 2

    // if the user is not BOT_USER they cant use the reactions
    if (level < 1) return messageReaction.users.remove(userinio)

    // eslint-disable-next-line no-nested-ternary
    const lang = settings ? (settings.lang ? settings.lang : 'en') : 'en'

    const todoObjRaw = await client.todos.getByMsg(
        messageReaction.message.id,
        messageReaction.message.guild.id,
    )

    if (!todoObjRaw) return

    const todoobj = new Todo(client, todoObjRaw)

    if (permSpan) permSpan.end()

    // eslint-disable-next-line @typescript-eslint/no-shadow
    async function edit(message, user) {
        // nconst timeout = 10000
        const filter = (m) => m.author.id === user
        const editUsageMessage = await message.channel.send(
            client.embed.default(messages.editReactionUsage[lang]),
        )
        message.channel
            .awaitMessages(filter, { max: 1, time: 90000, errors: ['time'] })
            .then((collected) => {
                try {
                    editUsageMessage.delete()
                } catch (e) {
                    client.logger.debug(`message sent by bot ${e}`)
                }
                const args = collected.first().content.split(',')
                // argument handler
                switch (args[0]) {
                    case 'title':
                    case 'loop':
                    case 'content':
                    case 'category':
                    case 'attachment':
                        todoobj[args[0]] = args[1].includes('+')
                            ? todoobj[args[0]] + args[1].replace('+', ' ')
                            : args[1]
                        // @ts-ignore
                        todomodel.updateOne({ _id: todoobj._id }, todoobj, (err: any) => {
                            if (err) return client.logger.debug(err)
                            messageReaction.message.edit(client.embed.todo(todoobj))
                            if (todoobj.shared && todoobj.shared === true)
                                client.emit('todochanged', todoobj, client)
                        })
                        break
                    default:
                        todoobj.errorDisplay(messageReaction.message, user, messages.novalidkey[lang])
                }
            })
            .catch(() => {
                // Delete message here
                // maybe dont log this to debug/elastic
                try {
                    todoobj.errorDisplay(messageReaction.message, user, messages.timeisuperror[lang])
                    editUsageMessage.delete()
                    // eslint-disable-next-line no-empty
                } catch (e) {}
            })
    }

    async function showmore() {
        todoobj.state = 'detail'
        messageReaction.message.edit(client.embed.todo(todoobj, true))
        await messageReaction.message.reactions.removeAll().catch((error) => client.logger.debug(error))
        await messageReaction.message.react(client.util.get('emojiMap').collapse)
    }
    async function showless() {
        todoobj.state = 'closed'
        messageReaction.message.edit(client.embed.todo(todoobj))
        await messageReaction.message.reactions.removeAll().catch((error) => client.logger.debug(error))
        await messageReaction.message.react(client.util.get('emojiMap').expand)
    }

    switch (react) {
        case 'accept_todo':
            const acceptSpan = reactionTrans.startSpan('accept_todo_reaction')
            // add the reacting user to the assigned array,
            // mark the todo as assigned and edit the todo
            // message, then react with the white checkmark

            if (todoobj.isAssigned(userinio) === false) todoobj.assigned.push(userinio)
            todoobj.state = 'assigned'
            todoobj.time_started = `${Date.now()}`
            await todoobj.update()

            messageReaction.message.edit(client.embed.todo(todoobj)).then(async () => {
                if (todoobj.shared && todoobj.shared === true) client.emit('todochanged', todoobj, client)
                await messageReaction.message.reactions.removeAll().catch((error) => {
                    client.logger.debug(error)
                })
                await messageReaction.message.react(client.util.get('emojiMap').edit)
                await messageReaction.message.react(client.util.get('emojiMap').finish)
                await messageReaction.message.react(client.util.get('emojiMap').assign)
                if (todoobj.shared !== true)
                    await messageReaction.message.react(client.util.get('emojiMap').share)
                if (todoobj.tasks) {
                    for (let i = 0; i < todoobj.tasks.length; i += 1) {
                        if (!todoobj.tasks[i].includes('finished_'))
                            messageReaction.message.react(client.util.get('emojiMap')[i + 1])
                    }
                }
            })
            if (acceptSpan) acceptSpan.end()
            break
        case 'finish':
            const finishSpan = reactionTrans.startSpan('finish_todo_reaction')
            // mark the todo as finished (closed), or
            // restart/repost the todo when its repeating
            if (Object.values(todoobj.assigned).includes(userinio) !== true)
                return messageReaction.users.remove(userinio)
            // if not all tasks are finished we dont allow the todo list to be marked as finished
            if (todoobj.tasks && todoobj.tasks.filter((task) => !task.includes('finished_')).length > 0) {
                client.util.get('clearReactions')(messageReaction.message, userinio)
                return todoobj.errorDisplay(messageReaction.message, userinio, messages.cantclosetodo[lang])
            }
            client.emit('todochanged', todoobj, client)
            if (todoobj.loop === true) {
                todoobj.state = 'open'
                todoobj.update()
                messageReaction.message.edit(client.embed.todo(todoobj)).then(async (msg) => {
                    await messageReaction.message.reactions
                        .removeAll()
                        .catch((error) => client.logger.debug(error))
                    await msg.react(client.util.get('emojiMap').edit)
                    await msg.react(client.util.get('emojiMap').assign)
                })
            } else {
                todoobj.state = 'closed'
                todoobj.time_finished = `${Date.now()}`
                todoobj.update()
                messageReaction.message.edit(client.embed.todo(todoobj)).then(async () => {
                    await messageReaction.message.reactions
                        .removeAll()
                        .catch((error) => client.logger.debug(error))
                    await messageReaction.message.react(client.util.get('emojiMap').expand)
                    if (todoobj.shared && todoobj.shared !== true)
                        await messageReaction.message.react(client.util.get('emojiMap').share)
                })
            }
            if (finishSpan) finishSpan.end()
            break
        case 'share':
            const shareSpan = reactionTrans.startSpan('share_todo_reaction')
            // send todo to read only channel
            if (settings.readonlychannel) {
                try {
                    if (todoobj.shared === true) return messageReaction.remove()
                    const rochan = await messageReaction.message.guild.channels.fetch(
                        settings.readonlychannel,
                    )
                    todoobj.shared = true
                    // todoobj.state = 'shared';
                    todoobj.readonlychannel = rochan.id
                    // @ts-expect-error
                    const msg = await rochan.send(client.embed.todo(todoobj))
                    todoobj.readonlymessage = msg.id
                    await todoobj.update()
                    // remove the reaction so users cant share again
                    messageReaction.remove()
                    if (shareSpan) shareSpan.end()
                } catch (e) {
                    client.logger.debug(e)
                    if (shareSpan) shareSpan.end()
                }
            } else {
                todoobj.errorDisplay(messageReaction.message, userinio, messages.noreadonlychannel[lang])
                if (shareSpan) shareSpan.end()
            }
            if (shareSpan) shareSpan.end()
            break
        case 'assign_yourself':
            const assignSpan = reactionTrans.startSpan('assign_yourself_reaction')
            // add the reacting user to the assigned array
            // and edit the todo msg/embed
            if (todoobj.isAssigned(userinio) === true) {
                todoobj.errorDisplay(messageReaction.message, userinio, messages.alreadyassigned[lang])
                await client.util.get('clearReactions')(messageReaction.message, userinio)
            } else {
                await todoobj.assign(userinio)
                await messageReaction.message.edit(client.embed.todo(todoobj))
                await client.util.get('clearReactions')(messageReaction.message, userinio)
                client.emit('todochanged', todoobj, client)
            }
            if (assignSpan) assignSpan.end()
            break
        case 'edit':
            const editSpan = client.apm.startSpan('edit_todo_reaction')
            // edit the task and edit the todo msg when finished
            if (todoobj.assigned === [] && userinio !== todoobj.submittedby)
                return messageReaction.users.remove(user.id)
            if (
                Object.values(todoobj.assigned).length > 0 &&
                Object.values(todoobj.assigned).includes(userinio) === false &&
                todoobj.submittedby !== userinio
            )
                return messageReaction.users.remove(user.id)
            await messageReaction.users.remove(user.id)
            await edit(messageReaction.message, userinio)
            if (editSpan) editSpan.end()
            break
        case 'expand':
            // Show more details
            showmore()
            break
        case 'collapse':
            showless()
            break
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
            const taskSpan = reactionTrans.startSpan('mark_task_finished_reaction')
            // function to mark task as finished
            const Mapemoji = client.util.get('Mapemoji')
            if (!todoobj.assigned.includes(userinio)) return messageReaction.users.remove(user.id)
            if (todoobj.tasks[Mapemoji[react] - 1].includes('finished_'))
                todoobj.tasks[Mapemoji[react] - 1] = todoobj.tasks[Mapemoji[react] - 1].replace(
                    'finished_',
                    '',
                )
            else todoobj.tasks[Mapemoji[react] - 1] = `finished_ ${todoobj.tasks[Mapemoji[react] - 1]}`
            client.emit('todochanged', todoobj, client)
            await todoobj.update()
            await messageReaction.message.edit(client.embed.todo(todoobj))
            await messageReaction.users.remove(user.id)
            if (taskSpan) taskSpan.end()
            break
        default:
            client.logger.log('Fuck you eslint')
            break
    }

    client.apm.endTransaction('reaction_event_handled', Date.now())
}
