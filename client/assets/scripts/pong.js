"use strict";

var app = app || {};

app.pong = {
    ball: {
        rad: 20,
        vel: {
            x: 10,
            y: 10
        },
        pos: {
            x: 1000 / 2,
            y: 600 / 2
        }
    },
    
    player: undefined,
    player2: undefined,

    color: "#00ff00",
    collisionTimer: 10,

    init: function(player){
        this.player = {
            height: player.height,
            width: player.width,
            pos: {x: player.pos.x, y: player.pos.y},
            vel: {x: 0, y: 0}
        }
    },
    update: function(){
        this.collisionTimer++;
        this.updatePlayer(this.player);
        //this.updatePlayer(this.player2);
        this.updateBall();
        if(this.collisionTimer > 10){
            if(this.updateCollision(this.player) ||
            this.updateCollision(this.player)){
                this.color = "#0000ff";
            }else{
                this.color = "#00ff00";
            }
        }

        this.draw();
    },
    updateCollision: function(player){
        var collision = checkCollision(player,this.ball);
        if(collision.x || collision.y){
            this.ball.pos.x += (this.ball.vel.x * -1);
            this.ball.vel.x *= -1;
            this.ball.vel.y += player.vel.y / 4;
            if(collision.y){
                this.ball.pos.y += (this.ball.vel.y * -1);
                this.ball.vel.y *= -1;
            }
            this.collisionTimer = 0;
            return true;
        }
        return false;
    },
    updatePlayer: function(player){
        if(Key.isDown(Key.UP)){
            player.vel.y -= 2;
            player.vel.y = Math.max(player.vel.y, -25);
        }else if(Key.isDown(Key.DOWN)){
            player.vel.y += 2;
            player.vel.y = Math.min(player.vel.y, 25);
        }else{
            player.vel.y *= .85;
        }

        player.pos.y += player.vel.y;
        this.boundPlayer(player);
    },
    updatePlayer2: function(player2){
        this.player2 = {
            height: player2.height,
            width: player2.width,
            pos: {x: player2.pos.x, y: player2.pos.y},
            vel: {x: 0, y: 0}
        }
    },
    boundPlayer: function(player){
        if(player.pos.y - player.height / 2 < 0){
            player.pos.y = player.height / 2;
            player.vel.y = 0;
        }else if(player.pos.y + player.height / 2 > app.main.HEIGHT){
            player.pos.y = app.main.HEIGHT - player.height / 2;
            player.vel.y = 0;
        }
    },
    updateBall: function(){
        if(this.ball.vel.y < .5 && this.ball.vel.y > -.5){
            this.ball.vel.y *= 4;
        }
        this.ball.pos.x += this.ball.vel.x;
        this.ball.pos.y += this.ball.vel.y;

        if(this.ball.pos.x - this.ball.rad < 0 || this.ball.pos.x + this.ball.rad > app.main.WIDTH){
            this.ball.pos.x += this.ball.vel.x * -1;
            this.ball.vel.x *= -1;
            this.color ="#ff0000";
            this.collisionTimer = 0;
        }
        if(this.ball.pos.y - this.ball.rad < 0 || this.ball.pos.y + this.ball.rad > app.main.HEIGHT){
            this.ball.pos.y += this.ball.vel.y * -1;
            this.ball.vel.y *= -1;
        }
    },
    draw: function(){
        this.drawPlayer(this.player);
        if(this.player2 != undefined && this.player2){
            this.drawPlayer(this.player2);
        }
        this.drawBall();
    },
    drawPlayer: function(player){
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
    drawBall: function(){
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