var express = require('express');
var router = express.Router();
var messages_router = require('./messages');

/* GET users listing. */
router.get('/', function(req, res, next) {
   
});


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
