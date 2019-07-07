var Thecanvas = {
    width: 544,
    height: 544
};
var Computer = "None";
var PlayersTurn = "Red";
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
    BoardState = [ // indexing is y then x so BoardState[y][x]
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0]];
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
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }
    myGameArea.start();
    document.getElementById("ButtonArea").hidden = false;
}

function OnePlayerMenu() {
    document.getElementById("Menu").hidden = true;
    document.getElementById("OnePlayerMenu").hidden = false;
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
            setTimeout(RunComputersRandomTurn, 500);
        }
    }
}

function draw(image, Info) {
    // works on any image given height width angle and position

    // save the current coordinate system 
    // before we screw with it
    myGameArea.context.save();

    // move to the middle of where we want to draw our image
    myGameArea.context.translate(Info.x * 68 + 34, Info.y * 68 + 34);

    // draw it up and to the left by half the width
    // and height of the image 
    myGameArea.context.drawImage(image, -(image.width / 2), -(image.height / 2));

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
        var x = Math.floor((e.clientX - 10) / 68);
        var y = Math.floor((e.clientY - 10) / 68);
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

function Checkforjump(playercolor, piece) {
    var jumpposition = {
        x: 0,
        y: 0
    };
    if (piece.Queen || playercolor == "Red") {
        if (piece.y > 1) {
            if (piece.x > 1) {
                jumpposition.x = piece.x - 2;
                jumpposition.y = piece.y - 2;
                if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x - 1;
                    jumpposition.y = piece.y - 1;
                    if (playercolor == "Red") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                            return true;
                        }
                    } else if (playercolor == "Black") {
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
                    if (playercolor == "Red") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                            return true;
                        }
                    } else if (playercolor == "Black") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 1) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    if (piece.Queen || playercolor == "Black") {
        if (piece.y < 6) {
            if (piece.x > 1) {
                jumpposition.x = piece.x - 2;
                jumpposition.y = piece.y + 2;
                if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                    jumpposition.x = piece.x - 1;
                    jumpposition.y = piece.y + 1;
                    if (playercolor == "Red") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                            return true;
                        }
                    } else if (playercolor == "Black") {
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
                    if (playercolor == "Red") {
                        if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                            return true;
                        }
                    } else if (playercolor == "Black") {
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
    var option, newx, newy, index
    var AIjumpagain = true;
    var movements = [];
    var jumps = [];
    Timedout = false;

    if (ComputersMoveList.length == 0) {
        FindMoves();
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
            if (PlayersTurn == "Red") {
                newx = ComputersMoveList[option].positions[0];
                newy = ComputersMoveList[option].positions[1];
                for (let i = 0; i < BlackCheckers.length; i++) {
                    if (BlackCheckers[i].x == RedCheckers[index].x + (newx - RedCheckers[index].x) / 2 && BlackCheckers[i].y == RedCheckers[index].y + (newy - RedCheckers[index].y) / 2) {
                        BoardState[BlackCheckers[i].y][BlackCheckers[i].x] = 0;
                        BlackCheckers.splice(i, 1);
                        break;
                    }
                }

                BoardState[RedCheckers[index].y][RedCheckers[index].x] = 0;
                BoardState[newy][newx] = 1;
                RedCheckers[index].x = newx;
                RedCheckers[index].y = newy;

                while (AIjumpagain == true) {
                    if (RedCheckers[index].y == 0) {
                        RedCheckers[index].Queen = true;
                        AIjumpagain = false;
                        ComputersMoveList = ComputersMoveList[option].next;
                    } else if (Math.random() > 0 && Checkforjump('Red', RedCheckers[index])) {
                        ComputersMoveList = ComputersMoveList[option].next;
                        FindMoves();
                        for (let i = 0; i < ComputersMoveList.length; i++) {
                            if (ComputersMoveList[i].type == "jump" && ComputersMoveList[i].index == index) {
                                newx = ComputersMoveList[i].positions[0];
                                newy = ComputersMoveList[i].positions[1];
                                for (let k = 0; k < BlackCheckers.length; k++) {
                                    if (BlackCheckers[k].x == RedCheckers[index].x + (newx - RedCheckers[index].x) / 2 && BlackCheckers[k].y == RedCheckers[index].y + (newy - RedCheckers[index].y) / 2) {
                                        BoardState[BlackCheckers[k].y][BlackCheckers[k].x] = 0;
                                        BlackCheckers.splice(k, 1);
                                        break;
                                    }
                                }
                                option = i;
                                BoardState[RedCheckers[index].y][RedCheckers[index].x] = 0;
                                BoardState[newy][newx] = 1;
                                RedCheckers[index].x = newx;
                                RedCheckers[index].y = newy;
                                break;
                            }
                        }
                        AIjumpagain = true;
                    } else {
                        AIjumpagain = false;
                        ComputersMoveList = ComputersMoveList[option].next;
                    }
                }
            } else {
                newx = ComputersMoveList[option].positions[0];
                newy = ComputersMoveList[option].positions[1];
                for (let i = 0; i < RedCheckers.length; i++) {
                    if (RedCheckers[i].x == BlackCheckers[index].x + (newx - BlackCheckers[index].x) / 2 && RedCheckers[i].y == BlackCheckers[index].y + (newy - BlackCheckers[index].y) / 2) {
                        BoardState[RedCheckers[i].y][RedCheckers[i].x] = 0;
                        RedCheckers.splice(i, 1);
                        break;
                    }
                }
                BoardState[BlackCheckers[index].y][BlackCheckers[index].x] = 0;
                BoardState[newy][newx] = 2;
                BlackCheckers[index].x = newx;
                BlackCheckers[index].y = newy;
                while (AIjumpagain == true) {
                    if (BlackCheckers[index].y == 7) {
                        BlackCheckers[index].Queen = true;
                        AIjumpagain = false;
                        ComputersMoveList = ComputersMoveList[option].next;
                    } else if (Math.random() > 0 && Checkforjump('Black', BlackCheckers[index])) {
                        ComputersMoveList = ComputersMoveList[option].next;
                        FindMoves();
                        for (let i = 0; i < ComputersMoveList.length; i++) {
                            if (ComputersMoveList[i].type == "jump" && ComputersMoveList[i].index == index) {
                                newx = ComputersMoveList[i].positions[0];
                                newy = ComputersMoveList[i].positions[1];
                                for (let k = 0; k < RedCheckers.length; k++) {
                                    if (RedCheckers[k].x == BlackCheckers[index].x + (newx - BlackCheckers[index].x) / 2 && RedCheckers[k].y == BlackCheckers[index].y + (newy - BlackCheckers[index].y) / 2) {
                                        BoardState[RedCheckers[k].y][RedCheckers[k].x] = 0;
                                        RedCheckers.splice(k, 1);
                                        break;
                                    }
                                }
                                option = i;
                                BoardState[BlackCheckers[index].y][BlackCheckers[index].x] = 0;
                                BoardState[newy][newx] = 2;
                                BlackCheckers[index].x = newx;
                                BlackCheckers[index].y = newy;
                                break;
                            }
                        }
                        AIjumpagain = true;
                    } else {
                        AIjumpagain = false;
                        ComputersMoveList = ComputersMoveList[option].next;
                    }
                }
            }
        } else {
            option = Math.round(Math.random() * (movements.length - 1));
            if (PlayersTurn == "Red") {
                BoardState[RedCheckers[ComputersMoveList[option].index].y][RedCheckers[ComputersMoveList[option].index].x] = 0;
                BoardState[ComputersMoveList[option].positions[1]][ComputersMoveList[option].positions[0]] = 1;
                RedCheckers[ComputersMoveList[option].index].x = ComputersMoveList[option].positions[0];
                RedCheckers[ComputersMoveList[option].index].y = ComputersMoveList[option].positions[1];
                if (RedCheckers[ComputersMoveList[option].index].y == 0) {
                    RedCheckers[ComputersMoveList[option].index].Queen = true;
                }
            } else {
                BoardState[BlackCheckers[ComputersMoveList[option].index].y][BlackCheckers[ComputersMoveList[option].index].x] = 0;
                BoardState[ComputersMoveList[option].positions[1]][ComputersMoveList[option].positions[0]] = 2;
                BlackCheckers[ComputersMoveList[option].index].x = ComputersMoveList[option].positions[0];
                BlackCheckers[ComputersMoveList[option].index].y = ComputersMoveList[option].positions[1];
                if (BlackCheckers[ComputersMoveList[option].index].y == 7) {
                    BlackCheckers[ComputersMoveList[option].index].Queen = true;
                }
            }
            ComputersMoveList = ComputersMoveList[option].next;
        }
        if (PlayersTurn == "Red") {
            PlayersTurn = "Black";
        } else {
            PlayersTurn = "Red";
        }
    } else {
        // if I calculated other moves in this move chain
    }
    checkforwin();
    updateGameArea();
}

function CreateNewMove(index, type, positions, next) {
    var variable = {
        index: index,
        type: type,
        positions: positions,
        next: next
    }
    return variable
}

function FindMoves() {
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
                        move = CreateNewMove(i, "move", [RedCheckers[i].x - 1, RedCheckers[i].y - 1], [])
                        ComputersMoveList.push(move);
                    } else if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                        if (RedCheckers[i].y > 1 && RedCheckers[i].x > 1) {
                            jumpposition.x = RedCheckers[i].x - 2;
                            jumpposition.y = RedCheckers[i].y - 2;
                            if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                                move = CreateNewMove(i, "jump", [RedCheckers[i].x - 2, RedCheckers[i].y - 2], []);
                                ComputersMoveList.push(move);
                            }
                        }
                    }
                }
                if (RedCheckers[i].x < 7) {
                    jumpposition.x = RedCheckers[i].x + 1;
                    jumpposition.y = RedCheckers[i].y - 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove(i, "move", [RedCheckers[i].x + 1, RedCheckers[i].y - 1], [])
                        ComputersMoveList.push(move);
                    } else if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                        if (RedCheckers[i].y > 1 && RedCheckers[i].x < 6) {
                            jumpposition.x = RedCheckers[i].x + 2;
                            jumpposition.y = RedCheckers[i].y - 2;
                            if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                                move = CreateNewMove(i, "jump", [RedCheckers[i].x + 2, RedCheckers[i].y - 2], []);
                                ComputersMoveList.push(move);
                            }

                        }
                    }

                }
            }
            if (RedCheckers[i].Queen && RedCheckers[i].y < 7) {
                if (RedCheckers[i].x > 0) {
                    jumpposition.x = RedCheckers[i].x - 1;
                    jumpposition.y = RedCheckers[i].y + 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove(i, "move", [RedCheckers[i].x - 1, RedCheckers[i].y + 1], [])
                        ComputersMoveList.push(move);
                    } else if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                        if (RedCheckers[i].y < 6 && RedCheckers[i].x > 1) {
                            jumpposition.x = RedCheckers[i].x - 2;
                            jumpposition.y = RedCheckers[i].y + 2;
                            if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                                move = CreateNewMove(i, "jump", [RedCheckers[i].x - 2, RedCheckers[i].y + 2], []);
                                ComputersMoveList.push(move);
                            }
                        }
                    }
                }
                if (RedCheckers[i].x < 7) {
                    jumpposition.x = RedCheckers[i].x + 1;
                    jumpposition.y = RedCheckers[i].y + 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove(i, "move", [RedCheckers[i].x + 1, RedCheckers[i].y + 1], [])
                        ComputersMoveList.push(move);
                    } else if (BoardState[jumpposition.y][jumpposition.x] == 2) {
                        if (RedCheckers[i].y < 6 && RedCheckers[i].x < 6) {
                            jumpposition.x = RedCheckers[i].x + 2;
                            jumpposition.y = RedCheckers[i].y + 2;
                            if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                                move = CreateNewMove(i, "jump", [RedCheckers[i].x + 2, RedCheckers[i].y + 2], []);
                                ComputersMoveList.push(move);
                            }
                        }
                    }
                }
            }

        }
    } else {
        for (let i = 0; i < BlackCheckers.length; i++) {
            if (BlackCheckers[i].y > 0 && BlackCheckers[i].Queen) {
                if (BlackCheckers[i].x > 0) {
                    jumpposition.x = BlackCheckers[i].x - 1;
                    jumpposition.y = BlackCheckers[i].y - 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove(i, "move", [BlackCheckers[i].x - 1, BlackCheckers[i].y - 1], [])
                        ComputersMoveList.push(move);
                    } else if (BoardState[jumpposition.y][jumpposition.x] == 1) {
                        if (BlackCheckers[i].y > 1 && BlackCheckers[i].x > 1) {
                            jumpposition.x = BlackCheckers[i].x - 2;
                            jumpposition.y = BlackCheckers[i].y - 2;
                            if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                                move = CreateNewMove(i, "jump", [BlackCheckers[i].x - 2, BlackCheckers[i].y - 2], []);
                                ComputersMoveList.push(move);
                            }
                        }
                    }
                }
                if (BlackCheckers[i].x < 7) {
                    jumpposition.x = BlackCheckers[i].x + 1;
                    jumpposition.y = BlackCheckers[i].y - 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove(i, "move", [BlackCheckers[i].x + 1, BlackCheckers[i].y - 1], [])
                        ComputersMoveList.push(move);
                    } else if (BoardState[jumpposition.y][jumpposition.x] == 1) {
                        if (BlackCheckers[i].y > 1 && BlackCheckers[i].x < 6) {
                            jumpposition.x = BlackCheckers[i].x + 2;
                            jumpposition.y = BlackCheckers[i].y - 2;
                            if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                                move = CreateNewMove(i, "jump", [BlackCheckers[i].x + 2, BlackCheckers[i].y - 2], []);
                                ComputersMoveList.push(move);
                            }
                        }
                    }
                }
            }
            if (BlackCheckers[i].y < 7) {
                if (BlackCheckers[i].x > 0) {
                    jumpposition.x = BlackCheckers[i].x - 1;
                    jumpposition.y = BlackCheckers[i].y + 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove(i, "move", [BlackCheckers[i].x - 1, BlackCheckers[i].y + 1], [])
                        ComputersMoveList.push(move);
                    } else if (BoardState[jumpposition.y][jumpposition.x] == 1) {
                        if (BlackCheckers[i].y < 6 && BlackCheckers[i].x > 1) {
                            jumpposition.x = BlackCheckers[i].x - 2;
                            jumpposition.y = BlackCheckers[i].y + 2;
                            if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                                move = CreateNewMove(i, "jump", [BlackCheckers[i].x - 2, BlackCheckers[i].y + 2], []);
                                ComputersMoveList.push(move);
                            }
                        }
                    }
                }
                if (BlackCheckers[i].x < 7) {
                    jumpposition.x = BlackCheckers[i].x + 1;
                    jumpposition.y = BlackCheckers[i].y + 1;
                    if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                        move = CreateNewMove(i, "move", [BlackCheckers[i].x + 1, BlackCheckers[i].y + 1], [])
                        ComputersMoveList.push(move);
                    } else if (BoardState[jumpposition.y][jumpposition.x] == 1) {
                        if (BlackCheckers[i].y < 6 && BlackCheckers[i].x < 6) {
                            jumpposition.x = BlackCheckers[i].x + 2;
                            jumpposition.y = BlackCheckers[i].y + 2;
                            if (BoardState[jumpposition.y][jumpposition.x] == 0) {
                                move = CreateNewMove(i, "jump", [BlackCheckers[i].x + 2, BlackCheckers[i].y + 2], []);
                                ComputersMoveList.push(move);
                            }
                        }
                    }
                }
            }
        }
    }
}



/*
Red is Blue Grey is Black
1 is Red, 2 is Black
condense checker colors to an array of all checkers might allow simpler code with indexing 
if black value *-1 if red *1 if queen do both
add jump again to find moves, checkers will need to be passed, and boardstate
*/