const ses = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();
module.exports = ses({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
              secure: false,
              maxAge: 1000 * 60 * 60 * 4,
              httpOnly: true
            },
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URL
    })
});