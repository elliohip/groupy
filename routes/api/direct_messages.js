var express = require('express');
var router = express.Router();
var user_controller = require('../../controllers/user_controller');
var register_controller = require('../../controllers/register_controller');
var photos_router = require('./photos');

// router.use(express.json());

/* GET Direct-Messages for a user, returns a map that maps the  */
router.get('/', );


router.get('/:message_id', register_controller.authenticate_user, user_controller.get_user);

router.get('/:message_id/friends', register_controller.authenticate_user, user_controller.get_user_friends);

// router.put('/:message_id', );


// router.delete('/:message_id', );


module.exports = router;