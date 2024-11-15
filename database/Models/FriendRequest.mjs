import mongoose from 'mongoose';

const Schema = mongoose.Schema;

var schema = new mongoose.Schema({
    from_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    accepted: {
        type: Boolean,
        default: false
    },
    rejected: {
        type: Boolean,
        default: false
    }
});

const FriendRequest = mongoose.model('FriendRequest', schema);

export default FriendRequest;