const mongoose = require('mongoose');
const userschema = new mongoose.Schema({
    _id: String,
    color: String
});

const usermodel = new mongoose.model("users", userschema)

module.exports = { usermodel };