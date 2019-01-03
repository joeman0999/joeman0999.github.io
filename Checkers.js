Thecanvas = {
    width: 544,
    height: 544
};
Computer = "None";
Timedout = false;
ComputersMoveList = [];
TypeOnePlayer = false;
TypeTwoPlayer = false;
BlackChecker = new Image();
BlackChecker.src = "images/BlackChecker.png";
RedChecker = new Image();
RedChecker.src = "images/RedChecker.png";
BlackCheckerQueen = new Image();
BlackCheckerQueen.src = "images/BlackCheckerQueen.png";
RedCheckerQueen = new Image();
RedCheckerQueen.src = "images/RedCheckerQueen.png";

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
        x: 0,
        y: 0,
        Index: 0,
        Holds: "Nothing",
    };
    PlayersTurn = "Red";
    jumpagain = false;
    document.getElementById("Jump_Again-Button").hidden = true;
    document.getElementById("End_Turn-Button").hidden = true;
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        New_Game();
        myGameArea.keys = [];
        frame = 0;

        this.canvas.setAttribute("id", "GameArea")
        this.canvas.setAttribute("width", Thecanvas.width);
        this.canvas.setAttribute("height", Thecanvas.height);
        this.canvas.width = Thecanvas.width;
        this.canvas.height = Thecanvas.height;
        this.context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        if (TypeOnePlayer) {
            document.getElementById("GameArea").addEventListener('click', clickhandler1P);
        } else {
            document.getElementById("GameArea").addEventListener('click', clickhandler2P);
        }
        this.interval = setInterval(updateGameArea, 60);
    },
    stop: function () {
        clearInterval(this.interval);
        if (TypeOnePlayer) {
            document.getElementById("GameArea").removeEventListener('click', clickhandler1P);
        } else if (Computer != "None") {
            document.getElementById("GameArea").removeEventListener('click', clickhandler2P);
        }
        myGameArea.clear;
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
    myGameArea.stop();
    Computer = "None";
    TypeOnePlayer = false;
    TypeTwoPlayer = false;
    document.getElementById("ButtonArea").hidden = true;
    document.getElementById("OnePlayerMenu").hidden = true;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = true;
    }
    document.getElementById("Menu").hidden = false;
    Thecanvas = {
        width: 544,
        height: 544
    };
}

function updateGameArea() {
    var i
    myGameArea.clear();
    for (i = 0; i < RedCheckers.length; i++) {
        if (RedCheckers[i].Queen) {
            draw(RedCheckerQueen, RedCheckers[i])
        } else {
            draw(RedChecker, RedCheckers[i])
        }
    }
    for (i = 0; i < BlackCheckers.length; i++) {
        if (BlackCheckers[i].Queen) {
            draw(BlackCheckerQueen, BlackCheckers[i])
        } else {
            draw(BlackChecker, BlackCheckers[i])
        }
    }
    if ((PlayersTurn == "Red" && Computer == "Red") || (PlayersTurn == "Black" && Computer == "Black")) {
        if (!Timedout) {
            Timedout = true;
            setTimeout(RunComputersTurn, 500);
        }
    }
}

