import mongoose from 'mongoose';
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
    text: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true // BIG ERROR REMEMBER REQUIRE USERNAME !!!
    }
}, {
    timestamps: true
});

const Message = mongoose.model('Message', schema);

export default Message;
