var Thecanvas = {
    width: 500,
    height: 500
};
var Bottom = true;
var PlayerImage = new Image();
PlayerImage.src = "images/Snake2.png";
var Player = {
    angle: 0,
    x: 250,
    y: 490,
    Speed: 0,
    Gravity: 5,
    Force: 0,
    Duration: 0,
    Mass: 1,
    MinY: 240
}
var JumpStats = {
    Force: -5.5,
    Duration: 10,
    Mass: 1
}
var dollars = 0;
var Knowledge = 0;

window.onload = function () {
    var screenW = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    var screenH = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
    var min = Math.min(screenW, screenH);
    var size = Math.floor(min * .5);
    Multiplier = size / 500;
}

function MainButtonClick() {
    if (Bottom == true) {
        Bottom = false;
        myGameArea.start();
        Player.Force = JumpStats.Force;
        Player.Duration = JumpStats.Duration;
        Knowledge += 1;
        document.getElementById("Knowledge").innerHTML = 'Knowledge: ' + Math.floor(Knowledge);
    }
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.frameNo = 0;
        if (Bottom) {
            Player.Speed = 0;
            Player.Force = 0;
            Player.Duration = 0;
            Player.y = 490;
        }
        this.interval = setInterval(updateGameArea, 20);
    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    set: function () {
        this.canvas.setAttribute("id", "GameArea");
        this.canvas.width = Thecanvas.width * Multiplier;
        this.canvas.height = Thecanvas.height * Multiplier;
        this.context = this.canvas.getContext("2d");
        var GameAreaDiv = document.getElementById("GameAreaDiv");
        GameAreaDiv.insertBefore(this.canvas, GameAreaDiv.childNodes[1]);
        document.getElementById("dollars").innerHTML = 'Money: ' + Math.floor(dollars);
    }
}

function updateGameArea() {
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (Player.Duration != 0) {
        Player.Duration += -1;
    } else {
        Player.Force = 0;
    }
    Player.Speed += Player.Force + Player.Gravity;
    Y = Player.y + Player.Speed;
    if (Y < Player.MinY) {
        Player.MinY = Y;
    }
    if (Y >= 490) {
        Player.Speed = 0;
        Player.Force = 0;
        Player.Duration = 0;
        Bottom = true;
        Player.y = 490;
    } else if (Y <= 240) { /////////////////////////////////////////////////////////// move the background and move the character based off of a high speed
        Player.y = Y;
    } else {
        Player.y = Y;
    }
    draw(PlayerImage, Player);
    if (Bottom) {
        dollars += Math.abs(Player.MinY-490)/100;
        document.getElementById("dollars").innerHTML = 'Money: ' + Math.floor(dollars);
        myGameArea.stop();
    }
}

function draw(image, Info) {
    // works on any image given height width angle and position

    // save the current coordinate system 
    // before we screw with it
    myGameArea.context.save();

    // move to the middle of where we want to draw our image
    myGameArea.context.translate(Info.x * Multiplier, Info.y * Multiplier);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    myGameArea.context.rotate(Info.angle);

    // draw it up and to the left by half the width
    // and height of the image 
    myGameArea.context.drawImage(image, -(image.width / 2) * Multiplier, -(image.height / 2) * Multiplier, image.width * Multiplier, image.height * Multiplier);

    // and restore the coords to how they were when we began
    myGameArea.context.restore();
}

function ButtonArea() {
    document.getElementById('GameAreaDiv').hidden = true;
    document.getElementById('ButtonArea').hidden = false;
    document.getElementById('ButtonArea-Button').disabled = true;
    document.getElementById('GameArea-Button').disabled = false;
}

function GameArea() {
    document.getElementById('GameAreaDiv').hidden = false;
    document.getElementById('ButtonArea').hidden = true;
    document.getElementById('ButtonArea-Button').disabled = false;
    document.getElementById('GameArea-Button').disabled = true;
    myGameArea.set();
    draw(PlayerImage, Player);
}

function DollarUpgrade(id, amount, type, cost) {
    if (cost < dollars) {
        dollars += cost * -1;
        document.getElementById("dollars").innerHTML = 'Money: ' + Math.floor(dollars);
        if (type == 'Mult') {
            JumpStats.Force = JumpStats.Force * amount;
        } else if (type == 'Add') {
            JumpStats.Force += amount;
        }
        switch(id) {
            case 0: 
                document.getElementById('Upgrade3').hidden = true;
                document.getElementById('Upgrade4').hidden = false;
                break;
            case 1:
                document.getElementById('Upgrade4').hidden = true;
                break;
        }
    }
}

function KnowledgeUpgrade(number) {
    switch(number) {
        case 0:
            if (Knowledge >= 10) {
                Knowledge += -10;
                JumpStats.Duration = 11;
                document.getElementById('Upgrade1').hidden = true;
            }
            break;
        case 1:
            if (Knowledge >= 20) {
                Knowledge += -20;
                JumpStats.Force = -6;
                document.getElementById('Upgrade2').hidden = true;
                document.getElementById('Upgrade3').hidden = false;
            }
            break;
        default:
            alert('what the hell?');
            break;
    }
    document.getElementById("Knowledge").innerHTML = 'Knowledge: ' + Math.floor(Knowledge);
}