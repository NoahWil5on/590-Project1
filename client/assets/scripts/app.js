"use strict";

//create or add to app
var app = app || {};

app.main = {

    //all app.main fields
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
    room: undefined,
    winScore: 5,
    streak: 0,
    GAME_STATE: {
        START: "start",
        GAME: "play",
        OVER: "over"
    },
    currentState: undefined,
    myUpdate: undefined,
    

    //intialize fields, most imporantly reset key values to reset the game
    init: function(player){
        console.log("word");
        //setup canvas
        this.canvas = document.getElementById('canvas');
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        //mouse event listeners
        this.canvas.addEventListener('mousemove', function(event) { app.main.mouse = getMousePos(app.main.canvas, event)});
        this.canvas.addEventListener('mouseup', function(event) { app.main.mouseButton = false});
        this.canvas.addEventListener('mousedown', function(event) { app.main.mouseButton = true});

        this.ctx = this.canvas.getContext('2d');

        //initialize all other app components
        app.pong.init(player);
        app.start.init();
        app.over.init();

        this.currentState = this.GAME_STATE.START;
        this.myUpdate = this.update.bind(this);
        this.myUpdate();
    },
    //used for resetting game if necessary
    setup: function(player){
        this.host = false;
        this.leftScore = 0;
        this.rightScore = 0;
        this.win = false;
        this.room = undefined;
        
        app.pong.init(player);
        app.start.init();
        app.over.init();
    },
    //route update calls depending on game state and updates various things
    update: function(delta){
        this.dt = (delta -this.lastUpdate) / 1000;
        //check if the mouse has just been clicked
        if(!this.lastMouse && this.mouseButton){
            this.mouseClick = true;
        }else{
            this.mouseClick = false;
        }
        //update delta time
//        this.currentTime = Date.now();
//        this.dt = (this.currentTime - this.lastUpdate)/1000;

        //clear screen
        this.clear();

        //bind update to constant frame updates
        this.animationID = requestAnimationFrame(this.myUpdate);

        //draw thin green strokes across screen to give old age effect
        this.drawStrokes();

        //checks if game has been won, updates streak count and game state accordingly
        if(this.leftScore >= this.winScore || this.rightScore >= this.winScore){
            if((this.host && this.leftScore >= this.winScore) ||
            (!this.host && this.rightScore >= this.winScore)){
                app.over.currentState = app.over.GAME_STATE.WIN
                this.streak++;
            }else{
                this.streak = 0;
            }
            this.currentState = this.GAME_STATE.OVER;
            this.leftScore = this.rightScore = 0;
        }
        //check which game state to update
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
        this.lastUpdate = delta;
        this.lastMouse = this.mouseButton;
    },
    //draw green strokes across screen
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
    //clear screen each frame
    clear: function(){
        this.ctx.save();

        this.ctx.fillStyle = "#000000";
        this.ctx.clearRect(0,0,this.WIDTH,this.HEIGHT);
        this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT);

        this.ctx.restore();
    }
}