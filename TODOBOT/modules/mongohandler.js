const mongoose = require('mongoose'),
{ MONGO_CONNECTION } = require('../config'),
{ configmodel } = require('./models/configmodel'),
{ todomodel } = require('./models/todomodel'),
{ remindermodel } = require('./models/remindermodel');

module.exports = (client) => {
    
    client.dbinit = async () => {
        mongoose.connect(MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        
        db.on("error", console.error.bind(console, "(!) Mongo DB Connection error:"))
    
        db.once("open", function() {
            client.logger.mongo("Database connection was established.")
        })
    };


    client.setconfig = (configobj) => {
        let newconf = new configmodel(configobj)
        return newconf.save(function(err, doc) {
            if (err) {
                client.logger.debug(err)
                return err;
            }

        }) 
    };



    client.getconfig = (_id) => {
        return configmodel.findOne({ _id }, (err, doc) => {
            if (err) return console.error(err)
            return doc;
        })
    };

    client.getguildtodos = (guildid) => {
        return todomodel.find({guildid}), (err, doc) => {
            if (err) return console.error(err);
            return doc;
        }
    };

    client.getusertodos = (user) => {
        return todomodel.find({ assigned: user }, (err, docs) => {
            if (err) return console.error(err)
            return docs;
        })
    };

    client.getonetodo = (_id) => {
        return todomodel.findOne({ _id }, (err, doc) => {
            if (err) return console.error(err);
            return doc;
        })
    };

    client.settodo = (todoobj) => {
        let newtodo = new todomodel(todoobj);
        return newtodo.save((err, doc) => {
            if (err) console.error(err);
        })
    };

    client.setreminder = (reminderobj) => {
        let newreminder = new remindermodel(reminderobj);
        return newreminder.save((err, doc) => {
            if (err) console.error(err)
        })
    };

    client.getreminderbyuser = (user) => {
        return remindermodel.find({ user }, (err, docs) => {
            if (err) console.error(err)
            return docs;
        })
    };


};