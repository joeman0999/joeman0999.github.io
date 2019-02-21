var Thecanvas = {
    width: 500,
    height: 500
};

var PlayerImage = new Image();
PlayerImage.src = "images/PongPlayer.png";

var winFrame = 0;
var LastWinner = "None";

var LeftPlayer = {
    y: 250,
    x: 20,
    width: 10,
    height: 100,
    wins: 0
}

var RightPlayer = {
    y: 250,
    x: 480,
    width: 10,
    height: 100,
    wins: 0
}

var ComputerPlayer = {
    y: 250,
    x: 20,
    maxSpeed: 5,
    width: 10,
    height: 100,
    wins: 0
}

var Ball = {
    y: 250,
    x: 250,
    Xspeed: 5,
    Yspeed: 1,
    width: 10,
    height: 10
}

var BallImage = new Image();
BallImage.src = "images/PongBall.png";

var TwoPlayers = false;

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.setAttribute("id", "GameArea")
        this.canvas.width = Thecanvas.width;
        this.canvas.height = Thecanvas.height;
        this.context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        if (TwoPlayers == false) {
            this.interval = setInterval(updateGameArea, 20);
        } else {
            this.interval = setInterval(updateGameArea2, 20);
        }

        window.addEventListener('keydown', keydownhandler);
        window.addEventListener('keyup', keyuphandler);

    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function Menu() {
    myGameArea.stop();
    document.getElementById("ButtonArea").hidden = true;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = true;
    }
    document.getElementById("Menu").hidden = false;
    LeftPlayer.wins = 0;
    RightPlayer.wins = 0;
    ComputerPlayer.wins = 0;
}

function Difficulty_Select() {
    document.getElementById("Menu").hidden = true;
    document.getElementById("DifficultyArea").hidden = false;
}

function Start_One_Player(difficulty) {
    document.getElementById("Menu").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    document.getElementById("DifficultyArea").hidden = true;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }
    ComputerPlayer.maxSpeed = difficulty;
    TwoPlayers = false;
    myGameArea.start()
}

function Start_Two_Player() {
    document.getElementById("Menu").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }

    TwoPlayers = true;
    myGameArea.start()
}

