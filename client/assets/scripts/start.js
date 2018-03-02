"use strict"

var app = app || {};

app.start = {

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

    init: function(){
        this.currentState = this.GAME_STATE.CHECK;
    },
    update: function(){
        this.checkReady();
        switch(this.currentState){
            case this.GAME_STATE.CHECK:
                this.updateButton();
                break;
            case this.GAME_STATE.READY:
                //this.drawReady();
                break;
            default:
                break;
        }
        this.draw();
    },
    checkReady: function(){
        if(this.opReady && this.ready){
            app.main.currentState = app.main.GAME_STATE.GAME;
            updateServerNum();
        }
    },
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
    draw: function(){
        this.drawTitle();
        switch(this.currentState){
            case this.GAME_STATE.CHECK:
                this.drawCheck();
                break;
            case this.GAME_STATE.READY:
                this.drawReady();
                break;
            default:
                break;
        }
    },
    drawCheck: function(){
        var ctx = app.main.ctx;
        ctx.save();

        ctx.fillStyle = this.buttonColor;
        ctx.fillRect(
            this.readyButton.x,
            this.readyButton.y,
            this.readyButton.width,
            this.readyButton.height);

        ctx.restore();
    },
    drawReady: function() {
        var ctx = app.main.ctx;
        ctx.save();

        ctx.font = '32pt Arial'
        ctx.textAlign = 'center';
        var x = app.main.WIDTH / 2;
        var y = app.main.HEIGHT * (2 / 3)+20;
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Waiting...", x, y);

        ctx.restore();
    },
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