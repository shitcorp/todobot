const mongoose = require('mongoose');
const suggestionschema = new mongoose.Schema({
    _id: String,
    guildId: String,
    suggestion: String,
    author: String,
    time: { type: Date, default: Date.now },
    systemtime: String,
    approved: Boolean,
    expires: String,
    upvotes: Number,
    downvotes: Number,
    msgid: String,
    apprmsgid: String,
    comments: Array,
    deletedcomments: Array
})

module.exports = new mongoose.model('suggestions', suggestionschema)