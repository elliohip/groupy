const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Message = require("./Message.js");
const DirectMessageHistory = require("./DirectMessageHistory.js");
const Group = require("./Group.js");
const FriendRequest = require("./FriendRequest.js");
const PhotoMessage = require("./PhotoMessage.js");

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

schema.pre('remove', async function(next) {
    try {
        // remove friend requests
        await FriendRequest.remove({to_id: this._id});
        await FriendRequest.remove({from_id: this._id});

        // remove messages
        await Message.remove({user_id: this._id});
        await PhotoMessage.remove({user_id: this._id});

        // remove from groups
        await Group.updateMany({users: this._id}, {$pull: {users: this._id}});
        await Group.updateMany({admins: this._id}, {$pull: {admins: this._id}});

        // remove dms
        await DirectMessageHistory.remove({users: this._id});

        
        next();
    } catch (err) {
        console.log(err);
        next();
    }
});

const User = mongoose.model('User', schema);

module.exports = User;