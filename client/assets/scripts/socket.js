"use strict";
let socket;
let myNum;

const connect = () => {
    console.log("connect");
    socket = io.connect();

    socket.on('join', (player) => {
        console.log("join");
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
function init(){
    console.log("init");
    connect();
}
function run(){
    console.log("run");
}
//window.onload = init;
window.onload = run();
console.log("execute");