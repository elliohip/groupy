const async_handler = require('express-async-handler');
const User = require('../database/Models/User');

module.exports.render_dashboard = async_handler(async (req, res, next) => {
    console.log(req.session.user_id);
    res.render('dashboard', {user_id: req.session.user_id, username: req.session.username});
});

module.exports.render_user_dashboard = async_handler(async (req, res, next) => {
    console.log(req.session.user_id);
    res.render('dashboard', {user_id: req.session.user_id, username: req.session.username});
});

module.exports.render_demo = async_handler(async (req, res, next) => {
    let rm_id = String(req.params.room_id).split('-')[1];
    res.render('demo', {
        room_id: rm_id,
        sock_rm_id: String(req.params.room_id)
    });
});

module.exports.render_random_chat = async_handler(async (req, res, next) => {
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
        sock_rm_id: String(req.params.room_id)
    });
});

module.exports.render_user_profile = async_handler(async (req, res, next) => {
    res.render('user-profile', {user: {
        user_id: req.session.user_id, 
        username: req.session.username, 
        email: req.session.email
    }});
});

module.exports.render_user_info = async_handler(async (req, res, next) => {
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