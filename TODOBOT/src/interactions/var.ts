import MyClient from '../classes/Client'
import Interaction from '../classes/Interaction'

const messages = require('../localization/messages')

const raw = {
    name: 'var',
    description:
        "Set, view, edit and delete configvariables. Use them in your tags like so: <%foo%> to be replaced with the variable 'foo'",
    options: [
        {
            name: 'create',
            // 1= subcommand
            type: 1,
            description: 'Create a new variable',
            options: [
                {
                    name: 'name',
                    description: 'How you want your variable to be named.',
                    // string
                    type: 3,
                    required: true,
                },
                {
                    name: 'value',
                    description: 'The value your variable should hold.',
                    type: 3,
                    required: true,
                },
            ],
        },
        {
            name: 'view',
            description: 'Show your already registered variables',
            type: 1,
        },
        {
            name: 'edit',
            description: 'Edit an already existing variable',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'Name of the variable you want to edit',
                    type: 3,
                    required: true,
                },
                {
                    name: 'value',
                    description: 'The new value for your variable',
                    type: 3,
                    required: true,
                },
            ],
        },
        {
            name: 'delete',
            description: 'Delete a variable.',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'Name of the variable you want to delete',
                    type: 3,
                    required: true,
                },
            ],
        },
    ],
}

export default {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        premium: true,
        production: true,
        permLevel: 'STAFF',
    },
    help: {
        category: 'Utility',
        description: raw.description,
    },
    // eslint-disable-next-line consistent-return
    run: async (client: MyClient, interaction: Interaction) => {
        const { conf } = interaction
        const { lang } = interaction
        if (!conf) return interaction.errorDisplay(messages.addbottoguild[lang])
        if (!conf.vars) conf.vars = { example: 'This is an example variable' }
        const variableMap = await client.util.get('mapBuilder')(conf.vars)
        let action
        let commandopts
        let name
        let value

        for (let i = 0; i < interaction.data.options; i += 1) {
            if (interaction.data.options[i].type === 1) action = interaction.data.options[i].name
            if (interaction.data.options[i].type === 1 && interaction.data.options[i].options)
                commandopts = interaction.data.options[i].options
        }
        for (let j = 0; j < commandopts.length; j += 1) {
            if (commandopts[j].name === 'name') name = commandopts[j].value
            if (commandopts[j].name === 'value') value = commandopts[j].value
        }
        // use args for command
        // eslint-disable-next-line default-case
        switch (action) {
            // set a new key value pair
            case 'create':
                if (variableMap.get(name)) return interaction.errorDisplay(messages.varalreadyexists[lang])
                variableMap.set(name, encodeURI(value))
                conf.vars = variableMap
                await client.util.get('updateconfig')(interaction.guild_id, conf)
                interaction.replyWithMessageAndDeleteAfterAWhile(
                    client.embed.success(
                        `${messages.savedvar}\n\n> Name => \`${name}\` \n\n> Value => \`${value}\``,
                    ),
                )
                break
            // view key value pair by key (maybe add -all flag)
            case 'view':
                // eslint-disable-next-line no-case-declarations
                let output = ''
                Object.keys(conf.vars).forEach((key) => {
                    output += `• \`${key}\` =>  ${conf.vars[key].slice(0, 69)} \n`
                })
                interaction.embed.default(`\n\n${output}`)
                break
            // edit key value pair
            case 'edit':
                variableMap.set(name, encodeURI(value))
                conf.vars = variableMap
                await client.util.get('updateconfig')(interaction.guild_id, conf)
                interaction.replyWithMessageAndDeleteAfterAWhile(
                    client.embed.success(
                        `${messages.updatedvar}\n\n> Name => \`${name}\` \n\n> Value => \`${value}\``,
                    ),
                )
                break
            // delete key value pair by key
            case 'delete':
                if (!variableMap.has(name)) return interaction.errorDisplay(messages.varmustexist[lang])
                variableMap.delete(name)
                conf.vars = variableMap
                await client.util.get('updateconfig')(interaction.guild_id, conf)
                interaction.replyWithMessageAndDeleteAfterAWhile(
                    client.embed.success(`${messages.deletedvar[lang]} \`\${name}\``),
                )
                break
        }
    },
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    permLevel: 'STAFF',
}
