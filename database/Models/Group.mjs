import mongoose from 'mongoose';

const Schema = mongoose.Schema

var schema = new mongoose.Schema({
    group_name: {
        type: String
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Group = mongoose.model('Group', schema);

export default Group;