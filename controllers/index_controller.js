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
    res.render('random-chat', {
        room_id: req.params.room_id,
        username: req.user.username
    });
});