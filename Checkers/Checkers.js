var Thecanvas = {
    width: 544,
    height: 544
};
var Computer = "None";
var PlayersTurn = "Red";
var Difficulty = 2;
var Timedout = false;
var ComputersMoveList = [];
var BoardState = [];
var TypeOnePlayer = false;
var TypeTwoPlayer = false;
var GameOver = false;
var BlackChecker = new Image();
BlackChecker.src = "images/BlackChecker.png";
var RedChecker = new Image();
RedChecker.src = "images/RedChecker.png"; // Red is blue
var BlackCheckerQueen = new Image();
BlackCheckerQueen.src = "images/BlackCheckerQueen.png"; // black is grey
var RedCheckerQueen = new Image();
RedCheckerQueen.src = "images/RedCheckerQueen.png";
var BackGroundSelect = new Image();
BackGroundSelect.src = "images/BackGroundSelect.png";

window.onload = function () {
    var screenW = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    var screenH = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight) - 70;
    var min = Math.min(screenW, screenH);
    var size = (Math.floor(min / 8) - 1) * 8;
    Thecanvas.width = Thecanvas.height = size;
    try {
        myGameArea.canvas.width = Thecanvas.width;
        myGameArea.canvas.height = Thecanvas.height;
    } catch (err) {
    }
    window.addEventListener('resize', ResizeWindow);
}

function ResizeWindow() {
    var screenW = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    var screenH = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight) - 70;
    var min = Math.min(screenW, screenH);
    var size = (Math.floor(min/8) - 1) * 8;
    Thecanvas.width = Thecanvas.height = size;
    try {
        myGameArea.canvas.width = Thecanvas.width;
        myGameArea.canvas.height = Thecanvas.height;
        updateGameArea();
    } catch (err) {
    }
}

function New_Game() {
    BlackCheckers = [
        {
            Queen: false,
            x: 1,
            y: 0
        }, {
            Queen: false,
            x: 3,
            y: 0
        }, {
            Queen: false,
            x: 5,
            y: 0
        }, {
            Queen: false,
            x: 7,
            y: 0
        }, {
            Queen: false,
            x: 0,
            y: 1
        }, {
            Queen: false,
            x: 2,
            y: 1
        }, {
            Queen: false,
            x: 4,
            y: 1
        }, {
            Queen: false,
            x: 6,
            y: 1
        }, {
            Queen: false,
            x: 1,
            y: 2
        }, {
            Queen: false,
            x: 3,
            y: 2
        }, {
            Queen: false,
            x: 5,
            y: 2
        }, {
            Queen: false,
            x: 7,
            y: 2
        }
    ];
    RedCheckers = [
        {
            Queen: false,
            x: 0,
            y: 5
        }, {
            Queen: false,
            x: 2,
            y: 5
        }, {
            Queen: false,
            x: 4,
            y: 5
        }, {
            Queen: false,
            x: 6,
            y: 5
        }, {
            Queen: false,
            x: 1,
            y: 6
        }, {
            Queen: false,
            x: 3,
            y: 6
        }, {
            Queen: false,
            x: 5,
            y: 6
        }, {
            Queen: false,
            x: 7,
            y: 6
        }, {
            Queen: false,
            x: 0,
            y: 7
        }, {
            Queen: false,
            x: 2,
            y: 7
        }, {
            Queen: false,
            x: 4,
            y: 7
        }, {
            Queen: false,
            x: 6,
            y: 7
        }
    ];
    Mouse = {
        Index: 0,
        Holds: "Nothing",
    };
    PlayersTurn = "Red";
    jumpagain = false;
    GameOver = false;
    document.getElementById("Jump_Again-Button").hidden = true;
    document.getElementById("End_Turn-Button").hidden = true;
    BoardState = DetermineBoardState(RedCheckers, BlackCheckers);
    updateGameArea();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        myGameArea.keys = [];
        this.canvas.setAttribute("id", "GameArea")
        this.canvas.width = Thecanvas.width;
        this.canvas.height = Thecanvas.height;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        document.getElementById("GameArea").addEventListener('click', clickhandler);
        document.getElementById("GameArea").addEventListener('touchstart', handleTouchStart);
        New_Game();
    },
    stop: function () {
        try {
            document.getElementById("GameArea").removeEventListener('click', clickhandler);
            myGameArea.clear();
        } catch (err) {
        }
        
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function TwoPlayer() {
    TypeTwoPlayer = true;
    document.getElementById("Menu").hidden = true;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }
    myGameArea.start();
    document.getElementById("ButtonArea").hidden = false;
}

function OnePlayer() {
    TypeOnePlayer = true;
    document.getElementById("OnePlayerMenu").hidden = true;
    document.getElementById("DifficultyMenu").hidden = false;
}

function OnePlayerMenu() {
    document.getElementById("Menu").hidden = true;
    document.getElementById("OnePlayerMenu").hidden = false;
}

function DifficultyMenu(e) {
    Difficulty = e;
    document.getElementById("DifficultyMenu").hidden = true;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }
    myGameArea.start();
    document.getElementById("ButtonArea").hidden = false;
}

function OnePlayerColor(Color) {
    if (Color == "Red") {
        Computer = "Black";
    } else {
        Computer = "Red";
    }
    OnePlayer()
}

function Menu() {
    Computer = "None";
    TypeOnePlayer = false;
    TypeTwoPlayer = false;
    document.getElementById("ButtonArea").hidden = true;
    document.getElementById("OnePlayerMenu").hidden = true;
    if (document.getElementById("GameArea")) {
        myGameArea.stop();
        document.getElementById("GameArea").hidden = true;
    }
    document.getElementById("Menu").hidden = false;
}

