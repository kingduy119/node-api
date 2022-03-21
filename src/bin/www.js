#!/usr/bin/env node

//import "dotenv/config";
import http from "http";
import app from "~/app";
import logger from "~/core/logger";
import { PORT } from "~/core/config";
// import * as socket from "~/routes/socket"
// const debug = require('debug')('new-folder:server');

const port = normalizePort(PORT);
app.set('port', port);

// create http server
const server = http.createServer(app);

// Connect to socket.io
// socket.connect(server);

// Listen and events
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);







//Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) return val; // named pipe

  if (port >= 0) return port; // port number

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.info('[server] Listening on ' + bind);
}
