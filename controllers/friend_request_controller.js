const User = require('../database/Models/User');
const FriendRequest = require('../database/Models/FriendRequest');

const async_handler = require('express-async-handler');

const DirectMessageHistory = require('../database/Models/DirectMessageHistory');

module.exports.create_friend_request_q = async_handler(async (req, res, next) => {
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
        from_id: req.query.to_id,
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
                friends: req.query.to_id
            }
        });
        await User.findByIdAndUpdate(req.query.to_id, {
            $push: {
                friends: req.session.user_id
            }
        });
        res.status(200);
        return;
    }

    let friend_req = await FriendRequest.create({
        from_id: req.session.user_id,
        to_id: req.query.to_id,
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

    let friend_request = await FriendRequest.findById(req.params.friend_request_id);

    let to_u = await User.findById(friend_request.to_id);

    let from_u = await User.findById(friend_request.from_id);

    if (to_u.friends.includes(friend_request.from_id) && from_u.friends.includes(friend_request.from_id)) { // if both are friends, send the message, and return
        
        return res.json( {message: 'already friends'} );

    } else if (to_u.friends.includes(friend_request.from_id) && !from_u.friends.includes(friend_request.from_id)) { // if only to has friend

        from_u.friends.push(friend_request.to_id);
        await from_u.save();
        return res.json({
            message: 'done'
        });

    } else if (!to_u.friends.includes(friend_request.from_id) && from_u.friends.includes(friend_request.from_id)) { // if only from has friend

        to_u.friends.push(friend_request.from_id);
        await to_u.save();
        return res.json({
            message: 'done'
        });

    }

    to_u.friends.push(friend_request.from_id);
    from_u.friends.push(friend_request.to_id);
    await to_u.save();
    await from_u.save();

    friend_request.accepted = true;
    friend_request.rejected = false;

    await friend_request.save();

    await DirectMessageHistory.create({
        users: [to_u.id, from_u.id]
    });

    res.json({message: 'done'});

});

module.exports.reject_friend_request = async_handler(async (req, res, next) => {
    let friend_request = await FriendRequest.findByIdAndUpdate(req.params.friend_request_id, {
        rejected: true,
        accepted: false
    });
    next();
});

module.exports.get_friend_request = async_handler(async (req, res, next) => {
    let f_r = await FriendRequest.findById(req.params.request_id);
    res.json(f_r);
});

module.exports.update_friend_request = async_handler(async (req, res, next) => {
    next();
});

module.exports.delete_friend_request = async_handler(async (req, res, next) => {
    await FriendRequest.findByIdAndDelete(req.params.friend_request_id);
    next();
});

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

