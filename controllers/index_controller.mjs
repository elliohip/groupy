import async_handler from 'express-async-handler';
import User from '../database/Models/User.mjs';
import FriendRequest from '../database/Models/FriendRequest.mjs';

export const render_dashboard = async_handler(async (req, res, next) => {
    console.log(req.session.user_id);

    res.render('dashboard', {user_id: req.session.user_id, username: req.session.username});
});

export const render_user_dashboard = async_handler(async (req, res, next) => {
    console.log(req.session.user_id);
    let friend_requests = await FriendRequest.find({
        to_id: req.session.user_id,
        rejected: false, 
        accepted: false
    });
    res.render('dashboard', {user_id: req.session.user_id, username: req.session.username, friend_requests_amount: friend_requests.length});
});

export const render_demo = async_handler(async (req, res, next) => {
    let rm_id = String(req.params.room_id).split('-')[1];

    res.render('demo', {
        room_id: rm_id,
        sock_rm_id: String(req.params.room_id),
        is_open: (req.session.curr_call_status === "o")
    });
});

export const render_random_chat = async_handler(async (req, res, next) => {
    console.log(req.session);

    let rm_id = String(req.params.room_id).split('-')[1];
    

    let data_obj = {
        username: req.session.username,
        user_id: req.session.user_id,
        email: req.session.email
    }
    res.render('random-chat', {
        room_id: rm_id,
        user: data_obj,
        sock_rm_id: String(req.params.room_id),
        is_open: (req.session.curr_call_status === "o")
    });
});

export const render_user_profile = async_handler(async (req, res, next) => {
    res.render('user-profile', {user: {
        user_id: req.session.user_id, 
        username: req.session.username, 
        email: req.session.email
    }});
});

export const render_user_info = async_handler(async (req, res, next) => {
    let usr = await User.findById(req.params.user_id);
    let imgs = [];
    let i = 0;
    usr.friends.forEach((val) => {
        imgs[i] = ``

        i += 1;
    });
    let pics = imgs.join('\n');
    res.render('user-info', {user: usr, photos: pics});
});

export const render_direct_messages = (req, res, next) => {
    res.render("direct-messages", {
        user_id: req.session.user_id, username: req.session.username
    });
}

export const render_wait_for_signup_confirm = (req, res, next) => {
    console.log(req.session);
    res.render('signup-wait');
}

export const render_add_school = (req,res,next) => {
    res.render('add-your-school');
}

export default {
    render_add_school,
    render_dashboard,
    render_demo,
    render_direct_messages,
    render_random_chat,
    render_user_dashboard,
    render_user_info,
    render_user_profile,
    render_wait_for_signup_confirm
}