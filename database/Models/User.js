const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    email: {
        String
    }

});

const User = mongoose.model('User', schema);

module.exports = User;