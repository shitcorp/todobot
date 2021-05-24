/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */
import messages from '../localization/messages'
import { MyClient, Interaction } from '../classes'
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
    const { conf } = interaction
    const lang = conf ? conf.lang || 'en' : 'en'

    const myCommands = client.getInteractions()

    // FIXME: rewrite this to use normal Maps
    // const myCommands = allInts.filter((cmd) => permMap[cmd.conf.permLevel] <= interaction.level)
    let command
    if (interaction.data.options) {
      for (let i = 0; i < interaction.data.options.length; i += 1) {
        if (interaction.data.options[i].name === 'command') command = interaction.data.options[i].value
      }
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
            > ${clientCommand.help.description}
            **Documentation:**
            > [Click here](https://shitcorp.github.io/TODOBOT/docs/${clientCommand.name}) to read the full documentation.`)
    }
    const showAllCommands = async () => {
      let currentCategory = ''
      let output = `**${messages.available_commands[lang]}**\n`
      const sorted = []
      myCommands.forEach((value) => {
        if (value) sorted.push(value)
      })
      sorted.sort((p, c) =>
        p.help.category > c.help.category
          ? 1
          : p.name > c.name && p.help.category === c.help.category
          ? 1
          : -1,
      )
      sorted.forEach((c) => {
        if (!c) return
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
