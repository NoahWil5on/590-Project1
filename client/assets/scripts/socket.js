"use strict";

let socket;
let lag = 20;
let updateInterval = undefined;

//initial connection to server
function connect(){
    socket = io.connect();
    if(updateInterval !== undefined){
        clearInterval(updateInterval);
    }

    //on joining the server, start up game
    socket.on('join', (player) => {
        console.log("join");
        app.main.host = player.host;
        
        if(app.main.canvas === undefined){
            app.main.init(player);
        }else{
            app.main.setup(player);
        }

        //update other clients on player and ball information every (lag) milliseconds
        updateInterval = setInterval(() => {
            socket.emit('updatePlayer', app.pong.player);
            if(app.main.host){
                socket.emit('updateBall', app.pong.ball)
            }
        },lag);
    });

    //when recieved updates the current room number client is in
    socket.on('connecting', (room) => {
        app.main.room = room;
    });
    //when recieved updates opponents player position
    socket.on('updatePlayer', (player2) => {
        app.pong.updatePlayer2(player2);
    });
    //when recieved updates the current ball position
    socket.on('updateBall', (ball) => {
        app.pong.updateClientBall(ball);
    });
    //when recieved upates the game score
    socket.on('updateScore', (score) => {
        app.main.leftScore = score.left;
        app.main.rightScore = score.right;
    });
    //recieving this call informs the client that their opponent is ready
    socket.on('ready', () => {
        app.start.opReady = true;
    });
    //when another opponent joins your room the app.start state changes to checking for them to be ready
    socket.on('changeToCheck', () => {
        app.start.currentState = app.start.GAME_STATE.CHECK;
    })
    //when a player leaves your room:
    socket.on('playerLeft', () => {
        //if at start state, find a new room
        if(app.main.currentState === app.main.GAME_STATE.START){
            disconnect();
            app.main.setup();
            connect();
        
        //if mid game, automatically win
        }else if(app.main.currentState === app.main.GAME_STATE.GAME){
            app.main.streak++;
            app.over.currentState = app.over.GAME_STATE.WIN;
            app.main.currentState = app.main.GAME_STATE.OVER;
            disconnect();
        }
    })
    //if this is recieved it means the host has detected that the ball has hit a wall
    socket.on('hitWall', () => {
        app.pong.color = "#ff0000";
        app.pong.collisionTimer = 0;
        app.pong.currentState = app.pong.GAME_STATE.COUNTDOWN;
        app.pong.countdown = 3;
    })
}
//informs non host that the ball has hit a wall
function sendHitWall(){
    socket.emit('hitWall', {});
}
//when called this will inform the server not to put more players in this room, even if it looks like it isn't full
function updateServerNum(){
    socket.emit('updateNum', {num: app.main.room});
}
//when called this will send the score from the client to the host
function sendScore(){
    var score = {
        left: app.main.leftScore,
        right: app.main.rightScore
    }
    socket.emit('updateScore', score);
}
//when called this will disconnect user from server
function disconnect(){
    socket.disconnect();
}
//when called informs opponent you are ready
function sendReady(){
    socket.emit('ready', {});
}
//when page loads call connect
function init(){
    connect();
}
window.onload = init;