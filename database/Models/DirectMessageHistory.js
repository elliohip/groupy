const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{
        from_id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        to_id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message_id: {
            type: String
        },
        text_content: {
            type: String
        }, 
        date_created: {
            type: Schema.Types.Date
        }
    }]
});

schema.methods.add_message = function(msg_content, date_made, frm_ident, to_ident) {
    this.messages.push({
        from_id: frm_ident,
        to_id: to_ident,
        message_id: v4(),
        text_content: msg_content,
        date_created: date_made
    });
    this.save();
};
schema.methods.remove_message = function(msg_id) {

    // find index
    let rm_idx = this.messages.findIndex((val) => {
        return val.message_id == msg_id;
    });
    // rm index
    this.messages.splice(rm_idx, 1);

    this.save();

};

const DirectMessageHistory = mongoose.model('DirectMessageHistory', schema);

module.exports = DirectMessageHistory;
