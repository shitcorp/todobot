const mongoose = require('mongoose');
const { configmodel } = require('./models/configmodel')


    function dbinit (client) {

        mongoose.connect("mongodb://localhost/todobotconf", { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        
        db.on("error", console.error.bind(console, "(!) Mongo DB Connection error:"))
    
        db.once("open", function() {
            client.logger.mongo("Database connection was established.")
        })
    }


    function configset (obj) {
        let newconf = new configmodel(obj)

        newconf.save(function(err, doc) {
            if (err) {
                client.logger.debug(err)
            }

        }) 
    }

module.exports = { dbinit, configset };