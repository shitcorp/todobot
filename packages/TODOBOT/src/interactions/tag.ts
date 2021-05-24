/* eslint-disable no-nested-ternary */
/* eslint-disable consistent-return */
import MyClient from '../classes/Client'
import Interaction from '../classes/Interaction'

const messages = require('../localization/messages.js')

const raw = {
    name: 'tag',
    description: 'Bild your own commands like a pro.',
    options: [
        {
            name: 'learn',
            description: 'Let the bot learn a new "command" or "tag".',
            // type 1 = subcommand
            // type 2 = subcommand group
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'The name of your new command/tag.',
                    // type 3 =  string
                    type: 3,
                    required: true,
                },
                {
                    name: 'content',
                    description: 'This is the content that will be sent when your custom command is run.',
                    type: 3,
                    required: true,
                },
            ],
        },
        {
            name: 'unlearn',
            description: 'Delete a command.',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'The command you want to delete.',
                    type: 3,
                    required: true,
                },
            ],
        },
        {
            name: 'edit',
            description: 'Edit an already existing tag.',
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'Name of the command you want to edit.',
                    type: 3,
                    required: true,
                },
                {
                    name: 'content',
                    description: 'The content that you want to save as the new tag',
                    type: 3,
                    required: true,
                },
            ],
        },
        {
            name: 'list',
            description: 'List available tags.',
            type: 1,
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
    run: async (client: MyClient, interaction: Interaction) => {
        if (!interaction.data.options) return
        const { conf } = interaction
        const lang = conf ? (conf.lang ? conf.lang : 'en') : 'en'
        if (!conf) return interaction.errorDisplay(messages.addbottoguild[lang])
        let action
        let commandopts
        for (let i = 0; i < interaction.data.options.length; i += 1) {
            if (interaction.data.options[i].type === 1) action = interaction.data.options[i].name
            if (interaction.data.options[i].type === 1 && interaction.data.options[i].options)
                commandopts = interaction.data.options[i].options
        }
        if (!action) return
        const tagMap = await client.util.get('mapBuilder')(conf.tags)
        let tag
        let value
        if (commandopts) {
            for (let j = 0; j < commandopts.length; j += 1) {
                if (commandopts[j].name === 'name') tag = commandopts[j].value
                if (commandopts[j].name === 'content') value = commandopts[j].value
            }
        }
        // eslint-disable-next-line default-case
        switch (action) {
            case 'list':
                // FIXME this is probably still erroring, needs some big brain time to find a fix
                // temporary fix: just slice the output if it gets too long
                // eslint-disable-next-line no-case-declarations
                let output = ''
                Object.keys(conf.tags).forEach((key) => {
                    output += `• \`${key}\` =>  ${
                        conf.tags[key].length > 69 ? conf.tags[key].slice(0, 69) : conf.tags[key]
                    } \n`
                    // eslint-disable-next-line no-useless-return
                    if (output.length > 2000) return
                })
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                if (output.length > 2000) `${output.slice(0, 2000)}...`
                // eslint-disable-next-line no-useless-concat
                interaction.embed.default(`**${messages.availabletags[lang]}**` + `\n\n${output}`)
                break
            case 'learn':
                if (client.commands.get(tag) || client.aliases.get(tag))
                    return interaction.errorDisplay(messages.cantoverwritecommands[lang])
                if (tagMap.get(tag)) return interaction.errorDisplay(messages.tagalreadyexists[lang])
                if (value.length > 1001)
                    return interaction.errorDisplay(messages.descriptiontoolong[lang] + value.length)
                tagMap.set(tag, value)
                conf.tags = tagMap
                await client.util.get('updateconfig')(interaction.guild_id, conf)
                interaction.replyWithMessageAndDeleteAfterAWhile(
                    client.embed.success(
                        `${messages.tagsaved[lang]}\n\n> Tag:  \`${tag}\` \n\n> Description:  \`${value}\``,
                    ),
                )
                break
            case 'unlearn':
                if (!tagMap.get(tag)) return interaction.errorDisplay(messages.tagdoesnotexist[lang])
                tagMap.delete(tag)
                conf.tags = tagMap
                await client.util.get('updateconfig')(interaction.guild_id, conf)
                interaction.embed.success(`${messages.tagunlearned[lang]}\`${tag}\`.`)
                break
            case 'edit':
                if (!tagMap.get(tag)) return interaction.errorDisplay(messages.tagdoesnotexist[lang])
                if (value.length > 1001)
                    return interaction.errorDisplay(messages.descriptiontoolong[lang] + value.length)
                tagMap.set(tag, value)
                conf.tags = tagMap
                await client.util.get('updateconfig')(interaction.guild_id, conf)
                interaction.replyWithMessageAndDeleteAfterAWhile(
                    client.embed.success(
                        `${messages.tagsaved[lang]}\n\n> Tag:  \`${tag}\` \n\n> Description:  \`${value}\``,
                    ),
                )
                break
        }
    },
}
