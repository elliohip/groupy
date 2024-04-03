var express = require('express');
var router = express.Router();
var photo_controller = require('../../controllers/photo_controller');
var register_controller = require('../../controllers/register_controller');

const multer  = require('multer');
const path = require('path');
const { v4 } = require('uuid');

const user_pfp_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!req.user) {
            cb(new Error('no user'))
        }
        cb(null, path.resolve(`../../uploads/user/${req.user.user_id}/photos/${v4()}`));
    }
});

const upload = multer({storage: user_pfp_storage});

/* GET photos listing. */
// router.get('/', );

router.get('/pfp', photo_controller.get_profile_pic);

router.get('/user-photos', register_controller.authenticate_user, photo_controller.get_user_pic_ids);

router.post('/',  express.json(),register_controller.authenticate_user, upload.single('photo_up'), photo_controller.add_picture);

router.get('/by-id/:photo_id', register_controller.authenticate_user, photo_controller.get_pic_by_id);

// router.put('/:photo_id');

router.delete('/delete/:photo_id', register_controller.authenticate_user, photo_controller.delete_photo);


module.exports = router;
