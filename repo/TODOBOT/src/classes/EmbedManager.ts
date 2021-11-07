/* eslint-disable class-methods-use-this */
import { MessageEmbed } from 'discord.js-light'
import { format } from 'date-fns'

export default class EmbedManager {
    client: any

    constructor(client) {
        this.client = client
    }

    noPerms(missingPermission: string) {
        return new MessageEmbed()
            .setAuthor('❌ No Permissions')
            .setDescription(
                `You lack the permission \`${missingPermission.toUpperCase()}\` to use this command!`,
            )
            .setColor('RED')
    }

    default(desc: string, obj?: any) {
        const embed = new MessageEmbed().setDescription(`${desc}`).setColor('BLUE')
        if (obj && obj.color) embed.setColor(obj.color)
        if (
            (obj && obj.img && obj.img.startsWith('https://cdn.discordapp.com/attachments/')) ||
            (obj && obj.img && obj.img.startsWith('https://img.todo-bot.xyz/'))
        )
            embed.setImage(obj.img)
        if (
            (obj && obj.thumb && obj.thumb.startsWith('https://cdn.discordapp.com/attachments/')) ||
            (obj && obj.thumb && obj.thumb.startsWith('https://img.todo-bot.xyz/'))
        )
            embed.setThumbnail(obj.thumb)
        return embed
    }

    coloredEmbed(desc: string, color: string) {
        return new MessageEmbed().setDescription(`${desc}`).setColor(color)
    }

    error(desc: string) {
        return new MessageEmbed()
            .setAuthor('❌ Error', this.client.user.avatarURL)
            .setDescription(`${desc}`)
            .setColor('RED')
    }

    warning(desc: string) {
        return new MessageEmbed().setAuthor(`⚠️ Warning`).setDescription(`${desc}`).setColor('#fffb0a')
    }

    success(desc: string) {
        return new MessageEmbed().setAuthor(`✅ Success!`).setDescription(`${desc}`).setColor('GREEN')
    }

    todo(todoobj, detailbool?: boolean) {
        const embed = new MessageEmbed().setAuthor(`${todoobj.title}`)

        const attacher = () => {
            if (
                todoobj.attachlink.startsWith('https://cdn.discordapp.com/attachments/') ||
                todoobj.attachlink.startsWith('https://img.todo-bot.xyz/')
            ) {
                embed.setImage(todoobj.attachlink)
            } else {
                embed.addField('Attachment**', `\`\`\`${todoobj.attachlink}\`\`\``)
            }
        }

        if (todoobj.tasks && todoobj.tasks.length > 0) {
            let output = ''
            let count = 0
            const tasks = []
            const progressBar = []

            for (let i = 0; i < todoobj.tasks.length; i += 1) {
                output = `${
                    todoobj.tasks[i].includes('finished_')
                        ? `<:checksquareregular:820384679562838046> ${todoobj.tasks[i].replace(
                              'finished_',
                              '',
                          )}`
                        : `<:squareregular:820381667881517118> ${todoobj.tasks[i]}`
                }`
                tasks.push(output)
                const EmojiMap = this.client.getUtil('emojiMap')
                if (todoobj.tasks[i].includes('finished_')) {
                    count += 1
                    progressBar.push(EmojiMap['+'])
                } else {
                    progressBar.push(EmojiMap['-'])
                }
            }
            embed.addField(`Tasks (${count} / ${todoobj.tasks.length}):`, `${progressBar.join('')}`)
            for (let j = 0; j < tasks.length; j += 1) embed.addField('\u200b', tasks[j])
        }

        if (todoobj.content)
            embed.addField(
                'Content',
                `> ${
                    todoobj.content.length >= 1024 ? `${todoobj.content.slice(0, 1020)}...` : todoobj.content
                }`,
            )
        if (todoobj.category) embed.addField('Category', todoobj.category, true)
        if (todoobj.attachlink) attacher()
        if (todoobj.assigned) {
            let output = ''
            if (todoobj.assigned !== []) {
                Object.keys(todoobj.assigned).forEach((key) => {
                    output += `<@${todoobj.assigned[key]}> \n`
                })
                if (output !== '' && todoobj.state === 'assigned') embed.addField('Assigned', output, true)
            }
        }

        const colorMap = {
            open: 'RED',
            assigned: 'YELLOW',
            closed: 'GREEN',
            detail: 'GREEN',
            readonly: 'GREEN',
        }

        embed.setColor(colorMap[todoobj.state])
        if (
            (todoobj.readonly !== '.' && todoobj.state === 'open') ||
            (todoobj.readonly !== '.' && todoobj.state === 'assigned')
        )
            embed.setFooter(`${todoobj._id}`)
        if (detailbool) {
            let output = ''

            if (todoobj.assigned !== []) {
                Object.keys(todoobj.assigned).forEach((key) => {
                    output += `<@${todoobj.assigned[key]}> \n`
                })
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                output !== '' ? embed.addField('Processed', output, true) : null
            }
            embed.addField('Submitted By', `<@${todoobj.submittedby}>`, true)
            embed.addField('Submitting Time', `> ${format(parseInt(todoobj.timestamp, 2), 'PPpp')}`, true)
            embed.addField('Severity', todoobj.severity, true)
            embed.addField('Loop', todoobj.loop, true)
            embed.addField('ID', `> ${todoobj._id}`, true)
        }

        if (todoobj.error && todoobj.error !== '') {
            embed.addField('Error', `\`\`\`${todoobj.error}\`\`\``)
            embed.setColor('RED')
        }
        return embed
    }

    reminder(reminderobj) {
        return new MessageEmbed()
            .setTitle(`⚠️  Your Reminder!  ⚠️`)
            .setDescription(
                `
            \`\`\`${reminderobj.content}\`\`\`
            `,
            )
            .setColor('YELLOW')
    }
}

/**
 *
client.
    client.
    client.

    client.
    // TODO: make a field for assigned users
    // TODO: put manual in footer (different manuals based on todos state!)
    client.;

    client. */
