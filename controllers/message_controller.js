const PhotoMessage = require('../database/Models/PhotoMessage');
var Message = require('../database/Models/message');
var async_handler = require('express-async-handler');

module.exports.get_messages = async_handler(async (req, res, next) => {
    console.log(req.query);

    

    
    let messages = await Message.find({
        group_id: req.params.group_id,
        createdAt: {
            $lt: Date.now()
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

module.exports.get_message = async_handler(async (req, res, next) => {
    let message = await Message.findById(String(req.params.message_id));

    res.json(message);
});

module.exports.update_message = async_handler(async (req, res, next) => {
    
})

module.exports.delete_message = async_handler(async (req, res, next) => {

})

module.exports.create_message = async_handler(async (req, res, next) => {

    let message = await Message.create({
        group_id: req.params.group_id,
        user_id: req.session.user_id,
        text: req.body.text
        });

    res.json(message);
});


module.exports.create_photo_message = async_handler(async (req, res, next) => {
    let msg = await PhotoMessage.create({
        photo_id: req.file.filename,
        group_id: req.params.group_id,
        username: req.session.username,
        user_id: req.session.user_id,
        caption: req.body.caption
    });

    return res.json(msg);
});

module.exports.get_photo_messages = async_handler(async (req, res, next) => {
    let msgs = await PhotoMessage.find({
        group_id: req.params.group_id
    });

    return res.json(msgs);
});

module.exports.get_photo_message = async_handler(async (req, res, next) => {
    
});