function updateGameArea() {
    myGameArea.clear();
    for (let i = 0; i < RedCheckers.length; i++) {
        if (RedCheckers[i].Queen) {
            draw(RedCheckerQueen, RedCheckers[i]);
        } else {
            draw(RedChecker, RedCheckers[i]);
        }
    }
    for (let i = 0; i < BlackCheckers.length; i++) {
        if (BlackCheckers[i].Queen) {
            draw(BlackCheckerQueen, BlackCheckers[i]);
        } else {
            draw(BlackChecker, BlackCheckers[i]);
        }
    }
    if (Mouse.Holds == "Red" ) {
        draw(BackGroundSelect, RedCheckers[Mouse.Index]);
    } else if(Mouse.Holds == "Black") {
        draw(BackGroundSelect, BlackCheckers[Mouse.Index]);
    }

    if ((PlayersTurn == "Red" && Computer == "Red") || (PlayersTurn == "Black" && Computer == "Black")) {
        if (!Timedout && !GameOver) {
            Timedout = true;
            if (Difficulty > 1) {
                setTimeout(RunComputersSmartTurn, 500);
            } else {
                setTimeout(RunComputersRandomTurn, 500);
            }
        }
    }
}

function draw(image, Info) {
    // works on any image given height width angle and position

    // save the current coordinate system 
    // before we screw with it
    myGameArea.context.save();

    // move to the middle of where we want to draw our image
    myGameArea.context.translate(Info.x * Thecanvas.width / 8 + Thecanvas.width / 16, Info.y * Thecanvas.height / 8 + Thecanvas.height / 16);

    // draw it up and to the left by half the width
    // and height of the image 
    myGameArea.context.drawImage(image, -(Thecanvas.width / 16), -(Thecanvas.height / 16), Thecanvas.width / 8, Thecanvas.height / 8);

    // and restore the coords to how they were when we began
    myGameArea.context.restore();
}

function clickhandler(e) {
    click(e);
}

function handleTouchStart(evt) {
    var e = evt.touches[0];
    click(e);
}

