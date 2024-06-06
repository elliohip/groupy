var express = require('express');
var router = express.Router();
const registerController = require('../controllers/register_controller');
const passport = require('../global_objects/configured_passport');
const { v4 } = require('uuid');

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


module.exports = router;
