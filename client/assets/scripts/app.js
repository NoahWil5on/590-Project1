"use strict";

var app = app || {};

app.main = {
    canvas: undefined,
    ctx: undefined,
    WIDTH: 1000,
    HEIGHT: 600,
    dt: 0,
    lastUpdate: Date.now(),
    currentTime: 0,
    host: false,
    leftScore: 0,
    rightScore: 0,
    mouse: {x: 0, y: 0},
    mouseButton: false,
    mouseClick: false,
    lastMouse: false,
    win: false,
    room: undefined,

    GAME_STATE: {
        START: "start",
        GAME: "play",
        OVER: "over"
    },
    currentState: undefined,

    init: function(player){
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        this.canvas.addEventListener('mousemove', function(event) { app.main.mouse = getMousePos(app.main.canvas, event)});
        this.canvas.addEventListener('mouseup', function(event) { app.main.mouseButton = false});
        this.canvas.addEventListener('mousedown', function(event) { app.main.mouseButton = true});

        this.ctx = this.canvas.getContext('2d');
        app.pong.init(player);
        app.start.init();

        this.currentState = this.GAME_STATE.START;
        this.update();
    },
    update: function(){
        if(!this.lastMouse && this.mouseButton){
            this.mouseClick = true;
        }else{
            this.mouseClick = false;
        }
        this.currentTime = Date.now();
        this.dt = (this.currentTime - this.lastUpdate)/1000;

        this.clear();
        this.animationID = requestAnimationFrame(this.update.bind(this));
        this.drawStrokes();
        switch(this.currentState){
            case this.GAME_STATE.START:
                app.start.update();
                break;
            case this.GAME_STATE.GAME:
                app.pong.update();
                break;
            case this.GAME_STATE.OVER:
                app.over.update();
                break;
            default: 
                break;
        }
        this.lastUpdate = Date.now();
        this.lastMouse = this.mouseButton;
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