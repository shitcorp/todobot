const mongoose = require('mongoose');

const reminderschema = new mongoose.Schema({
    _id: String,
    user: String,
    systime: String,
    expires: String,
    guild: {
        id: String,
        channel: String
    },
    content: String
})

exports.remindermodel = new mongoose.model("reminders", reminderschema)