function updateGameArea() {
    myGameArea.frameNo += 1;

    if (myGameArea.keys && myGameArea.keys[38]) {
        if (RightPlayer.y >= PlayerImage.height / 2) {
            RightPlayer.y -= 5;
        }
    } else if (myGameArea.keys && myGameArea.keys[40]) {
        if (RightPlayer.y <= Thecanvas.height - PlayerImage.height / 2) {
            RightPlayer.y += 5;
        }
    }

    Ball.y -= Ball.Yspeed;
    Ball.x += Ball.Xspeed;

    if ((Ball.y - Ball.width / 2 <= 0 && Ball.Yspeed > 0) || (Ball.y + Ball.width / 2 > Thecanvas.height && Ball.Yspeed < 0)) {
        Ball.Yspeed *= -1;
    }

    if (Math.abs(Ball.x + Ball.width / 2 - RightPlayer.x) == 0) {
        if (Ball.y <= (RightPlayer.y + RightPlayer.height / 2) && Ball.y >= (RightPlayer.y - RightPlayer.height / 2)) {
            Ball.Yspeed = (RightPlayer.y - Ball.y) / 5;
            Ball.Xspeed *= -1;
        }
    }

    if (Math.abs(Ball.x - Ball.width / 2 - ComputerPlayer.x) == 0) {
        if (Ball.y <= (ComputerPlayer.y + ComputerPlayer.height / 2) && Ball.y >= (ComputerPlayer.y - ComputerPlayer.height / 2)) {
            Ball.Yspeed = (ComputerPlayer.y - Ball.y) / 5;
            Ball.Xspeed *= -1;
        }
    }
    
    if (Ball.x < 0 && winFrame < myGameArea.frameNo) {
        RightPlayer.wins += 1
        document.getElementById("wins").innerHTML = "Left: " + ComputerPlayer.wins + " Right: " + RightPlayer.wins;
        winFrame = myGameArea.frameNo + 10;
        LastWinner = "Right";

    } else if (Ball.x > Thecanvas.width && winFrame < myGameArea.frameNo) {
        ComputerPlayer.wins += 1
        document.getElementById("wins").innerHTML = "Left: " + ComputerPlayer.wins + " Right: " + RightPlayer.wins;
        winFrame = myGameArea.frameNo + 10;
        LastWinner = "Left";
    }

    if (winFrame == myGameArea.frameNo) {
        Ball.y = 250;
        Ball.x = 250;
        if (LastWinner == "Right") {
            Ball.Xspeed = 5;
            Ball.Yspeed = Math.random() * 6 - 3;
        } else if (LastWinner == "Left") {
            Ball.Xspeed = -5;
            Ball.Yspeed = Math.random() * 6 - 5;
        }
    }

    if (Ball.Xspeed < 0) {
        var distance = ComputerPlayer.y - Ball.y;
        if (Math.abs(distance) > ComputerPlayer.maxSpeed) {
            if (distance < 0) {
                if (ComputerPlayer.y <= Thecanvas.height - PlayerImage.height / 2) {
                    ComputerPlayer.y += ComputerPlayer.maxSpeed;
                }
            } else {
                if (ComputerPlayer.y >= PlayerImage.height / 2) {
                    ComputerPlayer.y -= ComputerPlayer.maxSpeed;
                }
            }
        } else {
            if (ComputerPlayer.y >= PlayerImage.height / 2 && ComputerPlayer.y <= Thecanvas.height - PlayerImage.height / 2) {
                ComputerPlayer.y = Ball.y;
            }
        }
    }

    myGameArea.clear();
    draw(PlayerImage, RightPlayer);
    draw(PlayerImage, ComputerPlayer);
    draw(BallImage, Ball);
}

function updateGameArea2() { // Computer 2 left and add w s movement
    myGameArea.frameNo += 1;

    if (myGameArea.keys && myGameArea.keys[38]) {
        if (RightPlayer.y >= PlayerImage.height / 2) {
            RightPlayer.y -= 5;
        }
    } else if (myGameArea.keys && myGameArea.keys[40]) {
        if (RightPlayer.y <= Thecanvas.height - PlayerImage.height / 2) {
            RightPlayer.y += 5;
        }
    }

    if (myGameArea.keys && myGameArea.keys[87]) {
        if (LeftPlayer.y >= PlayerImage.height / 2) {
            LeftPlayer.y -= 5;
        }
    } else if (myGameArea.keys && myGameArea.keys[83]) {
        if (LeftPlayer.y <= Thecanvas.height - PlayerImage.height / 2) {
            LeftPlayer.y += 5;
        }
    }

    Ball.y -= Ball.Yspeed;
    Ball.x += Ball.Xspeed;

    if (Ball.y - Ball.width / 2 <= 0 || Ball.y + Ball.width / 2 > Thecanvas.height) {
        Ball.Yspeed *= -1;
    }

    if (Math.abs(Ball.x + Ball.width / 2 - RightPlayer.x) == 0) {
        if (Ball.y <= (RightPlayer.y + RightPlayer.height / 2) && Ball.y >= (RightPlayer.y - RightPlayer.height / 2)) {
            Ball.Yspeed = (RightPlayer.y - Ball.y) / 5;
            Ball.Xspeed *= -1;
        }
    }

    if (Math.abs(Ball.x - Ball.width / 2 - LeftPlayer.x) == 0) {
        if (Ball.y <= (LeftPlayer.y + LeftPlayer.height / 2) && Ball.y >= (LeftPlayer.y - LeftPlayer.height / 2)) {
            Ball.Yspeed = (LeftPlayer.y - Ball.y) / 5;
            Ball.Xspeed *= -1;
        }
    }

    if (Ball.x < 0 && winFrame < myGameArea.frameNo) {
        RightPlayer.wins += 1
        document.getElementById("wins").innerHTML = "Left: " + LeftPlayer.wins + " Right: " + RightPlayer.wins;
        winFrame = myGameArea.frameNo + 10;
        LastWinner = "Right";

    } else if (Ball.x > Thecanvas.width && winFrame < myGameArea.frameNo) {
        LeftPlayer.wins += 1
        document.getElementById("wins").innerHTML = "Left: " + LeftPlayer.wins + " Right: " + RightPlayer.wins;
        winFrame = myGameArea.frameNo + 10;
        LastWinner = "Left";
    }

    if (winFrame == myGameArea.frameNo) {
        Ball.y = 250;
        Ball.x = 250;
        if (LastWinner == "Right") {
            Ball.Xspeed = 5;
            Ball.Yspeed = Math.random() * 6 - 3;
        } else if (LastWinner == "Left") {
            Ball.Xspeed = -5;
            Ball.Yspeed = Math.random() * 6 - 5;
        }
    }

    myGameArea.clear();
    draw(PlayerImage, RightPlayer);
    draw(PlayerImage, LeftPlayer);
    draw(BallImage, Ball);
}

