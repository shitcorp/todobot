/**
 * IDEA: use thisfor server owners to let ppls ubmit bugs,
 * then implement issuetracker shadboard thingy
 * 
 *  Important: make it so only users with staff role
 *  can be assigned
 */


const mongoose = require('mongoose');

const bugschema = new mongoose.Schema({
    _id: String,
    author: String,
    systime: String,
    severity: String,
    attachements: String,
    assigned: Array,
    bugtitle: String,
    recreation: String,
    bugmsg: String
})

exports.bugmodel = new mongoose.model("bugs", bugschema)