import async_handler from 'express-async-handler';
import User from '../database/Models/User.mjs';
import path from 'path';

import { promises as fs } from 'fs';

const file_path = path.resolve('./');

export const get_profile_pic = async_handler(async (req, res, next) => {
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

export const add_picture = async_handler(async (req, res, next) => {
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

export const set_profile_pic = async_handler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.params.user_id, {
        pfp_id: String(req.params.photo_id)
    });
    
    return next();
});

export const get_pic_by_id = async_handler(async (req, res, next) => {

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
    res.sendFile(`${file_path}/uploads/user/${req.session.user_id}/${req.query.photo_id}`
    , cb_one);
    
});

/**
 * lets one user get a pic from anothr user
 */
export const get_user_pic_by_id = async_handler(async (req, res, next) => {
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
    res.sendFile(`${file_path}/uploads/user/${req.query.user_id}/${req.params.photo_id}`
    , cb_one);
});

/**
 * 
 */
export const get_pfp_by_id =async_handler( async (req, res, next) => {
    
    let user = await User.findById(req.params.user_id);

    
    let cb_one = (err) => {
        if (err) {
            res.sendFile(`profile-round-1346-svgrepo-com.svg`,{
                root:  `${file_path}/uploads/default`
            }, cb_two);
        }
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

export const delete_photo = async_handler(async (req, res, next) => {
    let user = await User.findByIdAndUpdate(req.params.user_id, {
        $pull: {
            photo_ids: req.params.photo_id
        }
    });

    let path = path.resolve(`../uploads/user/${req.user.user_id}/photos/${req.params.photo_id}`);
    await fs.unlink(path);
    res.status(200);
});

export const get_user_pic_ids = async_handler(async (req, res, next) => {
    let user = (await User.findById(req.query.user_id));
    console.log(user.photo_ids[0]);
    res.json(user.photo_ids);
});

export default {
    get_profile_pic,
    get_pfp_by_id,
    get_pic_by_id,
    get_user_pic_by_id,
    get_user_pic_ids,
    delete_photo,
    add_picture,
    set_profile_pic,
    
}