import express from 'express';
const router = express.Router();
import friend_request_controller from '../../controllers/friend_request_controller.mjs';
import register_controller from '../../controllers/register_controller.mjs';

/* GET friend_requests listing. */


router.get('/:to_id/to', register_controller.authenticate_user, friend_request_controller.get_friend_requests_to);


router.get('/:from_id/from', register_controller.authenticate_user, friend_request_controller.get_friend_requests_from);


router.post('/', register_controller.authenticate_user,friend_request_controller.create_friend_request);

router.get('/:friend_request_id', register_controller.authenticate_user, friend_request_controller.get_friend_request);

router.put('/:friend_request_id', register_controller.authenticate_user, friend_request_controller.update_friend_request);


router.delete('/:friend_request_id', register_controller.authenticate_user, friend_request_controller.delete_friend_request);

router.put('/:friend_request_id/accept', register_controller.authenticate_user, friend_request_controller.accept_friend_request);

router.put('/:friend_request_id/reject', register_controller.authenticate_user, friend_request_controller.reject_friend_request);

export default router;
