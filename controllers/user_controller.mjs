import User from '../database/Models/User';

const async_handler = require('express-async-handler');

export const get_user = async_handler(async (req, res, next) => {
    let user = await User.findById(req.params.user_id);

    res.json(user);
});

export const update_user = async_handler(async (req, res, next) => {

})

export const delete_user = async_handler((rew, res, next) => {

})

export const remove_friend_query = async_handler(async (req, res, next) => {

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

export const remove_friend = async_handler(async (req, res, next) => {
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

export const get_user_friends = async_handler(async (req, res, next) => {
    let user = await User.findById(req.params.user_id);

    res.json(user.friends);
    
})

export default user_controller