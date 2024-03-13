var users_router = require('./api/users');
var groups_router = require('./api/groups');
var group_instance_router = require('./api/group_instances');
var express = require('express');
var router = express.Router();

router.use('/users', users_router);
router.use('/groups', groups_router);
router.use('/group-instances', group_instance_router);

module.exports = router;