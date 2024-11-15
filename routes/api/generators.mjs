// generates keys and numbers for users

import express from 'express';
const router = express.Router();
import photo_controller from '../../controllers/photo_controller.mjs';
import register_controller from '../../controllers/register_controller.mjs';
import { v4 as uuidv4 } from 'uuid';
import mobile_rooms from '../../global_objects/mobile_rooms.mjs';

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

export default router;