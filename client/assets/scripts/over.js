"use strict"

//create or add to app
var app = app || {};

app.over = {
    //all app.over fields
    GAME_STATE: {
        WIN: "win",
        LOSE: "lose"
    },
    currentState: undefined,
    resetButton: {
        width: 150,
        height: 40,
        x: app.main.WIDTH / 2 - 75,
        y: app.main.HEIGHT * (2 / 3) - 20
    },
    buttonColor: "#00ff00",

    //intialize fields, most imporantly reset key values to reset the game
    init: function(){
        this.currentState = this.GAME_STATE.LOSE;
    },
    //routes updates
    update: function(){
        this.updateResetButton();
        this.draw();
    },
    //checks if the reset button is being clicked
    updateResetButton: function(){
        if(pointInRect(app.main.mouse,this.resetButton)){
            this.buttonColor = "#0000ff";
            if(app.main.mouseClick){
                this.doReset();
            }
        }else{
            this.buttonColor = "#00ff00";
        }
    },
    //restart client
    doReset: function(){
        app.main.setup();
        init();
    },
    //routes draw calls based on game_state
    draw: function(){
        this.drawReset();
        app.start.drawStreak();
        switch(this.currentState){
            case this.GAME_STATE.WIN:
                this.drawWin();
                break;
            case this.GAME_STATE.LOSE:
                this.drawLose();
                break;
            default:
                break;
        }
    },
    //draws reset button and text
    drawReset: function(){
        var ctx = app.main.ctx;
        ctx.save();

        ctx.fillStyle = this.buttonColor;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 5;
        ctx.fillRect(
            this.resetButton.x,
            this.resetButton.y,
            this.resetButton.width,
            this.resetButton.height);
        ctx.strokeRect(
            this.resetButton.x,
            this.resetButton.y,
            this.resetButton.width,
            this.resetButton.height
        );
        ctx.font = '12pt Arial'
        ctx.textAlign = 'center';
        var x = this.resetButton.x + this.resetButton.width / 2;
        var y = this.resetButton.y + this.resetButton.height / 2 + 6;
        ctx.fillStyle = "#000000";
        ctx.fillText("PLAY AGAIN", x, y);

        ctx.restore();

        ctx.restore();
    },
    //draw win text
    drawWin: function(){
        var ctx = app.main.ctx;
        ctx.save();

        ctx.font = '64pt Arial'
        ctx.textAlign = 'center';
        var x = app.main.WIDTH / 2;
        var y = app.main.HEIGHT * (1 / 3);
        ctx.fillStyle = "#00ff00";
        ctx.fillText("WINNER", x, y);

        ctx.restore();
    },
    //draw lose text
    drawLose: function(){
        var ctx = app.main.ctx;
        ctx.save();

        ctx.font = '64pt Arial'
        ctx.textAlign = 'center';
        var x = app.main.WIDTH / 2;
        var y = app.main.HEIGHT * (1 / 3);
        ctx.fillStyle = "#00ff00";
        ctx.fillText("LOSER", x, y);

        ctx.restore();
    }
};