function crashWith(obj, other) {
    var crash = false
    if (Math.floor(other.x / 68) == obj.x && Math.floor(other.y / 68) == obj.y) {
        crash = true;
    }

    return crash;
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

function clickhandler2P(e) {
    var i, Overlap, jump
    Mouse.x = e.clientX - 10;
    Mouse.y = e.clientY - 10;
    if (Mouse.Holds == "Nothing") {
        if (PlayersTurn == "Red") {
            for (i = 0; i < RedCheckers.length; i++) {
                if (crashWith(RedCheckers[i], Mouse)) {
                    Mouse.Holds = "Red";
                    Mouse.Index = i;
                    break;
                }
            }
        } else if (PlayersTurn == "Black") {
            for (i = 0; i < BlackCheckers.length; i++) {
                if (crashWith(BlackCheckers[i], Mouse)) {
                    Mouse.Holds = "Black";
                    Mouse.Index = i;
                    break;
                }
            }
        }
    } else {
        if (Mouse.x >= 0 && Mouse.x <= 544 && Mouse.y >= 0 && Mouse.y <= 544) {
            var Newplacex, Newplacey, Oldplacex, Oldplacey, Overlap, jumpposition
            Overlap = false;
            Newplacex = Math.floor(Mouse.x / 68);
            Newplacey = Math.floor(Mouse.y / 68);
            if (Mouse.Holds == "Red") {
                Oldplacex = RedCheckers[Mouse.Index].x;
                Oldplacey = RedCheckers[Mouse.Index].y;
                for (i = 0; i < RedCheckers.length; i++) {
                    if (crashWith(RedCheckers[i], Mouse)) {
                        if (!jumpagain) {
                            Overlap = true;
                            Mouse.Index = i;
                        }
                        break;
                    }
                }
                for (i = 0; i < BlackCheckers.length; i++) {
                    if (crashWith(BlackCheckers[i], Mouse)) {
                        Overlap = true;
                        break;
                    }
                }
            } else if (Mouse.Holds == "Black") {
                Oldplacex = BlackCheckers[Mouse.Index].x;
                Oldplacey = BlackCheckers[Mouse.Index].y;
                for (i = 0; i < RedCheckers.length; i++) {
                    if (crashWith(RedCheckers[i], Mouse)) {
                        Overlap = true;
                        break;
                    }
                }
                for (i = 0; i < BlackCheckers.length; i++) {
                    if (crashWith(BlackCheckers[i], Mouse)) {
                        if (!jumpagain) {
                            Overlap = true;
                            Mouse.Index = i;
                        }
                        break;
                    }
                }
            }
            if (!Overlap) {
                if (((Newplacex + Newplacey) / 2 != Math.round((Newplacex + Newplacey) / 2))) {
                    if (Math.abs(Oldplacex - Newplacex) + Math.abs(Oldplacey - Newplacey) == 2 && Newplacex != Oldplacex && Newplacey != Oldplacey && !jumpagain) {
                        if (Mouse.Holds == "Red") {
                            if (Newplacey < Oldplacey) {
                                if (Newplacey == 0) {
                                    RedCheckers[Mouse.Index].Queen = true;
                                }
                                RedCheckers[Mouse.Index].x = Newplacex;
                                RedCheckers[Mouse.Index].y = Newplacey;
                                Mouse.Holds = "Nothing";
                                PlayersTurn = "Black";
                                checkforwin();
                            } else if (RedCheckers[Mouse.Index].Queen) {
                                RedCheckers[Mouse.Index].x = Newplacex;
                                RedCheckers[Mouse.Index].y = Newplacey;
                                Mouse.Holds = "Nothing";
                                PlayersTurn = "Black";
                                checkforwin();
                            }
                        } else if (Mouse.Holds == "Black") {
                            if (Newplacey > Oldplacey) {
                                if (Newplacey == 7) {
                                    BlackCheckers[Mouse.Index].Queen = true;
                                }
                                BlackCheckers[Mouse.Index].x = Newplacex;
                                BlackCheckers[Mouse.Index].y = Newplacey;
                                Mouse.Holds = "Nothing";
                                PlayersTurn = "Red";
                                checkforwin();
                            } else if (BlackCheckers[Mouse.Index].Queen) {
                                BlackCheckers[Mouse.Index].x = Newplacex;
                                BlackCheckers[Mouse.Index].y = Newplacey;
                                Mouse.Holds = "Nothing";
                                PlayersTurn = "Red";
                                checkforwin();
                            }
                        }
                    } else if (Math.abs(Oldplacex - Newplacex) + Math.abs(Oldplacey - Newplacey) == 4 && Oldplacex != Newplacex && Oldplacey != Newplacey) {
                        jumpposition = {
                            x: (Oldplacex + (Newplacex - Oldplacex) / 2) * 68,
                            y: (Oldplacey + (Newplacey - Oldplacey) / 2) * 68
                        };
                        if (Mouse.Holds == "Red") {
                            for (i = 0; i < BlackCheckers.length; i++) {
                                if (crashWith(BlackCheckers[i], jumpposition)) {
                                    if (Newplacey < Oldplacey) {
                                        RedCheckers[Mouse.Index].x = Newplacex;
                                        RedCheckers[Mouse.Index].y = Newplacey;
                                        if (Newplacey == 0 && !RedCheckers[Mouse.Index].Queen) {
                                            RedCheckers[Mouse.Index].Queen = true;
                                            jumpagain = false;
                                            Mouse.Holds = "Nothing";
                                            PlayersTurn = "Black";
                                            document.getElementById("Jump_Again-Button").hidden = true;
                                            document.getElementById("End_Turn-Button").hidden = true;
                                            BlackCheckers.splice(i, 1);
                                            checkforwin();
                                        } else {
                                            BlackCheckers.splice(i, 1);
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
                                        RedCheckers[Mouse.Index].x = Newplacex;
                                        RedCheckers[Mouse.Index].y = Newplacey;
                                        BlackCheckers.splice(i, 1);
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

                                    break;
                                }
                            }
                        } else if (Mouse.Holds == "Black") {
                            for (i = 0; i < RedCheckers.length; i++) {
                                if (crashWith(RedCheckers[i], jumpposition)) {
                                    if (Newplacey > Oldplacey) {
                                        BlackCheckers[Mouse.Index].x = Newplacex;
                                        BlackCheckers[Mouse.Index].y = Newplacey;
                                        if (Newplacey == 7) {
                                            BlackCheckers[Mouse.Index].Queen = true;
                                            jumpagain = false;
                                            Mouse.Holds = "Nothing";
                                            PlayersTurn = "Red";
                                            document.getElementById("Jump_Again-Button").hidden = true;
                                            document.getElementById("End_Turn-Button").hidden = true;
                                            RedCheckers.splice(i, 1);
                                            checkforwin();
                                        } else {
                                            RedCheckers.splice(i, 1);
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
                                        BlackCheckers[Mouse.Index].x = Newplacex;
                                        BlackCheckers[Mouse.Index].y = Newplacey;
                                        RedCheckers.splice(i, 1);
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

                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function clickhandler1P(e) {
    if ((PlayersTurn == "Red" && Computer == "Black") || (PlayersTurn == "Black" && Computer == "Red")) {
        var i, Overlap, jump
        Mouse.x = e.clientX - 10;
        Mouse.y = e.clientY - 10;
        if (Mouse.Holds == "Nothing") {
            if (PlayersTurn == "Red") {
                for (i = 0; i < RedCheckers.length; i++) {
                    if (crashWith(RedCheckers[i], Mouse)) {
                        Mouse.Holds = "Red";
                        Mouse.Index = i;
                        break;
                    }
                }
            } else if (PlayersTurn == "Black") {
                for (i = 0; i < BlackCheckers.length; i++) {
                    if (crashWith(BlackCheckers[i], Mouse)) {
                        Mouse.Holds = "Black";
                        Mouse.Index = i;
                        break;
                    }
                }
            }
        } else {
            if (Mouse.x >= 0 && Mouse.x <= 544 && Mouse.y >= 0 && Mouse.y <= 544) {
                var Newplacex, Newplacey, Oldplacex, Oldplacey, Overlap, jumpposition
                Overlap = false;
                Newplacex = Math.floor(Mouse.x / 68);
                Newplacey = Math.floor(Mouse.y / 68);
                if (Mouse.Holds == "Red") {
                    Oldplacex = RedCheckers[Mouse.Index].x;
                    Oldplacey = RedCheckers[Mouse.Index].y;
                    for (i = 0; i < RedCheckers.length; i++) {
                        if (crashWith(RedCheckers[i], Mouse)) {
                            if (!jumpagain) {
                                Overlap = true;
                                Mouse.Index = i;
                            }
                            break;
                        }
                    }
                    for (i = 0; i < BlackCheckers.length; i++) {
                        if (crashWith(BlackCheckers[i], Mouse)) {
                            Overlap = true;
                            break;
                        }
                    }
                } else if (Mouse.Holds == "Black") {
                    Oldplacex = BlackCheckers[Mouse.Index].x;
                    Oldplacey = BlackCheckers[Mouse.Index].y;
                    for (i = 0; i < RedCheckers.length; i++) {
                        if (crashWith(RedCheckers[i], Mouse)) {
                            Overlap = true;
                            break;
                        }
                    }
                    for (i = 0; i < BlackCheckers.length; i++) {
                        if (crashWith(BlackCheckers[i], Mouse)) {
                            if (!jumpagain) {
                                Overlap = true;
                                Mouse.Index = i;
                            }
                            break;
                        }
                    }
                }
                if (!Overlap) {
                    if (((Newplacex + Newplacey) / 2 != Math.round((Newplacex + Newplacey) / 2))) {
                        if (Math.abs(Oldplacex - Newplacex) + Math.abs(Oldplacey - Newplacey) == 2 && Newplacex != Oldplacex && Newplacey != Oldplacey && !jumpagain) {
                            if (Mouse.Holds == "Red") {
                                if (Newplacey < Oldplacey) {
                                    if (Newplacey == 0) {
                                        RedCheckers[Mouse.Index].Queen = true;
                                    }
                                    RedCheckers[Mouse.Index].x = Newplacex;
                                    RedCheckers[Mouse.Index].y = Newplacey;
                                    Mouse.Holds = "Nothing";
                                    PlayersTurn = "Black";
                                    checkforwin();
                                } else if (RedCheckers[Mouse.Index].Queen) {
                                    RedCheckers[Mouse.Index].x = Newplacex;
                                    RedCheckers[Mouse.Index].y = Newplacey;
                                    Mouse.Holds = "Nothing";
                                    PlayersTurn = "Black";
                                    checkforwin();
                                }
                            } else if (Mouse.Holds == "Black") {
                                if (Newplacey > Oldplacey) {
                                    if (Newplacey == 7) {
                                        BlackCheckers[Mouse.Index].Queen = true;
                                    }
                                    BlackCheckers[Mouse.Index].x = Newplacex;
                                    BlackCheckers[Mouse.Index].y = Newplacey;
                                    Mouse.Holds = "Nothing";
                                    PlayersTurn = "Red";
                                    checkforwin();
                                } else if (BlackCheckers[Mouse.Index].Queen) {
                                    BlackCheckers[Mouse.Index].x = Newplacex;
                                    BlackCheckers[Mouse.Index].y = Newplacey;
                                    Mouse.Holds = "Nothing";
                                    PlayersTurn = "Red";
                                    checkforwin();
                                }
                            }
                        } else if (Math.abs(Oldplacex - Newplacex) + Math.abs(Oldplacey - Newplacey) == 4 && Oldplacex != Newplacex && Oldplacey != Newplacey) {
                            jumpposition = {
                                x: (Oldplacex + (Newplacex - Oldplacex) / 2) * 68,
                                y: (Oldplacey + (Newplacey - Oldplacey) / 2) * 68
                            };
                            if (Mouse.Holds == "Red") {
                                for (i = 0; i < BlackCheckers.length; i++) {
                                    if (crashWith(BlackCheckers[i], jumpposition)) {
                                        if (Newplacey < Oldplacey) {
                                            RedCheckers[Mouse.Index].x = Newplacex;
                                            RedCheckers[Mouse.Index].y = Newplacey;
                                            if (Newplacey == 0 && !RedCheckers[Mouse.Index].Queen) {
                                                RedCheckers[Mouse.Index].Queen = true;
                                                jumpagain = false;
                                                Mouse.Holds = "Nothing";
                                                PlayersTurn = "Black";
                                                document.getElementById("Jump_Again-Button").hidden = true;
                                                document.getElementById("End_Turn-Button").hidden = true;
                                                BlackCheckers.splice(i, 1);
                                                checkforwin();
                                            } else {
                                                BlackCheckers.splice(i, 1);
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
                                            RedCheckers[Mouse.Index].x = Newplacex;
                                            RedCheckers[Mouse.Index].y = Newplacey;
                                            BlackCheckers.splice(i, 1);
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

                                        break;
                                    }
                                }
                            } else if (Mouse.Holds == "Black") {
                                for (i = 0; i < RedCheckers.length; i++) {
                                    if (crashWith(RedCheckers[i], jumpposition)) {
                                        if (Newplacey > Oldplacey) {
                                            BlackCheckers[Mouse.Index].x = Newplacex;
                                            BlackCheckers[Mouse.Index].y = Newplacey;
                                            if (Newplacey == 7) {
                                                BlackCheckers[Mouse.Index].Queen = true;
                                                jumpagain = false;
                                                Mouse.Holds = "Nothing";
                                                PlayersTurn = "Red";
                                                document.getElementById("Jump_Again-Button").hidden = true;
                                                document.getElementById("End_Turn-Button").hidden = true;
                                                RedCheckers.splice(i, 1);
                                                checkforwin();
                                            } else {
                                                RedCheckers.splice(i, 1);
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
                                            BlackCheckers[Mouse.Index].x = Newplacex;
                                            BlackCheckers[Mouse.Index].y = Newplacey;
                                            RedCheckers.splice(i, 1);
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

                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function Checkforjump(playercolor, piece) {
    var overlap, i
    var jump = false;
    var jumpposition = {
        x: 0,
        y: 0
    };
    if (piece.Queen || playercolor == "Red") {
        if (piece.y > 1) {
            if (piece.x > 1) {
                jumpposition.x = (piece.x - 2) * 68;
                jumpposition.y = (piece.y - 2) * 68;
                for (i = 0; i < RedCheckers.length; i++) {
                    if (crashWith(RedCheckers[i], jumpposition)) {
                        overlap = true;
                        break;
                    }
                }
                for (i = 0; i < BlackCheckers.length; i++) {
                    if (crashWith(BlackCheckers[i], jumpposition)) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    jumpposition.x = (piece.x - 1) * 68;
                    jumpposition.y = (piece.y - 1) * 68;
                    if (playercolor == "Red") {
                        for (i = 0; i < BlackCheckers.length; i++) {
                            if (crashWith(BlackCheckers[i], jumpposition)) {
                                return jump = true
                            }
                        }
                    } else if (playercolor == "Black") {
                        for (i = 0; i < RedCheckers.length; i++) {
                            if (crashWith(RedCheckers[i], jumpposition)) {
                                return jump = true
                            }
                        }
                    }
                }
            }
            overlap = false;
            if (piece.x < 6) {
                jumpposition.x = (piece.x + 2) * 68;
                jumpposition.y = (piece.y - 2) * 68;
                for (i = 0; i < RedCheckers.length; i++) {
                    if (crashWith(RedCheckers[i], jumpposition)) {
                        overlap = true;
                        break;
                    }
                }
                for (i = 0; i < BlackCheckers.length; i++) {
                    if (crashWith(BlackCheckers[i], jumpposition)) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    jumpposition.x = (piece.x + 1) * 68;
                    jumpposition.y = (piece.y - 1) * 68;
                    if (playercolor == "Red") {
                        for (i = 0; i < BlackCheckers.length; i++) {
                            if (crashWith(BlackCheckers[i], jumpposition)) {
                                return jump = true
                            }
                        }
                    } else if (playercolor == "Black") {
                        for (i = 0; i < RedCheckers.length; i++) {
                            if (crashWith(RedCheckers[i], jumpposition)) {
                                return jump = true
                            }
                        }
                    }
                }
            }
        }
    }
    overlap = false;
    if (piece.Queen || playercolor == "Black") {
        if (piece.y < 6) {
            if (piece.x > 1) {
                jumpposition.x = (piece.x - 2) * 68;
                jumpposition.y = (piece.y + 2) * 68;
                for (i = 0; i < RedCheckers.length; i++) {
                    if (crashWith(RedCheckers[i], jumpposition)) {
                        overlap = true;
                        break;
                    }
                }
                for (i = 0; i < BlackCheckers.length; i++) {
                    if (crashWith(BlackCheckers[i], jumpposition)) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    jumpposition.x = (piece.x - 1) * 68;
                    jumpposition.y = (piece.y + 1) * 68;
                    if (playercolor == "Red") {
                        for (i = 0; i < BlackCheckers.length; i++) {
                            if (crashWith(BlackCheckers[i], jumpposition)) {
                                return jump = true
                            }
                        }
                    } else if (playercolor == "Black") {
                        for (i = 0; i < RedCheckers.length; i++) {
                            if (crashWith(RedCheckers[i], jumpposition)) {
                                return jump = true
                            }
                        }
                    }
                }
            }
            overlap = false;
            if (piece.x < 6) {
                jumpposition.x = (piece.x + 2) * 68;
                jumpposition.y = (piece.y + 2) * 68;
                for (i = 0; i < RedCheckers.length; i++) {
                    if (crashWith(RedCheckers[i], jumpposition)) {
                        overlap = true;
                        break;
                    }
                }
                for (i = 0; i < BlackCheckers.length; i++) {
                    if (crashWith(BlackCheckers[i], jumpposition)) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) {
                    jumpposition.x = (piece.x + 1) * 68;
                    jumpposition.y = (piece.y + 1) * 68;
                    if (playercolor == "Red") {
                        for (i = 0; i < BlackCheckers.length; i++) {
                            if (crashWith(BlackCheckers[i], jumpposition)) {
                                return jump = true
                            }
                        }
                    } else if (playercolor == "Black") {
                        for (i = 0; i < RedCheckers.length; i++) {
                            if (crashWith(RedCheckers[i], jumpposition)) {
                                return jump = true
                            }
                        }
                    }
                }
            }
        }
    }
    return jump
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
            Mouse.Holds = "Nothing";
            PlayersTurn = "Red";
        } else {
            Mouse.Holds = "Nothing";
            PlayersTurn = "Black";
        }
    }
    document.getElementById("Jump_Again-Button").hidden = true;
    document.getElementById("End_Turn-Button").hidden = true;
}

function checkforwin() {
    var i, j, move
    var overlap = false;
    var jumpposition = {
        x: 0,
        y: 0
    };

    if (PlayersTurn == "Red") {

        for (i = 0; i < RedCheckers.length; i++) {
            if (Checkforjump('Red', RedCheckers[i])) {
                move = true;
                break;
            }

            if (RedCheckers[i].y > 0) {
                if (RedCheckers[i].x > 0) {
                    jumpposition.x = (RedCheckers[i].x - 1) * 68;
                    jumpposition.y = (RedCheckers[i].y - 1) * 68;
                    overlap = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        move = true;
                        break;
                    }
                }
                if (RedCheckers[i].x < 7) {
                    jumpposition.x = (RedCheckers[i].x + 1) * 68;
                    jumpposition.y = (RedCheckers[i].y - 1) * 68;
                    overlap = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        move = true;
                        break;
                    }
                }
            }
            if (RedCheckers[i].Queen && RedCheckers[i].y < 7) {
                if (RedCheckers[i].x > 0) {
                    jumpposition.x = (RedCheckers[i].x - 1) * 68;
                    jumpposition.y = (RedCheckers[i].y + 1) * 68;
                    overlap = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        move = true;
                        break;
                    }
                }
                if (RedCheckers[i].x < 7) {
                    jumpposition.x = (RedCheckers[i].x + 1) * 68;
                    jumpposition.y = (RedCheckers[i].y + 1) * 68;
                    overlap = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        move = true;
                        break;
                    }
                }
            }

        }

        if (!move) {
            alert('Black Wins.')
        }
    } else {
        for (i = 0; i < BlackCheckers.length; i++) {
            if (Checkforjump('Black', BlackCheckers[i])) {
                move = true;
                break;
            }

            if (BlackCheckers[i].y > 0 && BlackCheckers[i].Queen) {
                if (BlackCheckers[i].x > 0) {
                    jumpposition.x = (BlackCheckers[i].x - 1) * 68;
                    jumpposition.y = (BlackCheckers[i].y - 1) * 68;
                    overlap = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        move = true;
                        break;
                    }
                }
                if (BlackCheckers[i].x < 7) {
                    jumpposition.x = (BlackCheckers[i].x + 1) * 68;
                    jumpposition.y = (BlackCheckers[i].y - 1) * 68;
                    overlap = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        move = true;
                        break;
                    }
                }
            }
            if (BlackCheckers[i].y < 7) {
                if (BlackCheckers[i].x > 0) {
                    jumpposition.x = (BlackCheckers[i].x - 1) * 68;
                    jumpposition.y = (BlackCheckers[i].y + 1) * 68;
                    overlap = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        move = true;
                        break;
                    }
                }
                if (BlackCheckers[i].x < 7) {
                    jumpposition.x = (BlackCheckers[i].x + 1) * 68;
                    jumpposition.y = (BlackCheckers[i].y + 1) * 68;
                    overlap = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    if (!overlap) {
                        move = true;
                        break;
                    }
                }
            }
        }

        if (!move) {
            alert('Red Wins.')
        }
    }
}

function RunComputersTurn() {
    var i, option, newx, newy
    var movements = [];
    var jumps = [];
    Timedout = false;
    if (ComputersMoveList.length == 0) {
        FindMoves();
        for (i = 0; i < ComputersMoveList.length; i++) {
            if (ComputersMoveList[i].type == "move") {
                movements.push(i);
            } else {
                jumps.push(i);
            }
        }
        if (jumps.length != 0) {
            option = Math.round(Math.random() * (jumps.length - 1));
            option = jumps[option];
            if (PlayersTurn == "Red") {
                newx = ComputersMoveList[option].positions[0];
                newy = ComputersMoveList[option].positions[1];
                for (i = 0; i < BlackCheckers.length; i++) {
                    if (BlackCheckers[i].x == RedCheckers[ComputersMoveList[option].index].x + (newx - RedCheckers[ComputersMoveList[option].index].x)/2 && BlackCheckers[i].y == RedCheckers[ComputersMoveList[option].index].y + (newy - RedCheckers[ComputersMoveList[option].index].y)/2) {
                        BlackCheckers.splice(i, 1);
                        break;
                    }
                }
                RedCheckers[ComputersMoveList[option].index].x = newx;
                RedCheckers[ComputersMoveList[option].index].y = newy;
                if (RedCheckers[ComputersMoveList[option].index].y == 0) {
                    RedCheckers[ComputersMoveList[option].index].Queen = true;
                }
            } else {
                newx = ComputersMoveList[option].positions[0];
                newy = ComputersMoveList[option].positions[1];
                for (i = 0; i < RedCheckers.length; i++) {
                    if (RedCheckers[i].x == BlackCheckers[ComputersMoveList[option].index].x + (newx - BlackCheckers[ComputersMoveList[option].index].x)/2 && RedCheckers[i].y == BlackCheckers[ComputersMoveList[option].index].y + (newy - BlackCheckers[ComputersMoveList[option].index].y)/2) {
                        RedCheckers.splice(i, 1);
                    }
                }
                BlackCheckers[ComputersMoveList[option].index].x = newx;
                BlackCheckers[ComputersMoveList[option].index].y = newy;
                if (BlackCheckers[ComputersMoveList[option].index].y == 7) {
                    BlackCheckers[ComputersMoveList[option].index].Queen = true;
                }
            }
            ComputersMoveList = ComputersMoveList[option].next;
        } else {
            option = Math.round(Math.random() * (movements.length - 1));
            if (PlayersTurn == "Red") {
                RedCheckers[ComputersMoveList[option].index].x = ComputersMoveList[option].positions[0];
                RedCheckers[ComputersMoveList[option].index].y = ComputersMoveList[option].positions[1];
                if (RedCheckers[ComputersMoveList[option].index].y == 0) {
                    RedCheckers[ComputersMoveList[option].index].Queen = true;
                }
            } else {
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
}

class Move {
    constructor(index, type, positions, next) {
        this.index = index;
        this.type = type;
        this.positions = positions;
        this.next = next;
    }
}

function FindMoves() {
    var i, j, k
    var overlap = false;
    var overlap2 = false;
    var jumpposition = {
        x: 0,
        y: 0
    };

    if (PlayersTurn == "Red") {

        for (i = 0; i < RedCheckers.length; i++) {

            if (RedCheckers[i].y > 0) {
                if (RedCheckers[i].x > 0) {
                    jumpposition.x = (RedCheckers[i].x - 1) * 68;
                    jumpposition.y = (RedCheckers[i].y - 1) * 68;
                    overlap = false;
                    overlap2 = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            if (RedCheckers[i].y > 1 && RedCheckers[i].x > 1) {
                                jumpposition.x = (RedCheckers[i].x - 2) * 68;
                                jumpposition.y = (RedCheckers[i].y - 2) * 68;
                                for (k = 0; k < RedCheckers.length; k++) {
                                    if (crashWith(RedCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                for (k = 0; k < BlackCheckers.length; k++) {
                                    if (crashWith(BlackCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                if (!overlap2) {
                                    move = new Move(i, "jump", [RedCheckers[i].x - 2, RedCheckers[i].y - 2], []);
                                    ComputersMoveList.push(move);
                                    break;
                                }

                            }
                            break;
                        }
                    }
                    if (!overlap) {
                        move = new Move(i, "move", [RedCheckers[i].x - 1, RedCheckers[i].y - 1], [])
                        ComputersMoveList.push(move);
                    }
                }
                if (RedCheckers[i].x < 7) {
                    jumpposition.x = (RedCheckers[i].x + 1) * 68;
                    jumpposition.y = (RedCheckers[i].y - 1) * 68;
                    overlap = false;
                    overlap2 = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            if (RedCheckers[i].y > 1 && RedCheckers[i].x < 6) {
                                jumpposition.x = (RedCheckers[i].x + 2) * 68;
                                jumpposition.y = (RedCheckers[i].y - 2) * 68;
                                for (k = 0; k < RedCheckers.length; k++) {
                                    if (crashWith(RedCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                for (k = 0; k < BlackCheckers.length; k++) {
                                    if (crashWith(BlackCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                if (!overlap2) {
                                    move = new Move(i, "jump", [RedCheckers[i].x + 2, RedCheckers[i].y - 2], []);
                                    ComputersMoveList.push(move);
                                    break;
                                }

                            }
                            break;
                        }
                    }
                    if (!overlap) {
                        move = new Move(i, "move", [RedCheckers[i].x + 1, RedCheckers[i].y - 1], [])
                        ComputersMoveList.push(move);
                    }
                }
            }
            if (RedCheckers[i].Queen && RedCheckers[i].y < 7) {
                if (RedCheckers[i].x > 0) {
                    jumpposition.x = (RedCheckers[i].x - 1) * 68;
                    jumpposition.y = (RedCheckers[i].y + 1) * 68;
                    overlap = false;
                    overlap2 = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            if (RedCheckers[i].y < 6 && RedCheckers[i].x > 1) {
                                jumpposition.x = (RedCheckers[i].x - 2) * 68;
                                jumpposition.y = (RedCheckers[i].y + 2) * 68;
                                for (k = 0; k < RedCheckers.length; k++) {
                                    if (crashWith(RedCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                for (k = 0; k < BlackCheckers.length; k++) {
                                    if (crashWith(BlackCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                if (!overlap2) {
                                    move = new Move(i, "jump", [RedCheckers[i].x - 2, RedCheckers[i].y + 2], []);
                                    ComputersMoveList.push(move);
                                    break;
                                }

                            }
                            break;
                        }
                    }
                    if (!overlap) {
                        move = new Move(i, "move", [RedCheckers[i].x - 1, RedCheckers[i].y + 1], [])
                        ComputersMoveList.push(move);
                    }
                }
                if (RedCheckers[i].x < 7) {
                    jumpposition.x = (RedCheckers[i].x + 1) * 68;
                    jumpposition.y = (RedCheckers[i].y + 1) * 68;
                    overlap = false;
                    overlap2 = false;
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            if (RedCheckers[i].y < 6 && RedCheckers[i].x < 6) {
                                jumpposition.x = (RedCheckers[i].x + 2) * 68;
                                jumpposition.y = (RedCheckers[i].y + 2) * 68;
                                for (k = 0; k < RedCheckers.length; k++) {
                                    if (crashWith(RedCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                for (k = 0; k < BlackCheckers.length; k++) {
                                    if (crashWith(BlackCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                if (!overlap2) {
                                    move = new Move(i, "jump", [RedCheckers[i].x + 2, RedCheckers[i].y + 2], []);
                                    ComputersMoveList.push(move);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    if (!overlap) {
                        move = new Move(i, "move", [RedCheckers[i].x + 1, RedCheckers[i].y + 1], [])
                        ComputersMoveList.push(move);
                    }
                }
            }

        }

    } else {
        for (i = 0; i < BlackCheckers.length; i++) {

            if (BlackCheckers[i].y > 0 && BlackCheckers[i].Queen) {
                if (BlackCheckers[i].x > 0) {
                    jumpposition.x = (BlackCheckers[i].x - 1) * 68;
                    jumpposition.y = (BlackCheckers[i].y - 1) * 68;
                    overlap = false;
                    overlap2 = false;
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            if (BlackCheckers[i].y > 1 && BlackCheckers[i].x > 1) {
                                jumpposition.x = (BlackCheckers[i].x - 2) * 68;
                                jumpposition.y = (BlackCheckers[i].y - 2) * 68;
                                for (k = 0; k < BlackCheckers.length; k++) {
                                    if (crashWith(BlackCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                for (k = 0; k < RedCheckers.length; k++) {
                                    if (crashWith(RedCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                if (!overlap2) {
                                    move = new Move(i, "jump", [BlackCheckers[i].x - 2, BlackCheckers[i].y - 2], []);
                                    ComputersMoveList.push(move);
                                    break;
                                }

                            }
                            break;
                        }
                    }
                    if (!overlap) {
                        move = new Move(i, "move", [BlackCheckers[i].x - 1, BlackCheckers[i].y - 1], [])
                        ComputersMoveList.push(move);
                    }
                }
                if (BlackCheckers[i].x < 7) {
                    jumpposition.x = (BlackCheckers[i].x + 1) * 68;
                    jumpposition.y = (BlackCheckers[i].y - 1) * 68;
                    overlap = false;
                    overlap2 = false;
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            if (BlackCheckers[i].y > 1 && BlackCheckers[i].x < 6) {
                                jumpposition.x = (BlackCheckers[i].x + 2) * 68;
                                jumpposition.y = (BlackCheckers[i].y - 2) * 68;
                                for (k = 0; k < BlackCheckers.length; k++) {
                                    if (crashWith(BlackCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                for (k = 0; k < RedCheckers.length; k++) {
                                    if (crashWith(RedCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                if (!overlap2) {
                                    move = new Move(i, "jump", [BlackCheckers[i].x + 2, BlackCheckers[i].y - 2], []);
                                    ComputersMoveList.push(move);
                                    break;
                                }

                            }
                            break;
                        }
                    }
                    if (!overlap) {
                        move = new Move(i, "move", [BlackCheckers[i].x + 1, BlackCheckers[i].y - 1], [])
                        ComputersMoveList.push(move);
                    }
                }
            }
            if (BlackCheckers[i].y < 7) {
                if (BlackCheckers[i].x > 0) {
                    jumpposition.x = (BlackCheckers[i].x - 1) * 68;
                    jumpposition.y = (BlackCheckers[i].y + 1) * 68;
                    overlap = false;
                    overlap2 = false;
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            if (BlackCheckers[i].y < 6 && BlackCheckers[i].x > 1) {
                                jumpposition.x = (BlackCheckers[i].x - 2) * 68;
                                jumpposition.y = (BlackCheckers[i].y + 2) * 68;
                                for (k = 0; k < BlackCheckers.length; k++) {
                                    if (crashWith(BlackCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                for (k = 0; k < RedCheckers.length; k++) {
                                    if (crashWith(RedCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                if (!overlap2) {
                                    move = new Move(i, "jump", [BlackCheckers[i].x - 2, BlackCheckers[i].y + 2], []);
                                    ComputersMoveList.push(move);
                                    break;
                                }

                            }
                            break;
                        }
                    }
                    if (!overlap) {
                        move = new Move(i, "move", [BlackCheckers[i].x - 1, BlackCheckers[i].y + 1], [])
                        ComputersMoveList.push(move);
                    }
                }
                if (BlackCheckers[i].x < 7) {
                    jumpposition.x = (BlackCheckers[i].x + 1) * 68;
                    jumpposition.y = (BlackCheckers[i].y + 1) * 68;
                    overlap = false;
                    overlap2 = false;
                    for (j = 0; j < BlackCheckers.length; j++) {
                        if (crashWith(BlackCheckers[j], jumpposition)) {
                            overlap = true;
                            break;
                        }
                    }
                    for (j = 0; j < RedCheckers.length; j++) {
                        if (crashWith(RedCheckers[j], jumpposition)) {
                            overlap = true;
                            if (BlackCheckers[i].y < 6 && BlackCheckers[i].x < 6) {
                                jumpposition.x = (BlackCheckers[i].x + 2) * 68;
                                jumpposition.y = (BlackCheckers[i].y + 2) * 68;
                                for (k = 0; k < BlackCheckers.length; k++) {
                                    if (crashWith(BlackCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                for (k = 0; k < RedCheckers.length; k++) {
                                    if (crashWith(RedCheckers[k], jumpposition)) {
                                        overlap2 = true;
                                        break;
                                    }
                                }
                                if (!overlap2) {
                                    move = new Move(i, "jump", [BlackCheckers[i].x + 2, BlackCheckers[i].y + 2], []);
                                    ComputersMoveList.push(move);
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    if (!overlap) {
                        move = new Move(i, "move", [BlackCheckers[i].x + 1, BlackCheckers[i].y + 1], [])
                        ComputersMoveList.push(move);
                    }
                }
            }

        }
    }
}