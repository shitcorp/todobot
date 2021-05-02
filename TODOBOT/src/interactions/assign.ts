/* eslint-disable no-nested-ternary */
import MyClient from '../classes/Client'
import Interaction from '../classes/Interaction'
import Todo from '../classes/Todo'
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
    // eslint-disable-next-line consistent-return
    run: async (client: MyClient, interaction: Interaction) => {
        // acknowledge the interaction

        if (!interaction.conf) return interaction.errorDisplay(messages.addbottoguild.en)
        const lang = interaction.conf ? (interaction.conf.lang ? interaction.conf.lang : 'en') : 'en'

        const user: any = Object.values(interaction.data.resolved.users)[0]

        if (user.bot === true) return interaction.errorDisplay(messages.cannotassignbots[lang])

        let id: string
        for (let i = 0; i < interaction.data.options; i += 1)
            if (interaction.data.options[i].name === 'id') id = interaction.data.options[i].value

        const getOne = client.getUtil('getonetodo')
        const check = await getOne(id)

        if (!check) return interaction.errorDisplay(messages.tododoesntexist[lang])

        const todoClass = new Todo(client, check)

        if (todoClass.assigned.includes(user.id))
            return interaction.errorDisplay(messages.useralreadyassigned[lang])

        if (todoClass.state === 'open') todoClass.state = 'assigned'

        todoClass.assign(user.id)

        const update = client.getUtil('updatetodo')
        await update(todoClass._id, todoClass)

        const todochannel = client.guilds.cache
            .get(interaction.guild_id)
            .channels.cache.get(todoClass.todochannel)

        // @ts-expect-error
        const msg = await todochannel.messages.fetch(todoClass.todomsg)

        await msg.edit(client.embed.todo(todoClass))

        interaction.replyWithMessageAndDeleteAfterAWhile(client.embed.success('User assigned.'))
    },
}
