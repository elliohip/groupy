var express = require('express');
var router = express.Router();
var friend_request_controller = require('../../controllers/friend_request_controller');
var register_controller = require('../../controllers/register_controller');

/* GET friend_requests listing. */
router.get('/:to_id', register_controller.authenticate_user, friend_request_controller.get_friend_requests_to);

/*
router.get('/:from_id', register_controller.authenticate_user, friend_request_controller.get_friend_requests_from);
*/

router.post('/', register_controller.authenticate_user,friend_request_controller.create_friend_request);

router.get('/:friend_request_id', register_controller.authenticate_user, friend_request_controller.get_friend_request);

router.put('/:friend_request_id', register_controller.authenticate_user, friend_request_controller.update_friend_request);


router.delete('/:friend_request_id', register_controller.authenticate_user, friend_request_controller.delete_friend_request);

router.put('/:friend_request_id/accept', register_controller.authenticate_user, friend_request_controller.accept_friend_request);


module.exports = router;
