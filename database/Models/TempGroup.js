const mongoose = require('mongoose');

const Schema = mongoose.Schema

var schema = new mongoose.Schema({
    group_name: {
        type: String
    },
    users: [{
        type: String,
    }]
});

const TempGroup = mongoose.model('TempGroup', schema);

module.exports = TempGroup;