var express = require('express');
var router = express.Router();
const registerController = require('../controllers/register_controller');
const passport = require('../global_objects/configured_passport');

router.post('/sign-up', 
registerController.sign_up,

);

router.post('/log-in',
passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/sign-up'
}), (req, res, next) => {
    console.log(req.user);
});

router.post('/logout', (req,res, next) => {
    try {
        req.logout();
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
