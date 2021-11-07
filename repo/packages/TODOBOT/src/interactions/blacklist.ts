/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-await-in-loop */
/* eslint-disable global-require */
/* eslint-disable no-nested-ternary */
import { MyClient, Interaction } from '../classes'

const raw = {
  name: 'blacklist',
  description: 'Blacklist user(s) and/or channel(s)',
  options: [
    {
      name: 'add',
      description: 'Add user(s) or channel(s) to the blacklist.',
      type: 1,
      options: [
        {
          name: 'user',
          description: 'The user you want to blacklist',
          type: 6,
          required: false,
        },
        {
          name: 'channel',
          description: 'The channel you want to blacklist',
          type: 7,
          required: false,
        },
      ],
    },
    {
      name: 'remove',
      description: 'Remove user(s) or channel(s) from the blacklist.',
      type: 1,
      options: [
        {
          name: 'user',
          description: 'The user you want to blacklist',
          type: 6,
          required: false,
        },
        {
          name: 'channel',
          description: 'The channel you want to blacklist',
          type: 7,
          required: false,
        },
      ],
    },
    {
      name: 'list',
      description: 'Show your current blacklists.',
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
    premium: false,
    production: true,
    permLevel: 'STAFF',
  },
  help: {
    category: 'System',
    description: raw.description,
  },
  // eslint-disable-next-line consistent-return
  run: async (client: MyClient, interaction: Interaction) => {
    const messages = require('../localization/messages')
    const { conf } = interaction
    const lang = conf ? (conf.lang ? conf.lang : 'en') : 'en'
    if (!conf) return interaction.errorDisplay(messages.addbottoguild[lang])

    let action
    let commandopts
    for (let i = 0; i < interaction.data.options; i += 1) {
      if (interaction.data.options[i].type === 1) action = interaction.data.options[i].name
      if (interaction.data.options[i].type === 1 && interaction.data.options[i].options)
        commandopts = interaction.data.options[i].options
    }
    if (action !== 'list' && !commandopts)
      return interaction.errorDisplay(messages.nouserorchannelgiven[lang])
    /**
     * interaction.data.resolved either holds a members object or channels object
     */
    let chann
    let user
    if (interaction.data.resolved) {
      if (interaction.data.resolved.channels)
        chann = interaction.data.resolved.channels[Object.keys(interaction.data.resolved.channels)[0]]
      if (interaction.data.resolved.users)
        user = interaction.data.resolved.users[Object.keys(interaction.data.resolved.users)[0]]
    }
    const blacklist_users = []
    const blacklist_channels = []
    Object.keys(conf.blacklist_users).forEach((key) => blacklist_users.push(conf.blacklist_users[key]))
    Object.keys(conf.blacklist_channels).forEach((key) =>
      blacklist_channels.push(conf.blacklist_channels[key]),
    )

    const updateConf = client.getUtil('updateconfig')

    // eslint-disable-next-line default-case
    switch (action) {
      case 'add':
        if (user && user.bot === true) return interaction.embed.error(messages.cannotblacklistbots[lang])
        if (user && blacklist_users.includes(user.id))
          return interaction.errorDisplay(messages.useralreadyblacklisted[lang])
        if (chann && blacklist_channels.includes(chann.id))
          return interaction.errorDisplay(messages.channelalreadyblacklisted[lang])
        if (user) blacklist_users.push(user.id)
        if (chann) blacklist_channels.push(chann.id)
        conf.blacklist_users = blacklist_users
        conf.blacklist_channels = blacklist_channels
        updateConf(interaction.guild_id, conf)
        interaction.embed.success(messages.updatedyourblacklist[lang])
        break
      case 'remove':
        if (user && user.bot === true) return interaction.embed.error(messages.cannotblacklistbots[lang])
        if (user && !blacklist_users.includes(user.id))
          return interaction.errorDisplay(messages.usernotblacklisted[lang])
        if (chann && !blacklist_channels.includes(chann.id))
          return interaction.errorDisplay(messages.channelnotblacklisted[lang])
        if (user) blacklist_users.splice(blacklist_users.indexOf(user.id), 1)
        if (chann) blacklist_channels.splice(blacklist_channels.indexOf(chann.id), 1)
        conf.blacklist_users = blacklist_users
        conf.blacklist_channels = blacklist_channels
        updateConf(interaction.guild_id, conf)
        interaction.replyWithMessageAndDeleteAfterAWhile(
          client.embed.success(messages.updatedyourblacklist[lang]),
        )
        break
      case 'list':
        // eslint-disable-next-line no-case-declarations
        let output = ''
        if (blacklist_users.length > 0) {
          output += '**Blacklisted Users:** \n'
          for (let i = 0; i < blacklist_users.length; i += 1) {
            output += `> • ${await client.users.fetch(blacklist_users[i])} \n`
          }
        }
        if (blacklist_channels.length > 0) {
          output += '\n\n **Blacklisted Channels:** \n'
          for (let i = 0; i < blacklist_channels.length; i += 1) {
            output += `> • ${await client.guilds.cache
              .get(interaction.guild_id)
              .channels.fetch(blacklist_channels[i])} \n`
          }
        }
        if (output === '') output = messages.noitemsonblacklist[lang]
        interaction.embed.default(output)
        break
    }
  },
}
