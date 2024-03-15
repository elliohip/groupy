const GroupInstance = require('../database/Models/FriendInstance');

var async_handler = require('express-async-handler');

module.exports.get_group_instance = async_handler(async (req, res, next) => {

});

module.exports.update_group_instance = async_handler(async (req, res, next) => {

})

module.exports.delete_group_instance = async_handler(async (req, res, next) => {

})

module.exports.create_group_instance = async_handler(async (req, res, next) => {
    let instance = await GroupInstance.create({
        group_id: req.body.group_id,
        user_id: req.body.user_id
    })
    res.json(instance);
    
});