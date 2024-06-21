var express = require('express');
var router = express.Router();
const registerController = require('../controllers/register_controller');
const passport = require('../global_objects/configured_passport');
const { v4 } = require('uuid');
const User = require('../database/Models/User');
const fs = require('fs').promises
// const clean_html = require('../config/clean_html');

/**
 * @type {[{
 *  email: {String},
 *  domain: {String}
 * }]}
 */
let domain_requests = require('../uploads/requested_domains.json');

/**
 * @type {String[]}
 */
var domains = require('../uploads/domains.json');

router.post('/sign-up', 
registerController.sign_up, (req, res, next) => {
    res.redirect('/dashboard');
    next();
}
);

router.post('/body-check', (req, res, next) => {
    console.log(req.body);
})

router.post('/log-in',(req, res, next) => {
    console.log(req.body);
    next();
}, registerController.log_in);

/*
passport.authenticate('local', {
    successRedirect: '/dashboard'
})
*/

router.post('/logout', (req,res, next) => {
    try {
        req.logout();
    } catch (err) {
        return next(err);
    }
});

router.post('/check-temp-key', async (req, res, next) => {
    if (req.session.temp_key == req.body.temp_key) {
        let user = await User.create({
            username: req.session.temp_username,
            hashed_password: req.session.temp_pass,
            email: req.session.temp_email
        });
        req.session.user_id = user._id;
        req.session.email = req.session.temp_email;
        req.session.username = req.session.temp_username;

        let u_domain = req.session.email.split('@')[1];

        if (!domains.includes(u_domain)) {
            req.session.domain = "none"
        }
        else {
            req.session.domain = u_domain
        }

        req.session.temp_user_id = null;
        req.session.temp_email = null;
        req.session.temp_username = null;
        req.session.save((err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/dashboard');
        })
    } else {
        res.redirect('/sign-up');
    }
});

router.post('/request-new-school', async (req, res, next) => {
    let new_request = {
        admin_email: req.body.email,
        domain: req.body.domain
    };
    let d_req = domain_requests.find((value) => value.domain == req.body.domain);
    let domn = domains.find((value) => value == req.body.domain);
    if (d_req || domn) {
        return res.json({message: 'domain already requested or already is in the list attached (email either groupyioapp@gmail.com or elhip03@gmail.com with your domain and email, and we will assist asap)', current_domains: domains})
    }
    domain_requests.push(new_request);
    await fs.writeFile('../uploads/requested_domains.json', domain_requests)
    res.redirect('/');
})


module.exports = router;
