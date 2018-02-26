let io;
let num;
const users = {};

const onJoined = (sock) => {
  const socket = sock;

  socket.join('room1');

  let x = 15;
  if (num % 2 === 1) x = 1000 - 15;

  socket.player = {
    playerNum: num,
    lastUpdate: new Date().getTime(),
    pos: {
      x,
      y: 300,
    },
    prevPos: {
      x: 0,
      y: 0,
    },
    destPos: {
      x: 0,
      y: 0,
    },
    height: 100,
    width: 12,
  };
  users[num] = socket.player;

  socket.emit('connection', socket.player);
};
const onMessage = (sock) => {
  const socket = sock;
  socket.on('update', (player) => {
    socket.broadcast.to('room1').emit('update', player);
  });
};
const onDisconnect = (sock) => {
  const socket = sock;
  console.log(socket);
};

const configure = (ioServer) => {
  io = ioServer;
  num = 0;

  io.on('connection', (socket) => {
    onJoined(socket);
    onMessage(socket);
    onDisconnect(socket);

    num++;
  });
};

module.exports.configure = configure;
