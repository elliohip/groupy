var express = require('express');
var router = express.Router();
const registerController = require('../controllers/register_controller');
const passport = require('../global_objects/configured_passport');

router.post('/sign-up', 
registerController.sign_up, (req, res, next) => {
    res.status(200);
    next();
}
);

router.post('/log-in',
passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/sign-up'
}));

router.post('/logout', (req,res, next) => {
    try {
        req.logout();
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
