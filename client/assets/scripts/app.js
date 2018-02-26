"use strict";

var app = app || {};

app.main = {
    canvas: undefined,
    ctx: undefined,
    WIDTH: 1000,
    HEIGHT: 600,

    init: function(player){
        console.log("app init");
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        this.ctx = this.canvas.getContext('2d');

        app.pong.init(player);

        this.update();
    },
    update: function(){
        this.clear();
        this.animationID = requestAnimationFrame(this.update.bind(this));
        this.drawStrokes();
        app.pong.update();
        this.draw();
    },
    draw: function(){
        
    },
    drawStrokes: function(){
        this.ctx.save();

        var yDraw = 10;
        this.ctx.strokeWidth = 1;
        this.ctx.strokeStyle = "#0e1600";
        while(yDraw < this.HEIGHT){
            this.ctx.moveTo(0, yDraw);
            this.ctx.lineTo(this.WIDTH, yDraw);
            this.ctx.stroke();
            yDraw += 20;
        }

        this.ctx.restore();
    },
    clear: function(){
        this.ctx.save();

        this.ctx.fillStyle = "#000000";
        this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);

        this.ctx.restore();
    }
}

//window.onload = app.main.init;