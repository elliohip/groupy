var async_handler = require('express-async-handler');
const User = require('../database/Models/User');
const path = require('path');

var  fs = require('fs').promises

const file_path = path.resolve('./');

module.exports.get_profile_pic = async_handler(async (req, res, next) => {
    console.log(req.query);
    //let url = new URL(req.url);
    
    console.log(req.session)
    let user = await User.findById(req.session.user_id);

    
    let cb_one = (err) => {
        if (err) {
            console.log(err);
        }
        // next(err);
    }
    console.log(user);

    if (!user.pfp_id) {
        console.log(file_path);

        res.sendFile(`profile-round-1346-svgrepo-com.svg`,{
            root:  `${file_path}/uploads/default`
        }, cb_one);

    } else {
        res.sendFile(path.resolve(`${file_path}/rando-chat/uploads/user/${user.id}/photos/${user.pfp_path}`), cb_one);
    }
});

module.exports.add_picture = async_handler(async (req, res, next) => {
    let id = req.file.filename;
    await User.findByIdAndUpdate(req.user.user_id, {
        $push: {
            photo_ids: id
        }
    });
    return next();
});

module.exports.set_profile_pic = async_handler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.user_id, {
        pfp_id: String(req.params.photo_id)
    });
    
    return next();
});

module.exports.get_pic_by_id = async_handler(async (req, res, next) => {
    
    let cb_two = (err) => {
        if (err) {
            console.log(err);
        }
        return next();
    }
    let cb_one = (err) => {
        if (err) {
            res.sendFile(path.resolve(`./uploads/default/profile-round-1346-svgrepo-com.svg`), cb_two);
        }
        return next();
    }
    res.sendFile(path.resolve(`${path.resolve('..')}/rando-chat/uploads/user/${req.query.id}/photos/${req.query.photo_id}`), cb_one);
});

module.exports.delete_photo = async_handler(async (req, res, next) => {
    let user = await User.findByIdAndUpdate(req.params.user_id, {
        $pull: {
            photo_ids: req.params.photo_id
        }
    });

    let path = path.resolve(`../uploads/user/${req.user.user_id}/photos/${req.params.photo_id}`);
    await fs.unlink(path);
    res.status(200);
});

module.exports.get_user_pic_ids = async_handler(async (req, res, next) => {
    let user = (await User.findById(req.query.user_id));

    res.json(user.photo_ids);
});

