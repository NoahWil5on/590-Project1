let io;
let num;

// checks how many clients are in any given room
const getNumClients = (room) => {
  const clients = io.nsps['/'].adapter.rooms[room];

  // if the room doesn't exist yet then we return 0
  if (clients === undefined) {
    return 0;
  }
  return clients.length;
};
// anytime a client joins do this
const onJoined = (sock, host) => {
  const socket = sock;
  socket.join(`room${socket.room}`);

  // initialize a player object
  socket.player = {
    lastUpdate: new Date().getTime(),
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
    host,
  };

  // announce that you have joined
  socket.emit('join', socket.player);

  // tell other clients what room they are in
  // (this is a bit unecessary, I could have combined calls)
  socket.broadcast.to(`room${socket.room}`).emit('connecting', { num: socket.room });

  // if there are now two clients the game can begin
  if (!host) {
    io.to(`room${socket.room}`).emit('changeToCheck', {});
  }
};
// when the socket recieves a message do these
const onMessage = (sock) => {
  const socket = sock;

  // non host update player position
  socket.on('updatePlayer', (player) => {
    socket.broadcast.to(`room${socket.room}`).emit('updatePlayer', player);
  });
  // non host update ball position
  socket.on('updateBall', (ball) => {
    socket.broadcast.to(`room${socket.room}`).emit('updateBall', ball);
  });
  // non host update the score
  socket.on('updateScore', (score) => {
    socket.broadcast.to(`room${socket.room}`).emit('updateScore', score);
  });
  // non host announce hit wall
  socket.on('hitWall', () => {
    socket.broadcast.to(`room${socket.room}`).emit('hitWall', {});
  });
  // announce to others in the room that you're ready to begin game
  socket.on('ready', () => {
    socket.broadcast.to(`room${socket.room}`).emit('ready', {});
  });
  // update which room the server should select for new clients connecting to server
  socket.on('updateNum', (clientNum) => {
    if (num === clientNum.num) {
      num++;
    }
  });
};
// when a user leaves call this
const onDisconnect = (sock) => {
  const socket = sock;

  socket.on('disconnect', () => {
    socket.broadcast.to(`room${socket.room}`).emit('playerLeft', {});
  });
};
// initialize and configure server
const configure = (ioServer) => {
  io = ioServer;
  num = 0;

  // anytime there's a new connection run this
  io.on('connection', (sock) => {
    const socket = sock;
    let host = false;

    // chooses what room to put new user in and if they should be the host
    const roomNum = getNumClients(`room${num}`);
    switch (roomNum) {
      case 0:
        host = true;
        break;
      case 1:
        break;
      default:
        host = true;
        num++;
        break;
    }
    socket.room = num;

    onJoined(socket, host);
    onMessage(socket);
    onDisconnect(socket);
  });
};

module.exports.configure = configure;
