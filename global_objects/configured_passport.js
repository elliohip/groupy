const passport = require('passport')

const init_passport = require('../config/init_passport');

init_passport(passport);

module.exports = passport;