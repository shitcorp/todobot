/* eslint-disable no-await-in-loop */
/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
import configmodel from '../models/configmodel'
import remindermodel from '../models/remindermodel'

const functions = {}

export default (client) => {
    client.decorate('loadCommand', (category, commandName) => {
        try {
            client.logger.log({
                module: 'COMMAND_LOADER',
                category: category.toUpperCase(),
                command: commandName,
            })
            // eslint-disable-next-line import/no-dynamic-require
            const props = require(`../../commands/${category}/${commandName}`)
            if (props.init && typeof props.init === 'function') {
                props.init(client)
            }
            props.help.category = category
            client.setCommand(props.help.name, props)
            props.conf.aliases.forEach((alias) => {
                client.setAlias(alias, props.help.name)
            })
            return false
        } catch (e) {
            return `Unable to load command ${commandName}: ${e}`
        }
    })

    client.decorate('discordlog', ({ error, event, guild, channel, message, command }) => {
        // DEBUG=false
        // DEBUG_GUILD=709541114633519177
        // DEBUG_CHANNEL=
        // DEBUG_LOG_CHANNEL=
        // DEBUG_URL_APM_SERVER=http://localhost:8200/

        if (!process.env.DEBUG || !process.env.DEBUG_GUILD || !process.env.DEBUG_CHANNEL) return
        if (process.env.DEBUG !== 'true') return

        client.guilds.cache
            .get(process.env.DEBUG_GUILD)
            .channels.cache.get(process.env.DEBUG_CHANNEL)
            .send(
                client.embed(`
          __**Error:**__ [${event || 'none given'}] 

          ${error} 
          > __**Guild:**__ 
          ${guild || 'none given'} 
          > __**Channel**__ 
          ${channel || 'none given'} 
          > __**Message:**__ 
          ${message || 'none given'} 
          > __**Command**__ 
          ${command || 'none given'} 
          > __**Time:**__ 
          ${Date.now().toLocaleString()}`),
            )
    })

    client.decorate('awaitreply', async (message, question, time = 60000) => {
        message.channel.send(question)
        const filter = (m) => m.author.id === message.author.id
        return message.channel.createMessageCollector(filter, { limit: 1, time })
    })

    /**
     *
     * @param {String} _id Guildid
     *
     * Invalideates the cached object
     * by id and pulls it back from the database
     *
     */

    client.decorate('invalidateCache', async (_id) => {
        client.cache.del(_id, (invalidateCacheError) => {
            // eslint-disable-next-line no-unused-expressions
            invalidateCacheError
                ? client.logger.debug(invalidateCacheError)
                : configmodel.findOne({ _id }, (invalidateCacheFindConfigError, doc) => {
                      invalidateCacheFindConfigError
                          ? client.logger.debug(invalidateCacheFindConfigError)
                          : client.cache.set(_id, JSON.stringify(doc))
                  })
        })
    })

    /**
     * Client.mapBuilder
     * @param {Object} obj
     * @returns {Map} map
     *
     * Takes in an object and returns a map.
     */
    client.decorate('mapBuilder', async (obj) => {
        const map = new Map()
        Object.keys(obj).forEach((key) => {
            map.set(key, obj[key])
        })
        return map
    })

    /**
     * Client.reminderjob
     *
     * Checks all reminders from the database
     * periodically and reminds the user(s)
     * when expired. If the reminder is a
     * repeating reminder, the reminder is
     * not deleted from the database, it will
     * be updated with the new expires timestamp
     */

    client.decorate('reminderjob', async () => {
        // eslint-disable-next-line no-unused-vars
        const reminderTrans = client.apm.startTransaction('ReminderJob', 'reminderhandler')
        const allRems = await remindermodel.find()
        const allRemLen = allRems.length
        for (let i = 0; i < allRemLen; i += 1) {
            const doc = allRemLen[i]
            if (doc.expires <= new Date()) {
                // mention the user that submitted the reminder
                let output = `${await client.users.fetch(doc.user)}`
                // if theres users to mention, iterate over the users mentions array and mention them as well
                if (doc.mentions.users.length > 0)
                    doc.mentions.users.forEach((user) => (output += `, ${client.users.fetch(user)}`))
                // if theres roles to mention, iterate ove the roles mentions array and mention them
                if (doc.mentions.roles.length > 0)
                    doc.mentions.roles.forEach((role) => (output += `, <@&${role}>`))
                // tryto get the guild where the reminder was created, then the channel, then send the reminder message in that channel
                try {
                    const chann = await client.guilds.cache
                        .get(doc.guild.id)
                        .channels.fetch(doc.guild.channel)
                    try {
                        await chann.send(output, client.reminder(doc))
                    } catch (channelError) {
                        // sending to channel went wrong, we should try to dm the user
                        try {
                            const submittingUser = await client.users.fetch(doc.user)
                            const dmchannel = await submittingUser.createDM(true)
                            await dmchannel.send(output, client.reminder(doc))
                        } catch (dmChannelError) {
                            client.logger.debug(dmChannelError)
                            remindermodel.deleteOne({ _id: doc._id }, null, (err) => {
                                if (err) client.logger.debug(err)
                            })
                            client.apm.endTransaction('fail_reminder_handled')
                        }
                    }
                    // if the message cant be sent, or the guild cant be fetched or theres some other
                    // error, we have to catch the error and delete the reminder(doc) from the database
                } catch (e) {
                    client.logger.debug(e)
                    remindermodel.deleteOne({ _id: doc._id }, null, (err) => {
                        if (err) client.logger.debug(err)
                    })
                    client.apm.endTransaction('fail_reminder_handled')
                }
                // if the reminderproperty "loop" is set to false delete the reminder
                doc.loop === false
                    ? remindermodel.deleteOne({ _id: doc._id }, null, (err) => {
                          if (err) client.logger.debug(err)
                      })
                    : // else update the reminder in the database with the new expires timestamp
                      remindermodel.updateOne(
                          { _id: doc.id },
                          { systime: new Date(), expires: doc.expires - doc.systime },
                          null,
                          // eslint-disable-next-line no-unused-vars
                          (err, resp) => {
                              if (err) client.logger.debug(err)
                          },
                      )
            }
        }
        client.apm.endTransaction('success_reminder_handled')
    })

    client.decorate('clearReactions', async (message, userID) => {
        try {
            const userReactions = message.reactions.cache.filter((reaction) =>
                reaction.users.cache.has(userID),
            )
            const reactionVals = userReactions.values()
            for (let i = 0; i < reactionVals.length; i += 1) {
                await reactionVals[i].users.remove(userID)
            }
        } catch (error) {
            client.logger.error(error)
            client.logger.debug('Failed to remove reactions.', error.toString())
        }
    })
}
