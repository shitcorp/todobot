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

module.exports = {
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
    run: async (client, interaction) => {
        const conf = interaction.conf
        const lang = interaction.lang
        if (!conf) return interaction.errorDisplay(messages.addbottoguild[lang])
        if (!conf.vars) conf.vars = { example: 'This is an example variable' }
        const variableMap = await client.mapBuilder(conf.vars)
        let action, commandopts, name, value

        for (index in interaction.data.options) {
            if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name
            if (interaction.data.options[index].type === 1 && interaction.data.options[index].options)
                commandopts = interaction.data.options[index].options
        }
        for (i in commandopts) {
            if (commandopts[i].name === 'name') name = commandopts[i].value
            if (commandopts[i].name === 'value') value = commandopts[i].value
        }
        //use args for command
        switch (action) {
            // set a new key value pair
            case 'create':
                if (variableMap.get(name)) return interaction.errorDisplay(messages.varalreadyexists[lang])
                variableMap.set(name, encodeURI(value))
                conf.vars = variableMap
                await client.updateconfig(interaction.guild_id, conf)
                interaction.replyWithMessageAndDeleteAfterAWhile(
                    client.success(
                        messages.savedvar + `\n\n> Name => \`${name}\` \n\n> Value => \`${value}\``,
                    ),
                )
                break
            // view key value pair by key (maybe add -all flag)
            case 'view':
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
                await client.updateconfig(interaction.guild_id, conf)
                interaction.replyWithMessageAndDeleteAfterAWhile(
                    client.success(
                        messages.updatedvar + `\n\n> Name => \`${name}\` \n\n> Value => \`${value}\``,
                    ),
                )
                break
            // delete key value pair by key
            case 'delete':
                if (!variableMap.has(name)) return interaction.errorDisplay(messages.varmustexist[lang])
                variableMap.delete(name)
                conf.vars = variableMap
                await client.updateconfig(interaction.guild_id, conf)
                interaction.replyWithMessageAndDeleteAfterAWhile(
                    client.success(messages.deletedvar[lang] + ' `${name}`'),
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
