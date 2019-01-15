var Thecanvas = {
    width: 500,
    height: 500
};

var HighScore = 0;
var TwoPlayers = false;
var SnakeImage = new Image();
SnakeImage.src = "images/Snake.png";
var SnakeImage2 = new Image();
SnakeImage2.src = "images/Snake2.png";
var SnakeDirection2, SnakeDirection, GameSpeed, GameSpeed2, Snake, Snake2, OldSnakeDirection, OldSnakeDirection2, NumberofFruit, fruit

function CreateNewSnake(x, y) {
    var variable = {
        x: x,
        y: y,
    }
    return variable
}

function One_Player() {
    TwoPlayers = false;
    Snake = [{
        x: 12,
        y: 12
    }];
    SnakeDirection = 'up';
    OldSnakeDirection = 'up';
    GameSpeed = 10;
    NumberofFruit = 3;
    fruit = [];
    spawnfruit();
    document.getElementById("Menu").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }
    myGameArea.stop();
    myGameArea.start();
    document.getElementById("wins").innerHTML = "Score: " + Snake.length;
}

function New_Game(type) {
    if (type == 'two') {
        Two_Player();
    } else if (type == 'one') {
        One_Player();
    }else {
        if (TwoPlayers) {
            Two_Player();
        } else {
            One_Player();
        }
    }
}

