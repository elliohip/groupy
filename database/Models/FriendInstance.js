const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var schema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    friend_with: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const FriendInstance = mongoose.model('FriendInstance', schema);

module.exports = FriendInstance;