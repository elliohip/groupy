var users_router = require('./api/users');
var groups_router = require('./api/groups');
var friend_request_router = require('./api/friend_requests');
var generators_router = require('./api/generators');
var express = require('express');
var router = express.Router();
var register_controller = require('../controllers/register_controller');
var message_router = require('./api/messages');

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use('/users', users_router);
router.use('/groups', register_controller.authenticate_user, groups_router);
router.use('/friend-requests', register_controller.authenticate_user, friend_request_router);
router.use('/generators', generators_router);
router.use('/messages', register_controller.authenticate_user, message_router);


module.exports = router;