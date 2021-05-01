/* eslint-disable consistent-return */
export default (client) =>
    client.decorate('taghandler', async (message, tag) => {
        if (!tag) return

        const conf = await client.getconfig(message.guild.id)

        const getJoinRank = (ID, guild) => {
            // Call it with the ID of the user and the guild
            if (!guild.member(ID)) return // It will return undefined if the ID is not valid

            const arr = guild.members.cache.array() // Create an array with every member
            arr.sort((a, b) => a.joinedAt - b.joinedAt) // Sort them by join date
            const len = arr.length
            if (len > 1000) return 1000
            for (let i = 0; i < len; i += 1) {
                // Loop though every element
                if (arr[i].id === ID) return i // When you find the user, return it's position
            }
        }

        const JOIN_POS = () => getJoinRank(message.author.id, message.guild)
        const MEMCOUNT = () => message.guild.memberCount
        // TODO: nullcheck!!!
        const PROCESSED = async () => (await client.getprocessedtodos(message.author.id)).length
        const SUBMITTED = () => client.getusertodos(message.author.id).length
        const MSG_AUTHOR = () => message.author
        const MSG_AUTHOR_ID = () => message.author.id
        const MSG_AUTHOR_TAG = () => message.author.tag
        const MSG_AUTHOR_NAME = () => message.author.username
        const GUILD_NAME = () => message.guild.name

        const PLACEHOLDERS = {
            '<JOIN_POS>': JOIN_POS,
            '<MEMCOUNT>': MEMCOUNT,
            '<PROCESSED>': PROCESSED,
            '<SUBMITTED>': SUBMITTED,
            '<MSG_AUTHOR>': MSG_AUTHOR,
            '<MSG_AUTHOR_ID>': MSG_AUTHOR_ID,
            '<MSG_AUTHOR_TAG>': MSG_AUTHOR_TAG,
            '<MSG_AUTHOR_NAME>': MSG_AUTHOR_NAME,
            '<GUILD_NAME>': GUILD_NAME,
        }

        /**
         *
         * @param {*} tag
         * turns the key of the placeholder into
         * a RegExp and replaces it with the value
         *
         */

        // eslint-disable-next-line @typescript-eslint/no-shadow
        const regexHandler = async (tag: any) => {
            if (tag.includes('<%')) {
                for (let i = 0; i < conf.vars.length; i += 1) {
                    const variable = conf.vars[i]
                    // eslint-disable-next-line no-param-reassign
                    tag = tag.replace(new RegExp(`<%${variable}%>`, 'gi'), decodeURI(conf.vars[variable]))
                }
            }
            Object.keys(PLACEHOLDERS).map(async ([key, value]) => {
                // eslint-disable-next-line no-param-reassign
                tag = tag.replace(new RegExp(value, 'gi'), await value[key]())
                return tag
            })
            return tag
        }

        const getValue = (text, Tag) => {
            const temp = text.split(' ')
            const startIndex = temp.indexOf(`<${Tag}>`)
            const endIndex = temp.indexOf(`</${Tag}>`)
            temp.splice(startIndex, 3)
            const newString = temp.join('')
            return {
                value: temp[(endIndex + startIndex) / 2].replace(' ', ''),
                string: newString,
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-shadow
        const embedhandler = async (tag) => {
            let cont = tag.replace('<EMBED>', '').replace('</EMBED>', '')
            const obj: Record<string | number, unknown> = {}

            if (tag.includes('<COLOR>')) {
                const returned = getValue(cont, 'COLOR')
                obj.color = returned.value
                cont = returned.string
            }
            if (tag.includes('<IMG>')) {
                const returned = getValue(cont, 'IMG')
                obj.img = returned.value
                cont = returned.string
            }
            if (tag.includes('<THUMB>')) {
                const returned = getValue(cont, 'THUMB')
                obj.thumb = returned.value
                cont = returned.string
            }
            const parsed = await regexHandler(cont)
            message.channel.send(client.embed(parsed, obj))
        }

        /**
         * Real taghandling happens down here.
         * Basically just seperate between the tags
         * that include <EMBED> or some other function
         * keywords that are no variables
         */
        if (tag.toUpperCase().includes('<EMBED>') || tag.toUpperCase().includes('</EMBED>')) {
            embedhandler(tag)
        } else {
            message.channel.send(await regexHandler(tag))
        }
    })
