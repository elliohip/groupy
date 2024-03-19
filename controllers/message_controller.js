var Message = require('../database/Models/message');
var async_handler = require('express-async-handler');

module.exports.get_messages = async_handler(async (req, res, next) => {
    let messages = await Message.find({
        group_id: req.params.group_id
    });
    
    res.status(200);
    res.json(messages);

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
        user_id: req.user.user_id,
        text: req.body.text
        });

    res.json(message);
});