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
        res.sendFile(path.resolve(`${file_path}/uploads/user/${user.id}/${user.pfp_id}`), cb_one);
    }
});

module.exports.add_picture = async_handler(async (req, res, next) => {
    let id = req.file.filename;
    let user = await User.findById(req.session.user_id);
    if (!user.pfp_id) {
        await User.findByIdAndUpdate(req.session.user_id, {
            $push: {
                photo_ids: id
            }, 
            pfp_id: id
        });

    } else {
        await User.findByIdAndUpdate(req.session.user_id, {
            $push: {
                photo_ids: id
            }
        });
    }
    return next();
});

module.exports.set_profile_pic = async_handler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.user_id, {
        pfp_id: String(req.params.photo_id)
    });
    
    return next();
});

module.exports.get_pic_by_id = async_handler(async (req, res, next) => {

    console.log(req.query);
    
    let cb_two = (err) => {
        if (err) {
            console.log(err);
        }
    }
    let cb_one = (err) => {
        if (err) {
            res.sendFile(`profile-round-1346-svgrepo-com.svg`,{
                root:  `${file_path}/uploads/default`
            }, cb_two);
        }
    }
    console.log(`${file_path}/uploads/user/${req.session.user_id}/${req.query.photo_id}`)
    return res.sendFile(`${file_path}/uploads/user/${req.session.user_id}/${req.query.photo_id}`
    , cb_one);
    
});

/**
 * lets one user get a pic from anothr user
 */
module.exports.get_user_pic_by_id = async_handler(async (req, res, next) => {
    console.log(req.query);
    
    let cb_two = (err) => {
        if (err) {
            console.log(err);
        }
    }
    let cb_one = (err) => {
        if (err) {
            res.sendFile(`profile-round-1346-svgrepo-com.svg`,{
                root:  `${file_path}/uploads/default`
            }, cb_two);
        }
    }
    console.log(`${file_path}/uploads/user/${req.query.user_id}/${req.params.photo_id}`)
    return res.sendFile(`${file_path}/uploads/user/${req.query.user_id}/${req.params.photo_id}`
    , cb_one);
});

/**
 * 
 */
module.exports.get_pfp_by_id =async_handler( async (req, res, next) => {
    console.log(req.params);
    //let url = new URL(req.url);
    
    console.log(req.session)
    let user = await User.findById(req.params.user_id);

    
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
        res.sendFile(path.resolve(`${file_path}/uploads/user/${user.id}/${user.pfp_id}`), cb_one);
    }
})

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
    console.log(user.photo_ids[0]);
    res.json(user.photo_ids);
});

