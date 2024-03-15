var Group = require('../database/Models/Group');
var async_handler = require('express-async-handler');

module.exports.get_group = async_handler(async (req, res, next) => {

})

module.exports.update_group = async_handler(async (req, res, next) => {

})

module.exports.delete_group = async_handler(async (req, res, next) => {

})

module.exports.create_group = async_handler(async (req, res, next) => {
    let group = await Group.create({
        group_name: req.body.group_name
    });

    res.json(group);
});