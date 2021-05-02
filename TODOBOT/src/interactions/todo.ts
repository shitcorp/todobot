import { Message } from 'discord.js-light'
import MyClient from '../classes/Client'
import Interaction from '../classes/Interaction'
import Todo from '../classes/Todo'

/* eslint-disable no-nested-ternary */
const { v4: uuidv4 } = require('uuid')
const messages = require('../localization/messages.js')

const raw = {
    name: 'todo',
    description: 'Create a new TODO object',
    options: [
        {
            name: 'title',
            description: 'Title of the TODO object',
            required: true,
            type: 3,
        },
        {
            name: 'tasks',
            description:
                'The tasks that belong to this todo. Seperate them with a semicolon (;). Maximum 10 tasks allowed!',
            type: 3,
        },
        {
            name: 'content',
            description: 'Content of the TODO object',
            type: 3,
        },
        {
            name: 'url',
            description: 'Attach a link to the todo',
            type: 3,
        },
        {
            name: 'image',
            description: 'Attach an image to the todo. Has to be a discord attachment link.',
            type: 3,
        },
        {
            name: 'category',
            description: 'The category this todo should belong to.',
            type: 3,
        },
        {
            name: 'loop',
            description: 'Create repeating tasks',
            type: 5,
        },
    ],
}

export default {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        premium: false,
        production: true,
        permLevel: 'BOT_USER',
    },
    help: {
        category: 'todo',
        description: raw.description,
        mddescription: `
        # Images & Attachments
        If you want to attach an image to your task, you can simply upload an image and give it a title like so: {{thisismytitle}} ("thisismytitle" will then be the title to reference). 
        
        \nWhen creating your task then reference the image with your title in the image options. The image will then be embedded into your todo list. **Note:** The image will be available 24hrs after uploading (for every guild member). This is due to the bot caching the links to images that are uploaded with the special tags (the double curly brackets {{}}).
        
        \nFor attaching normal links, just put them in the url option, if will then be shown as attachment in your todo list.`,
    },
    // eslint-disable-next-line consistent-return
    run: async (client: MyClient, interaction: Interaction) => {
        const { conf } = interaction
        // eslint-disable-next-line no-nested-ternary
        const lang = conf ? (conf.lang ? conf.lang : 'en') : 'en'
        if (!conf) return interaction.errorDisplay(messages.addbottoguild[lang])
        if (!conf.todochannel || conf.todoochannel === '')
            return interaction.errorDisplay(messages.notodochannel[lang])

        if (!interaction.data.options || interaction.data.options.length < 1)
            return interaction.errorDisplay(messages.todonoargs[lang])

        const todoobject = {
            _id: uuidv4().slice(0, 13),
            title: '',
            content: '',
            category: null,
            guildid: interaction.guild_id,
            state: 'open',
            submittedby: interaction.member.user.id,
            timestamp: Date.now(),
            time_started: '',
            time_finished: '',
            tasks: null,
            assigned: [],
            severity: 5,
            loop: false,
            attachlink: null,
            readonlychannel: '',
            readonlymessage: '',
            shared: false,
            todomsg: null,
            todochannel: null,
        }

        // eslint-disable-next-line array-callback-return
        Object.entries(interaction.data.options).map(
            ([key, value]: [
                key: any,
                value: Record<any, any>,
                // eslint-disable-next-line array-callback-return
            ]) => {
                // eslint-disable-next-line no-console
                console.log(key, value)
                switch (value.name) {
                    case 'title':
                        todoobject.title = value.value
                        break
                    case 'content':
                        todoobject.content = value.value
                        break
                    case 'tasks':
                        if (value.value === '') return
                        if (value.value.includes(';')) {
                            // split the string containing the tasks at the semicolon and filter out all empty
                            // tasks as well as task strings that are too long. If theres more than 10, were just
                            // capping the array by setting the length to 10
                            const temp = value.value
                                .split(';')
                                .filter((task) => task !== '' && task.length < 1020)
                            if (temp.length > 10) temp.length = 10
                            todoobject.tasks = temp
                        } else {
                            todoobject.tasks = [value.value]
                        }
                        break
                    case 'loop':
                        todoobject.loop = value.value
                        break
                    case 'category':
                        todoobject.category = value.value
                        break
                    case 'url':
                        todoobject.attachlink = `url_${value.value}`
                        break
                    case 'image':
                        client.cache.get(`${interaction.guild_id}${value.value}`, (res) => {
                            // eslint-disable-next-line no-console
                            console.log(res)
                        })
                        break
                    default:
                        // eslint-disable-next-line no-console
                        console.log('fuck eslint')
                        break
                }
            },
        )

        let todomsg: Message | undefined
        try {
            const todochannel = await client.guilds.cache
                .get(interaction.guild_id)
                .channels.fetch(
                    conf.todomode
                        ? conf.todomode === 'advanced'
                            ? interaction.channel_id
                            : conf.todochannel
                        : conf.todochannel,
                )
            // @ts-expect-error
            todomsg = await todochannel.send(client.embed.todo(todoobject))
        } catch (e) {
            client.logger.debug(e)

            return interaction.errorDisplay(messages.unabletoposttodo[lang])
        }

        if (!todomsg) return interaction.errorDisplay(messages.unabletoposttodo[lang])

        interaction.replyWithMessageAndDeleteAfterAWhile(client.embed.success(messages.todoposted[lang]))

        // were saving the channel for future reference, if the todo channel gets changed
        // and we repost a task/todo and put the link to the original message. Dont know
        // how to handle deletion of the todo channel but it is what it is
        todoobject.todomsg = todomsg.id
        todoobject.todochannel = conf.todomode
            ? conf.todomode === 'advanced'
                ? interaction.channel_id
                : conf.todochannel
            : conf.todochannel
        todoobject.shared = false

        await todomsg.react('✍️')
        try {
            // await todomsg.react('heart')

            // eslint-disable-next-line @typescript-eslint/dot-notation
            // todomsg.react(client.util.get('emojiMap').accept)
            // save the todo to database
            const todo = new Todo(interaction.client, todoobject)
            await todo.save()
        } catch (e) {
            console.error(e)
            // interaction.channel.send(messages.unabletoposttodo[lang])
        }
    },
}
