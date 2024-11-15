import PhotoMessage from '../database/Models/PhotoMessage';
import Message from '../database/Models/Message';
import async_handler from 'express-async-handler';

import clean_html from '../config/clean_html.mjs';

export const get_messages = async_handler(async (req, res, next) => {
    console.log(req.query);

    

    
    let messages = await Message.find({
        group_id: req.params.group_id,
        createdAt: {
            $lt: Number(req.query.current_time)
        }
    });
    

    /*
    let has_photos = await PhotoMessage.find({
        group_id: req.params.group_id
    }).limit(100);
    */

    let photos = await PhotoMessage.find({
        group_id: req.params.group_id,
        createdAt: {
            $lt: Date.now()
        }
    });
    
    // sends over the messages
    if (!photos.length && !messages.length) {
        // if theres no messages
        res.status(200);
        return res.json({message: '<p> no messages </p>'});
    }

    res.status(200);
    let ret_dat = [...messages, ...photos].sort((a, b) => {
        if (a.createdAt < b.createdAt) {
            return -1;
        }
        else if (a.createdAt > b.createdAt) {
            return 1;
        }
        else {
            return 0;
        }
    });

    res.json(ret_dat);

})

export const get_message = async_handler(async (req, res, next) => {
    let message = await Message.findById(String(req.params.message_id));

    res.json(message);
});

export const update_message = async_handler(async (req, res, next) => {
    
})

export const delete_message = async_handler(async (req, res, next) => {

})

export const create_message = async_handler(async (req, res, next) => {
    
    console.log(req.body)
    console.log(`\n\n
        ALL PARAMS: 
        grp: ${req.body.group_id}
        usr: ${req.body.user_id}
        txt: ${req.body.text}
        \n\n`);

        try {
        let message = await Message.create({
            group_id: req.params.group_id,
            user_id: req.session.user_id,
            text: clean_html(req.query.text),
            username: req.query.username
        });
        console.log(message)
        res.json(message);
        } catch (e) {
            console.log(e);
        }
});


export const create_photo_message = async_handler(async (req, res, next) => {
    let msg = await PhotoMessage.create({
        photo_id: req.file.filename,
        group_id: req.params.group_id,
        username: req.session.username,
        user_id: req.session.user_id,
        caption: req.body.caption
    });

    return res.json(msg);
});

export const get_photo_messages = async_handler(async (req, res, next) => {
    let msgs = await PhotoMessage.find({
        group_id: req.params.group_id
    });

    return res.json(msgs);
});

export const get_photo_message = async_handler(async (req, res, next) => {
    
});

export const get_latest_message = async_handler(async (req, res, next) => {
    try {
    let latest = await (await Message.findOne({
        group_id: req.params.group_id
    }, {}).sort({
        "created_at": -1
    }).exec());
    res.json(latest);
} catch(err) {
    console.log(err);
}
});