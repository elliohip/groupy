import express from 'express';
const router = express.Router();
import index_controller from '../controllers/index_controller.mjs';
import register_controller from '../controllers/register_controller.mjs';

import {promises as fs} from "fs"
// import currentRooms from '../global_objects/current_rooms';
// import demoRooms from '../global_objects/demo_rooms';


import { v4 as uuidv4 } from 'uuid';
import TempChat from '../database/Models/TempChat.mjs';
import path from 'path';

/**
 * @type {String[]}
 */
var curr_domains = JSON.parse(await fs.readFile(path.resolve('./uploads/domains.json')));

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.user_id);

  res.render('index', { domains: curr_domains });
  
});

router.get('/terms-of-service', (req, res, next) => {
  res.render('terms-of-service')
})

router.get('/sign-up', (req, res, next) => {
  res.render('sign-up')
});

router.get('/log-in', (req, res, next) => {
  res.render('log-in');
});

router.get('/dashboard', register_controller.authenticate_user, index_controller.render_user_dashboard);

router.get('/dashboard/:user_id', register_controller.authenticate_user_strict, index_controller.render_user_dashboard);

router.get('/demo', async (req, res, next) => {

  /* let room = demo_rooms.findIndex((val) => val.room_status == 'open')
  if (room == -1) {
    let rm_obj = {
      room_id: v4(),
      room_status: 'open'
    };
    demo_rooms.push(rm_obj);
    return res.redirect(`/demo/${rm_obj.room_id}`);
  }
  demo_rooms[room].room_status = 'closed';
  return res.redirect(`/demo/${demo_rooms[room].room_id}`);*/

  let open_chat = await TempChat.findOneAndUpdate({
    status: 'open',
    domain: 'demo'
  }, {
    status: 'in-call'
  });

  if (!open_chat) {
    let t_c = await TempChat.create({
      status: 'open',
      domain: 'demo'
    });
    req.session.curr_call_status = "o";
    return res.redirect(`/demo/TempChat-${t_c._id}`);
  }
  req.session.curr_call_status = "ic";
  return res.redirect(`/demo/TempChat-${open_chat._id}`);


});

router.get('/demo/:room_id', index_controller.render_demo);

router.get('/random-chat', register_controller.authenticate_user, async (req, res, next) => {
  /*
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
  */
  let open_chat = await TempChat.findOneAndUpdate({
    status: 'open',
    domain: req.session.domain
  }, {
    status: 'in-call'
  });

  if (!open_chat) {
    let t_c = await TempChat.create({
      status: 'open',
      domain: req.session.domain
    });
    req.session.curr_call_status = "o";
    return res.redirect(`/random-chat/TempChat-${t_c._id}`);
  }
  req.session.curr_call_status = "ic";
  return res.redirect(`/random-chat/TempChat-${open_chat._id}`);
});

router.get('/random-chat/:room_id', register_controller.authenticate_user, index_controller.render_random_chat);

router.get('/user-profile', register_controller.authenticate_user, index_controller.render_user_profile);

router.get('/user-info/:user_id', register_controller.authenticate_user, index_controller.render_user_info)

router.get('/view-direct-messages', register_controller.authenticate_user, index_controller.render_direct_messages);

router.get('/signup-wait', (req, res, next) => {
  res.render('signup-wait');
});

router.get('/add-your-school', index_controller.render_add_school);


export default router;
