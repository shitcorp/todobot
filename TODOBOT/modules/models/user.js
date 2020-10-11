const mongoose = require('mongoose');
const userschema = new mongoose.Schema({
    _id: String,
    color: String
});

module.exports = new mongoose.model('users', userschema)