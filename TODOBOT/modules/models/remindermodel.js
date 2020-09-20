const mongoose = require('mongoose');

const reminderschema = new mongoose.Schema({
    _id: String,
    user: String,
    systime: String,
    expires: String,
    content: String,
    loop: Boolean,
    guild: {
        id: String,
        channel: String
    },
    mentions: {
        users: Array,
        roles: Array
    }
})

exports.remindermodel = new mongoose.model("reminders", reminderschema)