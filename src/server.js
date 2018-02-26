const http = require('http');
const path = require('path');
const sockets = require('./sockets.js');
const socketio = require('socket.io');
const express = require('express');

const app = express();

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

app.use('/assets', express.static(path.resolve(`${__dirname}/../client/assets/`)));
app.get('/', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
});

const server = http.createServer(app);
const io = socketio(server);

sockets.configure(io);
server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${PORT}`);
});

