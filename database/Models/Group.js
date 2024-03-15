const mongoose = require('mongoose');

const Schema = mongoose.Schema

var schema = new mongoose.Schema({
    group_name: {
        type: String
    }
});

const Group = mongoose.model('Group', schema);

module.exports = Group;