const mongoose = require('mongoose');

const bugschema = new mongoose.Schema({
    _id: String,
    author: String,
    systime: String,
    severity: String,
    attachements: String,
    assigned: Array,
    bugtitle: String,
    recreation: String,
    bugmsg: String
})

module.exports = new mongoose.model('bugs', bugschema)