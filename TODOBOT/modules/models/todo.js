const mongoose = require('mongoose');

const todoschema = new mongoose.Schema({
    _id: String,
    guildId: String,
    title: String,
    content: String,
    attachlink: String,
    submittedby: String,
    timestamp: String,
    state: String,
    severity: Number,
    loop: Boolean,
    todomsg: String,
    assigned: Array,
    category: String
});
module.exports = new mongoose.model('todos_dev', todoschema)