import express from 'express';
const router = express.Router();
import messages_router from './messages.mjs';
import { promises as fs } from 'fs';
import path from 'path';
import register_controller from '../../controllers/register_controller.mjs';

import group_controller from '../../controllers/group_controller.mjs';
import Group from '../../database/Models/Group';
import multer from 'multer';

var group_photo_storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        if (!req.body.group_id) {
            cb(new Error('no group id param'));
        }
        try {
            await fs.access(path.resolve(`uploads/group/${req.body.group_id}/group-photo`));
            return cb(null, path.resolve(`uploads/group/${req.body.group_id}/group-photo`));
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                await fs.mkdir(path.resolve(`uploads/group/${req.body.group_id}/group-photo`));
                
                return cb(null, path.resolve(`uploads/group/${req.body.group_id}/group-photo`));
            }
            else {
                console.log(err);
                return cb(err);
            }
        }
    },
    filename: async (req, file, next) => {
        if (!req.body.group_id) {
            cb(new Error('no group'));
        }
        else {
            console.log(file);
            let n = `${v4()}${path.extname(file.destination + '/' + file.originalname)}`;
            cb(null, n);
        }
    }
});

const upload_group = multer({
    storage: group_photo_storage
});


/* GET users listing. */
router.get('/', function(req, res, next) {
   
});

router.get('/get-user-groups', register_controller.authenticate_user, group_controller.get_user_groups);


router.get('/by-id/:group_id', register_controller.authenticate_user,group_controller.get_group);

router.get('/group-photo/:group_id', group_controller.get_group_photo);

router.get('/group-photo-default', group_controller.get_group_photo_default);

// router.get('/:group_id/group_photo/:photo_id', register_controller.authenticate_user, group_controller.get_group_photo);
router.post('/group-photo', upload_group.single('photo_up'), group_controller.create_group_photo);

router.post('/new-group', register_controller.authenticate_user, group_controller.create_group_with_query);

/*
router.put('/update/:group_id', function(req, res, next) {
  
});
*/
router.put('/add-user/:group_id', register_controller.authenticate_user, group_controller.add_user);

router.delete('/delete/:group_id', function(req, res, next) {
  
});

router.use('/by-id/:group_id/messages',messages_router);

export default router;
