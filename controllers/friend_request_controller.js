const User = require('../database/Models/User');
const FriendRequest = require('../database/Models/FriendRequest');
const FriendInstance = require('../database/Models/FriendInstance')

const async_handler = require('express-async-handler')

module.exports.create_friend_request = async_handler(async (req, res, next) => {
    let check_exists = await FriendRequest.findOne({
        from_id: req.body.from_id,
        to_id: req.body.to_id
    });
    let check_is_friend = await FriendInstance.findOne({
        user_id: req.body.from_id,
        friend_with: req.body.to_id
    })
    if (check_exists) {
        return res.json({message: 'already sent request'});
    } else if (check_is_friend) {
        return res.json({message: 'already friends'});
    }

    await FriendRequest.create({
        from_id: req.body.from_id,
        to_id: req.body.to_id,
        accepted: false
    });
    res.status(200);
});

/**
 * this will accept the friend request, update the 
 * user's friend list, and create a new group with 
 * the two users
 */
module.exports.accept_friend_request = async_handler(async (req, res, next)=> {

    let friend_request = await FriendRequest.findByIdAndUpdate(req.params.friend_request_id, {
        accepted: true
    });

    let group = await fetch(`${process.env.BASE_PATH}/api/groups/`, {
        method: 'POST'
    });

    // group instances
    let from_group_instance = await fetch(`${process.env.BASE_PATH}/api/group-instances/`, {
        method: 'POST',
        body: {
            group_id: group.id,
            user_id: friend_request.from_id
        }
    });
    let to_group_instance = await fetch(`${process.env.BASE_PATH}/api/group-instances/`, {
        method: 'POST',
        body: {
            group_id: group.id,
            user_id: friend_request.to_id
        }
    });

    // friend instances
    let to_friend_instance = await fetch(`${process.env.BASE_PATH}/api/friend-instances/`, {
        method: 'POST',
        body: {
            user_id: friend_request.to_id,
            friends_with: friend_request.from_id
        }
    });
    let from_friend_instance = await fetch(`${process.env.BASE_PATH}/api/friend-instances`, {
        method: 'POST',
        body: {
            user_id: friend_request.from_id,
            friends_with: friend_request.to_id
        }
    });
});
module.exports.get_friend_request = async_handler(async (req, res, next) => {

})

module.exports.update_friend_request = async_handler(async (req, res, next) => {

})

module.exports.delete_friend_request = async_handler(async (req, res, next) => {

})

module.exports.get_friend_requests_to = async_handler(async (req, res, next) => {
    let friend_requests = await FriendRequest.find({
        to_id: req.params.to_id
    });

    res.json(friend_requests);
});

module.exports.get_friend_requests_from = async_handler(async (req, res, next) => {
    let friend_requests = await FriendRequest.find({
        from_id: req.params.from_id
    });

    res.json(friend_requests);
});