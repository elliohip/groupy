import express from 'express';
const router = express.Router();
import user_controller from '../../controllers/user_controller.mjs';
import register_controller from '../../controllers/register_controller.mjs';
import photos_router from './photos.mjs';
import direct_message_router from './direct_messages.mjs';

// router.use(express.json());

/* GET users listing. */
// router.get('/', );


router.get('/:user_id', register_controller.authenticate_user, user_controller.get_user);

router.get('/:user_id/friends', register_controller.authenticate_user, user_controller.get_user_friends);

// router.put('/:user_id', );


// router.delete('/:user_id', );

// router.post('/remove-friend/by-query', register_controller.authenticate_user, user_controller.remove_friend_query);

router.put('/:user_id/remove-friend', register_controller.authenticate_user, user_controller.remove_friend);

// router.get('/:messages', );

// router.get('/init-groups', );


// this route requires user_id in the search params
router.use('/photos', photos_router);
router.use('/:user_id/direct-messages', register_controller.authenticate_user_strict, direct_message_router);


export default router;
