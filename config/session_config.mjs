import ses from 'express-session';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
dotenv.config();

/*
store: new MongoStore({
        mongoUrl: process.env.MONGO_URL
    })
*/

let config = null;

if (process.env.MODE == "dev") {
    config = ses({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { 
                  secure: false,
                  maxAge: 1000 * 60 * 60 * 4,
                  httpOnly: true,
                },
        store: MongoStore.create({
            mongoUrl: process.env.TEST_MONGODB_URL
        })
    })
} else {
    config = ses({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { 
                secure: false,
                maxAge: 1000 * 60 * 60 * 4,
                httpOnly: true,
                },
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL
        })
    })
}

export const session_config = config;

export default config;