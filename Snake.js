Thecanvas = {
    width: 500,
    height: 500
};

HighScore = 0;
fruit = {
    x: 1,
    y: 1
};
keyup = true;
SnakeDirection = 'up';
SnakeImage = new Image();
SnakeImage.src = "images/Snake.png";
fruitImage = new Image();
fruitImage.src = "images/fruit1.png";

function CreateNewSnake(x, y) {
    var variable = {
        x: x,
        y: y,
    }
    return variable
}

function New_Game() {
    Snake = [{
        x: 12,
        y: 12,
    }];
    spawnfruit();
    document.getElementById("Menu").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }
    myGameArea.start();
}

function Menu() {
    myGameArea.stop();
    document.getElementById("ButtonArea").hidden = true;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = true;
    }
    document.getElementById("Menu").hidden = false;
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.setAttribute("id", "GameArea")
        this.canvas.setAttribute("width", Thecanvas.width);
        this.canvas.setAttribute("height", Thecanvas.height);
        this.canvas.width = Thecanvas.width;
        this.canvas.height = Thecanvas.height;
        this.context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;

        this.interval = setInterval(updateGameArea, 20);
        

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

function updateGameArea() {
    var i, x, y, crashed
    crashed = false;
    myGameArea.frameNo += 1;
    myGameArea.clear();
    if (Math.round(myGameArea.frameNo/7) == myGameArea.frameNo/7) {
        x = Snake[Snake.length-1].x;
        y = Snake[Snake.length - 1].y;
        if (SnakeDirection == 'up') {
            y -= 1;
        } else if (SnakeDirection == 'down') {
            y += 1;
        } else if (SnakeDirection == 'right') {
            x += 1;
        } else if (SnakeDirection == 'left') {
            x -= 1;
        }
        for (i = 0; i < Snake.length; i++) {
            if (Snake[i].x == x && Snake[i].y == y) {
                crashed = true;
                break;
            }
        }
        if (x < 0 || x > 24 || y < 0 || y > 24 || crashed) {
            myGameArea.stop()
            if (Snake.length > HighScore) {
                HighScore = Snake.length;
            }
            alert('Game Over. Your score is ' + Snake.length + '! The HighScore is ' + HighScore);
        } else if(fruit.x == x && fruit.y == y) {
            Snake.push(CreateNewSnake(x, y));
            spawnfruit();
        } else {
            Snake.push(CreateNewSnake(x, y));
            Snake.shift();
        }
    }

    for (i = 0; i < Snake.length; i++) {
        draw(SnakeImage, Snake[i])
    }

    draw(fruitImage, fruit);
}

function draw(image, Info) {
    // works on any image given height width angle and position

    // save the current coordinate system 
    // before we screw with it
    myGameArea.context.save();

    // move to the middle of where we want to draw our image
    myGameArea.context.translate(Info.x * 20 + 10, Info.y * 20 + 10);

    // draw it up and to the left by half the width
    // and height of the image 
    myGameArea.context.drawImage(image, -(image.width / 2), -(image.height / 2));

    // and restore the coords to how they were when we began
    myGameArea.context.restore();
}

function keydownhandler(e) {

    if (keyup) {
        if (e.keyCode == 38) {
            SnakeDirection = 'up';
            keyup = false;
        } else if (e.keyCode == 40) {
            SnakeDirection = 'down';
            keyup = false;
        } else if (e.keyCode == 39) {
            SnakeDirection = 'right';
            keyup = false;
        } else if (e.keyCode == 37) {
            SnakeDirection = 'left';
            keyup = false;
        }
    }
}

function keyuphandler(e) {
    keyup = true;
}

function spawnfruit() {
    var grid = "?".repeat(25).split("").map(() => 1);
    var xlist = [];
    var ylist = [];
    for (i = 0; i < Snake.length; i++) {
        xlist.push(Snake[i].x);
        ylist.push(Snake[i].y);
    }
    fruit.x = Math.round(Math.random() * 24);
    fruit.y = Math.round(Math.random() * 24);
}