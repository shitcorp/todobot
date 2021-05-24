import { MyClient, Interaction } from '../classes'
import { http } from '../modules/util'
import messages from '../localization/messages'

const raw = {
  name: 'shorten',
  description: 'Shorten a link.',
  required: true,
  options: [
    {
      name: 'Link',
      description: 'The link that you want to get shortened.',
      required: true,
      type: 3,
    },
    {
      name: 'Domain',
      description: 'The domain you want to use for your shortened link.',
      type: 3,
      choices: [
        {
          name: 'stlf.me',
          value: 'm.stlf.me',
        },
        {
          name: 'heres-the.link',
          value: 'heres-the.link',
        },
        {
          name: 'todo-bot.xyz',
          value: 'm.todo-bot.xyz',
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
    permLevel: 'USER',
  },
  help: {
    category: 'Utility',
    description: raw.description,
  },
  // eslint-disable-next-line consistent-return
  run: async (client: MyClient, interaction: Interaction) => {
    const lang = 'en'
    let domain = 'm.stlf.me'
    if (!interaction.data.options) return interaction.errorDisplay(messages.nolinkgiven[lang])
    const { data } = interaction
    const urlToShort = data.options[0].value
    if (data.options[1] && data.options[1].name === 'domain') domain = data.options[1].value

    let response
    try {
      response = await http.post(`https://${domain}/shorten`, JSON.stringify({ urlToShort }))
    } catch (e) {
      if (e.toString().includes('Not Acceptable'))
        return interaction.errorDisplay(messages.notacceptablelink[lang])
      if (e.toString().includes('Too Many Requests'))
        return interaction.errorDisplay(messages.toomanyrequests[lang])
      client.logger.debug(e)
    }

    if (!response) return interaction.errorDisplay(messages.backendoffline[lang])
    if (response && response.status && response.status >= 500)
      return interaction.errorDisplay(messages.backendoffline[lang])
    const url = response.url ? response.url.replace('http', 'https') : messages.somethingwentwrong[lang]
    interaction.reply(' ')
    const embedToSend = client.embed.success(
      `${messages.shortenedurl[lang]}\n*Original*\n> ${urlToShort}\n\n> ${url}`,
    )
    embedToSend.setThumbnail(client.user.avatarURL())
    // cdn.discordapp.com/avatars/ user.id + user.avatar + .png
    embedToSend.setFooter(
      `Requested by ${interaction.member.user.username}#${interaction.member.user.discriminator}   •    www.todo-bot.xyz`,
      `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.png`,
    )
    interaction.channel.send(embedToSend)
  },
}
