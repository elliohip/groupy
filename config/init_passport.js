var LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const User = require('../database/Models/User');
const passport = require('passport');
const path = require('path');
var fs = require('fs').promises

/**
 * 
 * @param {passport} pass 
 */
module.exports = (pass) => {

    pass.use('local',
    new LocalStrategy(async (username, password, done) => {
        try{
            let user = await User.findOne({
                username: username
            });
            if (!user) {
                return done(null, false)
            }
            let check_pass = await bcrypt.compare(password, user.hashed_password);
            if (!check_pass) {
                return done(null, false)
            }
            let log_user = {
                user_id: user.id,
                username: user.username,
                email: user.email
            }

            return done(null, log_user);
        } catch (err) {
        console.log(err);
        
        }
        
    }));


    pass.serializeUser(function(user, done) {
        process.nextTick(function() { 

                return done(null, { 
                user_id: user.user_id, 
                username: user.username,
                email: user.email
            });
        })
    });

    pass.deserializeUser(function(user, done) {
        process.nextTick(function() { 
            console.log(user);
            return done(null, user);
    
        });
    });

}