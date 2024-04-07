const mongoose = require('mongoose');

const Schema = mongoose.Schema

var schema = new mongoose.Schema({
    group_name: {
        type: String
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }]
});

const Group = mongoose.model('Group', schema);

module.exports = Group;