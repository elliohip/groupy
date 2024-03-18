const async_handler = require('express-async-handler')

module.exports.render_dashboard = async_handler(async (req, res, next) => {

    res.render('dashboard');
});

module.exports.render_user_dashboard = async_handler(async (req, res, next) => {
    res.render('dashboard');
});

module.exports.render_demo = async_handler(async (req, res, next) => {
    res.render('demo', {
        room_id: req.params.room_id
    });
});

module.exports.render_random_chat = async_handler(async (req, res, next) => {
    console.log(req.user);

    let data_obj = {
        username: req.user.username,
        user_id: req.user.user_id,
        email: req.user.email
    }
    res.render('random-chat', {
        room_id: req.params.room_id,
        user: data_obj
    });
});