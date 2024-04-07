const User = require('../database/Models/User');
const FriendRequest = require('../database/Models/FriendRequest');

const async_handler = require('express-async-handler')

module.exports.create_friend_request = async_handler(async (req, res, next) => {
    console.log(req.body);

    let check_is_friend = (await User.findById(req.session.user_id)).friends.includes(req.body.to_id);

    if (check_is_friend) {
        return res.json({message: 'already friends'});
    }

    let check_exists = await FriendRequest.findOne({
        from_id: req.session.user_id,
        to_id: req.body.to_id
    });
    let check_other_req = await FriendRequest.findOne({
        from_id: req.body.to_id,
        to_id: req.session.user_id
    });

    if (check_exists) {
        return res.json({message: 'already sent request'});
    } else if (check_is_friend) {
        return res.json({message: 'already friends'});
    }

    if (check_other_req != null) {

        check_other_req.accepted = true;
        check_other_req.save();
        await User.findByIdAndUpdate(req.session.user_id, {
            $push: {
                friends: req.body.to_id
            }
        });
        await User.findByIdAndUpdate(req.body.to_id, {
            $push: {
                friends: req.session.user_id
            }
        });
        res.status(200);
        return;
    }

    let friend_req = await FriendRequest.create({
        from_id: req.session.user_id,
        to_id: req.body.to_id,
        accepted: false,
        rejected: false
    });
    res.json(friend_req);
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

    let to_friend_instance = await User.findByIdAndUpdate(friend_request.to_id, {
        $push: {
            friends: friend_request.from_id,
        }
    });
    let from_friend_instance = await User.findByIdAndUpdate(friend_request.from_id, {
        $push: {
            friends: friend_request.to_id,
        }
    });

    return next();
    /**
     * automatically makes a group with the two 
     * friends
     
    let group = await (await fetch(`${process.env.BASE_PATH}/api/groups/`, {
        method: 'POST',
        body: {
            group_name: 'new group',
            users: [friend_request.from_id, friend_request.to_id]
        }
    })).json();

    

    // friend array update
    let to_friend_instance = await User.findByIdAndUpdate(friend_request.to_id, {
        $push: {
            friends: friend_request.from_id,
            groups: group.id
        }
    });
    let from_friend_instance = await User.findByIdAndUpdate(friend_request.from_id, {
        $push: {
            friends: friend_request.to_id,
            groups: group.id
        }
    });

    res.status(200);
    return next();
    */
});

module.exports.reject_friend_request = async_handler(async (req, res, next) => {
    let friend_request = await FriendRequest.findByIdAndUpdate(req.params.friend_request_id, {
        rejected: true
    });
    next();
});

module.exports.get_friend_request = async_handler(async (req, res, next) => {

})

module.exports.update_friend_request = async_handler(async (req, res, next) => {

})

module.exports.delete_friend_request = async_handler(async (req, res, next) => {

})

module.exports.get_friend_requests_to = async_handler(async (req, res, next) => {
    let friend_requests = await FriendRequest.find({
        to_id: req.params.to_id,
        rejected: false, 
        accepted: false
    }).populate();
    
    res.json(friend_requests);
});

module.exports.get_friend_requests_from = async_handler(async (req, res, next) => {
    let friend_requests = await FriendRequest.find({
        from_id: req.params.from_id, 
        accepted: false
    }).populate();
    res.json(friend_requests);
});