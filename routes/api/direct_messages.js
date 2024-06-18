var express = require('express');
var router = express.Router();
var user_controller = require('../../controllers/user_controller');
var register_controller = require('../../controllers/register_controller');
var photos_router = require('./photos');

var direct_message_controller = require('../../controllers/direct_message_controller');

// router.use(express.json());

/* GET Direct-Messages for a user, returns a map that maps the  */

router.post("/", direct_message_controller.create_direct_message_history)
router.get('/', direct_message_controller.get_direct_message_histories);


// router.get('/:dm_history_id/messages/:message_id', direct_message_cont);

router.get('/:dm_history_id/messages/', direct_message_controller.get_direct_messages);

router.put('/:dm_history_id/add-message', direct_message_controller.add_direct_message);

// router.put('/:message_id', );


// router.delete('/:message_id', );


module.exports = router;