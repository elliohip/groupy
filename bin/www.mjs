#!/usr/bin/env node

import path from 'path';
import app from '../app';
import debug from 'debug';
import http from 'http';
import socketFuncs from '../config/socket';
import httpProxy from 'http-proxy';
import { promises as fs } from 'fs';
import mongoose from 'mongoose';
// import MemoryStore from 'memorystore'; // If needed, uncomment and install the package
var connection = null;
var server = null;
function create_server() { 
  server = http.createServer(app, (req, res) => {
    proxy.web(req, res);
  });
  
  /* for http-proxy, will switch to nginx
  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });
  */
  socket_funcs.init_io(server);                   // init socket.io server 
  
  /**
   * Listen on provided port, on all network interfaces.
   */
  
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

async function connect_to_db_and_start_server() {
  if (process.env.MODE != "dev") {
    try {

      connection = mongoose.connect(process.env.MONGO_URL)
      create_server();

    } catch (err) {

      console.log(err);
    }
  }
  else {
    try {
      connection = await mongoose.connect(process.env.TEST_MONGODB_URL)
      create_server();

    } catch (err) {
      console.log(err);
    }
  }
}

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

var proxy = httpProxy.createProxyServer({
  target: process.env.BASE_PATH
});



// tries to see if uploads exists


/**
 * Create HTTP server.
 */

try {
  await fs.mkdir(path.resolve("./uploads"))
  await connect_to_db_and_start_server();
} catch (err) {
  console.log(err);
  await connect_to_db_and_start_server();
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(1);
});