function draw(image, Info) {
    // works on any image given height width angle and position

    // save the current coordinate system 
    // before we screw with it
    myGameArea.context.save();

    // move to the middle of where we want to draw our image
    myGameArea.context.translate(Info.x, Info.y);

    // draw it up and to the left by half the width
    // and height of the image 
    myGameArea.context.drawImage(image, -(image.width / 2), -(image.height / 2));

    // and restore the coords to how they were when we began
    myGameArea.context.restore();
}

function keydownhandler(e) {
    myGameArea.keys = (myGameArea.keys || []);
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
}

function keyuphandler(e) {
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
}

/*

function collide(obj1, obj2) {
    obj1_TR = [obj1.x + obj1.width / 2, obj1.y - obj1.height / 2];
    obj1_TL = [obj1.x - obj1.width / 2, obj1.y - obj1.height / 2];
    obj1_BR = [obj1.x + obj1.width / 2, obj1.y + obj1.height / 2];
    obj1_BL = [obj1.x - obj1.width / 2, obj1.y + obj1.height / 2];


    obj2_TR = [obj2.x + obj2.width / 2, obj2.y - obj2.height / 2];
    obj2_TL = [obj2.x - obj2.width / 2, obj2.y - obj2.height / 2];
    obj2_BR = [obj2.x + obj2.width / 2, obj2.y + obj2.height / 2];
    obj2_BL = [obj2.x - obj2.width / 2, obj2.y + obj2.height / 2];
    // A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
    // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
    // top left to top right
    d1 = (other[0] - mytopleft[0]) * (mytopright[1] - mytopleft[1]) - (other[1] - mytopleft[1]) * (mytopright[0] - mytopleft[0]);
    // bottom left to bottom right
    d3 = (other[0] - mybottomleft[0]) * (mybottomright[1] - mybottomleft[1]) - (other[1] - mybottomleft[1]) * (mybottomright[0] - mybottomleft[0]);
    // top right to bottom right
    d2 = (other[0] - mytopright[0]) * (mybottomright[1] - mytopright[1]) - (other[1] - mytopright[1]) * (mybottomright[0] - mytopright[0]);
    // top left to bottom left
    d4 = (other[0] - mytopleft[0]) * (mybottomleft[1] - mytopleft[1]) - (other[1] - mytopleft[1]) * (mybottomleft[0] - mytopleft[0]);

    if (((d1 > 0 && d3 < 0) && (d2 > 0 && d4 < 0)) || ((d1 < 0 && d3 > 0) && (d2 < 0 && d4 > 0))) {
        crash = true
    }
}
*/