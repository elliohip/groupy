var express = require('express');
var router = express.Router();
var user_controller = require('../../controllers/user_controller');
var register_controller = require('../../controllers/register_controller');
var photos_router = require('./photos');
var direct_message_router = require('./direct_messages.js');

// router.use(express.json());

/* GET users listing. */
// router.get('/', );


router.get('/:user_id', register_controller.authenticate_user, user_controller.get_user);

router.get('/:user_id/friends', register_controller.authenticate_user, user_controller.get_user_friends);

// router.put('/:user_id', );


// router.delete('/:user_id', );

// router.post('/remove-friend/by-query', register_controller.authenticate_user, user_controller.remove_friend_query);

router.put('/:user_id/remove-friend-q', register_controller.authenticate_user, user_controller.remove_friend_query);

// router.get('/:messages', );

// router.get('/init-groups', );


// this route requires user_id in the search params
router.use('/photos', photos_router);
router.use('/:user_id/direct-messages', register_controller.authenticate_user_strict_q, direct_message_router);


module.exports = router;
