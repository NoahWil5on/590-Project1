let io;
let num;

const getNumClients =(room) => {
  const clients = io.nsps["/"].adapter.rooms[room];

  if(clients === undefined){
    return 0;
  }
  return clients.length;
};

const onJoined = (sock,host) => {
  const socket = sock;
  socket.join(`room${socket.room}`);

  let x = 15;
  if (num % 2 === 1){
     x = 1000 - 15;
  }

  socket.player = {
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
    host: host
  };

  socket.emit('join', socket.player);
  socket.broadcast.to(`room${socket.room}`).emit('connecting', {num: socket.room});
};
const onMessage = (sock) => {
  const socket = sock;
  socket.on('updatePlayer', (player) => {
    socket.broadcast.to(`room${socket.room}`).emit('updatePlayer', player);
  });
  socket.on('updateBall', (ball) => {
    socket.broadcast.to(`room${socket.room}`).emit('updateBall', ball);
  })
  socket.on('updateScore', (score) => {
    socket.broadcast.to(`room${socket.room}`).emit('updateScore', score);
  })
  socket.on('ready', () => {
    socket.broadcast.to(`room${socket.room}`).emit('ready', {});
  })
  socket.on('updateNum', (clientNum) => {
    if(num === clientNum.num){
      num++;
    }
  })
};
const onDisconnect = (sock) => {
  socket.on('disconnect', () => {
    socket.broadcast.to(`room${socket.room}`).emit('playerLeft', {});
  })
}

const configure = (ioServer) => {
  io = ioServer;
  num = 0;

  io.on('connection', (sock) => {
    const socket = sock;
    let host = false;
    let roomNum = getNumClients(`room${num}`);
    if(roomNum === 0){
      host = true;
    }else if(roomNum !== 1){
      num++;
    }
    socket.room = num;


    onJoined(socket, host);
    onMessage(socket);
    onDisconnect(socket);
    num++;
  });
};

module.exports.configure = configure;
