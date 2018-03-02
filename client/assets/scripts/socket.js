"use strict";

let socket;

function connect(){
    socket = io.connect();

    socket.on('join', (player) => {
        app.main.host = player.host;
        app.main.init(player);
        setInterval(() => {
            socket.emit('updatePlayer', app.pong.player);
            if(app.main.host){
                socket.emit('updateBall', app.pong.ball)
            }
        },10);
    });
    socket.on('connecting', (room) => {
        app.main.room = room;
    })
    socket.on('updatePlayer', (player2) => {
        app.pong.updatePlayer2(player2);
    });
    socket.on('updateBall', (ball) => {
        app.pong.updateClientBall(ball);
    });
    socket.on('updateScore', (score) => {
        app.main.leftScore = score.left;
        app.main.rightScore = score.right;
    });
    socket.on('ready', () => {
        app.start.opReady = true;
    });
    socket.on('playerLeft', () => {
        if(app.main.currentState === app.main.GAME_STATE.START){
            app.start.currentState = app.main.GAME_STATE.WAIT;
            app.main.host = true;
        }else if(app.main.currentState === app.main.GAME_STATE.GAME){
            app.main.currentState = app.main.GAME_STATE.OVER;
            app.win = true;
        }
    })
}
function updateServerNum(){
    socket.emit('updateNum', {num: app.main.room});
}
function sendScore(){
    var score = {
        left: app.main.leftScore,
        right: app.main.rightScore
    }
    socket.emit('updateScore', score);
}
function sendReady(){
    socket.emit('ready', {});
}

function init(){
    connect();
}
window.onload = init;