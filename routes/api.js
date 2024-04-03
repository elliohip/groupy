var users_router = require('./api/users');
var groups_router = require('./api/groups');
var friend_request_router = require('./api/friend_requests');
var generators_router = require('./api/generators');
var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use('/users', users_router);
router.use('/groups', groups_router);
router.use('/friend-requests', friend_request_router);
router.use('/generators', generators_router)


module.exports = router;