function click(e) {
    if ((TypeOnePlayer && (PlayersTurn == "Red" && Computer == "Black") || (PlayersTurn == "Black" && Computer == "Red")) || TypeTwoPlayer) {
        var x = Math.floor((e.clientX - 10) / (Thecanvas.width / 8));
        var y = Math.floor((e.clientY - 10) / (Thecanvas.height / 8));
        if (x >= 0 && x <= 7 && y >= 0 && y <= 7) {
            if (Mouse.Holds == "Nothing") {
                if (PlayersTurn == "Red") {
                    if (BoardState[y][x] == 1) {
                        Mouse.Holds = "Red";
                        for (let i = 0; i < RedCheckers.length; i++) {
                            if (RedCheckers[i].x == x && RedCheckers[i].y == y) {
                                Mouse.Index = i;
                                break;
                            }
                        }
                    }
                } else {
                    if (BoardState[y][x] == 2) {
                        Mouse.Holds = "Black";
                        for (let i = 0; i < BlackCheckers.length; i++) {
                            if (BlackCheckers[i].x == x && BlackCheckers[i].y == y) {
                                Mouse.Index = i;
                                break;
                            }
                        }
                    }
                }
            } else {
                var Oldplacex, Oldplacey, jumpposition, index
                if (Mouse.Holds == "Red") {
                    Oldplacex = RedCheckers[Mouse.Index].x;
                    Oldplacey = RedCheckers[Mouse.Index].y;
                    if (BoardState[y][x] == 1 && !jumpagain) {
                        for (let i = 0; i < RedCheckers.length; i++) {
                            if (RedCheckers[i].x == x && RedCheckers[i].y == y) {
                                Mouse.Index = i;
                                break;
                            }
                        }
                    }
                } else if (Mouse.Holds == "Black") {
                    Oldplacex = BlackCheckers[Mouse.Index].x;
                    Oldplacey = BlackCheckers[Mouse.Index].y;
                    if (BoardState[y][x] == 2 && !jumpagain) {
                        for (let i = 0; i < BlackCheckers.length; i++) {
                            if (BlackCheckers[i].x == x && BlackCheckers[i].y == y) {
                                Mouse.Index = i;
                                break;
                            }
                        }
                    }
                }
                if (BoardState[y][x] == 0) {
                    if (((x + y) / 2 != Math.round((x + y) / 2))) {
                        if (Math.abs(Oldplacex - x) + Math.abs(Oldplacey - y) == 2 && x != Oldplacex && y != Oldplacey && !jumpagain) {
                            if (Mouse.Holds == "Red") {
                                if (y < Oldplacey) {
                                    if (y == 0) {
                                        RedCheckers[Mouse.Index].Queen = true;
                                    }
                                    RedCheckers[Mouse.Index].x = x;
                                    RedCheckers[Mouse.Index].y = y;
                                    Mouse.Holds = "Nothing";
                                    PlayersTurn = "Black";
                                    BoardState[y][x] = 1;
                                    BoardState[Oldplacey][Oldplacex] = 0;
                                    checkforwin();
                                } else if (RedCheckers[Mouse.Index].Queen) {
                                    RedCheckers[Mouse.Index].x = x;
                                    RedCheckers[Mouse.Index].y = y;
                                    Mouse.Holds = "Nothing";
                                    PlayersTurn = "Black";
                                    BoardState[y][x] = 1;
                                    BoardState[Oldplacey][Oldplacex] = 0;
                                    checkforwin();
                                }
                            } else if (Mouse.Holds == "Black") {
                                if (y > Oldplacey) {
                                    if (y == 7) {
                                        BlackCheckers[Mouse.Index].Queen = true;
                                    }
                                    BlackCheckers[Mouse.Index].x = x;
                                    BlackCheckers[Mouse.Index].y = y;
                                    Mouse.Holds = "Nothing";
                                    PlayersTurn = "Red";
                                    BoardState[y][x] = 2;
                                    BoardState[Oldplacey][Oldplacex] = 0;
                                    checkforwin();
                                } else if (BlackCheckers[Mouse.Index].Queen) {
                                    BlackCheckers[Mouse.Index].x = x;
                                    BlackCheckers[Mouse.Index].y = y;
                                    Mouse.Holds = "Nothing";
                                    PlayersTurn = "Red";
                                    BoardState[y][x] = 2;
                                    BoardState[Oldplacey][Oldplacex] = 0;
                                    checkforwin();
                                }
                            }
                        } else if (Math.abs(Oldplacex - x) + Math.abs(Oldplacey - y) == 4 && Oldplacex != x && Oldplacey != y) {
                            jumpposition = {
                                x: (Oldplacex + (x - Oldplacex) / 2),
                                y: (Oldplacey + (y - Oldplacey) / 2)
                            };
                            if (Mouse.Holds == "Red") {
                                if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                                    for (let i = 0; i < BlackCheckers.length; i++) {
                                        if (BlackCheckers[i].x == jumpposition.x && BlackCheckers[i].y == jumpposition.y) {
                                            index = i;
                                            break;
                                        }
                                    }
                                    if (y < Oldplacey) {
                                        RedCheckers[Mouse.Index].x = x;
                                        RedCheckers[Mouse.Index].y = y;
                                        BoardState[y][x] = 1;
                                        BoardState[Oldplacey][Oldplacex] = 0;
                                        BoardState[jumpposition.y][jumpposition.x] = 0;
                                        if (y == 0 && !RedCheckers[Mouse.Index].Queen) {
                                            RedCheckers[Mouse.Index].Queen = true;
                                            jumpagain = false;
                                            Mouse.Holds = "Nothing";
                                            PlayersTurn = "Black";
                                            document.getElementById("Jump_Again-Button").hidden = true;
                                            document.getElementById("End_Turn-Button").hidden = true;
                                            BlackCheckers.splice(index, 1);
                                            checkforwin();
                                        } else {
                                            BlackCheckers.splice(index, 1);
                                            if (Checkforjump("Red", RedCheckers[Mouse.Index])) {
                                                jumpagain = true;
                                                jumpagainoption();
                                            } else {
                                                jumpagain = false;
                                                Mouse.Holds = "Nothing";
                                                PlayersTurn = "Black";
                                                document.getElementById("Jump_Again-Button").hidden = true;
                                                document.getElementById("End_Turn-Button").hidden = true;
                                                checkforwin();
                                            }
                                        }
                                    } else if (RedCheckers[Mouse.Index].Queen) {
                                        RedCheckers[Mouse.Index].x = x;
                                        RedCheckers[Mouse.Index].y = y;
                                        BoardState[y][x] = 1;
                                        BoardState[Oldplacey][Oldplacex] = 0;
                                        BoardState[jumpposition.y][jumpposition.x] = 0;
                                        BlackCheckers.splice(index, 1);
                                        if (Checkforjump("Red", RedCheckers[Mouse.Index])) {
                                            jumpagain = true;
                                            jumpagainoption();
                                        } else {
                                            jumpagain = false;
                                            Mouse.Holds = "Nothing";
                                            PlayersTurn = "Black";
                                            document.getElementById("Jump_Again-Button").hidden = true;
                                            document.getElementById("End_Turn-Button").hidden = true;
                                            checkforwin();
                                        }
                                    }
                                }
                            } else if (Mouse.Holds == "Black") {
                                for (let i = 0; i < RedCheckers.length; i++) {
                                    if (RedCheckers[i].x == jumpposition.x && RedCheckers[i].y == jumpposition.y) {
                                        index = i;
                                        break;
                                    }
                                }
                                if (y > Oldplacey) {
                                    BlackCheckers[Mouse.Index].x = x;
                                    BlackCheckers[Mouse.Index].y = y;
                                    BoardState[y][x] = 2;
                                    BoardState[Oldplacey][Oldplacex] = 0;
                                    BoardState[jumpposition.y][jumpposition.x] = 0;
                                    if (y == 7) {
                                        BlackCheckers[Mouse.Index].Queen = true;
                                        jumpagain = false;
                                        Mouse.Holds = "Nothing";
                                        PlayersTurn = "Red";
                                        document.getElementById("Jump_Again-Button").hidden = true;
                                        document.getElementById("End_Turn-Button").hidden = true;
                                        RedCheckers.splice(index, 1);
                                        checkforwin();
                                    } else {
                                        RedCheckers.splice(index, 1);
                                        if (Checkforjump("Black", BlackCheckers[Mouse.Index])) {
                                            jumpagain = true;
                                            jumpagainoption();
                                        } else {
                                            jumpagain = false;
                                            document.getElementById("Jump_Again-Button").hidden = true;
                                            document.getElementById("End_Turn-Button").hidden = true;
                                            Mouse.Holds = "Nothing";
                                            PlayersTurn = "Red";
                                            checkforwin();
                                        }
                                    }
                                } else if (BlackCheckers[Mouse.Index].Queen) {
                                    BlackCheckers[Mouse.Index].x = x;
                                    BlackCheckers[Mouse.Index].y = y;
                                    BoardState[y][x] = 2;
                                    BoardState[Oldplacey][Oldplacex] = 0;
                                    BoardState[jumpposition.y][jumpposition.x] = 0;
                                    RedCheckers.splice(index, 1);
                                    if (Checkforjump("Black", BlackCheckers[Mouse.Index])) {
                                        jumpagain = true;
                                        jumpagainoption();
                                    } else {
                                        jumpagain = false;
                                        document.getElementById("Jump_Again-Button").hidden = true;
                                        document.getElementById("End_Turn-Button").hidden = true;
                                        Mouse.Holds = "Nothing";
                                        PlayersTurn = "Red";
                                        checkforwin();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        updateGameArea();
    }
}

function Checkforjump(Color, piece) {
    var jumpposition = {
        x: 0,
        y: 0
    };
    
    if (piece.Queen || Color == "Red") {
        if (piece.y > 1) {
            if (piece.x > 1) {
                jumpposition.x = piece.x - 2;
                jumpposition.y = piece.y - 2;
                if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x - 1;
                    jumpposition.y = piece.y - 1;
                    if (Color == "Red") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                            return true;
                        }
                    } else if (Color == "Black") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 1) {
                            return true;
                        }
                    }
                }
            }
            if (piece.x < 6) {
                jumpposition.x = piece.x + 2;
                jumpposition.y = piece.y - 2;
                if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x + 1;
                    jumpposition.y = piece.y - 1;
                    if (Color == "Red") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                            return true;
                        }
                    } else if (Color == "Black") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 1) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    if (piece.Queen || Color == "Black") {
        if (piece.y < 6) {
            if (piece.x > 1) {
                jumpposition.x = piece.x - 2;
                jumpposition.y = piece.y + 2;
                if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x - 1;
                    jumpposition.y = piece.y + 1;
                    if (Color == "Red") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                            return true;
                        }
                    } else if (Color == "Black") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 1) {
                            return true;
                        }
                    }
                }
            }
            if (piece.x < 6) {
                jumpposition.x = piece.x + 2;
                jumpposition.y = piece.y + 2;
                if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x + 1;
                    jumpposition.y = piece.y + 1;
                    if (Color == "Red") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                            return true;
                        }
                    } else if (Color == "Black") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 1) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

