const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group_id: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    photo_id: {
        type: String
    },
    caption: {
        type: String
    },
    username: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const PhotoMessage = mongoose.model('PhotoMessage', schema);

module.exports = PhotoMessage;