import express from 'express';
const router = express.Router();
import messages_controller from '../../controllers/message_controller.mjs';
import register_controller from '../../controllers/register_controller.mjs';
import path from 'path';
import { promises as fs } from 'fs';

import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

/* 
    Get messages by group, passing in the max time you want to
    load messaged back to for pagination, will store the current 
    max time in the session storage.  for native, it is required 
    that the native client keeps track of this data, and will be a different endpoint
*/
router.get('/:group_id', register_controller.authenticate_user, messages_controller.get_messages);

// router.get('/:group_id/latest-msg', register_controller.authenticate_user, messages_controller.get_messages);


var photo_message_store = multer.diskStorage({
    destination: async (req, file, cb) => {
        let d = path.resolve(`../../uploads/group/${req.body.group_id}/photo-messages`);
        try {
            await fs.access(d);
            return cb(null, d);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                await fs.mkdir(d);
                return cb(null, d);
            }
            console.log(err);
            cb(err);
        }
    },
    filename: async (req, file, cb) => {
        return cb(null, `${v4()}${path.extname(file.destination + '/' + req.params.group_id + '/' + file.originalname)}`);
    }
});

const upload_message = multer({
    storage: photo_message_store
});


router.get('/:group_id/latest-msg', register_controller.authenticate_user, messages_controller.get_latest_message);

// router.get('/:group_id/text-messages/:message_id', );


router.post('/:group_id/text-messages', register_controller.authenticate_user, messages_controller.create_message);


// router.put('/:group_id/text-messages/:message_id', );


// router.delete('/:group_id/text-messages/:message_id', );

// router.get('/:group_idphoto-messages', );

// posts a new photo message
router.post('/:group_id/photo-messages', register_controller.authenticate_user, upload_message.single('photo_up'), messages_controller.create_photo_message);

router.get('/:group_id/photo-messages/:photo_id');



export default router;
