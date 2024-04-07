var express = require('express');
var router = express.Router();

var index_controller = require('../controllers/index_controller');
var register_controller = require('../controllers/register_controller');
var current_rooms = require('../global_objects/current_rooms');
var demo_rooms = require('../global_objects/demo_rooms');

var {v4} = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user_id);
  
  res.render('index', { title: 'Express' });
  
});

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up')
});

router.get('/log-in', (req, res, next) => {
  res.render('log-in');
});

router.get('/dashboard', register_controller.authenticate_user, index_controller.render_dashboard);

router.get('/dashboard/:user_id', register_controller.authenticate_user_strict, index_controller.render_user_dashboard);

router.get('/demo', (req, res, next) => {
  let room = demo_rooms.findIndex((val) => val.room_status == 'open')
  if (room == -1) {
    let rm_obj = {
      room_id: v4(),
      room_status: 'open'
    };
    demo_rooms.push(rm_obj);
    return res.redirect(`/demo/${rm_obj.room_id}`);
  }
  demo_rooms[room].room_status = 'closed';
  return res.redirect(`/demo/${demo_rooms[room].room_id}`);
});

router.get('/demo/:room_id', index_controller.render_demo);

router.get('/random-chat', register_controller.authenticate_user, (req, res, next) => {
  let room = current_rooms.findIndex((val) => val.room_status == 'open')
  if (room == -1) {
    let rm_obj = {
      room_id: v4(),
      room_status: 'open'
    };
    current_rooms.push(rm_obj);
    return res.redirect(`/random-chat/${rm_obj.room_id}`);
  }
  current_rooms[room].room_status = 'closed';
  return res.redirect(`/random-chat/${current_rooms[room].room_id}`);
});

router.get('/random-chat/:room_id', register_controller.authenticate_user, index_controller.render_random_chat);

router.get('/user-profile', register_controller.authenticate_user, index_controller.render_user_profile);

router.get('/user-info/:user_id', register_controller.authenticate_user, index_controller.render_user_info)

module.exports = router;
