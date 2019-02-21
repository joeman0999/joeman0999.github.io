var Thecanvas = {
    width: 500,
    height: 500
};
var Score, GameSpeed
var HighScore = 0;
var Cheese = [];
var Cat = [];
var WallImage = new Image();
WallImage.src = "images/MouseWall.png";
var MouseImage = new Image();
MouseImage.src = "images/Mouse.png";
var CatImage = new Image();
CatImage.src = "images/Cat.png";
var CheeseImage = new Image();
CheeseImage.src = "images/Cheese.png";
var Mouse = {
    x: 12,
    y: 12
}
var BigGrid = [
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
var GridNodes = [];

function Start_Game() {
    Score = 0;
    GameSpeed = 4;
    LevelSelect();
    document.getElementById("Menu").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }
    myGameArea.stop();
    myGameArea.start();
    document.getElementById("wins").innerHTML = "Score: " + Score;
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
        myGameArea.keys = (myGameArea.keys || []);
        this.canvas.setAttribute("id", "GameArea")
        this.canvas.width = Thecanvas.width;
        this.canvas.height = Thecanvas.height;
        this.context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 50);


        window.addEventListener('keydown', keydownhandler);
        window.addEventListener('keyup', keyuphandler);
    },
    stop: function () {
        myGameArea.keys = [];
        clearInterval(this.interval);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function updateGameArea() {
    var i, j, k, x, y, kk, crashed, move, fail, CatMove, Used, CatList, Options, newOptions, pick, Path, Wall
    fail = false;
    move = false;
    crashed = false;
    myGameArea.frameNo += 1;
    if (Math.round(myGameArea.frameNo / GameSpeed) == myGameArea.frameNo / GameSpeed) {
        myGameArea.clear();
        x = Mouse.x;
        y = Mouse.y;
        if (myGameArea.keys[38] && y > 0) {
            y -= 1;
        } else if (myGameArea.keys[40] && y < 24) {
            y += 1;
        } else if (myGameArea.keys[39] && x < 24) {
            x += 1;
        } else if (myGameArea.keys[37] && x > 0) {
            x -= 1;
        }

        if (BigGrid[x][y]) {
            if (myGameArea.keys[38]) {
                for (j = y; j >= 0; j--) {
                    if (!BigGrid[x][j]) {
                        for (k = 0; k < Cat.length; k++) {
                            if (Cat[k].x == x && Cat[k].y == j) {
                                fail = true;
                            }
                        }
                        for (k = 0; k < Cheese.length; k++) {
                            if (Cheese[k].x == x && Cheese[k].y == j) {
                                fail = true;
                            }
                        }
                        if (!fail) {
                            move = true;
                            BigGrid[x][j] = true;
                            BigGrid[x][y] = false;
                            break;
                        }
                    }
                }
            } else if (myGameArea.keys[40]) {
                for (j = y; j < 25; j++) {
                    if (!BigGrid[x][j]) {
                        for (k = 0; k < Cat.length; k++) {
                            if (Cat[k].x == x && Cat[k].y == j) {
                                fail = true;
                            }
                        }
                        for (k = 0; k < Cheese.length; k++) {
                            if (Cheese[k].x == x && Cheese[k].y == j) {
                                fail = true;
                            }
                        }
                        if (!fail) {
                            move = true;
                            BigGrid[x][j] = true;
                            BigGrid[x][y] = false;
                            break;
                        }
                    }
                }
            } else if (myGameArea.keys[39]) {
                for (j = x; j < 25; j++) {
                    if (!BigGrid[j][y]) {
                        for (k = 0; k < Cat.length; k++) {
                            if (Cat[k].x == j && Cat[k].y == y) {
                                fail = true;
                            }
                        }
                        for (k = 0; k < Cheese.length; k++) {
                            if (Cheese[k].x == j && Cheese[k].y == y) {
                                fail = true;
                            }
                        }
                        if (!fail) {
                            move = true;
                            BigGrid[j][y] = true;
                            BigGrid[x][y] = false;
                            break;
                        }
                    }
                }
            } else if (myGameArea.keys[37]) {
                for (j = x; j >= 0; j--) {
                    if (!BigGrid[j][y]) {
                        for (k = 0; k < Cat.length; k++) {
                            if (Cat[k].x == j && Cat[k].y == y) {
                                fail = true;
                            }
                        }
                        for (k = 0; k < Cheese.length; k++) {
                            if (Cheese[k].x == j && Cheese[k].y == y) {
                                fail = true;
                            }
                        }
                        if (!fail) {
                            move = true;
                            BigGrid[j][y] = true;
                            BigGrid[x][y] = false;
                            break;
                        }
                    }
                }
            }
        } else {
            move = true;
        }

        if (move) {
            Mouse.x = x;
            Mouse.y = y;
        }

        for (i = 0; i < 25; i++) {
            for (j = 0; j < 25; j++) {
                if (BigGrid[i][j]) {
                    Wall = {
                        x: i,
                        y: j
                    }
                    draw(WallImage, Wall);
                }
            }
        }

        for (i = 0; i < Cat.length; i++) {
            if (Cat[i].x == Mouse.x && Cat[i].y == Mouse.y) {
                crashed = true;
                break;
            } else {
                CatMove = true;
                CatList = [];
                GridNodes = InitializeGrid();
                Path = FindConnectingPath(Cat[i], Mouse);
                if (Path.length > 0) {
                    
                    for (j = 0; j < Cat.length; j++) {
                        if (Cat[j].x == Path[0].x && Cat[j].y == Path[0].y) {
                            CatMove = false;
                            break;
                        }
                    }

                    if (CatMove) {
                        Cat[i].x = Path[0].x;
                        Cat[i].y = Path[0].y;
                        if (Cat[i].x == Mouse.x && Cat[i].y == Mouse.y) {
                            crashed = true;
                            break;
                        }
                    }
                } else {
                    GridNodes = InitializeGrid();
                    Options = Neighbors(GridNodes, Cat[i], false);
                    newOptions = [];
                    for (j = 0; j < Options.length; j++) {
                        if (!Options[j].visited) {
                            Used = false;
                            for (k = 0; k < Cat.length; k++) {
                                if (Options[j].x == Cat[k].x && Options[j].y == Cat[k].y) {
                                    Used = true;
                                    break;
                                }
                            }
                            if (!Used) {
                                newOptions.push(Options[j]);
                            }
                        }
                    }
                    if (newOptions.length > 0) {
                        pick = Math.round(Math.random() * (newOptions.length - 1));
                        Cat[i].x = newOptions[pick].x;
                        Cat[i].y = newOptions[pick].y;
                    } else {
                        CatList = [];
                        CatList.push(i);

                        for (j = 0; j < CatList.length; j++) {
                            for (kk = 0; kk < 4; kk++) {
                                Used = false;
                                if (kk == 0) {
                                    x = Cat[CatList[j]].x + 1;
                                    y = Cat[CatList[j]].y;
                                } else if (kk == 1) {
                                    x = Cat[CatList[j]].x - 1;
                                    y = Cat[CatList[j]].y;
                                } else if (kk == 2) {
                                    x = Cat[CatList[j]].x;
                                    y = Cat[CatList[j]].y + 1;
                                } else {
                                    x = Cat[CatList[j]].x;
                                    y = Cat[CatList[j]].y - 1;
                                }

                                if (x > -1 && x < 25 && y > -1 && y < 25 && !BigGrid[x][y]) {
                                    for (k = 0; k < Cat.length; k++) {
                                        if (Cat[k].x == x && Cat[k].y == y) {
                                            Used = true;
                                            CatList.push(k);
                                            CatList = CatList.filter(function (item, m, ar) { return ar.indexOf(item) === m; });
                                            break;
                                        }
                                    }
                                    for (k = 0; k < Cheese.length; k++) {
                                        if (Cheese[k].x == x && Cheese[k].y == y) {
                                            Used = true;
                                            break;
                                        }
                                    }
                                } else {
                                    Used = true;
                                }

                                if (!Used) {
                                    CatList = [];
                                    break;
                                }
                            }
                        }

                        CatList.sort(function (a, b) { return b - a });
                        for (j = 0; j < CatList.length; j++) {
                            Cheese.push(Cat[CatList[j]]);
                            Cat.splice(CatList[j], 1);
                            SpawnCat();
                        }

                        
                        Score += 100*CatList.length;
                        document.getElementById("wins").innerHTML = "Score: " + Score;
                    }
                }
            }
        }

        for (i = 0; i < Cheese.length; i++) {
            if (Mouse.x == Cheese[i].x && Mouse.y == Cheese[i].y) {
                Cheese.splice(i, 1);
                Score += 100;
                document.getElementById("wins").innerHTML = "Score: " + Score;
            } else {
                draw(CheeseImage, Cheese[i]);
            }
        }
        for (j = 0; j < Cat.length; j++) {
            draw(CatImage, Cat[j]);

        }
        draw(MouseImage, Mouse);
        
        if (crashed) {
            myGameArea.stop()
            if (Score > HighScore) {
                HighScore = Score;
            }
            alert('Game Over. Your score is ' + Score + '! The HighScore is ' + HighScore);
        }
    }
}

function LevelSelect() {
    Mouse = {
        x: 12,
        y: 12
    }
    BigGrid = [
        [false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false, true, false, false, false, false, false,],
        [false, false, false, false, false, false, false, true, false, true, false, false, true, false, false, true, false, true, false, false, false, false, false, true, false,],
        [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, true, false, false, false, false, false,],
        [false, false, false, true, true, false, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, true, false,],
        [false, false, false, true, true, false, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false,],
        [false, true, true, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false,],
        [false, false, false, true, true, false, true, true, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false,],
        [false, false, false, false, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false, false, false,],
        [false, true, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false,],
        [false, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, false, false, true, false, true, false, false, false, false,],
        [false, false, true, true, true, true, true, true, true, true, true, false, false, true, false, false, false, false, true, false, true, false, false, true, false,],
        [false, false, false, false, false, false, true, true, true, true, true, true, false, false, false, true, true, true, true, true, false, false, false, false, false,],
        [true, false, false, false, true, false, false, false, true, true, true, false, false, true, false, true, true, false, false, false, false, false, true, false, false,],
        [false, false, false, true, false, false, false, false, true, true, true, false, false, false, false, true, false, false, false, true, true, false, false, false, false,],
        [false, false, true, false, false, false, false, false, true, true, true, false, false, true, false, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, true, true, false, false, true, true, true, true, false, true, false, false, true, false, true, false, true, false, false, true, false, false,],
        [false, false, false, false, false, false, true, false, true, true, true, false, false, false, true, false, false, false, false, false, false, false, false, false, false,],
        [false, false, false, true, false, true, false, false, true, true, true, false, false, false, false, false, true, false, false, true, true, true, false, false, false,],
        [false, true, true, false, false, false, true, false, false, false, true, true, false, true, false, true, false, false, false, false, false, false, false, true, false,],
        [false, false, true, false, false, true, false, false, true, false, false, true, true, false, false, false, true, true, false, false, false, false, false, false, false,],
        [false, true, false, true, false, true, false, false, false, false, true, true, false, false, true, false, false, true, true, true, true, false, true, false, false,],
        [false, false, false, false, true, true, false, true, false, false, true, false, false, false, false, true, false, false, false, false, false, false, true, false, false,],
        [false, false, true, true, false, true, false, false, false, true, false, false, true, false, false, false, true, false, false, true, false, true, true, false, false,],
        [false, true, false, false, true, true, false, false, false, false, false, false, true, true, true, true, false, true, false, true, false, true, false, false, false,],
        [false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false, false, false, false, false, false, false, false, false, false,],
    ];
    Cat = [{
        x: 3,
        y: 4
    }];
    CATS = 1;
    Cheese = [];
}

function SpawnCat() {
    var i, j, k
    var Used = false;
    var xlist = [];
    var ylist = [];
    
    while (Score/100 >= CATS*2) {
        CATS += 1;
    }
    for (i = 0; i < 25; i++) {
        for (j = 0; j < 25; j++) {
            Used = false;
            if (!BigGrid[i][j]) {
                for (k = 0; k < Cat.length; k++) {
                    if (Cat[k].x == i && Cat[k].y == j) {
                        Used = true;
                        break;
                    }
                }
                for (k = 0; k < Cheese.length; k++) {
                    if (Cheese[k].x == i && Cheese[k].y == j) {
                        Used = true;
                        break;
                    }
                }
                if (Mouse.x == i && Mouse.y == j) {
                    Used = true;
                }
                if (!Used) {
                    xlist.push(i);
                    ylist.push(j)
                }
            }
        }
    }

    while (Cat.length < CATS && xlist.length != 0) {
        var randomval = Math.round(Math.random() * (xlist.length - 1));
        var newcat = {
            x: xlist[randomval],
            y: ylist[randomval]
        }
        Cat.push(newcat);
        xlist.splice(randomval, 1);
        ylist.splice(randomval, 1);
    }
}

function keydownhandler(e) {
    myGameArea.keys = (myGameArea.keys || []);
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
}

function keyuphandler(e) {
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
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

function FindConnectingPath(Point1, Point2) {
    var end = {
        x: Point2.x,
        y: Point2.y,
    }
    var start = {
        x: Point1.x,
        y: Point1.y,
        cost: 1,
        g: 0,
        f: 0,
        h: Math.abs(end.x - Point1.x) + Math.abs(end.y - Point1.y),
        visited: false,
        closed: false,
        parent: false,
    }

    return Path = search(GridNodes, start, end, false, 'manhattan')
}

function InitializeGrid() {
    var x, y, k
    var GridNodes = [];
    for (x = 0; x < 25; x++) {
        GridNodes[x] = [];
        for (y = 0; y < 25; y++) {
            var node = {
                x: x,
                y: y,
                f: 0, // Score = g + h
                g: 0, // g = how long it took to get here
                h: 0, // h = how far away the end is
                cost: 1,
                visited: false, // has this square been visited 
                closed: false, // is the square closed
                parent: null
            }

            node.visited = false;
            node.closed = false;
            if (BigGrid[x][y]) {
                node.visited = true; // has this square been visited 
                node.closed = true; // is the square closed
            }
            GridNodes[x][y] = node;
        }
    }
        for (k = 0; k < Cheese.length; k++) {
            GridNodes[Cheese[k].x][Cheese[k].y].visited = true;
            GridNodes[Cheese[k].x][Cheese[k].y].closed = true;
        }
    return GridNodes
}

function Neighbors(grid, node, diagonals) {
    var ret = [];
    var x = node.x;
    var y = node.y;

    // West
    if (grid[x - 1] && grid[x - 1][y]) {
        ret.push(grid[x - 1][y]);
    }

    // East
    if (grid[x + 1] && grid[x + 1][y]) {
        ret.push(grid[x + 1][y]);
    }

    // South
    if (grid[x] && grid[x][y - 1]) {
        ret.push(grid[x][y - 1]);
    }

    // North
    if (grid[x] && grid[x][y + 1]) {
        ret.push(grid[x][y + 1]);
    }

    if (diagonals) {

        // Southwest
        if (grid[x - 1] && grid[x - 1][y - 1]) {
            ret.push(grid[x - 1][y - 1]);
        }

        // Southeast
        if (grid[x + 1] && grid[x + 1][y - 1]) {
            ret.push(grid[x + 1][y - 1]);
        }

        // Northwest
        if (grid[x - 1] && grid[x - 1][y + 1]) {
            ret.push(grid[x - 1][y + 1]);
        }

        // Northeast
        if (grid[x + 1] && grid[x + 1][y + 1]) {
            ret.push(grid[x + 1][y + 1]);
        }

    }

    return ret;
}

function manhattan(x1, y1, x2, x2) {
    // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html

    var d1 = Math.abs(x2 - x1);
    var d2 = Math.abs(y2 - y1);
    return d1 + d2;
}

function getHeap() {
    return new BinaryHeap(function (node) {
        return node.f;
    });
}

function BinaryHeap(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function (element) {
        // Add the new element to the end of the array.
        this.content.push(element);

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    },
    pop: function () {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    },
    remove: function (node) {
        var i = this.content.indexOf(node);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            } else {
                this.bubbleUp(i);
            }
        }
    },
    size: function () {
        return this.content.length;
    },
    rescoreElement: function (node) {
        this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function (n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {

            // Compute the parent element's index, and fetch it.
            var parentN = ((n + 1) >> 1) - 1;
            var parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }
            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    },
    bubbleUp: function (n) {
        // Look up the target element and its score.
        var length = this.content.length;
        var element = this.content[n];
        var elemScore = this.scoreFunction(element);

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1;
            var child1N = child2N - 1;
            // This is used to store the new position of the element, if any.
            var swap = null;
            var child1Score;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore) {
                    swap = child1N;
                }
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N];
                var child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }
            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
};

