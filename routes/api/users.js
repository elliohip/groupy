var express = require('express');
var router = express.Router();
var user_controller = require('../../controllers/user_controller');
var register_controller = require('../../controllers/register_controller');
var photos_router = require('./photos');

// router.use(express.json());

/* GET users listing. */
router.get('/', );


router.get('/:user_id', register_controller.authenticate_user, user_controller.get_user);

router.get('/:user_id/friends', register_controller.authenticate_user, user_controller.get_user_friends);

router.put('/:user_id', );


router.delete('/:user_id', );

// router.get('/:messages', );

// router.get('/init-groups', );


// this route requires user_id in the search params
router.use('/photos', photos_router);

router.post('/remove-friend/by-query', register_controller.authenticate_user, user_controller.remove_friend_query);

module.exports = router;
