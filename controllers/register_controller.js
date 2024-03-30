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

    let log_user = {
        user_id: user.id,
        email: user.email,
        username: user.username
    }
    req.login(log_user,(err) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.redirect(`/dashboard`);
    });

})

module.exports.authenticate_user_strict  = async_handler((req, res, next) => {
    if (req.user.user_id != String(req.params.user_id)) {
        console.log({message: 'not user'});
        return next(new Error('not user'))
    }
    next();
});

module.exports.authenticate_user = async_handler(async (req, res, next) => {
    if (!req.user) {
        res.json({message: 'error, no user'});
        next(new Error('no user'))
    }
    console.log(req.body);
    next();
});

module.exports.authenticate_native = async_handler(async (req, res, next) => {
    if (!req.body.token) {
        res.json({error: {
            message: 'not authenticated'
        }});
    }
});

