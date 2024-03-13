var express = require('express');
var router = express.Router();

var index_controller = require('../controllers/index_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up')
});

router.get('/log-in', (req, res, next) => {
  res.render('log-in');
});

router.get('/dashboard', )


module.exports = router;
