"use strict";

//create or add to app
var app = app || {};

app.pong = {

    //all pong fields
    GAME_STATE: {
        COUNTDOWN: "countdown",
        PLAYING: "playing"
    },
    currentState: undefined,
    countdown: 3,
    ball: {
        rad: 20,
        vel: {
            x: 500,
            y: 500
        },
        pos: {
            x: 1000 / 2,
            y: 600 / 2
        }
    },
    player: undefined,
    player2: undefined,
    start: false,
    lagAlpha: .05,
    color: "#00ff00",
    collisionTimer: 10,

    //intialize fields, most imporantly reset key values to reset the game
    init: function (player) {
        this.start = false;
        this.lagAlpha = 1 / (lag / (1000 / 60));
        this.player2 = undefined;
        this.currentState = this.GAME_STATE.COUNTDOWN;
        this.countdown = 3;
        this.setup(player);
    },
    //do additional setup for the player object
    setup: function (player) {
        let x = 15;
        if(!app.main.host){
            x = app.main.WIDTH - 15;
        }
        this.player = {
            height: player.height,
            width: player.width,
            pos: { 
                    x, 
                    y: app.main.HEIGHT / 2 },
            vel: { x: 0, y: 0 }
        }
    },
    //routes what updates to call (+some generic updates than need to be done every frame)
    update: function () {
        this.collisionTimer++;

        //checks what gamestate to be updating
        switch(this.currentState){
            case this.GAME_STATE.COUNTDOWN:
                this.updateCountdown();
                break;
            case this.GAME_STATE.PLAYING:
                this.updateGame();
                break;
        };
        //update players movement
        this.updatePlayer(this.player);

        //update opponents client information with interpolation
        if(this.player2 !== undefined){
            this.interpolatePositions();
        }
        //make ball white
        if (this.collisionTimer > 30) {
            this.color = "#ffffff";
        }

        //call draw
        this.draw();
    },
    //only host calls this, it will update the ball position and check for collisions
    updateGame: function(){
        if (app.main.host) {
            this.updateBall();
            if (this.collisionTimer > 10) {
                this.updateCollision(this.player);
                this.updateCollision(this.player2);
            }
            this.updateBallWallCollision();
        }
    },
    //whenever the ball hits a (left/right) wall, reset the ball and start a countdown for the next round
    updateCountdown: function(){
        this.countdown -= app.main.dt;
        if(this.countdown <= 0){
            this.countdown = 3;
            this.currentState = this.GAME_STATE.PLAYING;
        }
        if(app.main.host){
            this.ball.pos.x = app.main.WIDTH / 2;
            this.ball.pos.y = app.main.HEIGHT / 2;
        }
    },
    //update ball collisions between players (not walls)
    updateCollision: function (player) {
        if (player === undefined) {
            return false;
        }
        if (checkCollision(player, this.ball)) {
            this.ball.pos.x += (this.ball.vel.x * -1) * app.main.dt;
            this.ball.vel.x *= -1;
            this.collisionTimer = 0;
            return true;
        }
        return false;
    },
    //update player position based on their velocity and key presses
    updatePlayer: function (player) {
        if (Key.isDown(Key.UP)) {
            player.vel.y -= 70;
            player.vel.y = Math.max(player.vel.y, -700);
        } else if (Key.isDown(Key.DOWN)) {
            player.vel.y += 70;
            player.vel.y = Math.min(player.vel.y, 700);
        } else {
            player.vel.y *= .85;
        }
        player.pos.y += player.vel.y * app.main.dt;

        //limit players position on the map
        this.boundPlayer(player);
    },
    //use interopalation to make up for lag
    interpolatePositions: function(){
        //other player
        this.player2.pos.x = lerp(this.player2.lastPos.x, this.player2.dest.x, this.player2.alpha);
        this.player2.pos.y = lerp(this.player2.lastPos.y, this.player2.dest.y, this.player2.alpha);
        this.player2.alpha += this.lagAlpha;
        if(this.player2.alpha > 1){
            this.player2.alpha = 1;
        }
        this.boundPlayer(this.player2);

        //ball
        if(!app.main.host){
            if(this.ball.pos.x === this.ball.lastPos.x &&
                this.ball.pos.y === this.ball.pos.y) return;
            this.ball.pos.x = lerp(this.ball.lastPos.x, this.ball.dest.x, this.ball.alpha);
            this.ball.pos.y = lerp(this.ball.lastPos.y, this.ball.dest.y, this.ball.alpha);
            this.ball.alpha += this.lagAlpha;
            if(this.ball.alpha > 1){
                this.ball.alpha = 1;
            }            
        }
    },
    //update opponents player position
    updatePlayer2: function (player2) {
        //create the opponent the first time around
        if(this.player2 === undefined){
            this.player2 = {
                height: player2.height,
                width: player2.width,
                lastPos: { x: player2.pos.x, y: player2.pos.y },
                pos: { x: player2.pos.x, y: player2.pos.y },
                alpha: this.lagAlpha,
                dest: { 
                    x: player2.vel.x * (lag / 1000)  + player2.pos.x, 
                    y: player2.vel.y * (lag / 1000)  + player2.pos.y 
                }
            }
            return;
        }
        //update their values any other time
        this.player2.lastPos = { x: this.player2.pos.x, y: this.player2.pos.y }
        this.player2.dest = { 
            x: player2.vel.x * (lag / 1000)  + player2.pos.x, 
            y: player2.vel.y * (lag / 1000)  + player2.pos.y 
        }
        this.player2.alpha = this.lagAlpha;
    },
    //keep player within the bounds of the scene
    boundPlayer: function (player) {
        if (player.pos.y - player.height / 2 < 0) {
            player.pos.y = player.height / 2;
            if(player.vel !== undefined){
                player.vel.y = 0;
            }
        } else if (player.pos.y + player.height / 2 > app.main.HEIGHT) {
            player.pos.y = app.main.HEIGHT - player.height / 2;
            if(player.vel !== undefined){
                player.vel.y = 0;
            }
        }
    },
    //simply move ball around based on its velocity
    updateBall: function () {
        this.ball.pos.x += this.ball.vel.x * app.main.dt;
        this.ball.pos.y += this.ball.vel.y * app.main.dt;
    },
    //update the balls collision with walls
    updateBallWallCollision: function () {
        //if the ball hits a left/right wall, someone scores and we call socket functions
        if (this.ball.pos.x - this.ball.rad < 0 || this.ball.pos.x + this.ball.rad > app.main.WIDTH) {
            this.color = "#ff0000";
            this.collisionTimer = 0;
            if (this.ball.pos.x < app.main.WIDTH / 2) {
                app.main.rightScore++;
            } else {
                app.main.leftScore++;
            }
            sendHitWall();
            sendScore();
            this.currentState = this.GAME_STATE.COUNTDOWN;
        }
        //if the ball hits a top/bottom wall simply deflect it
        if (this.ball.pos.y - this.ball.rad < 0 || this.ball.pos.y + this.ball.rad > app.main.HEIGHT) {
            this.ball.pos.y += this.ball.vel.y * -1 * app.main.dt;
            this.ball.vel.y *= -1;
        }
    },
    //only non host calls this, it updates their vision of the host's ball
    updateClientBall: function (ball) {
        //first time through setup the ball
        if(!this.start){
            this.ball = ball;
            this.ball.pos = {x: ball.x, y: ball.y};
            this.ball.lastPos = {x: ball.x, y: ball.y};
            this.ball.dest = {
                x: ball.vel.x * (lag / 1000) + ball.pos.x,
                y: ball.vel.y * (lag / 1000) + ball.pos.y
            };
            this.ball.alpha = this.lagAlpha;
            this.start = true;
            return;
        }
        //all other times through update the ball
        this.ball.lastPos = {x: ball.pos.x, y: ball.pos.y};
        this.ball.dest = {
            x: ball.vel.x * (lag / 1000) + ball.pos.x,
            y: ball.vel.y * (lag / 1000) + ball.pos.y
        };
        this.ball.alpha = this.lagAlpha;
    },
    //routes draw calls
    draw: function () {
        this.drawPlayer(this.player);
        if (this.player2 != undefined && this.player2) {
            this.drawPlayer(this.player2);
        }
        this.drawBall();
        this.drawScore();
        if(this.currentState === this.GAME_STATE.COUNTDOWN){
            this.drawCountDown();
        }
    },
    //draw the countdown you see after someone scores (or beginning of game)
    drawCountDown: function(){
        var ctx = app.main.ctx;
        ctx.save();

        ctx.font = '128pt Arial'
        ctx.textAlign = 'center';
        var x = app.main.WIDTH / 2;
        var y = app.main.HEIGHT - 75;
        ctx.fillStyle = "#00ff00";

        var cdVal = Math.floor(this.countdown) + 1;
        ctx.fillText(cdVal, x, y);

        ctx.restore();
    },
    //draw each players scores to the screen
    drawScore: function () {
        var ctx = app.main.ctx;

        ctx.save();

        //left score
        ctx.font = '30pt Arial'
        ctx.textAlign = 'right';
        var x = app.main.WIDTH / 2 - 10;
        if (app.main.host) {
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = '#00ff00';
        }
        ctx.fillText(app.main.leftScore, x, 50);

        //right score
        ctx.textAlign = 'left';
        x = app.main.WIDTH / 2 + 10;
        if (!app.main.host) {
            ctx.fillStyle = '#ffffff';
        } else {
            ctx.fillStyle = '#00ff00';
        }
        ctx.fillText(app.main.rightScore, x, 50);

        ctx.restore();
    },
    //draw any player past in
    drawPlayer: function (player) {
        var ctx = app.main.ctx;
        ctx.save();

        ctx.fillStyle = "#00ff00";
        ctx.fillRect(
            player.pos.x - player.width / 2,
            player.pos.y - player.height / 2,
            player.width, player.height
        );

        ctx.restore();
    },
    //draw the ball
    drawBall: function () {
        var ctx = app.main.ctx;
        ctx.save();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.ball.pos.x,
            this.ball.pos.y,
            this.ball.rad,
            0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}