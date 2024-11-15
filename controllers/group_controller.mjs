import Group from '../database/Models/Group';
import async_handler from 'express-async-handler';
import User from '../database/Models/User';

import group_map from '../global_objects/group_map';
import { v4 as uuidv4 } from 'uuid';
import GroupPhoto from '../database/Models/GroupPhoto';

import path from 'path';

module.exports.get_group = async_handler(async (req, res, next) => {
    let group = await Group.findById(String(req.params.group_id));

    if (!(group.users.includes(req.session.user_id))) {
        return res.json({message: 'not in group'})
    }
    
    res.json(group);
});



module.exports.get_user_groups = async_handler(async (req, res, next) => {
    let groups = (await Group.find({
        users: req.session.user_id
    }));

    if (groups.length == 0) {
        return res.json({message: 'no groups'});
    }

    res.json(groups);

});

module.exports.update_group = async_handler(async (req, res, next) => {
    
});

module.exports.delete_group = async_handler(async (req, res, next) => {

});

/**
 * using req.body.users, with users being a  ',' 
 * seperated string that gets tokenized into the ids
 */
module.exports.create_group = async_handler(async (req, res, next) => {
    let users_arr = [req.session.user_id, req.query.friend_id];
    if (!req.query.group_name) {
        Group.create({
            group_name: `${users_arr[0]}, ${users_arr[1]}`,
            users: users_arr
        })
        return next();
    }
    Group.create({
        group_name: req.query.group_name,
        users: users_arr
    });
    return next();
});

module.exports.create_group_with_query = async_handler(async(req, res, next) => {
    let users_arr = [req.session.user_id, req.query.friend_id];
    if (!req.query.group_name) {
        Group.create({
            group_name: `${users_arr[0]}, ${users_arr[1]}`,
            users: users_arr
        })
        return next();
    }
    Group.create({
        group_name: req.query.group_name,
        users: users_arr
    });
    return next();
});

module.exports.create_group_photo = async_handler(async (req, res, next) => {
    console.log(req.file.filename);
    let grp_photo = await GroupPhoto.create({
        group_id: req.params.group_id,
        file_name: req.file.filename
    });
    res.json({
        message: 'photo created'
    });
});

module.exports.get_group_photo = async_handler(async (req, res, next) => {
    let cb_two = (err) => {
        if (err) {
            console.log(err);
        }
    }
    let cb_one = (err) => {
        if (err) {
            res.sendFile(`group-svgrepo-com.svg`,{
                root:  `${file_path}/uploads/default`
            }, cb_two);
        }
    }
    console.log(`${file_path}/uploads/group/${req.params.group_id}/group-photo/${req.params.photo_id}`);
    let group = await Group.findById(req.params.group_id);
    // return res.sendFile(`${file_path}/uploads/group/${req.params.group_id}/group-photo/${}`
    // , cb_one);
    
});

module.exports.add_user = async_handler(async(req, res, next) => {
    let user = await User.findOne({username: req.query.user_id});
    if (!user) {
        return res.json({
            message: "no user"
        });
    }
    let group = await Group.findById(req.params.group_id);
    if (!group) {
        return res.json({
            message: "no group"
        });
    }
    group.users.push(user.id);
    await group.save();
});

module.exports.get_group_photo_default = async_handler(async (req, res, next) => {
    try {
        return res.sendFile(path.resolve(`./uploads/default/group-svgrepo-com.svg`), (err) => {
            if (err) {
                console.log(err);
            }
        });
    } catch (err) {
        console.log(err);
    }
});