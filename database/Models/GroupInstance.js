const mongoose = require('mongoose');

const Schema = mongoose.Schema

var schema = new mongoose.Schema({
    group_id: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const GroupInstance = mongoose.model('GroupInstance', schema);

module.exports = GroupInstance;