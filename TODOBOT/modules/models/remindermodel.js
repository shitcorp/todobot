const mongoose = require('mongoose');
const reminderschema = new mongoose.Schema({
    _id: String,
    user: String,
    expires: String,
    guild: String,
    channel: String,
    content: String
})

const remindermodel = new mongoose.model("reminders", reminderschema)

module.exports = { remindermodel };