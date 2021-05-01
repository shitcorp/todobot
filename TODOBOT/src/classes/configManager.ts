import Configmodel from '../modules/models/configmodel'

export default class ConfigManager {
    private _client: any

    constructor(client) {
        this._client = client
    }

    /**
     * set
     * @param {Object} configobj Configobject
     * Takes in the config object and sets it
     * to the db.
     *
     * Invalidates cached version of configobj
     * when called
     */
    async set(configobj) {
        const newconf = new Configmodel(configobj)
        const cache = await this._client.getAsync(configobj._id)
        if (cache !== null) {
            this._client.cache.del(configobj._id, (err) => {
                if (!err) {
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    this._client.cache.set(configobj._id, JSON.stringify(configobj), (err) => {
                        if (err) this._client.logger.debug(err)
                    })
                }
            })
        }
        return newconf.save()
    }

    async get(_id: string) {
        const cache = await this._client.getAsync(_id)
        if (cache) return JSON.parse(cache)
        const docs = await Configmodel.findOne({ _id })
        if (docs) this._client.cache.set(_id, JSON.stringify(docs))
        return docs
    }

    update(_id: string, configobj) {
        Configmodel.updateOne({ _id }, configobj, null, (err) => {
            if (err) this._client.logger.debug(err)
            this._client.invalidateCache(_id)
        })
    }
}