function jumpagainoption() {
    document.getElementById("Jump_Again-Button").hidden = false;
    document.getElementById("End_Turn-Button").hidden = false;
}

function jump_again(e) {
    if (e) {
        jumpagain = true;
    } else {
        jumpagain = false;
        if (Mouse.Holds == "Black") {
            PlayersTurn = "Red";
        } else {
            PlayersTurn = "Black";
        }
        Mouse.Holds = "Nothing";
    }
    document.getElementById("Jump_Again-Button").hidden = true;
    document.getElementById("End_Turn-Button").hidden = true;
    updateGameArea();
}

function checkforwin() {
    var move = false;
    var jumpposition = {
        x: 0,
        y: 0
    };
    if (PlayersTurn == "Red") {
        for (let i = 0; i < RedCheckers.length; i++) {
            if (RedCheckers[i].y > 0) {
                if (RedCheckers[i].x > 0) {
                    jumpposition.x = RedCheckers[i].x - 1;
                    jumpposition.y = RedCheckers[i].y - 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = true;
                        break;
                    }
                }
                if (RedCheckers[i].x < 7) {
                    jumpposition.x = RedCheckers[i].x + 1;
                    jumpposition.y = RedCheckers[i].y - 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = true;
                        break;
                    }
                }
            }
            if (RedCheckers[i].Queen && RedCheckers[i].y < 7) {
                if (RedCheckers[i].x > 0) {
                    jumpposition.x = RedCheckers[i].x - 1;
                    jumpposition.y = RedCheckers[i].y + 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = true;
                        break;
                    }
                }
                if (RedCheckers[i].x < 7) {
                    jumpposition.x = RedCheckers[i].x + 1;
                    jumpposition.y = RedCheckers[i].y + 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = true;
                        break;
                    }
                }
            }
            if (Checkforjump('Red', RedCheckers[i])) {
                move = true;
                break;
            }
        }
    } else {
        for (let i = 0; i < BlackCheckers.length; i++) {
            if (BlackCheckers[i].y > 0 && BlackCheckers[i].Queen) {
                if (BlackCheckers[i].x > 0) {
                    jumpposition.x = BlackCheckers[i].x - 1;
                    jumpposition.y = BlackCheckers[i].y - 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = true;
                        break;
                    }
                }
                if (BlackCheckers[i].x < 7) {
                    jumpposition.x = BlackCheckers[i].x + 1;
                    jumpposition.y = BlackCheckers[i].y - 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = true;
                        break;
                    }
                }
            }
            if (BlackCheckers[i].y < 7) {
                if (BlackCheckers[i].x > 0) {
                    jumpposition.x = BlackCheckers[i].x - 1;
                    jumpposition.y = BlackCheckers[i].y + 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = true;
                        break;
                    }
                }
                if (BlackCheckers[i].x < 7) {
                    jumpposition.x = BlackCheckers[i].x + 1;
                    jumpposition.y = BlackCheckers[i].y + 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = true;
                        break;
                    }
                }
            }
            if (Checkforjump('Black', BlackCheckers[i])) {
                move = true;
                break;
            }
        }
    }
    if (!move) {
        GameOver = true;
        if (PlayersTurn == "Red") {
            alert('Gray Wins.');
        } else {
            alert('Blue Wins.');
        }
    }
}

