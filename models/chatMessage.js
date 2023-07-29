const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const chatSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {timeStamps: true})

const chatMessage = mongoose.model('chatMessage', chatSchema)

module.exports = chatMessage;