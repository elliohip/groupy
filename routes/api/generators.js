// generates keys and numbers for users

var express = require('express');
var router = express.Router();
var photo_controller = require('../../controllers/photo_controller');
var register_controller = require('../../controllers/register_controller');
const { v4 } = require('uuid');
var mobile_rooms = require('../../global_objects/mobile_rooms');

/* gets room key for native apps.  TODO implement JWT */
router.get('/get-room-native', register_controller.authenticate_native,(req,res, next) => {
    let index = mobile_rooms.findIndex((val) => val.room_status == 'open')
    if (index != -1) {
        mobile_rooms[i].room_status = 'closed';
        res.json({
            room_id: mobile_rooms[i].room_id
        });
    }

    let new_room = {
        room_id: v4(),
        room_status: 'open'
    };
    mobile_rooms.push()
    res.json({
        room_id: new_room.room_id
    })
});

module.exports = router;