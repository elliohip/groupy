import express from 'express';
const router = express.Router();
import photo_controller from '../../controllers/photo_controller.mjs';
import register_controller from '../../controllers/register_controller.mjs';

import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { promises as fs } from 'fs';

const user_pfp_storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        if (!req.session.user_id) {
            cb(new Error('no user'))
        }
        try {
            let check_exists = await fs.access(path.resolve(`uploads/user/${req.session.user_id}`));

            return cb(null, path.resolve(`uploads/user/${req.session.user_id}`));
        } catch (err) {
            if (err && err.code === 'ENOENT') {
                await fs.mkdir(path.resolve(`uploads/user/${req.session.user_id}`));
                return cb(null, path.resolve(`uploads/user/${req.session.user_id}`));
            } else {
                console.log(err);
            }
        }
    },
    filename: async (req, file, cb) => {
        if (!req.session.user_id) {
            cb(new Error('no user'))
        }
        else {
            console.log(file);
            let n = `${v4()}${path.extname(file.destination + '/' + file.originalname)}`;
            cb(null, n);
        }
    }
});

const upload = multer({storage: user_pfp_storage});

/* GET photos listing. */
// router.get('/', );

router.get('/pfp', photo_controller.get_profile_pic);

router.get('/user-photos', register_controller.authenticate_user, photo_controller.get_user_pic_ids);

router.get('/get-user-pic/:photo_id', register_controller.authenticate_user, photo_controller.get_user_pic_by_id);

router.get('/pfp-by-id/:user_id', register_controller.authenticate_user, photo_controller.get_pfp_by_id);

router.post('/',register_controller.authenticate_user, upload.single('photo_up'), photo_controller.add_picture);

router.get('/by-id', register_controller.authenticate_user, photo_controller.get_pic_by_id);

// router.put('/:photo_id');

router.delete('/delete/:photo_id', register_controller.authenticate_user, photo_controller.delete_photo);


export default router;
