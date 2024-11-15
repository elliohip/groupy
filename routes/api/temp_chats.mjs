import express from 'express';
const router = express.Router();
import { promises as fs } from 'fs';
import path from 'path';
import register_controller from '../../controllers/register_controller.mjs';

import temp_chat_controller from '../../controllers/temp_chat_controller.mjs';



/* GET tempchats listing. */
router.get('/', function(req, res, next) {
   
});


router.get('/:temp_chat_id', temp_chat_controller.get_temp_chat);

/*
router.post('/', function(req, res, next) {

});
*/

router.delete('/:temp_chat_id/delete', temp_chat_controller.close_temp_chat);


router.post(':temp_chat_id')

router.put('/:temp_chat_id', function(req, res, next) {
  
});



var messages_router = express.Router();

messages_router.get("/", );
messages_router.post("/", );
messages_router.get("/:message_id", );
messages_router.delete("/:message_id", );

router.use('/:temp_chat_id/messages', messages_router);

export default router;