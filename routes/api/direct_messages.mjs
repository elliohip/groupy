import express from 'express';
const router = express.Router();
import user_controller from '../../controllers/user_controller.mjs';
import register_controller from '../../controllers/register_controller.mjs';
import photos_router from './photos.mjs';

import direct_message_controller from '../../controllers/direct_message_controller.mjs';

// router.use(express.json());

/* GET Direct-Messages for a user, returns a map that maps the  */

router.post("/", direct_message_controller.create_direct_message_history)
router.get('/', direct_message_controller.get_direct_message_histories);


// router.get('/:dm_history_id/messages/:message_id', direct_message_cont);

router.get('/:dm_history_id/messages/', direct_message_controller.get_direct_messages);

router.put('/:dm_history_id/add-message', direct_message_controller.add_direct_message);

// router.put('/:message_id', );


// router.delete('/:message_id', );


export default router;