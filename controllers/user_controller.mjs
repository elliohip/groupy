import User from '../database/Models/User.mjs';

import async_handler from 'express-async-handler';

let user_controller = {};

user_controller.get_user = async_handler(async (req, res, next) => {
    let user = await User.findById(req.params.user_id);

    res.json(user);
});

user_controller.update_user = async_handler(async (req, res, next) => {

})

user_controller.delete_user = async_handler((rew, res, next) => {

})

user_controller.remove_friend_query = async_handler(async (req, res, next) => {

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

user_controller.remove_friend = async_handler(async (req, res, next) => {
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

user_controller.get_user_friends = async_handler(async (req, res, next) => {
    let user = await User.findById(req.params.user_id);

    res.json(user.friends);
    
})

export default user_controller