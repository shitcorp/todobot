const mongoose = require('mongoose');

const configschema = new mongoose.Schema({
    _id: String,
    prefix: String,
    color: String,
    todochannel: String,
    suggestchannel: String,
    approvedchannel: String,
    bugchannel: String,
    suggestion_vote_timeout_max: Number,
    suggestion_vote_minimum_amount: Number,
    suggestion_comments_enabled: Boolean,
    suggestion_edits_enabled: Boolean,
    staffroles: Array,
    categories: Array,
    tags: Map
})

exports.configmodel = new mongoose.model("todoconfig", configschema)