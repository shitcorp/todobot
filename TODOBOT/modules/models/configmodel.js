const mongoose = require('mongoose');
const configschema = new mongoose.Schema({
    _id: String,
    prefix: String,
    todochannel: String,
    staffroles: Array,
    categories: Array,
    tags: Map
})

const configmodel = new mongoose.model("todoconfig", configschema)

module.exports = { configmodel };