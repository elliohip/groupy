var express = require('express');
var router = express.Router();
var friend_instance_controller = require('../../controllers/friend_instance_controller');
var register_controller = require('../../controllers/register_controller');

/* GET friend_instances listing. */
router.get('/:user_id', register_controller.authenticate_user, friend_instance_controller.get_friend_instances);

router.get('/:friend_instance_id', register_controller.authenticate_user, friend_instance_controller.get_friend_instance);

router.put('/:friend_instance_id', register_controller.authenticate_user, friend_instance_controller.update_friend_instance);

router.post('/', register_controller.authenticate_user, friend_instance_controller.create_friend_instance);

router.delete('/:friend_instance_id', register_controller.authenticate_user, friend_instance_controller.delete_friend_instance);




module.exports = router;
