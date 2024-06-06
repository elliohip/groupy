const async_handler = require('express-async-handler');
const TempGroup = require('../database/Models/TempGroup');
const { $where } = require('../database/Models/DirectMessageHistory');

module.exports.create_temp_group = async_handler(async(req, res, next) => {
    let has_group = await TempGroup.findOne({
        users: {
            $size: 2,
            $all: [req.body.from_user, req.body.to_user]
        }
    });

    if (has_group) {
        return res.json({message: "group already exists"});
    }

    let group = await TempGroup.create({
        users: [req.body.from_user, req.body.to_user]
    });
});

module.exports.add_user_to_temp_group = async_handler(async (req, res, next) => {
    let temp_group = await TempGroup.findOneById(req.body.group_id);

    if (temp_group.users.includes(req.body.temp_user_id)) {
        res.json({message: "user already in group"});
    }
    temp_group.users.push(req.body.temp_user_id);
    await temp_group.save();
    res.status(200);
});

module.exports.remove_from_temp_group = async_handler(async(req, res, next) => {
    let temp_group = await TempGroup.findOneById(req.body.group_id);

    if (!temp_group.users.includes(req.body.temp_user_id)) {
        res.json({message: "user not in group"});
    }
    
    let idx = temp_group.users.indexOf(req.body.temp_user_id);
    temp_group.users.splice(idx,1);
    await temp_group.save();
    res.status(200);
});

module.exports.get_temp_group = async_handler(async (req, res, next) => {
    
});