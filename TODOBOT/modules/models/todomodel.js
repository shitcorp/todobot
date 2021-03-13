const mongoose = require('mongoose');

const todoschema = new mongoose.Schema({
    _id: String,
    guildid: String,
    title: String,
    content: String,
    tasks: Array,
    attachlink: String,
    submittedby: String,
    timestamp: String,
    state: String,
    severity: Number,
    loop: Boolean,
    todomsg: String,
    todochannel: String,
    assigned: Array,
    category: String
});

exports.todomodel = new mongoose.model("todos_dev", todoschema)