function RunComputersRandomTurn() {
    var option, index;
    var movements = [];
    var jumps = [];
    Timedout = false;
    ComputersMoveList = FindMoves(PlayersTurn, RedCheckers, BlackCheckers, 1);
    for (let i = 0; i < ComputersMoveList.length; i++) {
        if (ComputersMoveList[i].type == "move") {
            movements.push(i);
        } else {
            jumps.push(i);
        }
    }
    if (jumps.length != 0) {
        option = Math.round(Math.random() * (jumps.length - 1));
        option = jumps[option];
        index = ComputersMoveList[option].index;
        RedCheckers = ComputersMoveList[option].Red;
        BlackCheckers = ComputersMoveList[option].Black;
        ComputersMoveList = ComputersMoveList[option].next;
        BoardState = DetermineBoardState(RedCheckers, BlackCheckers);
    } else {
        option = Math.round(Math.random() * (movements.length - 1));
        index = ComputersMoveList[option].index;
        RedCheckers = ComputersMoveList[option].Red;
        BlackCheckers = ComputersMoveList[option].Black;   
        ComputersMoveList = ComputersMoveList[option].next;
        BoardState = DetermineBoardState(RedCheckers, BlackCheckers);
    }
    if (PlayersTurn == "Red" && RedCheckers[index].y == 0) {
        RedCheckers[index].Queen = true;
    } else if (PlayersTurn == "Black" && BlackCheckers[index].y == 7) {
        BlackCheckers[index].Queen = true;
    }
    if (PlayersTurn == "Red") {
        PlayersTurn = "Black";
    } else {
        PlayersTurn = "Red";
    }

    checkforwin();
    updateGameArea();
}

function RunComputersSmartTurn() {
    var option, index;
    Timedout = false;
    var Scores = [];
    if (PlayersTurn == "Red") {
        var best = -13;
    } else {
        var best = 13;
    }
    var bestindex = [];
    
    ComputersMoveList = FindMoves(PlayersTurn, RedCheckers, BlackCheckers, 1);
    if (ComputersMoveList.length == 0) {

    } else {
        for (let i = 0; i < ComputersMoveList.length; i++) {
            // Allows me to keep already calculated information
        }
    }

    for (let i = 0; i < ComputersMoveList.length; i++) {
        Scores.push(Score(ComputersMoveList[i]));
        if (Scores[i] > best && PlayersTurn == "Red") {
            best = Scores[i];
        } else if (Scores[i] < best && PlayersTurn == "Black") {
            best = Scores[i];
        }
    }

    for (let i = 0; i < Scores.length; i++) {
        if (Scores[i] == best) {
            bestindex.push(i);
        }
    }
    
    option = Math.round(Math.random() * (bestindex.length - 1));
    option = bestindex[option];
    index = ComputersMoveList[option].index;
    RedCheckers = ComputersMoveList[option].Red;
    BlackCheckers = ComputersMoveList[option].Black;
    ComputersMoveList = ComputersMoveList[option].next;
    BoardState = DetermineBoardState(RedCheckers, BlackCheckers);
    
    if (PlayersTurn == "Red" && RedCheckers[index].y == 0) {
        RedCheckers[index].Queen = true;
    } else if (PlayersTurn == "Black" && BlackCheckers[index].y == 7) {
        BlackCheckers[index].Queen = true;
    }
    if (PlayersTurn == "Red") {
        PlayersTurn = "Black";
    } else {
        PlayersTurn = "Red";
    }

    checkforwin();
    updateGameArea();
}

function CreateNewMove(values, type, color, Red, Black, next) {
    // values = (x, y, index moved, index of jumped if jumped)
    var variable = {
        index: values[2],
        type: type,
        color: color,
        Red: [],
        Black: [],
        next: next
    }
    for (let i = 0; i < Red.length; i++) {
        if (color == "Red" && values[2] == i) {
            variable.Red.push(CheckerCopy(Red[i].Queen, values[0], values[1]));
        } else if (color != "Black" || i != values[3]) {
            variable.Red.push(CheckerCopy(Red[i].Queen, Red[i].x, Red[i].y));
        }
    }
    for (let i = 0; i < Black.length; i++) {
        if (color == "Black" && values[2] == i) {
            variable.Black.push(CheckerCopy(Black[i].Queen, values[0], values[1]));
        } else if (color != "Red" || i !=  values[3]) {
            variable.Black.push(CheckerCopy(Black[i].Queen, Black[i].x, Black[i].y));
        }
    }
    return variable;
}

function CheckerCopy(Queen, x, y) {
    var variable = {
        Queen: Queen,
        x: x,
        y: y
    }
    return variable;
}

