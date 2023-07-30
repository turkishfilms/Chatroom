const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const profileSchema = new Schema ({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const profile = mongoose.model('profile', profileSchema)

module.exports = profile;