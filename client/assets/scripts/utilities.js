"use strict";

function checkCollision(box,ball){
    var point = {
        x: (ball.pos.x - box.pos.x),
        y: (ball.pos.y - box.pos.y)
    }
    var x = false;
    var y = false;
    point.x = Math.max(-box.width / 2, Math.min(box.width / 2, point.x));
    if(point.x === -box.width /2 || point.x === box.width / 2){
        x = true;
    }
    point.y = Math.max(-box.height / 2, Math.min(box.height / 2, point.y));
    if(point.y === -box.height /2 || point.y === box.height / 2){
        y = true;
    }

    point.x += box.pos.x - ball.pos.x;
    point.y += box.pos.y - ball.pos.y;

    if(Math.pow(point.x, 2) + Math.pow(point.y, 2) < Math.pow(ball.rad, 2)){
        return {x: true, y: false};
    }

    return {x: false, y: false};
}

var Key = {
    pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,

    isDown: function (keyCode) {
        return this.pressed[keyCode];
    },

    onKeydown: function (event) {
        this.pressed[event.keyCode] = true;
    },

    onKeyup: function (event) {
        delete this.pressed[event.keyCode];
    }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);