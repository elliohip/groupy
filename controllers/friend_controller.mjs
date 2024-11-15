import async_handler from 'express-async-handler';
import User from '../database/Models/User';

export const remove_friend = async_handler(async (req, res, next) => {
    await User.findByIdAndUpdate({
        id: req.session.user_id
    }, {$pull: {
        friends: req.body.friend_id
    }});

    await User.findByIdAndUpdate({
        id: req.body.friend_id
    }, {$pull: {
        friends: req.session.user_id
    }});

    res.send({message: "done"});
});