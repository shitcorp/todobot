const mongoose = require('mongoose');

    function dbinit (client) {

        mongoose.connect("mongodb://localhost/todobotconf", { useNewUrlParser: true, useUnifiedTopology: true });

        const db = mongoose.connection;
        
        db.on("error", console.error.bind(console, "(!) Mongo DB Connection error:"))
    
        db.once("open", function() {
            client.logger.mongo("Database connection was established.")
        })
    }

    module.exports = { dbinit };