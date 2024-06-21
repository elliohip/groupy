var express = require('express');
var router = express.Router();
var messages_router = require('./messages');
const fs = require('fs').promises;
const path = require('path');
var register_controller = require('../../controllers/register_controller');

var group_controller = require('../../controllers/group_controller');

var multer = require('multer');
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

var Group = require('../../database/Models/Group');



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

module.exports = router;
