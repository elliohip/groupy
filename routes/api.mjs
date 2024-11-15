import users_router from './api/users.mjs';
import groups_router from './api/groups.mjs';
import friend_request_router from './api/friend_requests.mjs';
import generators_router from './api/generators.mjs';
import express from 'express';
const router = express.Router();
import register_controller from '../controllers/register_controller.mjs';
import message_router from './api/messages.mjs';
import tempchat_router from './api/temp_chats.mjs';

import bodyParser from 'body-parser';

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use('/users', users_router);
router.use('/tempchats', tempchat_router);
router.use('/groups', register_controller.authenticate_user, groups_router);
router.use('/friend-requests', register_controller.authenticate_user, friend_request_router);
router.use('/generators', generators_router);
router.use('/messages', register_controller.authenticate_user, message_router);


export default router;