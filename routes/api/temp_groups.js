var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
const path = require('path');
var register_controller = require('../../controllers/register_controller');

var temp_group_controller = require('../../controllers/temp_group_controller');

var multer = require('multer');
var temp_group_photo_storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        if (!req.body.temp_group_id) {
            cb(new Error('no temp_group id param'));
        }
        try {
            await fs.access(path.resolve(`uploads/temp_group/${req.body.temp_group_id}/temp_group-photo`));
            return cb(null, path.resolve(`uploads/temp_group/${req.body.temp_group_id}/temp_group-photo`));
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                await fs.mkdir(path.resolve(`uploads/temp_group/${req.body.temp_group_id}/temp_group-photo`));
                
                return cb(null, path.resolve(`uploads/temp_group/${req.body.temp_group_id}/temp_group-photo`));
            }
            else {
                console.log(err);
                return cb(err);
            }
        }
    },
    filename: async (req, file, next) => {
        if (!req.body.temp_group_id) {
            cb(new Error('no temp_group'));
        }
        else {
            console.log(file);
            let n = `${v4()}${path.extname(file.destination + '/' + file.originalname)}`;
            cb(null, n);
        }
    }
});

const upload_temp_group = multer({
    storage: temp_group_photo_storage
});

var temp_group = require('../../database/Models/temp_group');



/* GET users listing. */
router.get('/', function(req, res, next) {
   
});

router.get('/user-temp_groups', register_controller.authenticate_user, temp_group_controller.get_user_temp_groups);


router.get('/:temp_group_id', temp_group_controller.get_temp_group);

router.get('/:photo_id', temp_group_controller.get_temp_group_photo);


router.post('/', function(req, res, next) {
  
});

router.get('/:temp_group_id/temp_group_photo/:photo_id', register_controller.authenticate_user, temp_group_controller.get_temp_group_photo);
router.post('/temp_group_photo', upload_temp_group.single('photo_up'), temp_group_controller.create_temp_group_photo);

router.post('/new-temp_group', register_controller.authenticate_user, temp_group_controller.create_temp_group);

router.put('/:temp_group_id', function(req, res, next) {
  
});


router.delete('/:temp_group_id', function(req, res, next) {
  
});


var messages_router = express.Router();

messages_router.get("/", );
messages_router.post("/", );
messages_router.get("/:message_id", );
messages_router.delete("/:message_id", );

router.use('/:temp_group_id/messages', messages_router);

module.exports = router;