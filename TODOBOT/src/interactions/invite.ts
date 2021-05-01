import MyClient from '../classes/client'
import Interaction from '../classes/interaction'

const messages = require('../localization/messages')

const raw = {
    name: 'invite',
    description: 'Invite the bot to your server.',
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
        category: 'Utility',
        description: raw.description,
    },
    run: async (client: MyClient, interaction: Interaction) =>
        interaction.embed.default(
            messages.invitemessage[
                interaction.conf ? (interaction.conf.lang ? interaction.conf.lang : 'en') : 'en'
            ],
        ),
}
