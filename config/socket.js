const { Server } = require('socket.io');
const session_conf = require('./session_config');
const http = require('http');
const socket = require('socket.io');


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

        socket.on('join-room', async (room_id, peer_id, domain) => {
            try {
                await socket.join(room_id);
                // socket.to(room_id)
                socket.to(room_id).emit('connect-user', peer_id);
                console.log(`peer ${peer_id} joined room ${room_id}`);
            }
            catch (err) {
                console.log(err);
            }

        });


        socket.on('disconnect', () => {
            let time_stamp = Date.now();
            console.log(`user ${socket.id} disconnected at ${time_stamp}`);
        });
    
    });

    
}