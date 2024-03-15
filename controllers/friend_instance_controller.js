var async_handler = require('express-async-handler');
const FriendInstance = require('../database/Models/FriendInstance')


module.exports.get_friend_instance = async_handler(async (req, res, next) => {

})

module.exports.update_friend_instance = async_handler(async (req, res, next) => {

})

module.exports.delete_friend_instance = async_handler(async (req, res, next) => {

})

module.exports.create_friend_instance = async_handler(async (req, res, next) => {
    let friend_instance = await FriendInstance.create({
        user_id: req.body.user_id,
        friend_with: req.body.friend_with
    });
    res.json(friend_instance);
});

module.exports.get_friend_instances = async_handler(async (req, res, next) => {

})