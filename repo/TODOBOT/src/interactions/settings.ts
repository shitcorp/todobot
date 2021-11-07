/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-case-declarations */
import { MyClient, Interaction } from '../classes'
import messages from '../localization/messages'

const raw = {
  name: 'settings',
  description: 'View and edit bot settings.',
  options: [
    {
      name: 'set',
      description: 'Set a new value',
      type: 1,
      options: [
        {
          name: 'prefix',
          description: 'The prefix the bot will use for your custom commands or tags.',
          type: 3,
          required: false,
        },
        {
          name: 'todochannel',
          description: 'The channel that will be used to post your todos in.',
          // type 7 = channel
          type: 7,
          required: false,
        },
        {
          name: 'readonlychannel',
          description: 'The channel that will be used to keep your community updated.',
          type: 7,
          required: false,
        },
        {
          name: 'userrole',
          description:
            'Add a new userrole. Userroles can interact with the bot but cannot change bot settings.',
          type: 8,
          required: false,
        },
        {
          name: 'staffrole',
          description: 'Add a new staffrole. Staffroles can edit bot settings and force assign users.',
          type: 8,
          required: false,
        },
        {
          name: 'language',
          description: 'The language the bot uses to talk to you.',
          type: 3,
          required: false,
          choices: [
            {
              name: 'english',
              value: 'en',
            },
            {
              name: 'german',
              value: 'de',
            },
          ],
        },
        {
          name: 'autopurge',
          description: 'Toggle messages being auto purged in the todochannel.',
          // BOOLEAN
          type: 5,
          required: false,
        },
        {
          name: 'todomode',
          description: 'Toggle between simple (one channel) and advanced (multiple channels) mode',
          type: 3,
          choices: [
            {
              name: 'simple',
              value: 'simple',
            },
            {
              name: 'advanced',
              value: 'advanced',
            },
          ],
        },
      ],
    },
    {
      name: 'view',
      description: 'View your current settings.',
      type: 1,
    },
    {
      name: 'remove',
      description: 'Remove a user or staffrole.',
      type: 1,
      options: [
        {
          name: 'userrole',
          description:
            'Add a new userrole. Userroles can interact with the bot but cannot change bot settings.',
          type: 8,
          required: false,
        },
        {
          name: 'staffrole',
          description: 'Add a new staffrole. Staffroles can edit bot settings and force assign users.',
          type: 8,
          required: false,
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
    premium: false,
    production: true,
    permLevel: 'STAFF',
  },
  help: {
    category: 'Utility',
    description: raw.description,
    mddescription: `
        # Some Additional Information
        
        ## Readonly Setting

        If you set a readonly channel, you can from now on use the \`share\` reaction ![](https://cdn.discordapp.com/attachments/724022854231916684/844963684501684234/unknown.png) to share the todo to the channel that you configured. All changes to that TODO will be mirrored to that channel, so if someone finishes a task, edits the todo or closes it, everything will be shown in the read only channel.

        ## User/Staff Roles

        These roles are used to determine permissions. "USERs" are users that can interact with the bot. People with the "STAFF" role are users that can change and edit bot settings and force assing users. Having the discord permission \`MANAGE GUILD\` will override this permission system and allow you to edit the bots settings.

        ## Autopurge

        If you enable this setting, all messages that are sent in your configured todo channel and are not from the bot or a user without the \`STAFF\` role will be deleted. This is useful if you want to use your todochannel for tasks only and keep the chatting in other channels.

        ## Todomode

        As you may have seen, there are 2 choices for this: \`simple\` and \`advanced\`:

        **Simple**

        > In this mode all "todo activity" will happen in the preconfigured TODO channel. Means if you run the todo command in lets say the \`general\` channel, your todo will pop up in the configured todo channel (lets call it \`tasks\`).
        
        **Advanced**
        
        > In this mode, the todos will be created in the channel, where the todo command is run in. So lets say you run the todo command in the \`general\` channel, the todo will pop up in this very \`general\` channel.
        `,
  },
  run: async (client: MyClient, interaction: Interaction) => {
    let action
    let commandopts
    for (let index = 0; index < interaction.data.options.length; index += 1) {
      if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name
      if (interaction.data.options[index].type === 1 && interaction.data.options[index].options)
        commandopts = interaction.data.options[index].options
    }

    let conf = await client.config.get(interaction.guild_id)

    if (!conf)
      conf = {
        _id: interaction.guild_id,
        prefix: '//',
        color: 'BLUE',
        todochannel: null,
        readonlychannel: null,
        staffroles: [],
        userroles: [],
        tags: new Map(),
        blacklist_channels: [],
        blacklist_users: [],
        vars: new Map(),
        lang: 'en',
        blackboard: {
          message: null,
          channel: null,
        },
        autopurge: false,
        todomode: 'simple',
      }
    // eslint-disable-next-line no-nested-ternary
    const lang = conf ? (conf.lang ? conf.lang : 'en') : 'en'
    if (!action) return
    // eslint-disable-next-line default-case
    switch (action) {
      case 'set':
        let staffrole
        let userrole
        let todochannel
        for (let i = 0; i < commandopts.length; i += 1) {
          // eslint-disable-next-line default-case
          switch (commandopts[i].name) {
            case 'prefix':
              conf.prefix = commandopts[i].value
              break
            case 'todochannel':
              todochannel = commandopts[i].value
              break
            case 'readonlychannel':
              conf.readonlychannel = commandopts[i].value
              break
            case 'staffrole':
              staffrole = commandopts[i].value
              break
            case 'userrole':
              userrole = commandopts[i].value
              break
            case 'language':
              conf.lang = commandopts[i].value
              break
            case 'autopurge':
              conf.autopurge = commandopts[i].value
              break
            case 'todomode':
              conf.todomode = commandopts[i].value
              break
          }
        }
        if (todochannel) {
          try {
            const guild = await client.guilds.fetch(interaction.guild_id)
            const chann = await guild.channels.fetch(todochannel)
            // @ts-expect-error
            const testmsg = await chann.send(
              client.embed.default(
                'This is a test message to ensure I have all the permissions I need.',
                null,
              ),
            )
            // await testmsg.react(client.getUtil('emojiMap').edit)
            // await testmsg.react(client.getUtil('emojiMap').accept)
            await testmsg.delete()
            conf.todochannel = todochannel
          } catch (e) {
            interaction.errorDisplay(messages.unabletoposttodo[lang])
          }
        }

        if (staffrole) conf.staffroles.push(staffrole)
        if (userrole) conf.userroles.push(userrole)

        try {
          await client.config.set(conf)
        } catch (e) {
          try {
            await client.config.update(interaction.guild_id, conf)
          } catch (e) {
            client.logger.debug(e)
          }
        }
        interaction.replyWithMessageAndDeleteAfterAWhile(client.embed.success(messages.savedsettings[lang]))
        break
      case 'view':
        const output = {
          prefix: conf.prefix,
          todochannel: conf.todochannel,
          readonlychannel: conf.readonlychannel,
          userroles: conf.userroles,
          staffroles: conf.staffroles,
          todomode: conf.todomode,
          autopurge: conf.autopurge,
          language: conf.lang,
        }

        let outputString = '**Current Settings** \n\n'

        // eslint-disable-next-line guard-for-in
        for (const i in output) {
          switch (i) {
            case 'readonlychannel':
            case 'todochannel':
              outputString += `> ${i}  =>  ${
                output[i] === undefined
                  ? 'undefined'
                  : await client.guilds.cache.get(interaction.guild_id).channels.fetch(output[i])
              } \n`
              break
            case 'userroles':
            case 'staffroles':
              if (output[i] === [])
                outputString += `> ${i}  =>  \`${output[i] === undefined ? 'undefined' : output[i]}\` \n`
              else {
                const temp = []
                if (output[i]) output[i].forEach(async (role) => temp.push(`<@&${role}>`))
                outputString += `> ${i}  =>  ${output[i] === undefined ? 'undefined' : temp.join(', ')} \n`
              }
              break
            default:
              outputString += `> ${i}  =>  \`${output[i] === undefined ? 'undefined' : output[i]}\` \n`
          }
        }

        const embedToSend = client.embed.default(outputString)
        embedToSend.setThumbnail(client.user.avatarURL())
        // cdn.discordapp.com/avatars/ user.id + user.avatar + .png
        embedToSend.setFooter(
          `Requested by ${interaction.member.user.username}#${interaction.member.user.discriminator}   •    www.todo-bot.xyz`,
          `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`,
        )
        interaction.replyWithMessageAndDeleteAfterAWhile(embedToSend)

        break
      case 'remove':
        let staffrole_to_remove
        let userrole_to_remove
        for (let i = 0; i < commandopts.length; i += 1) {
          if (commandopts[i].name === 'staffrole') staffrole_to_remove = commandopts[i].value
          if (commandopts[i].name === 'userrole') userrole_to_remove = commandopts[i].value
        }
        if (staffrole_to_remove) {
          const staffroles = []
          Object.values(conf.staffroles).forEach((value) => staffroles.push(value))
          if (!staffroles.includes(staffrole_to_remove))
            return interaction.errorDisplay(messages.rolenotinarray[lang])
          staffroles.splice(staffroles.indexOf(staffrole_to_remove), 1)
          conf.staffroles = staffroles
        }
        if (userrole_to_remove) {
          const userroles = []
          Object.values(conf.userroles).forEach((value) => userroles.push(value))
          if (!conf.userroles.includes(userrole_to_remove))
            return interaction.errorDisplay(messages.rolenotinarray[lang])
          userroles.splice(userroles.indexOf(userrole_to_remove, 1))
          conf.userroles = userroles
        }
        try {
          await client.config.set(conf)
        } catch (e) {
          client.config.update(interaction.guild_id, conf)
        }
        interaction.replyWithMessageAndDeleteAfterAWhile(client.embed.success(messages.savedsettings[lang]))
        break
    }
  },
}
