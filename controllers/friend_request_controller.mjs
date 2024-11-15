import User from '../database/Models/User.mjs';
import FriendRequest from '../database/Models/FriendRequest.mjs';

import async_handler from 'express-async-handler';

import DirectMessageHistory from '../database/Models/DirectMessageHistory.mjs';

export const create_friend_request = async_handler(async (req, res, next) => {
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
export const accept_friend_request = async_handler(async (req, res, next)=> {

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

export const reject_friend_request = async_handler(async (req, res, next) => {
    let friend_request = await FriendRequest.findByIdAndUpdate(req.params.friend_request_id, {
        rejected: true,
        accepted: false
    });
    next();
});

export const get_friend_request = async_handler(async (req, res, next) => {
    let f_r = await FriendRequest.findById(req.params.request_id);
    res.json(f_r);
});

export const update_friend_request = async_handler(async (req, res, next) => {
    next();
});

export const delete_friend_request = async_handler(async (req, res, next) => {
    await FriendRequest.findByIdAndDelete(req.params.friend_request_id);
    next();
});

export const get_friend_requests_to = async_handler(async (req, res, next) => {
    let friend_requests = await FriendRequest.find({
        to_id: req.params.to_id,
        rejected: false, 
        accepted: false
    }).populate();
    
    res.json(friend_requests);
});

export const get_friend_requests_from = async_handler(async (req, res, next) => {
    let friend_requests = await FriendRequest.find({
        from_id: req.params.from_id, 
        accepted: false
    }).populate();
    res.json(friend_requests);
});

export default {
    create_friend_request,
    accept_friend_request,
    reject_friend_request,
    get_friend_requests_to,
    get_friend_requests_from,
    get_friend_request,
    delete_friend_request,
    update_friend_request
}