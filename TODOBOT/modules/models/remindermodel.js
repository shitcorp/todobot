const mongoose = require('mongoose');
const reminderschema = new mongoose.Schema({
    _id: String,
    user: String,
    guild: String,
    channel: String,
    content: String
})

const remindermodel = new mongoose.model("todoconfig", reminderschema)

module.exports = { remindermodel };