function search(grid, start, end, diagonal, heuristic) {
    var openHeap = getHeap();
    openHeap.push(start);
    var Run = true;
    while (Run == true) {

        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
        var currentNode = openHeap.pop();
        try {
            // End case -- result has been found, return the traced path.
            if (currentNode.x == end.x && currentNode.y == end.y) {
                var curr = currentNode;
                var ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }
        } catch (err) {
            var x = 1;
        }
        // Normal case -- move currentNode from open to closed, process each of its neighbors.
        currentNode.closed = true;

        // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
        var neighbors = Neighbors(grid, currentNode, diagonal);

        for (var i = 0, il = neighbors.length; i < il; i++) {
            var neighbor = neighbors[i];

            if (neighbor.closed) {
                // Not a valid node to process, skip to next neighbor.
                continue;
            }

            // The g score is the shortest distance from start to current node.
            // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
            var gScore = currentNode.g + neighbor.cost;
            var beenVisited = neighbor.visited;

            if (!beenVisited || gScore < neighbor.g) {

                // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                neighbor.visited = true;
                neighbor.parent = currentNode;
                if (heuristic == manhattan) { // The manhattan distance
                    neighbor.h = manhattan(neighbor.x, neighbor.y, end.x, end.y);
                }
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;

                if (!beenVisited) {
                    // Pushing to heap will put it in proper place based on the 'f' value.
                    openHeap.push(neighbor);
                }
                else {
                    // Already seen the node, but since it has been rescored we need to reorder it in the heap
                    openHeap.rescoreElement(neighbor);
                }
            }
        }
        if (openHeap.content.length == 0) {
            Run = false;
        }
    }

    // No result was found - empty array signifies failure to find path.
    return [];
}