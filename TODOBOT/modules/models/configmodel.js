const mongoose = require('mongoose');

const configschema = new mongoose.Schema({
    _id: String,
    prefix: String,
    color: String,
    todochannel: String,
    readonlychannel: String,
    staffroles: Array,
    tags: Map,
    blacklist_channels: Array,
    blacklist_users: Array,
    vars: Map,
    lang: String
})

exports.configmodel = new mongoose.model("todoconfig", configschema)