var Group = require('../database/Models/Group');
var async_handler = require('express-async-handler');
const User = require('../database/Models/User');

var group_map = require('../global_objects/group_map');
const { v4 } = require('uuid');

module.exports.get_group = async_handler(async (req, res, next) => {
    let group = await Group.findById(String(req.params.group_id));

    res.json(group);
});



module.exports.get_user_groups = async_handler(async (req, res, next) => {
    let groups = (await User.findById(req.user.user_id)).groups;
    let get_runtime_group = (g_id) => {

        if (!group_map.has(g_id)) {
            let run_g_id = v4();
            group_map.set(g_id, run_g_id);
            return run_g_id;
        }
        return group_map.get(g_id);
    }

    /**
     * @type {{solid_id: String, runtime_id: String}[]}
     */
    let response_data = [];

    for (let group in groups) {
        let group_run_id = get_runtime_group(group);
        response_data.push({
            solid_id: group,
            runtime_id: group_run_id
        });
    }

    res.json(response_data);

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
    let users_arr = String(req.body.users).split(',');
    let nm = req.body.group_name | `${users_arr[0]}, ${users_arr[1]}`;
    let group = await Group.create({
        group_name: nm,
        users: users_arr
    });

    res.json(group);
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