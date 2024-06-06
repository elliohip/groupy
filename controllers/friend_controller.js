var async_handler = require('express-async-handler');
const User = require('../database/Models/User');

module.exports.remove_friend_query = async_handler(async (req, res, next) => {
    await User.findByIdAndUpdate({
        id: req.session.user_id
    }, {$pull: {
        friends: req.query.friend_id
    }});

    await User.findByIdAndUpdate({
        id: req.query.friend_id
    }, {$pull: {
        friends: req.query.req.sesion.user_id
    }});
});