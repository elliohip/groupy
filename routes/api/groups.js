var express = require('express');
var router = express.Router();
var messages_router = require('./messages');

var register_controller = require('../../controllers/register_controller');

var group_controller = require('../../controllers/group_controller');

var Group = require('../../database/Models/Group');

/* GET users listing. */
router.get('/', function(req, res, next) {
   
});

router.get('/user-groups', register_controller.authenticate_user, group_controller.get_user_groups);


router.get('/:group_id', function(req, res, next) {
  
});


router.post('/', function(req, res, next) {
  
});


router.put('/:group_id', function(req, res, next) {
  
});


router.delete('/:group_id', function(req, res, next) {
  
});

router.use('/messages', messages_router);

module.exports = router;