function FindMoves(Color, Red, Black, depth) {
    var jumpposition = {
        x: 0,
        y: 0
    }
    var index = -1;
    var MoveList = [];
    var Board = DetermineBoardState(Red, Black);
    var move;

    if (Color == "Red") {
        var NextColor = "Black";
    } else {
        var NextColor = "Red"
    }
    
    if (Color == "Red") {
        for (let i = 0; i < Red.length; i++) {
            if (Red[i].y > 0) {
                if (Red[i].x > 0) {
                    jumpposition.x = Red[i].x - 1;
                    jumpposition.y = Red[i].y - 1;
                    if (Board[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove([jumpposition.x, jumpposition.y, i, -1], "move", Color, Red, Black, []);
                        MoveList.push(move);
                        if (depth < Difficulty) {
                            MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                        }
                    } else if (Board[jumpposition.y][jumpposition.x] == 2) {
                        if (Red[i].y > 1 && Red[i].x > 1) {
                            jumpposition.x = Red[i].x - 2;
                            jumpposition.y = Red[i].y - 2;
                            if (Board[jumpposition.y][jumpposition.x] == 0) {
                                for (let k = 0; k < Black.length; k++) {
                                    if (Black[k].x == Red[i].x - 1 && Black[k].y == Red[i].y - 1) {
                                        index = k;
                                        break;
                                    }
                                }
                                move = CreateNewMove([jumpposition.x, jumpposition.y, i, index], "jump", Color, Red, Black, []);
                                MoveList.push(move);
                                if (depth < Difficulty) {
                                    MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                }
                                FindMultiJump(Color, i, move.Red, move.Black, MoveList, depth);
                            }
                        }
                    }
                }
                if (Red[i].x < 7) {
                    jumpposition.x = Red[i].x + 1;
                    jumpposition.y = Red[i].y - 1;
                    if (Board[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove([jumpposition.x, jumpposition.y, i, -1], "move", Color, Red, Black, []);
                        MoveList.push(move);
                        if (depth < Difficulty) {
                            MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                        }
                    } else if (Board[jumpposition.y][jumpposition.x] == 2) {
                        if (Red[i].y > 1 && Red[i].x < 6) {
                            jumpposition.x = Red[i].x + 2;
                            jumpposition.y = Red[i].y - 2;
                            if (Board[jumpposition.y][jumpposition.x] == 0) {
                                for (let k = 0; k < Black.length; k++) {
                                    if (Black[k].x == Red[i].x + 1 && Black[k].y == Red[i].y - 1) {
                                        index = k;
                                        break;
                                    }
                                }
                                move = CreateNewMove([jumpposition.x, jumpposition.y, i, index], "jump", Color, Red, Black, []);
                                MoveList.push(move);
                                if (depth < Difficulty) {
                                    MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                }
                                FindMultiJump(Color, i, move.Red, move.Black, MoveList, depth);
                            }
                        }
                    }

                }
            }
            if (Red[i].Queen && Red[i].y < 7) {
                if (Red[i].x > 0) {
                    jumpposition.x = Red[i].x - 1;
                    jumpposition.y = Red[i].y + 1;
                    if (Board[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove([jumpposition.x, jumpposition.y, i, -1], "move", Color, Red, Black, []);
                        MoveList.push(move);
                        if (depth < Difficulty) {
                            MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                        }
                    } else if (Board[jumpposition.y][jumpposition.x] == 2) {
                        if (Red[i].y < 6 && Red[i].x > 1) {
                            jumpposition.x = Red[i].x - 2;
                            jumpposition.y = Red[i].y + 2;
                            if (Board[jumpposition.y][jumpposition.x] == 0) {
                                for (let k = 0; k < Black.length; k++) {
                                    if (Black[k].x == Red[i].x - 1 && Black[k].y == Red[i].y + 1) {
                                        index = k;
                                        break;
                                    }
                                }
                                move = CreateNewMove([jumpposition.x, jumpposition.y, i, index], "jump", Color, Red, Black, []);
                                MoveList.push(move);
                                if (depth < Difficulty) {
                                    MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                }
                                FindMultiJump(Color, i, move.Red, move.Black, MoveList, depth);
                            }
                        }
                    }
                }
                if (Red[i].x < 7) {
                    jumpposition.x = Red[i].x + 1;
                    jumpposition.y = Red[i].y + 1;
                    if (Board[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove([jumpposition.x, jumpposition.y, i, -1], "move", Color, Red, Black, []);
                        MoveList.push(move);
                        if (depth < Difficulty) {
                            MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                        }
                        if (depth < Difficulty) {
                            MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                        }
                    } else if (Board[jumpposition.y][jumpposition.x] == 2) {
                        if (Red[i].y < 6 && Red[i].x < 6) {
                            jumpposition.x = Red[i].x + 2;
                            jumpposition.y = Red[i].y + 2;
                            if (Board[jumpposition.y][jumpposition.x] == 0) {
                                for (let k = 0; k < Black.length; k++) {
                                    if (Black[k].x == Red[i].x + 1 && Black[k].y == Red[i].y + 1) {
                                        index = k;
                                        break;
                                    }
                                }
                                move = CreateNewMove([jumpposition.x, jumpposition.y, i, index], "jump", Color, Red, Black, []);
                                MoveList.push(move);
                                if (depth < Difficulty) {
                                    MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                }
                                FindMultiJump(Color, i, move.Red, move.Black, MoveList, depth);
                            }
                        }
                    }
                }
            }

        }
    } else {
        for (let i = 0; i < Black.length; i++) {
            if (Black[i].y > 0 && Black[i].Queen) {
                if (Black[i].x > 0) {
                    jumpposition.x = Black[i].x - 1;
                    jumpposition.y = Black[i].y - 1;
                    if (Board[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove([jumpposition.x, jumpposition.y, i, -1], "move", Color, Red, Black, []);
                        MoveList.push(move);
                        if (depth < Difficulty) {
                            MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                        }
                    } else if (Board[jumpposition.y][jumpposition.x] == 1) {
                        if (Black[i].y > 1 && Black[i].x > 1) {
                            jumpposition.x = Black[i].x - 2;
                            jumpposition.y = Black[i].y - 2;
                            if (Board[jumpposition.y][jumpposition.x] == 0) {
                                for (let k = 0; k < Red.length; k++) {
                                    if (Red[k].x == Black[i].x - 1 && Red[k].y == Black[i].y - 1) {
                                        index = k;
                                        break;
                                    }
                                }
                                move = CreateNewMove([jumpposition.x, jumpposition.y, i, index], "jump", Color, Red, Black, []);
                                MoveList.push(move);
                                if (depth < Difficulty) {
                                    MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                }
                                FindMultiJump(Color, i, move.Red, move.Black, MoveList, depth);
                            }
                        }
                    }
                }
                if (Black[i].x < 7) {
                    jumpposition.x = Black[i].x + 1;
                    jumpposition.y = Black[i].y - 1;
                    if (Board[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove([jumpposition.x, jumpposition.y, i, -1], "move", Color, Red, Black, []);
                        MoveList.push(move);
                        if (depth < Difficulty) {
                            MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                        }
                    } else if (Board[jumpposition.y][jumpposition.x] == 1) {
                        if (Black[i].y > 1 && Black[i].x < 6) {
                            jumpposition.x = Black[i].x + 2;
                            jumpposition.y = Black[i].y - 2;
                            if (Board[jumpposition.y][jumpposition.x] == 0) {
                                for (let k = 0; k < Red.length; k++) {
                                    if (Red[k].x == Black[i].x + 1 && Red[k].y == Black[i].y - 1) {
                                        index = k;
                                        break;
                                    }
                                }
                                move = CreateNewMove([jumpposition.x, jumpposition.y, i, index], "jump", Color, Red, Black, []);
                                MoveList.push(move);
                                if (depth < Difficulty) {
                                    MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                }
                                FindMultiJump(Color, i, move.Red, move.Black, MoveList, depth);
                            }
                        }
                    }
                }
            }
            if (Black[i].y < 7) {
                if (Black[i].x > 0) {
                    jumpposition.x = Black[i].x - 1;
                    jumpposition.y = Black[i].y + 1;
                    if (Board[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove([jumpposition.x, jumpposition.y, i, -1], "move", Color, Red, Black, []);
                        MoveList.push(move);
                        if (depth < Difficulty) {
                            MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                        }
                    } else if (Board[jumpposition.y][jumpposition.x] == 1) {
                        if (Black[i].y < 6 && Black[i].x > 1) {
                            jumpposition.x = Black[i].x - 2;
                            jumpposition.y = Black[i].y + 2;
                            if (Board[jumpposition.y][jumpposition.x] == 0) {
                                for (let k = 0; k < Red.length; k++) {
                                    if (Red[k].x == Black[i].x - 1 && Red[k].y == Black[i].y + 1) {
                                        index = k;
                                        break;
                                    }
                                }
                                move = CreateNewMove([jumpposition.x, jumpposition.y, i, index], "jump", Color, Red, Black, []);
                                MoveList.push(move);
                                if (depth < Difficulty) {
                                    MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                }
                                FindMultiJump(Color, i, move.Red, move.Black, MoveList, depth);
                            }
                        }
                    }
                }
                if (Black[i].x < 7) {
                    jumpposition.x = Black[i].x + 1;
                    jumpposition.y = Black[i].y + 1;
                    if (Board[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove([jumpposition.x, jumpposition.y, i, -1], "move", Color, Red, Black, []);
                        MoveList.push(move);
                        if (depth < Difficulty) {
                            MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                        }
                    } else if (Board[jumpposition.y][jumpposition.x] == 1) {
                        if (Black[i].y < 6 && Black[i].x < 6) {
                            jumpposition.x = Black[i].x + 2;
                            jumpposition.y = Black[i].y + 2;
                            if (Board[jumpposition.y][jumpposition.x] == 0) {
                                for (let k = 0; k < Red.length; k++) {
                                    if (Red[k].x == Black[i].x + 1 && Red[k].y == Black[i].y + 1) {
                                        index = k;
                                        break;
                                    }
                                }
                                move = CreateNewMove([jumpposition.x, jumpposition.y, i, index], "jump", Color, Red, Black, []);
                                MoveList.push(move);
                                if (depth < Difficulty) {
                                    MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                }
                                FindMultiJump(Color, i, move.Red, move.Black, MoveList, depth);
                            }
                        }
                    }
                }
            }
        }
    }
    return MoveList;
}

function FindMultiJump(Color, index, Red, Black, MoveList, depth) {
    var jumpposition = {
        x: 0,
        y: 0
    }
    var Board = DetermineBoardState(Red, Black);
    var output = [];
    var move;
    if (Color == "Red") {
        var piece = Red[index];
        var NextColor = "Black";
    } else {
        var piece = Black[index]
        var NextColor = "Red"
    }

    if (piece.Queen || Color == "Red") {
        if (piece.y > 1) {
            if (piece.x > 1) {
                jumpposition.x = piece.x - 2;
                jumpposition.y = piece.y - 2;
                if (Board[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x - 1;
                    jumpposition.y = piece.y - 1;
                    if (Color == "Red") {
                        if (Board[jumpposition.y][jumpposition.x] == 2) {
                            for (let k = 0; k < Black.length; k++) {
                                if (Black[k].x == jumpposition.x && Black[k].y == jumpposition.y) {
                                    move = CreateNewMove([piece.x - 2, piece.y - 2, index, k], "jump", Color, Red, Black, []);
                                    MoveList.push(move);
                                    if (depth < Difficulty) {
                                        MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                    }
                                    FindMultiJump(Color, index, move.Red, move.Black, MoveList, depth);
                                }
                            }
                        }
                    } else if (Color == "Black") {
                        if (Board[jumpposition.y][jumpposition.x] == 1) {
                            for (let k = 0; k < Red.length; k++) {
                                if (Red[k].x == jumpposition.x && Red[k].y == jumpposition.y) {
                                    move = CreateNewMove([piece.x - 2, piece.y - 2, index, k], "jump", Color, Red, Black, []);
                                    MoveList.push(move);
                                    if (depth < Difficulty) {
                                        MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                    }
                                    FindMultiJump(Color, index, move.Red, move.Black, MoveList, depth);
                                }
                            }
                        }
                    }
                }
            }
            if (piece.x < 6) {
                jumpposition.x = piece.x + 2;
                jumpposition.y = piece.y - 2;
                if (Board[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x + 1;
                    jumpposition.y = piece.y - 1;
                    if (Color == "Red") {
                        if (Board[jumpposition.y][jumpposition.x] == 2) {
                            for (let k = 0; k < Black.length; k++) {
                                if (Black[k].x == jumpposition.x && Black[k].y == jumpposition.y) {
                                    move = CreateNewMove([piece.x + 2, piece.y - 2, index, k], "jump", Color, Red, Black, []);
                                    MoveList.push(move);
                                    if (depth < Difficulty) {
                                        MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                    }
                                    FindMultiJump(Color, index, move.Red, move.Black, MoveList, depth);
                                }
                            }
                        }
                    } else if (Color == "Black") {
                        if (Board[jumpposition.y][jumpposition.x] == 1) {
                            for (let k = 0; k < Red.length; k++) {
                                if (Red[k].x == jumpposition.x && Red[k].y == jumpposition.y) {
                                    move = CreateNewMove([piece.x + 2, piece.y - 2, index, k], "jump", Color, Red, Black, []);
                                    MoveList.push(move);
                                    if (depth < Difficulty) {
                                        MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                    }
                                    FindMultiJump(Color, index, move.Red, move.Black, MoveList, depth);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (piece.Queen || Color == "Black") {
        if (piece.y < 6) {
            if (piece.x > 1) {
                jumpposition.x = piece.x - 2;
                jumpposition.y = piece.y + 2;
                if (Board[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x - 1;
                    jumpposition.y = piece.y + 1;
                    if (Color == "Red") {
                        if (Board[jumpposition.y][jumpposition.x] == 2) {
                            for (let k = 0; k < Black.length; k++) {
                                if (Black[k].x == jumpposition.x && Black[k].y == jumpposition.y) {
                                    move = CreateNewMove([piece.x - 2, piece.y + 2, index, k], "jump", Color, Red, Black, []);
                                    MoveList.push(move);
                                    if (depth < Difficulty) {
                                        MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                    }
                                    FindMultiJump(Color, index, move.Red, move.Black, MoveList, depth);
                                }
                            }
                        }
                    } else if (Color == "Black") {
                        if (Board[jumpposition.y][jumpposition.x] == 1) {
                            for (let k = 0; k < Red.length; k++) {
                                if (Red[k].x == jumpposition.x && Red[k].y == jumpposition.y) {
                                    move = CreateNewMove([piece.x - 2, piece.y + 2, index, k], "jump", Color, Red, Black, []);
                                    MoveList.push(move);
                                    if (depth < Difficulty) {
                                        MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                    }
                                    FindMultiJump(Color, index, move.Red, move.Black, MoveList, depth);
                                }
                            }
                        }
                    }
                }
            }
            if (piece.x < 6) {
                jumpposition.x = piece.x + 2;
                jumpposition.y = piece.y + 2;
                if (Board[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x + 1;
                    jumpposition.y = piece.y + 1;
                    if (Color == "Red") {
                        if (Board[jumpposition.y][jumpposition.x] == 2) {
                            for (let k = 0; k < Black.length; k++) {
                                if (Black[k].x == jumpposition.x && Black[k].y == jumpposition.y) {
                                    move = CreateNewMove([piece.x + 2, piece.y + 2, index, k], "jump", Color, Red, Black, []);
                                    MoveList.push(move);
                                    if (depth < Difficulty) {
                                        MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                    }
                                    FindMultiJump(Color, index, move.Red, move.Black, MoveList, depth);
                                }
                            }
                        }
                    } else if (Color == "Black") {
                        if (Board[jumpposition.y][jumpposition.x] == 1) {
                            for (let k = 0; k < Red.length; k++) {
                                if (Red[k].x == jumpposition.x && Red[k].y == jumpposition.y) {
                                    move = CreateNewMove([piece.x + 2, piece.y + 2, index, k], "jump", Color, Red, Black, []);
                                    MoveList.push(move);
                                    if (depth < Difficulty) {
                                        MoveList[MoveList.length - 1].next = FindMoves(NextColor, move.Red, move.Black, depth + 1);
                                    }
                                    FindMultiJump(Color, index, move.Red, move.Black, MoveList, depth);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return output;
}

function DetermineBoardState(Red, Black) {//indexing is y then x so BoardState[y][x]
    var Board = [];
    for (let i = 0; i < 8; ++i) {
        Board.push([]);
        for (let k = 0; k < 8; ++k) {
            Board[i].push(0);
        }
    }
    try {
        for (let i = 0; i < Red.length; ++i) {
            Board[Red[i].y][Red[i].x] = 1;
        }
    } catch (err) {
        x = 1;
    }
    for (let i = 0; i < Black.length; ++i) {
        Board[Black[i].y][Black[i].x] = 2;
    }
    return Board;
}

function Score(MoveList) {
    if (MoveList.next.length > 0) {
        var sum = 0;
        for (let i = 0; i < MoveList.next.length; i++) {
            sum += Score(MoveList.next[i]);
        }
        var average = sum / MoveList.next.length;
    } else {
        var average = MoveList.Red.length - MoveList.Black.length;
    }
    return average;
}


/*
Red is Blue Grey is Black
1 is Red, 2 is Black
*/