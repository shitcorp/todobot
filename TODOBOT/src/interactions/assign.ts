import { User } from 'discord.js-light'
import MyClient from '../classes/client'
import Interaction from '../classes/interaction'
import todo from '../classes/todo'
import messages from '../localization/messages'

const raw = {
    name: 'assign',
    description: 'Assign someone to a task no matter if they want or not.',
    options: [
        {
            name: 'user',
            description: 'The user you want to assign.',
            // type 6 = user
            type: 6,
            required: true,
        },
        {
            name: 'id',
            description: 'ID of the task that you want to assing the user to.',
            type: 3,
            required: true,
        },
    ],
}

export default {
    raw,
    id: '822581844213366876',
    name: raw.name,
    conf: {
        enabled: true,
        premium: false,
        production: true,
        permLevel: 'STAFF',
    },
    help: {
        category: 'System',
        description: raw.description,
        mddescription: `
        # Assign Command
        Welcome to the documentation of the \`assign\` command. It is used to assign members to tasks.
        `,
    },
    run: async (client: MyClient, interaction: Interaction) => {
        // acknowledge the interaction

        if (!interaction.conf) return interaction.errorDisplay(messages.addbottoguild['en'])
        let lang = interaction.conf ? (interaction.conf.lang ? interaction.conf.lang : 'en') : 'en'

        // @ts-expect-error
        let user: User = Object.values(interaction.data.resolved.users)[0]

        if (user.bot === true) return interaction.errorDisplay(messages.cannotassignbots[lang])

        let id
        for (const index in interaction.data.options)
            if (interaction.data.options[index].name === 'id') id = interaction.data.options[index].value

        const getOne = client.getUtil('getonetodo')
        const check = await getOne(id)

        if (!check) return interaction.errorDisplay(messages.tododoesntexist[lang])

        const todoClass = new todo(client, check)

        if (todoClass.assigned.includes(user.id))
            return interaction.errorDisplay(messages.useralreadyassigned[lang])

        if (todoClass.state === 'open') todoClass.state = 'assigned'

        todoClass.assign(user.id)

        const update = client.getUtil('updatetodo')
        await update(todoClass._id, todoClass)

        let todochannel = await client.guilds.cache
            .get(interaction.guild_id)
            .channels.cache.get(todoClass.todochannel)

        // @ts-expect-error
        let msg = await todochannel.messages.fetch(todoClass.todomsg)

        await msg.edit(client.embed.todo(todoClass))

        interaction.replyWithMessageAndDeleteAfterAWhile(client.embed.success('User assigned.'))
    },
}
