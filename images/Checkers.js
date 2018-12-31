Thecanvas = {
    width: 544,
    height: 544
};

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
        document.getElementById("GameArea").addEventListener('mousedown', mousedownhandler);
        this.interval = setInterval(updateGameArea, 20);
    },
    stop: function () {
        clearInterval(this.interval);
        document.getElementById("GameArea").removeEventListener('mousedown', mousedownhandler);
        myGameArea.clear;
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function StartGame() {
    document.getElementById("Menu").hidden = true;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = false;
    }
    myGameArea.start();
    document.getElementById("ButtonArea").hidden = false;
}

function Menu() {
    myGameArea.stop();
    document.getElementById("ButtonArea").hidden = true;
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

function mousedownhandler(e) {
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
                            } else if (RedCheckers[Mouse.Index].Queen) {
                                RedCheckers[Mouse.Index].x = Newplacex;
                                RedCheckers[Mouse.Index].y = Newplacey;
                                Mouse.Holds = "Nothing";
                                PlayersTurn = "Black";
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
                            } else if (BlackCheckers[Mouse.Index].Queen) {
                                BlackCheckers[Mouse.Index].x = Newplacex;
                                BlackCheckers[Mouse.Index].y = Newplacey;
                                Mouse.Holds = "Nothing";
                                PlayersTurn = "Red";
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