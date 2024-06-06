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
    req.session.user_id = user.id;
    req.session.email = user.email;
    req.session.username = user.username;

    res.redirect('/dashboard');

});

module.exports.log_in = async_handler(async (req, res, next) => {
    let check_user = await User.findOne({username: String(req.body.username)});

    let is_user = await bcrypt.compare(req.body.password, check_user.hashed_password);
    let log_user = {
        user_id: check_user.id,
        email: check_user.email,
        username: check_user.username
    }
    if (!is_user) {
        return res.json({error: {message: 'not password'}});
    }

    req.session.user_id = log_user.user_id;
    req.session.username = log_user.username;
    req.session.email = log_user.email;
    req.session.domain = log_user.email.split('@')[1];

    return res.redirect('/dashboard');
    /*
    req.session.save((err) => {
        if (err) {
            console.log(err);
        }
    });
    */
    
});


module.exports.authenticate_user_strict  = async_handler((req, res, next) => {
    if (req.session.user_id != String(req.params.user_id)) {
        console.log({message: 'not user'});
        return next(new Error('not user'))
    }
    next();
});

module.exports.authenticate_user = async_handler(async (req, res, next) => {
    if (!req.session.user_id) {
        // res.json({message: 'error, no user'});
        res.redirect('/log-in');
        next(new Error('no user'))
    }
    console.log(req.url);
    next();
});

module.exports.authenticate_native = async_handler(async (req, res, next) => {
    if (!req.body.token) {
        res.json({error: {
            message: 'not authenticated'
        }});
    }
});

module.exports.authenticate_user_strict_q  = async_handler((req, res, next) => {
    if (req.session.user_id != String(req.query.user_id)) {
        console.log({message: 'not user'});
        return next(new Error('not user'));
    }
    next();
});

module.exports.authenticate_temp = async_handler(async (req, res, next) => {
    if (!req.session.temp_user_id) {
        return res.redirect('/temp-login');
    }
})