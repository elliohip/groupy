import TempChat from '../database/Models/TempChat';

import async_handler from 'express-async-handler';

import clean_html from '../config/clean_html.mjs';

export const get_temp_chat = async_handler(async (req, res, next) => {
    let temp_chat = await TempChat.findById(req.params.temp_chat_id);

    res.json(temp_chat);
});


export const close_temp_chat = async_handler(async (req, res, next) => {
    await TempChat.findByIdAndDelete(req.params.temp_chat_id);
});

export const create_temp_chat = async_handler(async (req, res, next) => {
    let u_domain = req.session.domain | 'demo';
    let t_c = await TempChat.create({
        status: 'open',
        domain: u_domain
    });
    res.json(t_c);
});

export const delete_temp_chat = async_handler(async (req, res, next) => {
    await TempChat.findByIdAndDelete(req.body.direct_message_id);
});