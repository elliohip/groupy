var express = require('express');
var router = express.Router();
var user_controller = require('../../controllers/user_controller');
var register_controller = require('../../controllers/register_controller');
var photos_router = require('./photos');

// router.use(express.json());

/* GET users listing. */
router.get('/', );

/*
router.get('/:user_id', );

router.put('/:user_id', );


router.delete('/:user_id', );

router.get('/:messages', );

router.get('/init-groups', );
*/

// this route requires user_id in the search params
router.use('/photos', photos_router)

module.exports = router;
