const User = require('../database/Models/User');

const bcrypt = require('bcrypt');

const async_handler = require('express-async-handler');

module.exports.sign_up = async_handler(async (req, res, next) => {

    let check_user = await User.findOne({username: String(req.body.username)});
    let check_email = await User.findOne({username: String(req.body.email)});

    if (check_email) {
        return res.json(new Error('email already exists'));
    }
    if(check_user) {
        return res.json(new Error('username already exists'));
    }

    let salt = await bcrypt.genSalt(10);
    let encrypted_pass = await bcrypt.hash(req.body.password, salt);
    let user = await User.create({
        username: String(req.body.username),
        hashed_password: encrypted_pass,
        email: String(req.body.email)
    });

    req.login(user,(err) => {
        if (err) {
            throw err;
        }
    });

    res.json({
        user
    });

    return res.redirect('/dashboard');

})