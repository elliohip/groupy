var express = require('express');
var router = express.Router();
var messages_controller = require('../../controllers/message_controller');
var register_controller = require('../../controllers/register_controller');

/* GET users listing. */
router.get('/', register_controller.authenticate_user,messages_controller.get_messages);


router.get('/:message_id', );


router.post('/', );


router.put('/:message_id', );


router.delete('/:message_id', );



module.exports = router;
