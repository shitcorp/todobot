const mongoose = require('mongoose'),
{ MONGO_CONNECTION } = require('../config'),
{ configmodel } = require('./models/configmodel'),
{ todomodel } = require('./models/todomodel'),
{ remindermodel } = require('./models/remindermodel');



    exports.dbinit = (client) => {

        mongoose.connect("mongodb://localhost/todobotconf", { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        
        db.on("error", console.error.bind(console, "(!) Mongo DB Connection error:"))
    
        db.once("open", function() {
            client.logger.mongo("Database connection was established.")
        })
    };


    exports.setconfig = (obj) => {
        let newconf = new configmodel(obj)

        return newconf.save(function(err, doc) {
            if (err) {
                client.logger.debug(err)
            }

        }) 
    };

    exports.getconfig = (_id) => {
        return configmodel.findOne({ _id }, (err, doc) => {
            if (err) return console.error(err)
            return doc;
        })
    };

    exports.getguildtodos = (guildid) => {
        return todomodel.find({guildid}), (err, doc) => {
            if (err) return console.error(err);
            return doc;
        }
    };

    exports.getusertodos = (user) => {
        return todomodel.find({ assigned: user }, (err, docs) => {
            if (err) return console.error(err)
            return docs;
        })
    };

    exports.getonetodo = (_id) => {
        return todomodel.findOne({ _id }, (err, doc) => {
            if (err) return console.error(err);
            return doc;
        })
    };

    exports.settodo = (todoobj) => {
        let newtodo = new todomodel(todoobj);
        return newtodo.save((err, doc) => {
            if (err) console.error(err);
        })
    };

    exports.setreminder = (reminderobj) => {
        let newreminder = new remindermodel(reminderobj);
        return newreminder.save((err, doc) => {
            if (err) console.error(err)
        })
    };

    exports.getreminderbyuser = (user) => {
        return remindermodel.find({ user }, (err, docs) => {
            if (err) console.error(err)
            return docs;
        })
    };