const DirectMessageHistory = require('../database/Models/DirectMessageHistory');

const async_handler = require('express-async-handler');

module.exports.get_direct_message_history = async_handler(async (req, res, next) => {
    let direct_message_history = await direct_message_history.findById(req.params.direct_message_history_id);

    res.json(direct_message_history);
});


module.exports.update_direct_message_history = async_handler(async (req, res, next) => {

});


module.exports.delete_direct_message_history = async_handler(async (req, res, next) => {
    await DirectMessageHistory.findByIdAndDelete(req.body.direct_message_id);
});


module.exports.delete_direct_message = async_handler(async (req, res, next) => {
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


module.exports.add_direct_message = async_handler(async (req, res, next) => {
    await DirectMessageHistory.findOneAndUpdate({
        users: req.body.from_id
    }, {
        $push: {
            messages: {
                message_id: v4(),
                to_id: req.body.to_id,
                from_id: req.body.from_id,
                text_content: req.body.text_content,
                date_created: new Date(Number(req.body.time_created))
            }
        }
    });

});

module.exports.get_direct_message = async (req, res, next) => {

}