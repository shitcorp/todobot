import MyClient from '../classes/client'
import Interaction from '../classes/interaction'

import { MessageEmbed } from 'discord.js-light'

const raw = {
    name: 'vote',
    description: 'If you like the bot vote for it!',
}

export default {
    raw,
    id: '',
    name: raw.name,
    conf: {
        enabled: true,
        premium: false,
        production: true,
        // USER - BOT_USER - STAFF
        permLevel: 'USER',
    },
    help: {
        category: 'Utility',
        description: raw.description,
    },
    run: async (client: MyClient, interaction: Interaction) => {
        const voteEmbed = new MessageEmbed()
            .setAuthor('Vote Links')
            .setColor('BLUE')
            .setThumbnail(client.user.avatarURL())
            .addField(
                '\u200b',
                `
            > **•** [Top.gg](https://top.gg/bot/709541772295929909/vote)
            > **•** [Space List](https://discordlist.space/bot/709541772295929909)
            > **•** [Discord Bots](https://discord.bots.gg/bots/709541772295929909)
            > **•** [Discord Boats](https://discord.boats/bot/709541772295929909)
            > **•** [Discord Botlist](https://discordbotlist.com/bots/todo-bot)
            > **•** [Thereisabotforthat.com](https://thereisabotforthat.com/bots/todobot2)

            `,
            )
            .setFooter(`By voting on top.gg you give yourself access to premium features for 24 hrs.`)

        interaction.replyWithMessageAndDeleteAfterAWhile(voteEmbed)
    },
}
