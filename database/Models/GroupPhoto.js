const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    group_id: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    photo_nm: {
        type: String
    }
});

const GroupPhoto = mongoose.model('GroupPhoto', schema);

module.exports = GroupPhoto;
