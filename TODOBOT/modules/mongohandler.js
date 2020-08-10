const mongoose = require('mongoose');
const { configmodel } = require('./models/configmodel');
const { todomodel } = require('./models/todomodel');


    function dbinit (client) {

        mongoose.connect("mongodb://localhost/todobotconf", { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        
        db.on("error", console.error.bind(console, "(!) Mongo DB Connection error:"))
    
        db.once("open", function() {
            client.logger.mongo("Database connection was established.")
        })
    }


    function setconfig (obj) {
        let newconf = new configmodel(obj)

        newconf.save(function(err, doc) {
            if (err) {
                client.logger.debug(err)
            }

        }) 
    }

    function getconfig (_id) {
        return configmodel.findOne({ _id }, (err, doc) => {
            if (err) return console.error(err)
            return doc;
        })
    }

    function getguildtodos (guildid) {
        return todomodel.find(), (err, doc) => {
            if (err) return console.error(err);
            return doc;
        }
    }

    function getonetodo (_id) {
        return todomodel.findOne({ _id }, (err, doc) => {
            if (err) return console.error(err);
            return doc;
        })
    }

    



module.exports = { dbinit, setconfig, getconfig, getguildtodos, getonetodo };