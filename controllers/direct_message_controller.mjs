import { v4 as uuidv4 } from 'uuid';
import DirectMessageHistory from '../database/Models/DirectMessageHistory.mjs';

import async_handler from 'express-async-handler';

export const get_direct_message_history = async_handler(async (req, res, next) => {
    let direct_message_history = await DirectMessageHistory.findById(req.params.direct_message_history_id);

    res.json(direct_message_history);
});


export const update_direct_message_history = async_handler(async (req, res, next) => {

});


export const delete_direct_message_history = async_handler(async (req, res, next) => {
    await DirectMessageHistory.findByIdAndDelete(req.body.direct_message_id);
});


export const delete_direct_message = async_handler(async (req, res, next) => {
    await DirectMessageHistory.findOneAndUpdate({
        users: req.body.from_id
    }, {
        $pull: {
            messages: {
                message_id: req.body.message_id
            }
        }
    });
    res.status(200);
});


export const add_direct_message = async_handler(async (req, res, next) => {

    console.log(`
        \n\n
        total params: 
        ${req.query}

        \n\n
        `);
        try {
            await DirectMessageHistory.findOneAndUpdate({
                users: req.query.user_id
            }, {
                $push: {
                    messages: {
                        message_id: v4(),
                        to_id: req.query.to_id,
                        from_id: req.query.user_id,
                        text_content: req.query.text,
                        date_created: new Date(Number(req.query.time_created))
                    }
                }
                });
                res.json({message: "done"});
        } catch (e) {
            console.log(e);
        }

});

export const get_direct_messages = async (req, res, next) => {
    let dm_history = await DirectMessageHistory.findById(req.params.direct_message_history);
    res.json(dm_history.messages.filter((val) => {
        return (val.date_created.getMilliseconds() - Number(req.query.time_stamp)) < 0
    }));
}

export const get_direct_message_histories = async (req, res, next) => {
    let dm_histories = await DirectMessageHistory.find({
        users: req.session.user_id
    });
    res.json(dm_histories);
}

export const create_direct_message_history = async (req, res, next) => {

}

export default {
    get_direct_message_histories,
    get_direct_message_history,
    get_direct_messages,
    update_direct_message_history,
    create_direct_message_history,
    delete_direct_message,
    delete_direct_message_history,
    add_direct_message
}