/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-case-declarations */
/* eslint-disable no-nested-ternary */
import { formatDistanceToNow } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import Pagination from 'discord-paginationembed'
import MyClient from '../classes/Client'
import Interaction from '../classes/Interaction'

import messages from '../localization/messages'
import Remindermodel from '../modules/models/remindermodel'

const systime = Date.now()

const raw = {
    name: 'reminder',
    description: 'Create, edit and view reminders',
    options: [
        {
            name: 'create',
            description: 'Create a new reminder.',
            type: 1,
            options: [
                {
                    name: 'time',
                    description: 'After this timespan you will be reminded.',
                    // type 4 = integer
                    type: 4,
                    required: true,
                },
                {
                    name: 'unit',
                    description: 'Minutes? Hours? Seconds? Choose now.',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'hours',
                            value: 'h',
                        },
                        {
                            name: 'minutes',
                            value: 'm',
                        },
                        {
                            name: 'days',
                            value: 'd',
                        },
                    ],
                },
                {
                    name: 'content',
                    description: 'Reminder Text that will be shown when the reminder expires.',
                    type: 3,
                    required: true,
                },
                {
                    name: 'participants',
                    description: 'Choose another user or users that should also be reminded.',
                    type: 6,
                    required: false,
                },
                {
                    name: 'participatingRoles',
                    description: 'Choose a role that should be reminded.',
                    type: 8,
                    required: false,
                },
            ],
        },
        {
            name: 'view',
            description: 'View your reminder(s).',
            type: 1,
        },
    ],
}

const newviewer = async (client, interaction, arr) => {
    // in order for discord to show the interaction we have to reply
    // with something. even a space will do :D its just to acknowledge
    // the interaction/slash command, so the user gets instant feedback

    const FieldsEmbed = new Pagination.FieldsEmbed()
        .setArray(arr)
        .setAuthorizedUsers([interaction.member.user.id])
        .setChannel(
            await client.guilds.cache.get(interaction.guild_id).channels.fetch(interaction.channel_id),
        )
        .setElementsPerPage(1)
        // Initial page on deploy
        .setPage(1)
        .setPageIndicator(true)
        .formatField(
            'Created',
            (i: Record<any, any>) => `\`\`\`${formatDistanceToNow(Number(i.systime))} ago.\`\`\``,
            false,
        )
        .formatField(
            'Expires',
            (i: Record<any, any>) => `\`\`\`in ${formatDistanceToNow(Number(i.expires))}.\`\`\``,
            false,
        )
        .formatField('Content', (i: Record<any, any>) => `> ${i.content}`, false)
        // Deletes the embed upon awaiting timeout
        .setDeleteOnTimeout(true)
        // Disable built-in navigation emojis, in this case: 🗑 (Delete Embed)
        // .setDisabledNavigationEmojis(['delete'])
        .setFunctionEmojis({
            '✏️': async (user, i) => {
                // @ts-expect-error
                // edit the remider on the current page
                const filter = (m) => m.author.id === message.author.id
                // @ts-expect-error
                message.channel
                    .send(
                        client.embed(`
                Enter the new text for your reminder now:
                `),
                    )
                    .then(() => {
                        // @ts-expect-error
                        if (message.deletable) message.delete({ timeout })
                        // @ts-expect-error
                        message.channel
                            .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
                            .then((collected) => {
                                if (collected.first().deletable) collected.first().delete()
                                Remindermodel.updateOne(
                                    { _id: arr[i.page - 1]._id },
                                    { content: collected.first().content },
                                    null,
                                    (err) => {
                                        if (err) client.logger.debug(err)
                                        interaction.replyWithMessageAndDeleteAfterAWhile(
                                            client.success(messages.updatedreminder.en),
                                        )
                                    },
                                )
                            })
                            .catch((collected) => {
                                // Delete message here
                                client.logger.debug(collected)
                            })
                    })
            },
            '❌': async (user, i) => {
                // Delete the reminder on the current page
                Remindermodel.deleteOne({ _id: arr[i.page - 1]._id }, null, (err) => {
                    if (err) client.logger.debug(err)
                    interaction.replyWithMessageAndDeleteAfterAWhile(
                        client.success(messages.deletedreminder.en),
                    )
                })
            },
        })
        // Sets whether function emojis should be deployed after navigation emojis
        .setEmojisFunctionAfterNavigation(false)

    FieldsEmbed.embed.setColor('BLUE').setFooter(`Manual:
✏️          Edit the reminder
❌          Delete the reminder
🗑️          Destroy this embed`)
    await FieldsEmbed.build()
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

    run: async (client: MyClient, interaction: Interaction) => {
        if (!interaction.data.options) return
        const { conf } = interaction
        const lang = conf ? (conf.lang ? conf.lang : 'en') : 'en'
        if (!conf) return interaction.errorDisplay(messages.addbottoguild[lang])
        let action
        let commandopts
        for (let index = 0; index < interaction.data.options.length; index += 1) {
            if (interaction.data.options[index].type === 1) action = interaction.data.options[index].name
            if (interaction.data.options[index].type === 1 && interaction.data.options[index].options)
                commandopts = interaction.data.options[index].options
        }
        if (!action) return
        // eslint-disable-next-line default-case
        switch (action) {
            case 'view':
                // query db for reminders by user and push them
                // to the cache array to hand over to the paginator
                // function
                const cache = []
                // eslint-disable-next-line no-restricted-syntax
                for await (const doc of await Remindermodel.find({ user: interaction.member.user.id }))
                    cache.push(doc)
                // Make sure theres something in the array for
                // the embed paginator, else return an error
                cache.length > 0
                    ? newviewer(client, interaction, cache)
                    : interaction.errorDisplay(messages.noopenreminders[lang])
                break
            case 'create':
                let time
                let unit
                let content
                let participants
                let participatingroles
                for (let i = 0; i < commandopts.length; i += 1) {
                    if (commandopts[i].name === 'time') time = commandopts[i].value
                    if (commandopts[i].name === 'unit') unit = commandopts[i].value
                    if (commandopts[i].name === 'content') content = commandopts[i].value
                    if (commandopts[i].name === 'participants') participants = commandopts[i].value
                    if (commandopts[i].name === 'participatingroles')
                        participatingroles = commandopts[i].value
                }
                let expires
                // eslint-disable-next-line default-case
                switch (unit) {
                    case 'm':
                        expires = systime + time * 60000
                        break
                    case 'h':
                        expires = systime + time * 3600000
                        break
                    case 'd':
                        expires = systime + time * 86400000
                        break
                }
                if (content.length > 400) return interaction.errorDisplay(messages.contenttoolarge[lang])
                const ID = uuidv4()
                const rem = {
                    _id: ID,
                    user: interaction.member.user.id,
                    systime,
                    expires,
                    content,
                    guild: {
                        id: interaction.guild_id,
                        channel: interaction.channel_id,
                    },
                    mentions: {
                        users: null,
                        roles: null,
                    },
                    loop: false,
                }
                if (participants) {
                    rem.mentions.users = participants
                } else delete rem.mentions.users
                if (participatingroles) {
                    rem.mentions.roles = participatingroles
                } else delete rem.mentions.roles
                const newreminder = new Remindermodel(rem)
                newreminder.save((err) => {
                    err
                        ? client.logger.debug(err)
                        : interaction.replyWithMessageAndDeleteAfterAWhile(
                              client.embed.success(messages.remindercreated[lang]),
                          )
                })
                break
        }
    },
}
