import User from '../database/Models/User.mjs';

import bcrypt from 'bcrypt';
import send_mail from '../config/send_mail.mjs';

import async_handler from 'express-async-handler';
import clean_html from '../config/clean_html.mjs';
import { v4 as uuidv4 } from 'uuid';

import { promises as fs } from 'fs';
import path from 'path';
// import clean_html from '../config/clean_html';
/**
 * @type {String[]}
 */
var domains = JSON.parse(await fs.readFile(path.resolve('./uploads/domains.json')));

export const sign_up = async_handler(async (req, res, next) => {

    let check_user = await User.findOne({username: String(req.body.username)});
    let check_email = await User.findOne({email: String(req.body.email)});

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
    try {
        await send_mail({
            to: user.email,
            from: process.env.EMAIL_ADDR, 
            subject: "access key for groupy",
            text: t_key
        });
        req.session.temp_email = user.email;
        req.session.temp_username = user.username;
        req.session.temp_pass = user.hashed_password;

        return res.redirect('/signup-wait');
    } catch (err) {
        return res.json({message: "error with email, the email must be a valid email, dont use your college email until it is added to the list of registered emails from the homepage"});
    }
    

});

export const log_in = async_handler(async (req, res, next) => {
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


export const authenticate_user_strict  = async_handler((req, res, next) => {
    if (req.session.user_id != String(req.params.user_id)) {
        console.log({message: 'not user'});
        return res.redirect('/log-in');
    }
    next();
});

export const authenticate_user = async_handler(async (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/log-in');
    }
    console.log(req.url);
    next();
});

export const authenticate_native = async_handler(async (req, res, next) => {
    if (!req.body.token) {
        return res.json({error: {
            message: 'not authenticated'
        }});
    }
});

export const authenticate_user_strict_q  = async_handler((req, res, next) => {
    if (req.session.user_id != String(req.query.user_id)) {
        console.log({message: 'not user'});
        return next(new Error('not user'));
    }
    next();
});

export const authenticate_temp = async_handler(async (req, res, next) => {
    if (!req.session.temp_user_id) {
        return res.redirect('/temp-login');
    }
})

export const authenticate_admin = async (req, res, next) => {
    
}

export default {
    sign_up,
    log_in,
    authenticate_admin,
    authenticate_user,
    authenticate_user_strict,
    authenticate_temp,
    authenticate_native,
}