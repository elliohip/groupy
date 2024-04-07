const User = require('../database/Models/User');

const async_handler = require('express-async-handler');

module.exports.get_user = async_handler(async (req, res, next) => {
    let user = await User.findById(req.params.user_id);

    res.json(user);
});

module.exports.update_user = async_handler(async (req, res, next) => {

})

module.exports.delete_user = async_handler((rew, res, next) => {

})

module.exports.remove_friend_query = async_handler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.session.user_id, {$pull: {
        friends: req.query.friend_id
    }});
    await User.findByIdAndUpdate(req.query.user_id, {
        $pull: {
            friends: req.session.user_id
        }
    })
});

module.exports.get_user_friends = async_handler(async (req, res, next) => {
    let user = await User.findById(req.params.user_id);

    res.json(user.friends);
    
})