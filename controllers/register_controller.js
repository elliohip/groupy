const User = require('../database/Models/User');

const bcrypt = require('bcrypt');
const send_mail = require('../config/send_mail');

const async_handler = require('express-async-handler');
const clean_html = require('../config/clean_html');
const { v4 } = require('uuid');

const fs = require('fs').promises
// const clean_html = require('../config/clean_html');
/**
 * @type {String[]}
 */
var domains = require('../uploads/domains.json');

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
    let user = {
        username: clean_html(req.body.username),
        hashed_password: encrypted_pass,
        email: clean_html(req.body.email)
    };
    let t_key = v4();
    req.session.temp_key = t_key;
    await send_mail({
        to: user.email,
        from: process.env.EMAIL_ADDR, 
        subject: "access key for groupy",
        text: t_key
    });
    req.session.temp_email = user.email;
    req.session.temp_username = user.username;
    req.session.temp_pass = user.hashed_password;

    res.redirect('/signup-wait');

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
    let u_domain = log_user.email.split('@')[1];
    req.session.user_id = log_user.user_id;
    req.session.username = log_user.username;
    req.session.email = log_user.email;
    // req.session.domain = log_user.email.split('@')[1];
    if (domains.includes(u_domain)) {
        req.session.domain = u_domain;
    }
    else {
        req.session.domain = "none"
    }

    req.session.save((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/dashboard');
    });
    
    
    
});


module.exports.authenticate_user_strict  = async_handler((req, res, next) => {
    if (req.session.user_id != String(req.params.user_id)) {
        console.log({message: 'not user'});
        return res.redirect('/log-in');
    }
    next();
});

module.exports.authenticate_user = async_handler(async (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/log-in');
    }
    console.log(req.url);
    next();
});

module.exports.authenticate_native = async_handler(async (req, res, next) => {
    if (!req.body.token) {
        return res.json({error: {
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

module.exports.authenticate_admin = async (req, res, next) => {
    
}