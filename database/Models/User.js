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
        type: String
    },
    friends: [{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }], 
    blocked: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    photo_ids: [{
        type: String
    }],
    pfp_id: {
        type: String
    },
    profile_info: {
        bio: {
            type: String
        }
    }
});

const User = mongoose.model('User', schema);

module.exports = User;