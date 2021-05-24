import { Schema, model } from 'mongoose'

const reminderschema = new Schema({
    _id: String,
    user: String,
    systime: String,
    expires: String,
    content: String,
    loop: Boolean,
    guild: {
        id: String,
        channel: String,
    },
    mentions: {
        users: Array,
        roles: Array,
    },
})

// eslint-disable-next-line new-cap
export default model('reminders', reminderschema)
