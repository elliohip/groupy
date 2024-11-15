import { Server } from 'socket.io';
import {session_config as session_conf} from './session_config.mjs';
import http from 'http';

import { v4 as uuidv4 } from 'uuid';
import Group from '../database/Models/Group.mjs';

import clean_html from './clean_html.mjs';
/* 
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
*/



/**
 * @type {Server}
 */
var io;



/**
 * 
 * @param {http.Server} http_server
 */
export const init_io = (http_server) => {

    /**
     * 
     * TODO ONLY ALLOW HTTPS ORIGIN
     * @type {import('socket.io').ServerOptions | undefined}
     */
    
    let server_ops = {
        cors: {
            origin: 'http://localhost:3000/',
            credentials: true
        },
        allowEIO3: true
    };
    
    
     
    io = new Server(http_server, server_ops);
    io.engine.use(session_conf);

    io.engine.on("connection_error", (err) => {
        console.log(err.req);      // the request object
        console.log("socket err code: " + err.code);     // the error code, for example 1
        console.log("error message: " + err.message);  // the error message, for example "Session ID unknown"
        console.log(err.context);  // some additional error context
        console.log(err);
    });

    /*
    io.use((socket, next) => {
        if (socket.handshake.query) {
            let username = socket.handshake.query.username;
            socket.user = username;
            next();
        }
    });
    */

    
    io.on('connection', (socket) => {

        console.log("socket: " + socket.id + ' connected');
        console.log("socket url: " + socket.client.request.url);

        socket.on('join-demo-room', async (room_id) => {
            try {
                await socket.join(room_id);
                socket.broadcast.to(room_id).emit('user-joined');
                // socket.to(room_id)
                console.log(`room ${room_id}`);
            }
            catch (err) {
                console.log(err);
            }

        });

        socket.on('send-message', (room_id, message) => {
            let new_msg = {
                user_id: message.user_id,
                content : clean_html(message.content),
                username: message.username
            }
            socket.broadcast.to(room_id).emit('message-recieved', new_msg);
        });

        socket.on('disconnect', () => {
            let time_stamp = Date.now();
            for(let r in socket.rooms) {
                socket.broadcast.to(r).emit('user-left');
            }
            console.log(`user ${socket.id} disconnected at ${time_stamp}`);
        });

        socket.on('demo-left', async(room_id) => {
            socket.broadcast.to(room_id).emit('demo-left');
            console.log("user left room: " + room_id);
            if (room_id.split('-').length > 2) {
                socket.disconnect();
                return;
            }
            socket.disconnect();
            try {
                
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('user-left', async (room_id, user) => {
            socket.broadcast.to(room_id).emit('user-left', user);
            console.log(room_id);

            try {
                /**
                 * @type {String}
                 */
                let rom_type = room_id.split('-')[0];
                let objid = room_id.split('-')[1];
                socket.disconnect();
                if (rom_type.toLowerCase() != "group") {
                    
                }
                
            } catch(err) {
                console.log(err);
            }
        })
        socket.on('join-random-room', async (room_id, socket_id, user) => {
            try {
                await socket.join(room_id);
                socket.broadcast.to(room_id).emit('client-joined', socket_id, user);
            }
            catch (err) {
                console.log(err);
            }

        });

        socket.on('typing-start', (room_id) => {
            socket.broadcast.to(room_id).emit('typing-start');
        });

        socket.on('typing-end', (room_id) => {
            socket.broadcast.to(room_id).emit('typing-end');
        });
        socket.on('respond-to-join', (rm_id, sock_id, user) => {
            socket.broadcast.to(rm_id).emit('respond-to-join', rm_id, sock_id, user);
        });
        socket.on('add-friend', (socket_id, username, to_socket_id) => {
            socket.broadcast.to(to_socket_id).emit('friend-request', socket_id, username, to_socket_id);
        });


        socket.on('join-group', async (group_id, username, user_id, socket_id) => {
            let g_id = group_id.split('-')[1];
            if (group_id.split('-')[0] == "DMHistory") {
                return socket.join(group_id);
            }
            try {
                let g = await Group.findById(g_id);
                if (!(g.users.includes(user_id))) {
                    g.users.push(user_id);
                    await g.save();
                }

                console.log(socket.rooms);

                if (g != null) {
                    socket.join(group_id);
                    console.log('joined group: ' + group_id);
                }

            } catch (err) {
                console.log(err);
            }

        });

        socket.on('add-user-to-group', async (group_id, username, user_id, socket_id) => {
            let g_id = group_id.split('-')[1];
            try {
                socket.to(group_id).emit('user-added', group_id, username, socket_id);
            } catch (err) {
                console.log(err);
            }
        });

        socket.on('message-to-group', async (group_id, message) => {

            let grp_id = group_id.split('-')[1];
            if (!grp_id) {
                return;
            }

            let message_info = {
                user_id: message.user_id,
                group_id: grp_id,
                text: clean_html(message.text),
                username: message.username
            }
            console.log(`total groups:`);
            for (let sockt in socket.rooms.entries()) {
                console.log(sockt);
            }
            console.log(`message to group <${grp_id}> `)
            console.log(`total groups:`);
            
            socket.broadcast.to(group_id).emit('message-from-group', grp_id, message_info);
            
        });

    });

    
}

export default init_io;