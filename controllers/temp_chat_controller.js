const TempChat = require('../database/Models/TempChat');

const async_handler = require('express-async-handler');

module.exports.get_temp_chat = async_handler(async (req, res, next) => {
    let temp_chat = await TempChat.findById(req.params.temp_chat_id);

    res.json(temp_chat);
});


module.exports.close_temp_chat = async_handler(async (req, res, next) => {
    await TempChat.findByIdAndUpdate(req.params.temp_chat_id, {
        status: 'closed'
    });
});

module.exports.create_temp_chat = async_handler(async (req, res, next) => {
    let u_domain = req.session.domain | 'demo';
    let t_c = await TempChat.create({
        status: 'open',
        domain: u_domain
    });
    res.json(t_c);
});

module.exports.delete_temp_chat = async_handler(async (req, res, next) => {
    await TempChat.findByIdAndDelete(req.body.direct_message_id);
});