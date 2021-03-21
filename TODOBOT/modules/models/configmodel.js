const { Schema, model} = require('mongoose');

const configschema = new Schema({
    _id: String,
    prefix: String,
    color: String,
    todochannel: String,
    readonlychannel: String,
    userroles: Array,
    staffroles: Array,
    tags: Map,
    blacklist_channels: Array,
    blacklist_users: Array,
    vars: Map,
    lang: String
})

exports.configmodel = new model("todoconfig", configschema)