const { Server } = require('socket.io');
const session_conf = require('./session_config');
const http = require('http');
const socket = require('socket.io');
var group_map = require('../global_objects/group_map');
const { v4 } = require('uuid');

/**
 * @type {Server}
 */
var io;



/**
 * 
 * @param {http.Server} http_server
 */
module.exports.init_io = (http_server) => {

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
            socket.broadcast.to(room_id).emit('message-recieved', message);
        });

        socket.on('disconnect', () => {
            let time_stamp = Date.now();
            console.log(`user ${socket.id} disconnected at ${time_stamp}`);
        });
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


        socket.on('join-group', (group_id_solid, username, user_id, socket_id) => {
            let g_id = group_map.get(group_id_solid);
            if (!g_id) {
                g_id = v4();
                group_map.set(group_id_solid, g_id);

            }
        });
    });

    
}