const { Schema, model} = require('mongoose');

const reminderschema = new Schema({
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

exports.remindermodel = new model("reminders", reminderschema)