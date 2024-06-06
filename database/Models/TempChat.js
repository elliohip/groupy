const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    status: {
        type: String,
        enum: [
            'open',
            'in-call',
            'closed'
        ]
    },
    domain: {
        type: String
    },

});


const TempChat = mongoose.model('TempChat', schema);

module.exports = TempChat;