function Two_Player() {
    TwoPlayers = true;
    Snake = [{
        x: 17,
        y: 6
    }];
    Snake2 = [{
        x: 6,
        y: 6
    }]
    SnakeDirection = 'up';
    SnakeDirection2 = 'up';
    OldSnakeDirection = 'up';
    OldSnakeDirection2 = 'up';
    GameSpeed = 10;
    GameSpeed2 = 10;
    NumberofFruit = 5;
    fruit = [];
    spawnfruit();
    document.getElementById("Menu").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }
    myGameArea.stop();
    myGameArea.start();
    document.getElementById("wins").innerHTML = "Score: " + Snake.length;
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

    },
    stop: function () {
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

var fruitImage = new Image();
fruitImage.src = "images/fruit.png";

function updateGameArea() {
    var i, x, y, crashed, hitfruit
    hitfruit = false;
    crashed = false;
    myGameArea.frameNo += 1;
    myGameArea.clear();
    if (Math.round(myGameArea.frameNo / GameSpeed) == myGameArea.frameNo / GameSpeed) {
        x = Snake[Snake.length - 1].x;
        y = Snake[Snake.length - 1].y;
        if (SnakeDirection == 'up') {
            if (OldSnakeDirection != 'down') {
                y -= 1;
                OldSnakeDirection = 'up';
            } else {
                y += 1;
            }
        } else if (SnakeDirection == 'down') {
            if (OldSnakeDirection != 'up') {
                y += 1;
                OldSnakeDirection = 'down';
            } else {
                y -= 1;
            }
        } else if (SnakeDirection == 'right') {
            if (OldSnakeDirection != 'left') {
                x += 1;
                OldSnakeDirection = 'right';
            } else {
                x -= 1;
            }
        } else if (SnakeDirection == 'left') {
            if (OldSnakeDirection != 'right') {
                x -= 1;
                OldSnakeDirection = 'left';
            } else {
                x += 1;
            }
        }
        for (i = 0; i < Snake.length; i++) {
            if (Snake[i].x == x && Snake[i].y == y) {
                crashed = true;
                break;
            }
        }
        for (i = 0; i < fruit.length; i++) {
            if (fruit[i].x == x && fruit[i].y == y) {
                hitfruit = true;
                fruit.splice(i,1);
                break;
            }
        }

        if (x < 0 || x > 24 || y < 0 || y > 24 || crashed) {
            myGameArea.stop()
            if (Snake.length > HighScore) {
                HighScore = Snake.length;
            }
            alert('Game Over. Your score is ' + Snake.length + '! The HighScore is ' + HighScore);
        } else if (hitfruit) {
            Snake.push(CreateNewSnake(x, y));
            document.getElementById("wins").innerHTML = "Score: " + Snake.length;
            if (Snake.length > 199) {
                GameSpeed = 4;
            } else if (Snake.length > 149) {
                GameSpeed = 5;
            } else if (Snake.length > 99) {
                GameSpeed = 6;
            }
            else if (Snake.length > 74) {
                GameSpeed = 7;
            }
            else if (Snake.length > 49) {
                GameSpeed = 8;
            }
            else if (Snake.length > 24) {
                GameSpeed = 9;
            }
            spawnfruit();
        } else {
            Snake.push(CreateNewSnake(x, y));
            Snake.shift();
        }
    }
    for (i = 0; i < fruit.length; i++) {
        renderFruit(fruit[i]);
    }
    for (i = 0; i < Snake.length; i++) {
        draw(SnakeImage, Snake[i])
    }

}

function updateGameArea2() {
    var i, x, y, crashed, crashed2, hitfruit, hitfruit2, Dead1, Dead2
    Dead1 = false;
    Dead2 = false;
    hitfruit = false;
    hitfruit2 = false;
    crashed = false;
    crashed2 = false;
    myGameArea.frameNo += 1;
    myGameArea.clear();
    spawnfruit();
    if (Math.round(myGameArea.frameNo / GameSpeed) == myGameArea.frameNo / GameSpeed) {
        x = Snake[Snake.length - 1].x;
        y = Snake[Snake.length - 1].y;
        if (SnakeDirection == 'up') {
            if (OldSnakeDirection != 'down') {
                y -= 1;
                OldSnakeDirection = 'up';
            } else {
                y += 1;
            }
        } else if (SnakeDirection == 'down') {
            if (OldSnakeDirection != 'up') {
                y += 1;
                OldSnakeDirection = 'down';
            } else {
                y -= 1;
            }
        } else if (SnakeDirection == 'right') {
            if (OldSnakeDirection != 'left') {
                x += 1;
                OldSnakeDirection = 'right';
            } else {
                x -= 1;
            }
        } else if (SnakeDirection == 'left') {
            if (OldSnakeDirection != 'right') {
                x -= 1;
                OldSnakeDirection = 'left';
            } else {
                x += 1;
            }
        }
        for (i = 0; i < Snake.length; i++) {
            if (Snake[i].x == x && Snake[i].y == y) {
                crashed = true;
                break;
            }
        }
        for (i = 0; i < Snake2.length; i++) {
            if (Snake2[i].x == x && Snake2[i].y == y) {
                crashed = true;
                break;
            }
        }
        for (i = 0; i < fruit.length; i++) {
            if (fruit[i].x == x && fruit[i].y == y) {
                hitfruit = true;
                fruit.splice(i, 1);
                break;
            }
        }

        if (x < 0 || x > 24 || y < 0 || y > 24 || crashed) {
            myGameArea.stop();
            Dead1 = true;
            
        } else if (hitfruit) {
            Snake.push(CreateNewSnake(x, y));
            document.getElementById("wins").innerHTML = "Score Player 1: " + Snake.length + " Score Player 2: " + Snake2.length;
            if (Snake.length > 199) {
                GameSpeed = 4;
            } else if (Snake.length > 149) {
                GameSpeed = 5;
            } else if (Snake.length > 99) {
                GameSpeed = 6;
            }
            else if (Snake.length > 74) {
                GameSpeed = 7;
            }
            else if (Snake.length > 49) {
                GameSpeed = 8;
            }
            else if (Snake.length > 24) {
                GameSpeed = 9;
            }
        } else {
            Snake.push(CreateNewSnake(x, y));
            Snake.shift();
        }
    }
    if (Math.round(myGameArea.frameNo / GameSpeed2) == myGameArea.frameNo / GameSpeed2) {
        x = Snake2[Snake2.length - 1].x;
        y = Snake2[Snake2.length - 1].y;
        if (SnakeDirection2 == 'up') {
            if (OldSnakeDirection2 != 'down') {
                y -= 1;
                OldSnakeDirection2 = 'up';
            } else {
                y += 1;
            }
        } else if (SnakeDirection2 == 'down') {
            if (OldSnakeDirection2 != 'up') {
                y += 1;
                OldSnakeDirection2 = 'down';
            } else {
                y -= 1;
            }
        } else if (SnakeDirection2 == 'right') {
            if (OldSnakeDirection2 != 'left') {
                x += 1;
                OldSnakeDirection2 = 'right';
            } else {
                x -= 1;
            }
        } else if (SnakeDirection2 == 'left') {
            if (OldSnakeDirection2 != 'right') {
                x -= 1;
                OldSnakeDirection2 = 'left';
            } else {
                x += 1;
            }
        }
        for (i = 0; i < Snake.length; i++) {
            if (Snake[i].x == x && Snake[i].y == y) {
                crashed2 = true;
                break;
            }
        }
        for (i = 0; i < Snake2.length; i++) {
            if (Snake2[i].x == x && Snake2[i].y == y) {
                crashed2 = true;
                break;
            }
        }
        for (i = 0; i < fruit.length; i++) {
            if (fruit[i].x == x && fruit[i].y == y) {
                hitfruit2 = true;
                fruit.splice(i, 1);
                break;
            }
        }

        if (x < 0 || x > 24 || y < 0 || y > 24 || crashed2) {
            myGameArea.stop();
            Dead2 = true;
        } else if (hitfruit2) {
            Snake2.push(CreateNewSnake(x, y));
            document.getElementById("wins").innerHTML = "Score Player 1: " + Snake.length + " Score Player 2: " + Snake2.length;
            if (Snake2.length > 199) {
                GameSpeed = 4;
            } else if (Snake2.length > 149) {
                GameSpeed = 5;
            } else if (Snake2.length > 99) {
                GameSpeed = 6;
            }
            else if (Snake2.length > 74) {
                GameSpeed = 7;
            }
            else if (Snake2.length > 49) {
                GameSpeed = 8;
            }
            else if (Snake2.length > 24) {
                GameSpeed = 9;
            }
        } else {
            Snake2.push(CreateNewSnake(x, y));
            Snake2.shift();
        }
    }
    if (Dead1 && Dead2) {
        alert("Game Over. It's a tie. Length of Player 1: " + Snake.length + ' Length of Player 2: ' + Snake2.length);
    } else if (Dead1) {
        alert('Game Over. Player two wins. Length of Player 1: ' + Snake.length + ' Length of Player 2: ' + Snake2.length);
    } else if (Dead2) {
        alert('Game Over. Player one wins. Length of Player 1: ' + Snake.length + ' Length of Player 2: ' + Snake2.length);
    }
    for (i = 0; i < fruit.length; i++) {
        renderFruit(fruit[i]);
    }
    for (i = 0; i < Snake2.length; i++) {
        draw(SnakeImage2, Snake2[i])
    }
    for (i = 0; i < Snake.length; i++) {
        draw(SnakeImage, Snake[i])
    }

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

    if (e.keyCode == 38) {
        SnakeDirection = 'up';
    } else if (e.keyCode == 40) {
        SnakeDirection = 'down';
    } else if (e.keyCode == 39) {
        SnakeDirection = 'right';
    } else if (e.keyCode == 37) {
        SnakeDirection = 'left';
    } else if (e.keyCode == 87) {
        SnakeDirection2 = 'up';
    } else if (e.keyCode == 83) {
        SnakeDirection2 = 'down';
    } else if (e.keyCode == 68) {
        SnakeDirection2 = 'right';
    } else if (e.keyCode == 65) {
        SnakeDirection2 = 'left';
    }
}

function spawnfruit() {
    var i, j, randomval
    var grid = [
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
    ];
    var xlist = [];
    var ylist = [];
    for (i = 0; i < Snake.length; i++) {
        grid[Snake[i].x][Snake[i].y] = true;
    }
    if (TwoPlayers) {
        for (i = 0; i < Snake2.length; i++) {
            grid[Snake2[i].x][Snake2[i].y] = true;
        }
    }
    for (i = 0; i < fruit.length; i++) {
        grid[fruit[i].x][fruit[i].y] = true;
    }

    for (i = 0; i < 25; i++) {
        for (j = 0; j < 25; j++) {
            if (!grid[i][j]) {
                xlist.push(i);
                ylist.push(j)
            }
        }
    }
    if (xlist.length == 0 && fruit.length == 0) {
        myGameArea.stop()
        if (Snake.length > HighScore) {
            HighScore = Snake.length;
        }
        alert('GAME OVER YOU WIN!!!!!!!. Your score is ' + Snake.length + '! The HighScore is ' + HighScore + '!!!!');
    }
    while (fruit.length < NumberofFruit && xlist.length != 0) {

        randomval = Math.round(Math.random() * (xlist.length - 1))
        fruit.push(createnewfruit(xlist[randomval], ylist[randomval], Math.round(Math.random() * 2), Math.round(Math.random() * 4)));
        xlist.splice(randomval,1);
        ylist.splice(randomval,1);
    }
}

function renderFruit(Data) {

    // Draw the animation
    // Data.context.drawImage
    Data.context.drawImage(
        Data.image,
        Data.xFrame * Data.width / Data.numberOfXFrames,
        Data.yFrame * Data.height / Data.numberOfYFrames,
        Data.width / Data.numberOfXFrames,
        Data.height / Data.numberOfYFrames,
        (Data.x * 20 + 10) - ((Data.width / Data.numberOfXFrames) / 2),
        (Data.y * 20 + 10) - ((Data.height / Data.numberOfYFrames) / 2),
        Data.width / Data.numberOfXFrames,
        Data.height / Data.numberOfYFrames);

};

function createnewfruit(x,y,xFrame,yFrame) {
    var fruitData = {
        x: x,
        y: y,
        xFrame: xFrame,
        yFrame: yFrame,
        image: fruitImage,
        width: 60,
        height: 100,
        numberOfXFrames: 3,
        numberOfYFrames: 5,
        context: myGameArea.canvas.getContext("2d")
    }
    return fruitData;
}