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

    let u_1 = await User.findByIdAndUpdate(req.session.user_id, 
        {
            $pull: {
        friends: req.query.friend_id
    }});
    let u_2 = await User.findByIdAndUpdate(req.query.friend_id, {
        $pull: {
            friends: req.session.user_id
        }
    })
});

module.exports.remove_friend = async_handler(async (req, res, next) => {
    console.log(req.body.friend_id);
    await User.findByIdAndUpdate(req.session.user_id, 
        {
            $pull: { friends: req.body.friend_id
    }});
    await User.findByIdAndUpdate(req.body.friend_id, {
        $pull: {
            friends: req.session.user_id
        }
    });
    res.status(200);
});

module.exports.get_user_friends = async_handler(async (req, res, next) => {
    let user = await User.findById(req.params.user_id);

    res.json(user.friends);
    
})