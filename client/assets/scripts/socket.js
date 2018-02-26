"use strict";
let socket;
let myNum;

const connect = () => {
    socket = io.connect();

    socket.on('connection', (player) => {
        myNum = player.playerNum;
        app.main.init(player);
        setInterval(() => {
            socket.emit('update', app.pong.player);
        },10)
    });
    socket.on('update', (player2) => {
        app.pong.updatePlayer2(player2);
    })
}
const init = () => {
    connect();
}
window.onload = init;