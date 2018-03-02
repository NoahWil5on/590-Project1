"use strict"

//create or add to app
var app = app || {};

app.start = {

    //all start fields
    GAME_STATE: {
        WAIT: "waiting",
        CHECK: "check",
        READY: "ready"
    },
    readyButton: {
        width: 150,
        height: 40,
        x: app.main.WIDTH / 2 - 75,
        y: app.main.HEIGHT * (2 / 3) - 20
    },
    ready: false,
    opReady: false,
    buttonColor: "#00ff00",
    currentState: undefined,

    //intialize fields, most imporantly reset key values to reset the game
    init: function(){
        this.currentState = this.GAME_STATE.WAIT;
        this.ready = false;
        this.opReady = false;
    },

    //route updates depending on state of game
    update: function(){
        this.checkReady();
        switch(this.currentState){
            case this.GAME_STATE.CHECK:
                this.updateButton();
                break;
            default:
                break;
        }
        this.draw();
    },
    //checks if the game should begin, called every frame
    checkReady: function(){
        if(this.opReady && this.ready){
            app.main.currentState = app.main.GAME_STATE.GAME;
            updateServerNum();
        }
    },
    //checks if ready button is being clicked
    updateButton: function(){
        if(pointInRect(app.main.mouse,this.readyButton)){
            this.buttonColor = "#0000ff";
            if(app.main.mouseClick){
                this.currentState = this.GAME_STATE.READY;
                this.ready = true;
                sendReady();
            }
        }else{
            this.buttonColor = "#00ff00";
        }
    },
    //routes draw calls depending on current state of the game
    draw: function(){
        this.drawTitle();
        this.drawStreak();
        switch(this.currentState){
            case this.GAME_STATE.CHECK:
                this.drawCheck();
                break;
            case this.GAME_STATE.READY:
                this.drawReady();
                break;
            case this.GAME_STATE.WAIT:
                this.drawWait();
                break;
            default:
                break;
        }
    },
    //draws players current win streak
    drawStreak: function(){
        var ctx = app.main.ctx;
        ctx.save();

        ctx.font = '24pt Arial'
        ctx.textAlign = 'center';
        var x = app.main.WIDTH / 2;
        var y = app.main.HEIGHT / 2;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`WIN STREAK: ${app.main.streak}`, x, y);

        ctx.restore();
    },
    //draws text informing the user that more players need to join the server
    drawWait: function(){
        var ctx = app.main.ctx;
        ctx.save();

        ctx.font = '32pt Arial'
        ctx.textAlign = 'center';
        var x = app.main.WIDTH / 2;
        var y = app.main.HEIGHT * (2 / 3)+20;
        ctx.fillStyle = "#ffffff";
        ctx.fillText("WAITING FOR ANOTHER PLAYER...", x, y);

        ctx.restore();
    },
    //draws the ready button with text
    drawCheck: function(){
        var ctx = app.main.ctx;
        ctx.save();

        ctx.fillStyle = this.buttonColor;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.fillRect(
            this.readyButton.x,
            this.readyButton.y,
            this.readyButton.width,
            this.readyButton.height);
        ctx.strokeRect(
            this.readyButton.x,
            this.readyButton.y,
            this.readyButton.width,
            this.readyButton.height
        );
        ctx.font = '12pt Arial'
        ctx.textAlign = 'center';
        var x = this.readyButton.x + this.readyButton.width / 2;
        var y = this.readyButton.y + this.readyButton.height / 2 + 6;
        ctx.fillStyle = "#000000";
        ctx.fillText("READY BUTTON", x, y);

        ctx.restore();
    },
    //informs the user that they are waiting for opponent to be ready
    drawReady: function() {
        var ctx = app.main.ctx;
        ctx.save();

        ctx.font = '32pt Arial'
        ctx.textAlign = 'center';
        var x = app.main.WIDTH / 2;
        var y = app.main.HEIGHT * (2 / 3)+20;
        ctx.fillStyle = "#ffffff";
        ctx.fillText("WAITING ON OPPONENT...", x, y);

        ctx.restore();
    },
    //draws the title of the game
    drawTitle: function(){
        var ctx = app.main.ctx;
        ctx.save();

        ctx.font = '64pt Arial'
        ctx.textAlign = 'center';
        var x = app.main.WIDTH / 2;
        var y = app.main.HEIGHT * (1 / 3);
        ctx.fillStyle = "#00ff00";
        ctx.fillText("PONG TOURNAMENT", x, y);

        ctx.restore();
    }
};