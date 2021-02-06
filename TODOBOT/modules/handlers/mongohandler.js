const mongoose = require('mongoose'),
{ MONGO_CONNECTION } = require('../../config'),
{ configmodel } = require('../models/configmodel'),
{ todomodel } = require('../models/todomodel'),
{ remindermodel } = require('../models/remindermodel'),
{ promisify } = require("util");


module.exports = (client) => {

    const getAsync = promisify(client.cache.get).bind(client.cache)

    client.dbinit = async () => {
        mongoose.connect(MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        
        db.on("error", console.error.bind(console, "(!) Mongo DB Connection error:"))
    
        db.once("open", async () => {
            client.logger.mongo("Database connection was established.")
            await client.guilds.cache.forEach(async guild => {
                const _id = guild.id
                const inCache = await getAsync(_id)    
                if (inCache === null) {
                    // pull config from db and set to cache
                    configmodel.findOne({ _id }, (err, doc) => {
                        if (err) return;
                        if (typeof doc === "object") {
                            client.cache.set(_id, JSON.stringify(doc), (err) => {
                                if (err) client.logger.debug(err)
                            })
                        }
                    })
                } else {
                    // delete from cache and pull from db then set to cache
                    client.cache.del(_id, (err) => {
                        err ? client.logger.debug(err) :
                            configmodel.findOne({ _id }, (err, doc) => {    
                                if (err) console.log(err)
                                if (typeof doc === "object") {
                                    client.cache.set(_id, JSON.stringify(doc), (err) => {
                                        if (err) client.logger.debug(err)
                                    })
                                }
                            })
                    })
                }


                //console.log("inCache:", inCache)
                
            })
        });
    };

    /**
     * Setconfig 
     * @param {Object} configobj Configobject
     * Takes in the config object and sets it
     * to the db.
     * 
     * Invalidates cached version of configobj
     * when called
     */

    client.setconfig = (configobj) => {
        
        const newconf = new configmodel(configobj)
        const cache = getAsync(configobj._id)

        if (cache !== null) {
            client.cache.del(configobj._id, (err) => {
                if (!err) {
                    client.cache.set(configobj._id, JSON.stringify(configobj), (err) => {
                        if (err) client.logger.debug(err)
                    })
                }
            })
        }


        return newconf.save(function(err, doc) {
            if (err) {
                client.logger.debug(err)
                return err;
            }

        }) 
    };


    /**
     * 
     * @param {String} _id Guildid
     * 
     * Gets and returns the guildconfig
     * by id. It checks the redis cache
     * first before querying mongodb.
     */
    
    client.getconfig = async (_id) => {
        
        const cache = await getAsync(_id)
        
        if (cache !== null) {
            return JSON.parse(cache) 
        } else {
            let docs = await configmodel.findOne({ _id });
            if (docs) {
                client.cache.set(_id, JSON.stringify(docs))
                return docs;
            }
        }

    };


    /**
     * 
     * @param {String} _id 
     * @param {Object} configobj 
     */

    client.updateconfig = async (_id, configobj) => {
        configmodel.updateOne({ _id }, configobj, (err, affected, resp) => {
            if (err) client.logger.debug(err)
            client.invalidateCache(_id)
        })
    };


    client.getguildtodos = (guildid) => {
        return todomodel.find({guildid}), (err, doc) => {
            if (err) return client.logger.debug(err)
            return doc;
        }
    };

    client.querytodos = (queryobj) => {
        
        return todomodel.find({queryobj} , (err, docs) => {
            if (err) return client.logger.debug(err)
            return docs;
        })
    };

    client.getusertodos = (user) => {
        return todomodel.find({ submittedby: user }, (err, docs) => {
            if (err) return client.logger.debug(err)
            return docs;
        })
    };

    client.getprocessedtodos = async (user) => {
        return await todomodel.find({ assigned: user }, (err, docs) => {
            if (err) return client.logger.debug(err)
            return docs;
        })
    }

    client.getonetodo = (_id) => {
        return todomodel.findOne({ _id }, (err, doc) => {
            if (err) return client.logger.debug(err)
            return doc;
        })
    };

    /**
     * 
     * @param {String} todomsg todomsg(id)
     * @param {String} guildid guildid(id)
     * 
     * returns the todo by message id and channel
     */
    client.gettodobymsg = (todomsg, guildid) => {
        return todomodel.findOne({ todomsg, guildid })
    };


    client.updatetodo = (_id, todoobj) => {
        return configmodel.updateOne({ _id }, todoobj, (err) => {
            if (err) client.logger.debug(err)
        })
    }


    client.settodo = (todoobj) => {
        let newtodo = new todomodel(todoobj);
        return newtodo.save((err, doc) => {
            if (err) client.logger.debug(err)
        })
    };

    client.setreminder = (reminderobj) => {
        let newreminder = new remindermodel(reminderobj);
        return newreminder.save((err, doc) => {
            if (err) client.logger.debug(err)
        })
    };

    client.getreminderbyuser = (user) => {
        return remindermodel.find({ user }, (err, docs) => {
            if (err) client.logger.debug(err)
            return docs;
        })
    };


};