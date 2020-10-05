const mongoose = require('mongoose'),
    Config = require('./models/config'),
    Todo = require('./models/todo'),
    Reminder = require('./models/reminder'),
    getAsync = require('promisify')(client.cache.get).bind(client.cache);

module.exports = (client) => ({
    ...client,
    initDatabase: async () => {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = mongoose.connection;
        db.on('error', (err) => client.logger.error(`(!) Mongo DB Connection error: ${err}`));
        db.once('open', async () => {
            client.logger.mongo('Database connection was established.');
            await client.guilds.cache.forEach(async guild => {
                const inCache = await getAsync(guild.id); 
                if (inCache === null) 
                    configmodel.findOne({ _id: guild.id }, (err, doc) => {
                        if (err) return;
                        if (typeof doc === 'object') 
                            client.cache.set(guild.id, JSON.stringify(doc), (err) => {
                                if (err) client.logger.debug(err);
                            })
                    })
                else 
                    client.cache.del(guild.id, (err) => {
                        if(err) client.logger.debug(err);
                        else
                            configmodel.findOne({ _id: guild.id }, (err, doc) => {    
                                if (err) console.log(err);
                                if (typeof doc === 'object') {
                                    client.cache.set(guild.id, JSON.stringify(doc), (err) => {
                                        if (err) client.logger.debug(err);
                                    })
                                }
                            })
                    })
            })
        });
    },
    setConfig: async (config) => {
        const newConfig = new Config(config);
        const cache = await getAsync(config.guildId);

        if (cache !== null)
            client.cache.del(config.guildId, (err) => !err && 
                client.cache.set(config.guildId, JSON.stringify(config), (err) => err && client.logger.debug(err)))

        return newConfig.save((err) => err && client.logger.debug(err)) 
    },
    getConfig: async (id) => {
        const cache = await getAsync(id)
        if (cache)
            return JSON.parse(cache) 
        else 
            await Config.findOne({ _id: id })
    },
    updateConfig: async (id, config) =>
        Config.updateOne({ _id: id }, config, (err) => {
            if (err) client.logger.debug(err);
            client.invalidateCache(id);
        }),
    getGuildTodos: async (guildId) => await Todo.find({ guildId }),
    queryTodos: (query) => await Todo.find({ ...query }),
    getUserTodos: (user) => await Todo.find({ submittedby: user }),
    getProcessedTodos: (user) => await Todo.find({ assigned: user }),
    getTodo: (id) => await Todo.findOne({ _id: id }),
    getTodoByMsg: (todoMsg, guildId) => await Todo.findOne({ todoMsg, guildId }),
    updateTodo: (id, todo) => await Config.updateOne({ _id: id }, todo),
    setTodo: (todo) => await new Todo(todo).save(),
    setReminder: (reminder) => await new Reminder(reminder).save(),
    getReminderByUser: (user) => await Reminder.find({ user })
});
