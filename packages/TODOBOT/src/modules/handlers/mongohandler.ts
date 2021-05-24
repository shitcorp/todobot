/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-shadow */
import mongoose from 'mongoose'
import configmodel from '../models/configmodel'

const { MONGO_CONNECTION } = process.env

export default (client) => {
    client.decorate('dbinit', async () => {
        mongoose.connect(MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = mongoose.connection
        db.on('error', (error) => {
            client.logger.debug(error)
        })
        db.once('open', async () => {
            client.logger.mongo('Database connection was established.')
            await client.guilds.cache.forEach(async (guild) => {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const _id = guild.id
                const inCache = await client.getAsync(_id)
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
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        if (!err)
                            configmodel.findOne({ _id }, (err, doc) => {
                                if (!err) client.cache.set(_id, JSON.stringify(doc))
                            })
                    })
                }
            })
        })
    })
}
