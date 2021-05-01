/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */
import MyClient from '../classes/client'
import Interaction from '../classes/interaction'
import properCase from '../modules/util/toProperCase'

const raw = {
    name: 'help',
    description: 'Show all available commands and their usage.',
    options: [
        {
            name: 'command',
            description: 'The command you want specific infomation about.',
            type: 3,
            required: false,
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
        permLevel: 'USER',
    },
    help: {
        category: 'System',
        description: raw.description,
    },
    run: async (client: MyClient, interaction: Interaction) => {
        const messages = require('../localization/messages')
        const { conf } = interaction
        const lang = conf ? (conf.lang ? conf.lang : 'en') : 'en'
        const permMap = client.getUtil('permMap')
        const myCommands = client.interactions.filter(
            (cmd) => permMap[cmd.conf.permLevel] <= interaction.level,
        )

        let command
        for (let i = 0; i < interaction.data.options; i += 1) {
            if (interaction.data.options[i].name === 'command') command = interaction.data.options[i].value
        }
        // eslint-disable-next-line consistent-return
        const showOnlyOneCommand = async () => {
            const clientCommand = client.interactions.get(command)
            if (!clientCommand) return interaction.embed.error(messages.commandnotfound[lang])
            interaction.embed.default(`
            **Name:** 
            > ${command}

            **Category:**
            > ${clientCommand.help.category}

            **Description:** 
            > ${clientCommand.help.description}`)
        }
        const showAllCommands = async () => {
            let currentCategory = ''
            let output = `**${messages.available_commands[lang]}**\n`
            const sorted = myCommands
                .array()
                .sort((p, c) =>
                    p.help.category > c.help.category
                        ? 1
                        : p.name > c.name && p.help.category === c.help.category
                        ? 1
                        : -1,
                )
            sorted.forEach((c) => {
                const cat = c.help.category
                if (currentCategory !== cat) {
                    output += `\n __${properCase(cat.slice(0, 45))}:__ \n`
                    currentCategory = cat
                }
                output += `\` ${c.name} \` |`
            })
            output += `\n\n> ${messages.moreinformation[lang]}`
            interaction.embed.default(output)
        }
        // no command speciefied, user wants information about all commands
        if (command) showOnlyOneCommand()
        else showAllCommands()
    },
}
