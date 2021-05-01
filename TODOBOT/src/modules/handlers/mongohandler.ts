/* eslint-disable no-shadow */
import mongoose from 'mongoose'
import { promisify } from 'util'
import configmodel from '../models/configmodel'
import todomodel from '../models/todomodel'
import remindermodel from '../models/remindermodel'

const { MONGO_CONNECTION } = process.env

export default (client) => {
    const getAsync = promisify(client.cache.get).bind(client.cache)

    client.decorate('dbinit', async () => {
        mongoose.connect(MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = mongoose.connection
        db.on('error', (error) => {
            client.logger.debug(error)
        })
        db.once('open', async () => {
            client.logger.mongo('Database connection was established.')
            await client.guilds.cache.forEach(async (guild) => {
                const _id = guild.id
                const inCache = await getAsync(_id)
                if (inCache === null) {
                    // pull config from db and set to cache
                    configmodel.findOne({ _id }, (err, doc) => {
                        if (err) throw new Error(err)
                        if (typeof doc === 'object') {
                            client.cache.set(_id, JSON.stringify(doc), (err) => {
                                if (err) throw new Error(err)
                            })
                        }
                    })
                } else {
                    // delete from cache and pull from db then set to cache
                    client.cache.del(_id, (err) => {
                        // eslint-disable-next-line no-unused-expressions
                        err
                            ? new Error(err)
                            : configmodel.findOne({ _id }, (err, doc) => {
                                  if (err) throw new Error(err)
                                  if (typeof doc === 'object') {
                                      client.cache.set(_id, JSON.stringify(doc), (err) => {
                                          if (err) throw new Error(err)
                                      })
                                  }
                              })
                    })
                }
            })
        })
    })

    /**
     * Setconfig
     * @param {Object} configobj Configobject
     * Takes in the config object and sets it
     * to the db.
     *
     * Invalidates cached version of configobj
     * when called
     */

    client.decorate('setconfig', async (configobj) => {
        // eslint-disable-next-line new-cap
        const newconf = new configmodel(configobj)
        const cache = await getAsync(configobj._id)

        if (cache !== null) {
            client.cache.del(configobj._id, (err) => {
                if (!err) {
                    // eslint-disable-next-line no-shadow
                    client.cache.set(configobj._id, JSON.stringify(configobj), (err) => {
                        if (err) throw new Error(err)
                    })
                }
            })
        }
        return newconf.save()
    })

    /**
     *
     * @param {String} _id Guildid
     *
     * Gets and returns the guildconfig
     * by id. It checks the redis cache
     * first before querying mongodb.
     */

    // eslint-disable-next-line consistent-return
    client.decorate('getconfig', async (_id) => {
        const cache = await getAsync(_id)
        if (cache) return JSON.parse(cache)
        const docs = await configmodel.findOne({ _id })
        if (docs) {
            client.cache.set(_id, JSON.stringify(docs))
            return docs
        }
    })

    /**
     *
     * @param {String} _id
     * @param {Object} configobj
     */

    client.decorate('updateconfig', async (_id: string, configobj) => {
        configmodel.updateOne({ _id }, configobj, null, (err) => {
            if (err) client.logger.debug(err)
            client.invalidateCache(_id)
        })
    })

    client.decorate('getguildtodos', async (guildid) => todomodel.find({ guildid }))

    client.decorate('querytodos', (queryobj) => todomodel.find({ queryobj }))

    client.decorate('getusertodos', (user) => todomodel.find({ submittedby: user }))

    client.decorate('getprocessedtodos', (user) => todomodel.find({ assigned: user }))

    client.decorate('getonetodo', (_id) => todomodel.findOne({ _id }))

    /**
     *
     * @param {String} todomsg todomsg(id)
     * @param {String} guildid guildid(id)
     *
     * returns the todo by message id and channel
     */

    client.decorate('gettodobymsg', (todomsg, guildid) => todomodel.findOne({ todomsg, guildid }))

    client.decorate('updatetodo', (_id, todoobj) => todomodel.updateOne({ _id }, todoobj))

    client.decorate('settodo', (todoobj) => {
        // eslint-disable-next-line new-cap
        const newtodo = new todomodel(todoobj)
        return newtodo.save((err) => {
            if (err) client.logger.debug(err)
        })
    })

    client.decorate('setreminder', (reminderobj) => {
        // eslint-disable-next-line new-cap
        const newreminder = new remindermodel(reminderobj)
        return newreminder.save((err) => {
            if (err) client.logger.debug(err)
        })
    })

    client.decorate('getreminderbyuser', (user) => remindermodel.find({ user }))
}
