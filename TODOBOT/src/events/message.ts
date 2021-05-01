/* eslint-disable consistent-return */
const cmdRecently = new Set()

export default async (client, message) => {
    const timeout = process.env.MSG_DELETE || 90000

    const messageTrans = client.apm.startTransaction('MessageEvent', 'eventhandler')
    client.apm.setUserContext({
        id: message.author.id,
        username: `${message.author.username}#${message.author.discriminator}`,
    })

    const cmdSpan = messageTrans.startSpan('cmd')

    if (message.author.bot) return
    if (message.channel.type === 'dm') return
    if (!message.guild) return

    const allowedFormats = ['.jpg', 'jpeg', '.png']
    // !message.content.includes('```') is to ignore code blocks
    if (
        message.content.includes('{{') &&
        message.content.includes('}}') &&
        !message.content.includes('```') &&
        message.attachments.size === 1 &&
        allowedFormats.includes(
            message.attachments
                .first()
                .url.substr(
                    message.attachments.first().url.length - 4,
                    message.attachments.first().url.length,
                ),
        )
    ) {
        // fixme
        const key = `${message.guild.id}${message.content.substr(
            message.content.indexOf('{{') + 2,
            message.content.indexOf('}}'),
        )}`
        // eslint-disable-next-line no-console
        console.log(key)
        // using guildid together with the img title so
        // later on we only have to search for guildid+img
        const success = client.cache.set(key, `${message.attachments.first().url}`, client.cache.print)
        client.cache.expire(key, 172800)
        // eslint-disable-next-line no-console
        if (success === true) await message.react('✅')
        client.apm.endTransaction('picture_upload_handled', Date.now())
    }

    let settings

    if (message.guild) settings = await client.getconfig(message.guild.id)

    const Prefix = settings.prefix || '//'

    // autopurge
    if (
        settings &&
        settings.autopurge === true &&
        settings.todomode &&
        settings.todomode !== 'advanced' &&
        message.channel.id === settings.todochannel
    ) {
        client.apm.endTransaction('message_deleted_event_handled', Date.now())
        return message.delete().catch((e) => client.logger.debug(e))
    }

    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`)
    if (message.content.match(prefixMention)) {
        return message.reply(client.embed(`My prefix on this guild is ${Prefix}`)).then((msg) => {
            msg.delete({ timeout }).catch((e) => client.logger.debug(e))
        })
    }

    if (message.content.indexOf(Prefix) !== 0) return

    const args = message.content.slice(Prefix.length).trim().split(/ +/g)

    const command = args.shift().toLowerCase()

    if (settings) {
        // Check for blacklisted users here
        if (settings.blacklist_users && Object.values(settings.blacklist_users).includes(message.author.id))
            return

        // Check if the message is in a blacklisted channel
        if (
            settings.blacklist_channels &&
            Object.values(settings.blacklist_channels).includes(message.channel.id)
        )
            return

        /**
         * Start Taghandler
         */
        const tags = await client.mapBuilder(settings.tags)
        if (tags.has(command)) client.taghandler(message, tags.get(command))

        /**
         *  End Taghandler
         */
    }

    if (message.guild && !message.member) await message.guild.fetchMember(message.author)

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))

    if (!cmd) return

    if (cmd && !message.guild && cmd.conf.guildOnly)
        return message.channel.send(
            client.warning(
                'This command is unavailable via private message. Please run this command in a guild.',
            ),
        )

    // eslint-disable-next-line no-param-reassign
    message.flags = []
    for (let k = 0; k < args.length; k += 1) {
        while (args[k].startsWith('-')) {
            message.flags.push(args.shift().slice(1))
        }
    }

    if (message.flags.includes('h') || message.flags.includes('help')) {
        const helpcmd = client.commands.get('help')
        const arg = [command]
        return helpcmd.run(client, message, arg)
    }

    // global cooldown here
    if (cmdRecently.has(message.author.id)) {
        message
            .reply(
                client.warning(
                    `Please wait  \`${client.cooldown / 1000}\`  seconds before doing this command again!`,
                ),
            )
            .then((msg) => {
                if (msg.deletable) msg.delete({ timeout })
            })
    } else {
        cmdRecently.add(message.author.id)
        setTimeout(() => {
            cmdRecently.delete(message.author.id)
        }, client.cooldown)

        client.logger.cmd(
            `[CMD] ${message.author.username} (ID: ${message.author.id}) ran the command '${cmd.help.name}', in the guild '${message.guild.name}' (ID: ${message.guild.id})`,
        )
        try {
            cmd.run(client, message, args, 1)
        } catch (e) {
            client.logger.debug(e)
        }
    }
    if (cmdSpan) cmdSpan.end()
    client.apm.endTransaction('message_event_handled', Date.now())
}
