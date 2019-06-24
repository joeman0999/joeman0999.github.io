var BlueWins = 0;
var GreenWins = 0;
var Mouse = [{
    Holds: "Nothing",
    OriginalX: 0,
    OriginalY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    angle: 0,
    Shape: "Bullet",
    Index: 0, // used to determine which item is being held
}];

var Thecanvas = {
    width: 1300,
    height: 600
};

var SoloGame = false;
var CoOpGame = false;
var Level_Editor = false;
var VsGame = false;

var Player1Tank = {
    Tank: "images/Tank1.png",
    Move: "WASD",
    Forward: 87,
    Backward: 83,
    Clockwise: 68,
    Counter: 65,
    Shoot: 32
}

var Player2Tank = {
    Tank: "images/Tank2.png",
    Move: "Arrow",
    Forward: 38,
    Backward: 40,
    Clockwise: 39,
    Counter: 37,
    Shoot: 13
}

var LevelEditorInfo = {
    Type: "Solo", // defines the number of friendly tanks to create
    Wall: "BlackLine", // defines the type of wall to create
    Enemy: "Target", // defines the type of enemy to create
    x: 0, // used to determine the difference in the mouses new and old positions to move elements around
    y: 0, // used to determine the difference in the mouses new and old positions to move elements around
};

var Max_Level = 1;
var CoOpMax_Level = 1;
var AIEnemyData = [];
var Bullets = [];
var Level, Tank1, Tank2, Tank1Data, Tank2Data, frame

function Menu() {
    clearInterval(myGameArea.interval);
    myGameArea.keys = [];
    try {
        myGameArea.clear();
    } catch (err) {
    }
    try {
        document.getElementById("GameArea").removeEventListener('mousedown', mousedownhandler);
    } catch (err) {
    }
    try {
        document.getElementById("GameArea").removeEventListener('mouseup', mouseuphandler);
    } catch (err) {
    }
    try {
        document.getElementById("GameArea").removeEventListener('mousemove', mousemovehandler);
    } catch (err) {
    }
    try {
        window.removeEventListener('keydown', keydownhandler);
    } catch (err) {
    }
    try {
        window.removeEventListener('keyup', keyuphandler);
    } catch (err) {
    }

    document.getElementById("Solo_Level_List").hidden = true;
    document.getElementById("VS_Level_List").hidden = true;
    document.getElementById("CoOp_Level_List").hidden = true;
    document.getElementById("ButtonArea").hidden = true;
    document.getElementById("LevelEditorArea").hidden = true;
    if (document.getElementById("GameArea")) {
        document.getElementById("GameArea").hidden = true;
    }
    document.getElementById("Help-Area").hidden = true;
    document.getElementById("Settings-Area").hidden = true;
    document.getElementById("Menu").hidden = false;
    Thecanvas = {
        width: 1300,
        height: 600
    };
    SoloGame = false;
    CoOpGame = false;
    Level_Editor = false;
    VsGame = false;
}

function Reset() {
    clearInterval(myGameArea.interval);
    myGameArea.keys = [];
    myGameArea.clear();
    Bullets = [];
    frame = 0;
    document.getElementById("Play-Button").disabled = true;
    document.getElementById("Pause-Button").disabled = false;
    if (Level<0) {
        PlayerLevel((Level*-1)-1)
    } else if (VsGame) {
        var option = Math.round(Math.random() * 5 + 1); // random level
        VSMapSelect(option);
        myGameArea.interval = setInterval(updateCoOpGameArea, 20);
    } else if (SoloGame) {
        myGameArea.interval = setInterval(updateSoloGameArea, 20);
        document.getElementById("wins").innerHTML = "Level: " + Level;
        SoloLevelSelector(Level);
    } else if (CoOpGame) {
        myGameArea.interval = setInterval(updateCoOpGameArea, 20);
        document.getElementById("wins").innerHTML = "Level: " + Level;
        CoOpLevelSelector(Level);
    }
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        myGameArea.keys = (myGameArea.keys || []);
        document.getElementById("Play-Button").disabled = true;
        document.getElementById("Pause-Button").disabled = false;
        frame = 0;
        this.canvas.setAttribute("id", "GameArea");
        this.canvas.width = Thecanvas.width;
        this.canvas.height = Thecanvas.height;
        this.context = this.canvas.getContext("2d");

        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        if (VsGame) {
            this.interval = setInterval(updateCoOpGameArea, 20);
            document.getElementById("wins").innerHTML = "Blue Wins: " + BlueWins + "      Green Wins: " + GreenWins;
        } else if (SoloGame) {
            this.interval = setInterval(updateSoloGameArea, 20);
            document.getElementById("wins").innerHTML = "Level: " + Level;
        } else if (CoOpGame) {
            this.interval = setInterval(updateCoOpGameArea, 20);
            document.getElementById("wins").innerHTML = "Level: " + Level;
        } else if (Level_Editor) {
            this.interval = setInterval(updateLevelEditorArea, 20);
            document.getElementById("GameArea").addEventListener('mousedown', mousedownhandler);

            document.getElementById("GameArea").addEventListener('mouseup', mouseuphandler);
            document.getElementById("GameArea").addEventListener('mousemove', mousemovehandler);
        }

        window.addEventListener('keydown', keydownhandler);
        window.addEventListener('keyup', keyuphandler);

    },
    stop: function () {
        myGameArea.keys = [];
        document.getElementById("Play-Button").disabled = false;
        document.getElementById("Pause-Button").disabled = true;
        clearInterval(this.interval);
        if (!Level_Editor) {
            this.interval = setInterval(TrackReset, 20);
        } else {
            document.getElementById("Play2-Button").disabled = false;
            document.getElementById("Pause2-Button").disabled = true;
        }
    },
    unpause: function () {
        document.getElementById("Play-Button").disabled = true;
        document.getElementById("Pause-Button").disabled = false;
        if (VsGame || CoOpGame) {
            this.interval = setInterval(updateCoOpGameArea, 20);
        } else if (SoloGame) {
            this.interval = setInterval(updateSoloGameArea, 20);
        } else if (Level_Editor) {
            this.interval = setInterval(updateLevelEditorArea, 20);
            document.getElementById("Play2-Button").disabled = true;
            document.getElementById("Pause2-Button").disabled = false;
        }
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function keydownhandler(e) {
    myGameArea.keys = (myGameArea.keys || []);
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
}

function keyuphandler(e) {
    myGameArea.keys[e.keyCode] = (e.type == "keydown");
}

function mousedownhandler(e) {
    Mouse[0].x = e.clientX;
    Mouse[0].y = e.clientY;
    Mouse[0].OriginalX = e.clientX;
    Mouse[0].OriginalY = e.clientY;

    if (crashWith(Tank1Data, Mouse[0])) {
        Mouse[0].Holds = "Tank1";
        LevelEditorInfo.x = Tank1Data.x;
        LevelEditorInfo.y = Tank1Data.y;
    } else if (LevelEditorInfo.Type == "CoOp" && crashWith(Tank2Data, Mouse[0])) {
        Mouse[0].Holds = "Tank2";
        LevelEditorInfo.x = Tank2Data.x;
        LevelEditorInfo.y = Tank2Data.y;
    }
    for (let i = 0; i < walls.length; i++) {
        if (crashWith(walls[i], Mouse[0])) {
            Mouse[0].Holds = "Wall";
            Mouse[0].Index = i;
            LevelEditorInfo.x = walls[i].x;
            LevelEditorInfo.y = walls[i].y;
            break;
        }
    }
    for (let i = 0; i < AIEnemyData.length; i++) {
        if (crashWith(AIEnemyData[i], Mouse[0])) {
            Mouse[0].Holds = "AI";
            Mouse[0].Index = i;
            LevelEditorInfo.x = AIEnemyData[i].x;
            LevelEditorInfo.y = AIEnemyData[i].y;
            break;
        }
    }
}

function mouseuphandler(e) {
    if (Mouse[0].Holds == "Wall") {
        DetermineGridMap();
    }
    Mouse[0].Holds = "Nothing";

}

function mousemovehandler(e) {
    if (Mouse[0].Holds != "Nothing") {
        Mouse[0].x = e.clientX;
        Mouse[0].y = e.clientY;

        var Type = document.getElementById("Movement-selector").value
        if (Type == 0) {
            if (Mouse[0].Holds == "Tank1") {
                Tank1Data.x = LevelEditorInfo.x - (Mouse[0].OriginalX - Mouse[0].x);
                Tank1Data.y = LevelEditorInfo.y - (Mouse[0].OriginalY - Mouse[0].y);
            } else if (Mouse[0].Holds == "Tank2") {
                Tank2Data.x = LevelEditorInfo.x - (Mouse[0].OriginalX - Mouse[0].x);
                Tank2Data.y = LevelEditorInfo.y - (Mouse[0].OriginalY - Mouse[0].y);
            } else if (Mouse[0].Holds == "Wall") {
                walls[Mouse[0].Index].x = LevelEditorInfo.x - (Mouse[0].OriginalX - Mouse[0].x);
                walls[Mouse[0].Index].y = LevelEditorInfo.y - (Mouse[0].OriginalY - Mouse[0].y);
                
            } else if (Mouse[0].Holds == "AI") {
                AIEnemyData[Mouse[0].Index].x = LevelEditorInfo.x - (Mouse[0].OriginalX - Mouse[0].x);
                AIEnemyData[Mouse[0].Index].y = LevelEditorInfo.y - (Mouse[0].OriginalY - Mouse[0].y);
            }

        } else if (Type == 1) {
            if (Mouse[0].Holds == "Tank1") {
                Tank1Data.angle = Math.atan2((Tank1Data.y - Mouse[0].y), (Tank1Data.x - Mouse[0].x)) - Math.PI / 2;
            } else if (Mouse[0].Holds == "Tank2") {
                Tank2Data.angle = Math.atan2((Tank2Data.y - Mouse[0].y), (Tank2Data.x - Mouse[0].x)) - Math.PI / 2;
            } else if (Mouse[0].Holds == "Wall") {
                walls[Mouse[0].Index].angle = Math.atan2((walls[Mouse[0].Index].y - Mouse[0].y), (walls[Mouse[0].Index].x - Mouse[0].x)) - Math.PI / 2;
            } else if (Mouse[0].Holds == "AI") {
                AIEnemyData[Mouse[0].Index].angle = Math.atan2((AIEnemyData[Mouse[0].Index].y - Mouse[0].y), (AIEnemyData[Mouse[0].Index].x - Mouse[0].x)) - Math.PI / 2;
            }
        }
    
        LevelEditorDrawing();
    }
}

function SettingsScreen() {
    document.getElementById("Settings-Area").hidden = false;
    document.getElementById("Menu").hidden = true;
}

function TankSelect(Tank, Property, Option) {
    if (Property == "Image") {
        if (Tank == 1) {
            var index = Player1Tank.Tank[4];
            document.getElementById("Tank1-" + index + "-Button").disabled = false;
            document.getElementById("Tank1-" + Option + "-Button").disabled = true;
            Player1Tank.Tank = "images/Tank" + Option + ".png";
        } else if (Tank == 2) {
            var index = Player2Tank.Tank[4];
            document.getElementById("Tank2-" + index + "-Button").disabled = false;
            document.getElementById("Tank2-" + Option + "-Button").disabled = true;
            Player2Tank.Tank = "images/Tank" + Option + ".png";
        }
    } else if (Property == "Move") {
        if (Option == "WASD") {
            document.getElementById("Tank1-WASD-Button").disabled = true;
            document.getElementById("Tank1-Arrow-Button").disabled = false;
            document.getElementById("Tank1-4568-Button").disabled = false;
            Player1Tank.Move = "WASD";
            Player1Tank.Forward = 87;
            Player1Tank.Backward = 83;
            Player1Tank.Clockwise = 68;
            Player1Tank.Counter = 65;
            Player1Tank.Shoot = 32;
        } else if (Option == "4568") {
            document.getElementById("Tank1-4568-Button").disabled = true;
            document.getElementById("Tank1-WASD-Button").disabled = false;
            document.getElementById("Tank1-Arrow-Button").disabled = false;
            Player1Tank.Move = "4568";
            Player1Tank.Forward = 104;
            Player1Tank.Backward = 101;
            Player1Tank.Clockwise = 102;
            Player1Tank.Counter = 100;
            Player1Tank.Shoot = 32;
        } else if (Option == "Arrow") {
            document.getElementById("Tank1-Arrow-Button").disabled = true;
            document.getElementById("Tank1-WASD-Button").disabled = false;
            document.getElementById("Tank1-4568-Button").disabled = false;
            Player1Tank.Move = "Arrow";
            Player1Tank.Forward = 38;
            Player1Tank.Backward = 40;
            Player1Tank.Clockwise = 39;
            Player1Tank.Counter = 37;
            Player1Tank.Shoot = 13;
        }
    }
}

function HelpScreen() {
    Level = 0;
    VsGame = false;
    SoloGame = true;
    CoOpGame = false;
    Bullets = [];
    Thecanvas = {
        width: 800,
        height: 500
    };
    document.getElementById("Menu").hidden = true;
    Tank1 = new Image();
    Tank1.src = Player1Tank.Tank;
    Tank1Data = {
        x: 100,
        y: 300,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: true
    }
    SoloLevelSelector(0);
    myGameArea.start()
    document.getElementById("GameArea").hidden = false;
    document.getElementById("Help-Area").hidden = false;
}

function TrackReset() {
    if (myGameArea.keys && myGameArea.keys[78]) {
        Reset();
    }
}

function startVSGame(n) {
    VsGame = true;
    Bullets = [];
    document.getElementById("Menu").hidden = true;
    document.getElementById("VS_Level_List").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    Tank1 = new Image();
    Tank1.src = Player1Tank.Tank;
    Tank1Data = {
        x: 100,
        y: 300,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: true
    }
    Tank2 = new Image();
    Tank2.src = Player2Tank.Tank;
    Tank2Data = {
        x: 1200,
        y: 300,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: -Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: true
    }
    if (n == 0) {
        n = Math.round(Math.random() * 5 + 1); // random level
    }
    VSMapSelect(n);
    myGameArea.start()
    document.getElementById("GameArea").hidden = false;
}

function startSoloGame(n) {
    Level = n;
    SoloGame = true;
    Bullets = [];
    document.getElementById("Menu").hidden = true;
    document.getElementById("Solo_Level_List").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    Tank1 = new Image();
    Tank1.src = Player1Tank.Tank;
    Tank1Data = {
        x: 100,
        y: 300,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: true
    }
    SoloLevelSelector(Level);
    myGameArea.start();
    document.getElementById("GameArea").hidden = false;
}

function StartCoOpGame(n) {
    Level = n;
    CoOpGame = true;
    Bullets = [];
    document.getElementById("Menu").hidden = true;
    document.getElementById("CoOp_Level_List").hidden = true;
    document.getElementById("ButtonArea").hidden = false;
    Tank1 = new Image();
    Tank1.src = Player1Tank.Tank;
    Tank2 = new Image();
    Tank2.src = Player2Tank.Tank;
    Tank1Data = {
        x: 100,
        y: 200,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: true
    }
    Tank2Data = {
        x: 100,
        y: 400,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: true,
    }
    CoOpLevelSelector(Level);
    myGameArea.start()
    document.getElementById("GameArea").hidden = false;
}

function component(width, height, color, x, y, angle, Shape) { // makes bullets

    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.Shape = Shape;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = color;
        ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
        ctx.restore();
    }
    this.newPos = function () {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
}

function updateSoloGameArea() {
    frame = frame + 1;
    var x, y, found
    for (let i = 0; i < Bullets.length; i += 1) {
        found = false;
        for (let k = 0; k < AIEnemyData.length; k += 1) {
            if (crashWith(AIEnemyData[k], Bullets[i])) {
                AIEnemyData.splice(k, 1);
                Bullets.splice(i, 1);
                --i;
                found = true;
                break;
            }
        }
        if (!found) {
            if (crashWith(Tank1Data, Bullets[i])) {
                myGameArea.clear();
                myGameArea.stop();
                document.getElementById("Play-Button").disabled = true;
                alert("Game Over");
                return;
            } else if (WallCheck(Bullets[i], walls)) {
                Bullets.splice(i, 1);
                --i;
            }
        }
    }

    if (AIEnemyData.length == 0 && Level != 0) {
        myGameArea.clear();
        myGameArea.stop();
        document.getElementById("Play-Button").disabled = true;
        if (Level > 0) {
            alert("Level " + Level + " Completed");
            ++Level;
            try {
                if (Max_Level < Level) {
                    localStorage.Max_Level = Level;
                    Max_Level = Level;
                }
            } catch (err) {
                if (Max_Level < Level) {
                    Max_Level = Level;
                }
            }
        } else {
            alert("Level Completed");
        }
        return;
    }
    
    Tank1Data.moveAngle = 0;
    Tank1Data.speed = 0;

    if (myGameArea.keys && myGameArea.keys[80] && Level != 0) {
        myGameArea.stop();
    }

    if (myGameArea.keys && myGameArea.keys[Player1Tank.Shoot] && frame - 25 > Tank1Data.frame) {
        Tank1Data.frame = frame;
        x = Tank1Data.x + Math.sin(Tank1Data.angle) * (Tank1Data.Th + 10);
        y = Tank1Data.y - Math.cos(Tank1Data.angle) * (Tank1Data.Th + 10);
        Bullets.push(new component(2, 4, "blue", x, y, Tank1Data.angle, "Bullet"));
    }

    if (myGameArea.keys && myGameArea.keys[Player1Tank.Counter]) {
        Tank1Data.moveAngle = -5;
    } else if (myGameArea.keys && myGameArea.keys[Player1Tank.Clockwise]) {
        Tank1Data.moveAngle = 5;
    }

    if (myGameArea.keys && myGameArea.keys[Player1Tank.Forward]) {
        Tank1Data.speed = 3;
    } else if (myGameArea.keys && myGameArea.keys[Player1Tank.Backward]) {
        Tank1Data.speed = -3;
    }

    if (myGameArea.keys && myGameArea.keys[78] && Level != 0) {
        Reset();
    }

    myGameArea.clear();
    Tank1Data = update(Tank1Data);
    drawTank(Tank1, Tank1Data)
    AiDraw();
    drawWallsAndBullets();
}

function updateCoOpGameArea() {
    frame = frame + 1;
    var x, y, found
    for (let i = 0; i < Bullets.length; i += 1) {
        found = false;
        for (let k = 0; k < AIEnemyData.length; k += 1) {
            if (crashWith(AIEnemyData[k], Bullets[i])) {
                AIEnemyData.splice(k, 1);
                Bullets.splice(i, 1);
                --i;
                found = true;
                break;
            }
        }

        if (!found) {
            if (crashWith(Tank1Data, Bullets[i]) && Tank1Data.Alive) {
                Tank1Data.Alive = false;
                Bullets.splice(i, 1);
                --i;
                if (VsGame) {
                    myGameArea.clear();
                    myGameArea.stop();
                    document.getElementById("Play-Button").disabled = true;
                    ++GreenWins;
                    document.getElementById("wins").innerHTML = "Blue Wins: " + BlueWins + "      Green Wins: " + GreenWins;
                    alert("Green Player Wins!!")
                    return;
                }
            } else if (crashWith(Tank2Data, Bullets[i]) && Tank2Data.Alive) {
                Tank2Data.Alive = false;
                Bullets.splice(i, 1);
                --i;
                if (VsGame) {
                    myGameArea.clear();
                    myGameArea.stop();
                    document.getElementById("Play-Button").disabled = true;
                    ++BlueWins;
                    document.getElementById("wins").innerHTML = "Blue Wins: " + BlueWins + "      Green Wins: " + GreenWins;
                    alert("Blue Player Wins!!")
                    return;
                }
            } else if (WallCheck(Bullets[i], walls)) {
                Bullets.splice(i, 1);
                --i;
            }
        }
    }

    if (AIEnemyData.length == 0 && CoOpGame) {
        myGameArea.keys = [];
        myGameArea.stop();
        myGameArea.clear();
        document.getElementById("Play-Button").disabled = true;
        if (Level > 0) {
            alert("Level " + Level + " Completed");
            ++Level;
            try {
                if (CoOpMax_Level < Level) {
                    localStorage.CoOpMax_Level = Level;
                    CoOpMax_Level = Level;
                }
            } catch (err) {
                if (CoOpMax_Level < Level) {
                    CoOpMax_Level = Level;
                }
            }
        } else {
            alert("Level Completed");
        }
        return;
    }

    myGameArea.clear();

    if (myGameArea.keys && myGameArea.keys[78]) {
        Reset();
    }

    if (Tank1Data.Alive) {
        Tank1Data.moveAngle = 0;
        Tank1Data.speed = 0;
        if (myGameArea.keys && myGameArea.keys[80]) {
            myGameArea.stop();
        }
        if (myGameArea.keys && myGameArea.keys[32] && frame - 25 > Tank1Data.frame) {
            Tank1Data.frame = frame;
            x = Tank1Data.x + Math.sin(Tank1Data.angle) * (Tank1Data.Th + 10);
            y = Tank1Data.y - Math.cos(Tank1Data.angle) * (Tank1Data.Th + 10);
            Bullets.push(new component(2, 4, "blue", x, y, Tank1Data.angle, "Bullet"));
        }

        if (myGameArea.keys && myGameArea.keys[65]) {
            Tank1Data.moveAngle = -5;
        } else if (myGameArea.keys && myGameArea.keys[68]) {
            Tank1Data.moveAngle = 5;
        }

        if (myGameArea.keys && myGameArea.keys[87]) {
            Tank1Data.speed = 3;
        } else if (myGameArea.keys && myGameArea.keys[83]) {
            Tank1Data.speed = -3;
        }

        Tank1Data = update(Tank1Data);
        drawTank(Tank1, Tank1Data);
    }

    if (Tank2Data.Alive) {
        Tank2Data.moveAngle = 0;
        Tank2Data.speed = 0;

        if (myGameArea.keys && myGameArea.keys[13] && frame - 25 > Tank2Data.frame) {
            Tank2Data.frame = frame;
            x = Tank2Data.x + Math.sin(Tank2Data.angle) * (Tank2Data.Th + 10);
            y = Tank2Data.y - Math.cos(Tank2Data.angle) * (Tank2Data.Th + 10);
            Bullets.push(new component(2, 4, "green", x, y, Tank2Data.angle, "Bullet"));
        }

        if (myGameArea.keys && myGameArea.keys[37]) {
            Tank2Data.moveAngle = -5;
        } else if (myGameArea.keys && myGameArea.keys[39]) {
            Tank2Data.moveAngle = 5;
        }

        if (myGameArea.keys && myGameArea.keys[38]) {
            Tank2Data.speed = 3;
        } else if (myGameArea.keys && myGameArea.keys[40]) {
            Tank2Data.speed = -3;
        }

        Tank2Data = update(Tank2Data);
        drawTank(Tank2, Tank2Data);
    }

    if (!Tank1Data.Alive && !Tank2Data.Alive) {
        myGameArea.clear();
        myGameArea.stop();
        document.getElementById("Play-Button").disabled = true;
        alert("Game Over");
        return;
    }

    AiDraw();
    drawWallsAndBullets();
}

function update(Info) { // updates the position given many elements and checks for collisions

    if (Info.angle > Math.PI * 2) {
        Info.angle = Info.angle - Math.PI * 2
    } else if (Info.angle < 0) {
        Info.angle = Info.angle + Math.PI * 2
    }

    var Oldangle = Info.angle;

    var Oldx = Info.x;
    var Oldy = Info.y;
    Info.angle += Info.moveAngle * Math.PI / 180;
    if (WallCheck(Info, walls) || TanksOverlap(Info)) {
        Info.angle = Oldangle;
    }
    Info.x += Info.speed * Math.sin(Info.angle);
    if (40 >= Info.x || Info.x >= Thecanvas.width - 40 || WallCheck(Info, walls) || TanksOverlap(Info)) {
        Info.x = Oldx;
    }
    Info.y -= Info.speed * Math.cos(Info.angle);
    if (40 >= Info.y || Info.y >= Thecanvas.height - 40 || WallCheck(Info, walls) || TanksOverlap(Info)) {
        Info.y = Oldy;
    }

    return Info
}

function Atan2(x, y) {
    var Theta = Math.atan2(x, y);
    if (Theta >= Math.PI * 2) {
        return (Theta - Math.PI * 2);
    } else if (Theta < 0) {
        return (Theta + Math.PI * 2);
    } else {
        return Theta;
    }
}

function updateAI(Info) {
    if (Info.angle >= Math.PI * 2) {
        Info.angle = Info.angle - Math.PI * 2;
    } else if (Info.angle < 0) {
        Info.angle = Info.angle + Math.PI * 2;
    }
    var Theta, AngleDif, x, y
    if (Info.AIType == "Turret") {
        // + y means down so y is flipped
        x = Tank1Data.x - Info.x;
        y = Info.y - Tank1Data.y;
        Theta = Atan2(x, y);

        if (Theta > Info.angle) {
            AngleDif = Theta - Info.angle;
            if (AngleDif > Math.PI) {
                Info.moveAngle = -5;
            } else {
                Info.moveAngle = 5;
            }
        } else if (Theta < Info.angle) {
            AngleDif = Info.angle - Theta;
            if (AngleDif > Math.PI) {
                Info.moveAngle = 5;
            } else {
                Info.moveAngle = -5;
            }
        } else {
            AngleDif = 0;
        }
        if (AngleDif < Math.PI / 180 * 5) {
            Info.moveAngle = 0;
            Info.angle = Theta
        }
    } else if (Info.AIType == "Target") {
        if (Info.speed != 0 && Info.path == "Line") {
            // + y means down so y is flipped
            if (Info.Direction == "Pos") {
                x = Info.x1 - Info.x;
                y = Info.y - Info.y1;
            } else {
                x = Info.x2 - Info.x;
                y = Info.y - Info.y2;
            }

            Theta = Math.atan2(x, y);

            if (Theta >= Math.PI * 2) {
                Theta = Theta - Math.PI * 2
            } else if (Theta < 0) {
                Theta = Theta + Math.PI * 2;
            } else if (x == 0 && y == 0) {
                if (Info.Direction == "Pos") {
                    Info.Direction = "Neg";
                } else {
                    Info.Direction = "Pos"
                }
                Theta = Info.angle - Math.PI;
            }
            Info.angle = Theta;
        }
    } else if (Info.AIType == "Chase") {
        var PathDistance, distance, Path
        Info.FireRate = 30;

        for (let i = 0; i < Bullets.length; i += 1) { // Check if it needs to switch to dodge mode
            x = Info.x - Bullets[i].x;
            y = Bullets[i].y - Info.y;
            Theta = Atan2(x, y);

            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if (Math.abs(Math.abs(Bullets[i].angle) - Theta) < Math.PI * 25 / 180 && distance < 150) {
                Info.AIType = "Dodge";
                return Info;
            }
        }

        x = Tank1Data.x - Info.x;
        y = Info.y - Tank1Data.y;
        distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        PathDistance = 0;
        Path = {
            Shape: "Bullet",
            x: Info.x,
            y: Info.y
        }

        Theta = Atan2(x, y);

        while (distance - PathDistance >= 5) {
            Path.x += 5 * Math.sin(Theta);
            Path.y -= 5 * Math.cos(Theta);
            PathDistance += 5;
            if (WallCheck(Path, walls)) {
                Info.AIType = "PathFind";
                return Info;
            }
        }


        if (Theta > Info.angle) {
            AngleDif = Theta - Info.angle;
            if (AngleDif > Math.PI) {
                Info.moveAngle = -5;
            } else {
                Info.moveAngle = 5;
            }
        } else if (Theta < Info.angle) {
            AngleDif = Info.angle - Theta;
            if (AngleDif > Math.PI) {
                Info.moveAngle = 5;
            } else {
                Info.moveAngle = -5;
            }
        } else {
            AngleDif = 0;
        }

        if (AngleDif < Math.PI / 180 * 5) {
            Info.moveAngle = 0;
            var Oldangle = Info.angle;
            Info.angle = Theta
            if (WallCheck(Info, walls) || TanksOverlap(Info)) {
                Info.angle = Oldangle;
            }
        }

        if (distance <= 250 && Info.speed > -3) {
            Info.speed = Info.speed - .1;
        } else if (Info.speed < 3) {
            Info.speed = Info.speed + .1;
        }

    } else if (Info.AIType == "Dodge") {
        var i, ii, distance;
        var Distances = [];
        var indexes = [];
        var Path = false;
        for (i = 0; i < Bullets.length; i += 1) {
            x = Info.x - Bullets[i].x;
            y = Bullets[i].y - Info.y;
            Theta = Atan2(x, y);

            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if (Math.abs(Bullets[i].angle - Theta) < Math.PI * 25 / 180 && distance < 150) {
                Path = true;
                Distances.push(distance);
                indexes.push(i);
            }
        }
        ii = indexOfMin(Distances);
        i = indexes[ii];
        if (Path == false) {
            Info.AIType = "Chase";
            return Info;
        }

        Info.speed = -3;

        if (Theta > Bullets[i].angle) {
            Theta = Theta - Math.PI / 2;
        } else {
            Theta = Theta + Math.PI / 2
        }

        if (Theta >= Math.PI * 2) {
            Theta = Theta - Math.PI * 2
        } else if (Theta < 0) {
            Theta = Theta + Math.PI * 2;
        }

        if (Theta > Info.angle) {
            AngleDif = Theta - Info.angle;
            if (AngleDif > Math.PI) {
                Info.moveAngle = -5;
            } else {
                Info.moveAngle = 5;
            }
        } else if (Theta < Info.angle) {
            AngleDif = Info.angle - Theta;
            if (AngleDif > Math.PI) {
                Info.moveAngle = 5;
            } else {
                Info.moveAngle = -5;
            }
        } else {
            AngleDif = 0;
        }

        if (AngleDif < Math.PI / 180 * 5) {
            Info.moveAngle = 0;
            var Oldangle = Info.angle;
            Info.angle = Theta
            if (WallCheck(Info, walls) || TanksOverlap(Info)) {
                Info.angle = Oldangle;
            }
        }
    } else if (Info.AIType == "PathFind") {

        var PathDistance, distance, Path, LOS

        for (i = 0; i < Bullets.length; i += 1) { // Check if it needs to switch to dodge mode
            x = Info.x - Bullets[i].x;
            y = Bullets[i].y - Info.y;
            Theta = Atan2(x, y);

            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if (Math.abs(Math.abs(Bullets[i].angle) - Theta) < Math.PI * 25 / 180 && distance < 150) {
                Info.AIType = "Dodge";
                Info.Path = [];
                return Info;
            }
        }

        x = Tank1Data.x - Info.x;
        y = Info.y - Tank1Data.y;
        distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        PathDistance = 0;
        Path = {
            Shape: "Bullet",
            x: Info.x,
            y: Info.y
        }

        Theta = Atan2(x, y);

        LOS = true;
        while (LOS == true && distance - PathDistance >= 5) {
            Path.x += 5 * Math.sin(Theta);
            Path.y -= 5 * Math.cos(Theta);
            PathDistance += 5;
            if (WallCheck(Path, walls)) {
                LOS = false;
                break;
            }
        }

        if (LOS) {
            Info.AIType = "Chase";
            Info.Path = [];
            return Info;
        }

        Info.FireRate = 100;

        var Point1 = {
            x: Info.x,
            y: Info.y
        }

        var Point2 = {
            x: Tank1Data.x,
            y: Tank1Data.y
        }

        if (Info.Path.length == 0 || frame - 200 > Info.Pathframe) {
            Info.Pathframe = frame;
            Info.Path = FindConnectingPath(Point1, Point2);
            Info.PathIndex = 1;
        } else {
            x = ((Info.Path[Info.PathIndex].x) * 50 + 25) - Info.x;
            y = Info.y - ((Info.Path[Info.PathIndex].y) * 50 + 25);
            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if (Info.PathIndex < Info.Path.length - 1 && distance < 30) {
                Info.PathIndex += 1;
            }
            Info.speed = 3;
            Theta = Atan2(x, y);

            if (Theta > Info.angle) {
                AngleDif = Theta - Info.angle;
                if (AngleDif > Math.PI) {
                    Info.moveAngle = -5;
                } else {
                    Info.moveAngle = 5;
                }
            } else if (Theta < Info.angle) {
                AngleDif = Info.angle - Theta;
                if (AngleDif > Math.PI) {
                    Info.moveAngle = 5;
                } else {
                    Info.moveAngle = -5;
                }
            } else {
                AngleDif = 0;
            }
            if (AngleDif < Math.PI / 180 * 5) {
                Info.moveAngle = 0;
                Info.angle = Theta
            }
        }


        return Info;


    } else if (Info.AIType == "Flee") {
        Info.speed = 3;
    }
    return Info;
}

function updateCoOpAI(Info) {
    var Theta, AngleDif, x, y
    if (Info.angle >= Math.PI * 2) {
        Info.angle = Info.angle - Math.PI * 2
    } else if (Info.angle < 0) {
        Info.angle = Info.angle + Math.PI * 2;
    }

    if (Info.AIType == "Turret") {
        // + y means down so y is flipped
        var x2, y2, distance, distance2
        if (Info.Target == 1) {
            x = Tank1Data.x - Info.x;
            y = Info.y - Tank1Data.y;
            x2 = Tank2Data.x - Info.x;
            y2 = Info.y - Tank2Data.y;
            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            distance2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2));
            if ((distance > distance2 && (Info.TargetSwitch + 100) < frame) || !Tank1Data.Alive) {
                x = x2;
                y = y2;
                Info.Target = 2;
                Info.TargetSwitch = frame;
            }
        } else if (Info.Target == 2) {
            x = Tank2Data.x - Info.x;
            y = Info.y - Tank2Data.y;
            x2 = Tank1Data.x - Info.x;
            y2 = Info.y - Tank1Data.y;
            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            distance2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2));
            if ((distance > distance2 && (Info.TargetSwitch + 100) < frame) || !Tank2Data.Alive) {
                x = x2;
                y = y2;
                Info.Target = 1;
                Info.TargetSwitch = frame;
            }
        }

        Theta = Atan2(x, y);

        if (Theta > Info.angle) {
            AngleDif = Theta - Info.angle;
            if (AngleDif > Math.PI) {
                Info.moveAngle = -5;
            } else {
                Info.moveAngle = 5;
            }
        } else if (Theta < Info.angle) {
            AngleDif = Info.angle - Theta;
            if (AngleDif > Math.PI) {
                Info.moveAngle = 5;
            } else {
                Info.moveAngle = -5;
            }
        } else {
            AngleDif = 0;
        }
        if (AngleDif < Math.PI / 180 * 5) {
            Info.moveAngle = 0;
            Info.angle = Theta
        }
    } else if (Info.AIType == "Target") {
        if (Info.speed != 0 && Info.path == "Line") {
            // + y means down so y is flipped
            if (Info.Direction == "Pos") {
                x = Info.x1 - Info.x;
                y = Info.y - Info.y1;
            } else {
                x = Info.x2 - Info.x;
                y = Info.y - Info.y2;
            }

            Theta = Math.atan2(x, y);

            if (Theta >= Math.PI * 2) {
                Theta = Theta - Math.PI * 2
            } else if (Theta < 0) {
                Theta = Theta + Math.PI * 2;
            } else if (x == 0 && y == 0) {
                if (Info.Direction == "Pos") {
                    Info.Direction = "Neg";
                } else {
                    Info.Direction = "Pos"
                }
                Theta = Info.angle - Math.PI;
            }
            Info.angle = Theta;
        }
    } else if (Info.AIType == "Chase") {
        var x2, y2, distance, distance2, LOS2
        var PathDistance = 0;
        var Path = {
            Shape: "Bullet",
            x: Info.x,
            y: Info.y
        }
        if (Info.Target == 1) {
            x = Tank1Data.x - Info.x;
            y = Info.y - Tank1Data.y;
            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            Theta = Atan2(x, y);

            if (Tank2Data.Alive) {
                x2 = Tank2Data.x - Info.x;
                y2 = Info.y - Tank2Data.y;
                distance2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2));
                Theta2 = Atan2(x2, y2);
                LOS2 = true;
                while (distance2 - PathDistance >= 5) {
                    Path.x += 5 * Math.sin(Theta);
                    Path.y -= 5 * Math.cos(Theta);
                    PathDistance += 5;
                    if (WallCheck(Path, walls)) {
                        LOS2 = false;
                        break;
                    }
                }
            } else {
                LOS2 = false;
                distance2 = 1000;
            }
            // Reset Data and check if we can see the target tank
            PathDistance = 0;
            Path.x = Info.x;
            Path.y = Info.y;

            while (distance - PathDistance >= 5) {
                Path.x += 5 * Math.sin(Theta);
                Path.y -= 5 * Math.cos(Theta);
                PathDistance += 5;
                if (WallCheck(Path, walls)) {
                    if (!LOS2) {
                        Info.AIType = "PathFind";
                        return Info;
                    }
                    Theta = Theta2;
                    distance = distance2;
                    x = x2;
                    y = y2;
                    Info.Target = 2;
                    Info.TargetSwitch = frame;
                }
            }
            
            if ((distance > distance2 && (Info.TargetSwitch + 100) < frame && Tank2Data.Alive && LOS2) || !Tank1Data.Alive) {
                Theta = Theta2;
                distance = distance2;
                x = x2;
                y = y2;
                Info.Target = 2;
                Info.TargetSwitch = frame;
            }
        } else if (Info.Target == 2) {
            x = Tank2Data.x - Info.x;
            y = Info.y - Tank2Data.y;
            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            Theta = Atan2(x, y);

            if (Tank1Data.Alive) {
                x2 = Tank1Data.x - Info.x;
                y2 = Info.y - Tank1Data.y;
                distance2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2));
                Theta2 = Atan2(x2, y2);

                LOS2 = true;
                while (distance2 - PathDistance >= 5) {
                    Path.x += 5 * Math.sin(Theta);
                    Path.y -= 5 * Math.cos(Theta);
                    PathDistance += 5;
                    if (WallCheck(Path, walls)) {
                        LOS2 = false;
                        break;
                    }
                }
            } else {
                LOS2 = false;
                distance2 = 1000;
            }
            
            PathDistance = 0;
            Path.x = Info.x;
            Path.y = Info.y;

            while (distance - PathDistance >= 5) {
                Path.x += 5 * Math.sin(Theta);
                Path.y -= 5 * Math.cos(Theta);
                PathDistance += 5;
                if (WallCheck(Path, walls)) {
                    if (!LOS2) {
                        Info.AIType = "PathFind";
                        return Info;
                    }
                    Theta = Theta2;
                    distance = distance2;
                    x = x2;
                    y = y2;
                    Info.Target = 2;
                    Info.TargetSwitch = frame;
                }
            }

            if ((distance > distance2 && (Info.TargetSwitch + 100) < frame && Tank1Data.Alive && LOS2) || !Tank2Data.Alive) {
                Theta = Theta2;
                distance = distance2;
                x = x2;
                y = y2;
                Info.Target = 1;
                Info.TargetSwitch = frame;
            }
        }



        if (Theta > Info.angle) {
            AngleDif = Theta - Info.angle;
            if (AngleDif > Math.PI) {
                Info.moveAngle = -5;
            } else {
                Info.moveAngle = 5;
            }
        } else if (Theta < Info.angle) {
            AngleDif = Info.angle - Theta;
            if (AngleDif > Math.PI) {
                Info.moveAngle = 5;
            } else {
                Info.moveAngle = -5;
            }
        } else {
            AngleDif = 0;
        }
        if (AngleDif < Math.PI / 180 * 5) {
            Info.moveAngle = 0;
            var Oldangle = Info.angle;
            Info.angle = Theta
            if (WallCheck(Info, walls) || TanksOverlap(Info)) {
                Info.angle = Oldangle;
            }
        }

        if (distance <= 250 && Info.speed > -3) {
            Info.speed = Info.speed - .1;
        } else if (Info.speed < 3) {
            Info.speed = Info.speed + .1;
        }

        for (i = 0; i < Bullets.length; i += 1) {
            x = Info.x - Bullets[i].x;
            y = Bullets[i].y - Info.y;
            Theta = Atan2(x, y);
            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if (Math.abs(Math.abs(Bullets[i].angle) - Theta) < Math.PI * 30 / 180 && distance < 150) {
                Info.AIType = "Dodge";
                break;
            }
        }

    } else if (Info.AIType == "Dodge") {
        var i, ii, distance
        var Distances = [];
        var indexes = [];
        var Path = false;
        for (i = 0; i < Bullets.length; i += 1) {
            x = Info.x - Bullets[i].x;
            y = Bullets[i].y - Info.y;
            Theta = Atan2(x, y);
            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

            if (Math.abs(Math.abs(Bullets[i].angle) - Theta) < Math.PI * 25 / 180 && distance < 150) {
                Path = true;
                Distances.push(distance);
                indexes.push(i);
            }
        }
        ii = indexOfMin(Distances);
        i = indexes[ii];
        if (Path == false) {
            Info.AIType = "Chase";
            return Info;
        }

        Info.speed = -3;

        if (Theta > Bullets[i].angle) {
            Theta = Theta - Math.PI / 2;
        } else {
            Theta = Theta + Math.PI / 2
        }

        if (Theta >= Math.PI * 2) {
            Theta = Theta - Math.PI * 2
        } else if (Theta < 0) {
            Theta = Theta + Math.PI * 2;
        }

        if (Theta > Info.angle) {
            AngleDif = Theta - Info.angle;
            if (AngleDif > Math.PI) {
                Info.moveAngle = -5;
            } else {
                Info.moveAngle = 5;
            }
        } else if (Theta < Info.angle) {
            AngleDif = Info.angle - Theta;
            if (AngleDif > Math.PI) {
                Info.moveAngle = 5;
            } else {
                Info.moveAngle = -5;
            }
        } else {
            AngleDif = 0;
        }

        if (AngleDif < Math.PI / 180 * 5) {
            Info.moveAngle = 0;
            var Oldangle = Info.angle;
            Info.angle = Theta
            if (WallCheck(Info, walls) || TanksOverlap(Info)) {
                Info.angle = Oldangle;
            }
        }
    } else if (Info.AIType == "PathFind") {

        var PathDistance, distance, Path, LOS, x2, y2, distance2, PathDistance, Theta2

        for (i = 0; i < Bullets.length; i += 1) { // Check if it needs to switch to dodge mode
            x = Info.x - Bullets[i].x;
            y = Bullets[i].y - Info.y;
            Theta = Atan2(x, y);
            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if (Math.abs(Math.abs(Bullets[i].angle) - Theta) < Math.PI * 25 / 180 && distance < 150) {
                Info.AIType = "Dodge";
                Info.Path = [];
                return Info;
            }
        }
        x = Tank1Data.x - Info.x;
        y = Info.y - Tank1Data.y;
        distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        Theta = Atan2(x, y);

        x2 = Tank2Data.x - Info.x;
        y2 = Info.y - Tank2Data.y;
        distance2 = Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2));
        PathDistance = 0;
        Theta2 = Atan2(x2, y2);

        Path = {
            Shape: "Bullet",
            x: Info.x,
            y: Info.y
        }
        if (Tank1Data.Alive) {
            LOS = true;
            while (LOS == true && distance - PathDistance >= 5) {
                Path.x += 5 * Math.sin(Theta);
                Path.y -= 5 * Math.cos(Theta);
                PathDistance += 5;
                if (WallCheck(Path, walls)) {
                    LOS = false;
                    break;
                }
            }
        } else {
            LOS = false
            Info.Target = 2;
        }

        if (LOS) {
            Info.AIType = "Chase";
            Info.Target = 1;
            Info.Path = [];
            return Info;
        }
        PathDistance = 0;
        Path.x = Info.x;
        Path.y = Info.y;

        if (Tank2Data.Alive) {
            Los = true;
            while (distance2 - PathDistance >= 5) {
                Path.x += 5 * Math.sin(Theta2);
                Path.y -= 5 * Math.cos(Theta2);
                PathDistance += 5;
                if (WallCheck(Path, walls)) {// says I hit a wall trying to go on a straight path that means stay on pathfind not switch
                    Los = false;
                    break;
                }
            }
            if (Los) {
                Info.AIType = "Chase";
                Info.Target = 2;
                Info.Path = [];
                return Info;
            }
        } else {
            Info.Target = 1;
        }

        Info.FireRate = 100;

        var Point1 = {
            x: Info.x,
            y: Info.y
        }

        if (Info.Target == 1) {
            var Point2 = {
                x: Tank1Data.x,
                y: Tank1Data.y
            }
        } else if (Info.Target == 2) {
            var Point2 = {
                x: Tank2Data.x,
                y: Tank2Data.y
            }
        }

        if (Info.Path.length == 0 || frame - 200 > Info.Pathframe) {
            Info.Pathframe = frame;
            Info.Path = FindConnectingPath(Point1, Point2);
            Info.PathIndex = 1;
        } else {
            x = ((Info.Path[Info.PathIndex].x) * 50 + 25) - Info.x;
            y = Info.y - ((Info.Path[Info.PathIndex].y) * 50 + 25);
            distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            if (Info.PathIndex < Info.Path.length - 1 && distance < 25) {
                Info.PathIndex += 1;
            }
            Info.speed = 3;
            Theta = Atan2(x, y);

            if (Theta > Info.angle) {
                AngleDif = Theta - Info.angle;
                if (AngleDif > Math.PI) {
                    Info.moveAngle = -5;
                } else {
                    Info.moveAngle = 5;
                }
            } else if (Theta < Info.angle) {
                AngleDif = Info.angle - Theta;
                if (AngleDif > Math.PI) {
                    Info.moveAngle = 5;
                } else {
                    Info.moveAngle = -5;
                }
            } else {
                AngleDif = 0;
            }
            if (AngleDif < Math.PI / 180 * 5) {
                Info.moveAngle = 0;
                Info.angle = Theta
            }
        }


        return Info;
    }

    return Info;
}

function drawTank(image, Info) {
    // works on any image given height width angle and position

    // save the current coordinate system 
    // before we screw with it
    myGameArea.context.save();

    // move to the middle of where we want to draw our image
    myGameArea.context.translate(Info.x, Info.y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    myGameArea.context.rotate(Info.angle);

    // draw it up and to the left by half the width
    // and height of the image 
    myGameArea.context.drawImage(image, -(image.width / 2), -(image.height / 2));

    // and restore the coords to how they were when we began
    myGameArea.context.restore();
}

function drawWall(image, Info) {
    // works on any image given height width angle and position

    // save the current coordinate system 
    // before we screw with it
    myGameArea.context.save();

    // move to the middle of where we want to draw our image
    myGameArea.context.translate(Info.x, Info.y);

    // rotate around that point, converting our 
    // angle from degrees to radians 
    myGameArea.context.rotate(Info.angle);

    // draw it up and to the left by half the width
    // and height of the image 
    myGameArea.context.drawImage(image, -(Info.width / 2), -(Info.height / 2), Info.width, Info.height);

    // and restore the coords to how they were when we began
    myGameArea.context.restore();
}

function drawWallsAndBullets() {
    for (let i = 0; i < Bullets.length; i += 1) {
        Bullets[i].x += Math.sin(Bullets[i].angle) * 4.5;
        Bullets[i].y += Math.cos(Bullets[i].angle) * -4.5;

        if (0 >= Bullets[i].x || Bullets[i].x >= Thecanvas.width || 0 >= Bullets[i].y || Bullets[i].y >= Thecanvas.height) {
            Bullets.splice(i, 1);
            i = i - 1;
        } else {
            Bullets[i].update();
        }
    }
    for (let i = 0; i < walls.length; i++) {
        drawWall(walls[i].img, walls[i]);
    }
}

function AiDraw() {
    var x, y;
    for (let k = 0; k < AIEnemyData.length; k += 1) {
        if (frame - AIEnemyData[k].FireRate > AIEnemyData[k].Fireframe && AIEnemyData[k].AIType != "Target") {
            AIEnemyData[k].Fireframe = frame;
            if (AIEnemyData[k].Shape == "Rect") {
                x = AIEnemyData[k].x + Math.sin(AIEnemyData[k].angle) * (AIEnemyData[k].Th + 10);
                y = AIEnemyData[k].y - Math.cos(AIEnemyData[k].angle) * (AIEnemyData[k].Th + 10);
            } else if (AIEnemyData[k].Shape == "Circle") {
                x = AIEnemyData[k].x + Math.sin(AIEnemyData[k].angle) * (AIEnemyData[k].radius);
                y = AIEnemyData[k].y - Math.cos(AIEnemyData[k].angle) * (AIEnemyData[k].radius);
            }
            Bullets.push(new component(2, 4, "green", x, y, AIEnemyData[k].angle, "Bullet"));
        }
        if (SoloGame) {
            AIEnemyData[k] = updateAI(AIEnemyData[k]);
        } else {
            AIEnemyData[k] = updateCoOpAI(AIEnemyData[k]);
        }
        AIEnemyData[k] = update(AIEnemyData[k]);
        drawTank(AIEnemyData[k].img, AIEnemyData[k])
    }
}

function VSLevelSelectorScreen() {
    document.getElementById("Menu").hidden = true;
    document.getElementById("VS_Level_List").hidden = false;

    try {
        if (localStorage.SavedLevels) {
            SavedLevels = JSON.parse(localStorage.SavedLevels);
        }
        for (let i = 0; i < SavedLevels.length; i++) {
            if (SavedLevels[i].Type == "VS") {
                document.getElementById("VSPlayerLevel" + (i + 1)).hidden = false;
            }
        }
    } catch (err) {

    }
}

function LevelSelectorScreen() {
    try {
        if (localStorage.Max_Level) {
            Max_Level = localStorage.Max_Level;
        } else {
            localStorage.Max_Level = 1;
            Max_Level = 1;
        }
    } catch (err) {
        Max_Level = 10;
    }
    document.getElementById("Menu").hidden = true;
    document.getElementById("Solo_Level_List").hidden = false;
    
    try {
        if (localStorage.SavedLevels) {
            SavedLevels = JSON.parse(localStorage.SavedLevels);
        }
        for (let i = 0; i < SavedLevels.length; i++) {
            if (SavedLevels[i].Type == "Solo") {
                document.getElementById("SoloPlayerLevel" + (i+1)).hidden = false;
            }
        }
    } catch (err) {

    }

    for (let i = 2; i <= Max_Level && Max_Level <= 10; i++) {
        document.getElementById("Level" + i).disabled = false;
    }
}

function CoOpLevelSelectorScreen() {
    try {
        if (localStorage.CoOpMax_Level) {
            CoOpMax_Level = localStorage.CoOpMax_Level;
        } else {
            localStorage.CoOpMax_Level = 1;
            CoOpMax_Level = 1;
        }
    } catch (err) {
        CoOpMax_Level = 4;
    }

    try {
        if (localStorage.SavedLevels) {
            SavedLevels = JSON.parse(localStorage.SavedLevels);
        }
        for (let i = 0; i < SavedLevels.length; i++) {
            if (SavedLevels[i].Type == "CoOp") {
                document.getElementById("CoOpPlayerLevel" + (i + 1)).hidden = false;
            }
        }
    } catch (err) {

    }
    document.getElementById("Menu").hidden = true;
    document.getElementById("CoOp_Level_List").hidden = false;

    for (let i = 2; i <= CoOpMax_Level && CoOpMax_Level <= 4; i++) {
        document.getElementById("CoOpLevel" + i).disabled = false;
    }
}

function SoloLevelSelector(selectedLevel) {
    Tank1Data = {
        x: 100,
        y: 300,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 40,
        Shape: "Rect",
        frame: 0,
        Alive: true
    }
    switch (selectedLevel) {
        case 0:
            walls = [];
            AIEnemyData = [];
            break;
        case 1:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 70 + Math.random() * 500,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 22,
                AIType: "Target",
                Shape: "Circle",
                FireRate: "never",
                frame: 0
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Target.png";
            }
            break;
        case 2:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 70 + Math.random() * 500,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 22,
                AIType: "Target",
                Shape: "Circle",
                FireRate: "never",
                frame: 0
            },
            {
                x: 900 + Math.random() * 300,
                y: 70 + Math.random() * 500,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 22,
                AIType: "Target",
                Shape: "Circle",
                FireRate: "never",
                frame: 0
            }
            ];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Target.png";
            }
            break;

        case 3:
            walls = [];
            AIEnemyData = [{
                x: 1000,
                y: 320,
                x1: 1000,
                y1: 100,
                x2: 1000,
                y2: 500,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 5,
                Direction: "Pos",
                path: "Line",
                radius: 23,
                AIType: "Target",
                Shape: "Circle",
                FireRate: "never",
                frame: 0
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Target.png";
            }
            break;
        case 4:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 70 + Math.random() * 500,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 30,
                AIType: "Turret",
                Shape: "Circle",
                FireRate: 25,
                Fireframe: 0
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Turret.png";
            }
            break;

        case 5:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 400,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 30,
                AIType: "Turret",
                Shape: "Circle",
                FireRate: 30,
                Fireframe: 0
            }, {
                x: 700 + Math.random() * 500,
                y: 200,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 30,
                AIType: "Turret",
                Shape: "Circle",
                FireRate: 30,
                Fireframe: 0
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Turret.png";
            }
            break;

        case 6:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 70 + Math.random() * 500,
                Lw: 15,
                Rw: 15,
                Th: 15,
                Bh: 30,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 2,
                AIType: "Chase",
                Shape: "Rect",
                FireRate: 30,
                Fireframe: 0,
                Pathframe: 0,
                Path: []
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Tank3.png";
            }
            break;
        case 7:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 400,
                Lw: 15,
                Rw: 15,
                Th: 15,
                Bh: 30,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 2,
                AIType: "Chase",
                Shape: "Rect",
                FireRate: 30,
                Fireframe: 0,
                Pathframe: 0,
                Path: []
            }, {
                x: 700 + Math.random() * 500,
                y: 200,
                Lw: 15,
                Rw: 15,
                Th: 15,
                Bh: 30,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 2,
                AIType: "Chase",
                Shape: "Rect",
                FireRate: 30,
                Fireframe: 0,
                Pathframe: 0,
                Path: []
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Tank3.png";
            }
            break;
        case 8:
            walls = [];
            AIEnemyData = [{
                x: 1200,
                y: 100,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 30,
                AIType: "Turret",
                Shape: "Circle",
                FireRate: 50,
                Fireframe: 0
            }, {
                x: 1000,
                y: 350,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 40,
                AIType: "Turret",
                Shape: "Circle",
                FireRate: 30,
                Fireframe: 0
            }, {
                x: 1000,
                y: 250,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 40,
                AIType: "Turret",
                Shape: "Circle",
                FireRate: 30,
                Fireframe: 0
            }, {
                x: 1200,
                y: 500,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 50,
                AIType: "Turret",
                Shape: "Circle",
                FireRate: 30,
                Fireframe: 0
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Turret.png";
            }
            break;
        case 9:
            walls = [{
                x: 650,
                y: 300,
                width: 15,
                height: 200,
                angle: 0
            }];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 400,
                Lw: 15,
                Rw: 15,
                Th: 15,
                Bh: 30,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 2,
                AIType: "Chase",
                Shape: "Rect",
                FireRate: 30,
                Fireframe: 10,
                Pathframe: 0,
                Path: []
            }, {
                x: 700 + Math.random() * 500,
                y: 200,
                Lw: 15,
                Rw: 15,
                Th: 15,
                Bh: 30,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 2,
                AIType: "Chase",
                Shape: "Rect",
                FireRate: 30,
                Fireframe: 10,
                Pathframe: 0,
                Path: []
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Tank3.png";
            }
            break;
        case 10:
            Tank1Data.x = 80;
            walls = [
                {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 200,
                    y: 450
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 200,
                    y: 150
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 330,
                    y: 300
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 460,
                    y: 150
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 460,
                    y: 450
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 590,
                    y: 300
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 720,
                    y: 150
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 720,
                    y: 450
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 850,
                    y: 300
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 980,
                    y: 150
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 980,
                    y: 450
                }
            ]
            AIEnemyData = [{
                x: 1150,
                y: 300,
                Lw: 15,
                Rw: 15,
                Th: 15,
                Bh: 30,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 2,
                AIType: "Chase",
                Shape: "Rect",
                FireRate: 30,
                Fireframe: 10,
                Pathframe: 0,
                Path: []
            }]
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Tank3.png";
            }
            break;
        default:
            alert("All Levels Completed!!!");
            Menu();
            break;
    }
    for (let i = 0; i < walls.length; i++) {
        walls[i].img = new Image();
        walls[i].img.src = "images/Wall.png";
    }
    DetermineGridMap();
}

function CoOpLevelSelector(selectedLevel) {
    Tank1Data = {
        x: 100,
        y: 200,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: true
    };
    Tank2Data = {
        x: 100,
        y: 400,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: true,
    };
    switch (selectedLevel) {
        case 1:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 70 + Math.random() * 500,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 22,
                AIType: "Target",
                Shape: "Circle",
                FireRate: "never",
                frame: 0
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Target.png";
            }
            break;
        case 2:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 70 + Math.random() * 500,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 22,
                AIType: "Target",
                Shape: "Circle",
                FireRate: "never",
                frame: 0
            }, {
                x: 900 + Math.random() * 300,
                y: 70 + Math.random() * 500,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 22,
                AIType: "Target",
                Shape: "Circle",
                FireRate: "never",
                frame: 0
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Target.png";
            }
            break;
        case 3:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 400,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 30,
                AIType: "Turret",
                Shape: "Circle",
                FireRate: 30,
                frame: 0,
                Fireframe: 0,
                Target: 1,
                TargetSwitch: 0
            }, {
                x: 700 + Math.random() * 500,
                y: 200,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 0,
                radius: 30,
                AIType: "Turret",
                Shape: "Circle",
                FireRate: 30,
                frame: 0,
                Fireframe: 0,
                Target: 2,
                TargetSwitch: 0
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Turret.png";
            }
            break;

        case 4:
            walls = [];
            AIEnemyData = [{
                x: 900 + Math.random() * 300,
                y: 400,
                Lw: 15,
                Rw: 15,
                Th: 15,
                Bh: 30,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 2,
                AIType: "Chase",
                Shape: "Rect",
                FireRate: 30,
                frame: 0,
                Fireframe: 0,
                Target: 1,
                TargetSwitch: 0,
                Path: []
            }, {
                x: 700 + Math.random() * 500,
                y: 200,
                Lw: 15,
                Rw: 15,
                Th: 15,
                Bh: 30,
                angle: -Math.PI / 2,
                moveAngle: 0,
                speed: 2,
                AIType: "Chase",
                Shape: "Rect",
                FireRate: 30,
                frame: 0,
                Fireframe: 0,
                Target: 2,
                TargetSwitch: 0,
                Path: []
            }];
            for (let i = 0; i < AIEnemyData.length; i++) {
                AIEnemyData[i].img = new Image();
                AIEnemyData[i].img.src = "images/Tank3.png";
            }
            break;
        default:
            alert("All Levels Completed!!!")
            Menu();
            break;
    }
    for (let i = 0; i < walls.length; i++) {
        walls[i].img = new Image();
        walls[i].img.src = "images/Wall.png";
    }
}

function VSMapSelect(selectedLevel) { // selects the map to use for the vs game type currently. using random numbers
    Tank1Data = {
        x: 100,
        y: 300,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 40,
        Shape: "Rect",
        frame: 0,
        Alive: true
    }
    Tank2Data = {
        x: 1200,
        y: 300,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: -Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: true
    }
    AIEnemyData = [];
    walls = [];
    switch (selectedLevel) {
        case 1:
            walls = [{
                x: 650,
                y: 300,
                width: 15,
                height: 200,
                angle: 0
            }];
            break;

        case 2:
            break;
        case 3:
            walls = [{
                x: 350,
                y: 300,
                width: 15,
                height: 200,
                angle: 0
            }, {
                x: 950,
                y: 300,
                width: 15,
                height: 200,
                angle: 0
            }]
            break;
        case 4:
            walls = [{
                x: 650,
                y: 300,
                width: 15,
                height: 800,
                angle: 90
            }];
            break;
        case 5:
            walls = [
                {
                    x: 950,
                    y: 425,
                    width: 15,
                    height: 400,
                    angle: 90
                }, {
                    x: 450,
                    y: 175,
                    width: 15,
                    height: 400,
                    angle: 90
                }
            ];
            break;
        case 6:
            walls = [
                {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 200,
                    y: 450
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 200,
                    y: 150
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 330,
                    y: 300
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 460,
                    y: 150
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 460,
                    y: 450
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 590,
                    y: 300
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 720,
                    y: 150
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 720,
                    y: 450
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 850,
                    y: 300
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 980,
                    y: 150
                }, {
                    Shape: "wall",
                    angle: 0,
                    height: 200,
                    width: 15,
                    x: 980,
                    y: 450
                }
            ]
            break;
    }
    for (let i = 0; i < walls.length; i++) {
        walls[i].img = new Image();
        walls[i].img.src = "images/Wall.png";
    }
}

function LevelEditor() {
    document.getElementById("Menu").hidden = true;
    document.getElementById("LevelEditorArea").hidden = false;
    document.getElementById("Pause2-Button").disabled = false;
    document.getElementById("Play2-Button").disabled = true;
    document.getElementById("Enemy-selector").value = 0;
    document.getElementById("Pause2-Button").disabled = false;
    VsGame = false; // Game type
    SoloGame = false; // Game type
    CoOpGame = false; // Game type
    Level_Editor = true; // Game type
    Bullets = [];
    walls = []; // initializes the walls
    AIEnemyData = []; // initializes the Enemies
    Tank1 = new Image(); // used when creating images instead of components
    Tank1.src = Player1Tank.Tank; // used to define the images code source
    Tank1Data = {
        x: 100, // position
        y: 300, // position
        Lw: 15, // left width
        Rw: 15, // right width
        Th: 15, // top height
        Bh: 30, // bottom height these are needed do to the not centered image of the tank
        angle: Math.PI / 2, // angle it faces
        moveAngle: 0, // rate of change of the angle degrees
        speed: 0, // movement speed in pixels
        width: 30, // width of image
        height: 55, // height of image
        Shape: "Rect", // defines shape for hiting things
        frame: 0, // defines the rame it last shot
        Alive: true // Used in CoOp to determine the target
    }
    Tank2 = new Image();
    Tank2.src = Player2Tank.Tank;
    Tank2Data = {
        x: 1200,
        y: 300,
        Lw: 15,
        Rw: 15,
        Th: 15,
        Bh: 30,
        angle: -Math.PI / 2,
        moveAngle: 0,
        speed: 0,
        width: 30,
        height: 55,
        Shape: "Rect",
        frame: 0,
        Alive: false
    }
    try {
        if (localStorage.SavedLevels) {
            SavedLevels = JSON.parse(localStorage.SavedLevels);
        }
        for (let i = 0; i < SavedLevels.length; i++) {
            document.getElementById("EditPlayerLevel" + (i + 1)).hidden = false;
            document.getElementById("DeletePlayerLevel" + (i + 1)).hidden = false;
        }
    } catch (err) {

    }
    myGameArea.start() // starts the game loop and initializes more data
    document.getElementById("GameArea").hidden = false; // ensures the game area is not hidden
}

function updateLevelEditorArea() {
    frame = frame + 1;
    myGameArea.clear();
    Tank1Data.moveAngle = 0;
    Tank1Data.speed = 0;

    if (myGameArea.keys && myGameArea.keys[65]) {
        Tank1Data.moveAngle = -5;
    } else if (myGameArea.keys && myGameArea.keys[68]) {
        Tank1Data.moveAngle = 5;
    }

    if (myGameArea.keys && myGameArea.keys[87]) {
        Tank1Data.speed = 3;
    } else if (myGameArea.keys && myGameArea.keys[83]) {
        Tank1Data.speed = -3;
    }

    Tank1Data = update(Tank1Data);
    drawTank(Tank1, Tank1Data);
    if (LevelEditorInfo.Type == "CoOp" || LevelEditorInfo.Type == "VS") {
        Tank2Data.moveAngle = 0;
        Tank2Data.speed = 0;
        if (myGameArea.keys && myGameArea.keys[37]) {
            Tank2Data.moveAngle = -5;
        } else if (myGameArea.keys && myGameArea.keys[39]) {
            Tank2Data.moveAngle = 5;
        }

        if (myGameArea.keys && myGameArea.keys[38]) {
            Tank2Data.speed = 3;
        } else if (myGameArea.keys && myGameArea.keys[40]) {
            Tank2Data.speed = -3;
        }
        Tank2Data = update(Tank2Data);
        drawTank(Tank2, Tank2Data);
    }

    for (let i = 0; i < AIEnemyData.length; i += 1) {
        AIEnemyData[i] = updateCoOpAI(AIEnemyData[i]);
        AIEnemyData[i] = update(AIEnemyData[i]);
        drawTank(AIEnemyData[i].img, AIEnemyData[i]);
    }

    drawWallsAndBullets();
}

function LevelEditorSelect(Option) {
    var Selector, value
    if (Option == "Type") {
        Selector = document.getElementById("Solo-selector");
        value = Selector.value;
        if (value == 0) {
            LevelEditorInfo.Type = "Solo";
            Tank2Data.Alive = false;
        } else if (value == 1) {
            LevelEditorInfo.Type = "CoOp";
            Tank2Data.Alive = true;
        } else if (value == 2) {
            LevelEditorInfo.Type = "VS";
            Tank2Data.Alive = true;
        }
    } else if (Option == "Wall") {
        Selector = document.getElementById("Wall-selector");
        value = Selector.value;
        if (value == 0) {
            LevelEditorInfo.Wall = "BlackLine";
        }
    } else if (Option == "Enemy") {
        Selector = document.getElementById("Enemy-selector");
        value = Selector.value;
        if (value == 0) {
            LevelEditorInfo.Enemy = "Target";
        } else if (value == 1) {
            LevelEditorInfo.Enemy = "Turret";
        } else if (value == 2) {
            LevelEditorInfo.Enemy = "Tank";
        }
    }
}

function AddWall() {
    if (LevelEditorInfo.Wall == "BlackLine") {
        var Width = Number(document.getElementById("Wall-Width-Field").value)
        var Height = Number(document.getElementById("Wall-Height-Field").value)
        var newWall = {
            x: 650,
            y: 300,
            width: Width,
            height: Height,
            angle: 0,
            Shape: "wall",
            img: new Image()
        }
        walls.push(newWall)
        walls[walls.length - 1].img.src = "images/Wall.png";
    }
    DetermineGridMap()
    setTimeout(LevelEditorDrawing, 50);
}

function AddEnemy() {
    var NewEnemy = {
        x: 900,
        y: 400,
        angle: Math.PI * 3 / 2,
        moveAngle: 0,
        speed: 0,
        frame: 0,
        img: new Image()
    }
    if (LevelEditorInfo.Enemy == "Target") {

        NewEnemy.radius = 22;
        NewEnemy.AIType = "Target";
        NewEnemy.Shape = "Circle";
        NewEnemy.FireRate = "never";
        
        AIEnemyData.push(NewEnemy);
        AIEnemyData[AIEnemyData.length - 1].img.src = "images/Target.png"
    } else if (LevelEditorInfo.Enemy == "Turret") {
        NewEnemy.radius = 30;
        NewEnemy.AIType = "Turret";
        NewEnemy.Shape = "Circle";
        NewEnemy.FireRate = 30;
        NewEnemy.Target = Math.round(1 + Math.random());
        NewEnemy.TargetSwitch = 0;

        AIEnemyData.push(NewEnemy);
        AIEnemyData[AIEnemyData.length - 1].img.src = "images/Turret.png"
    } else if (LevelEditorInfo.Enemy == "Tank") {
        NewEnemy.Lw = 15;
        NewEnemy.Rw = 15;
        NewEnemy.Th = 15;
        NewEnemy.Bh = 30;
        NewEnemy.AIType = "Chase";
        NewEnemy.Shape = "Rect";
        NewEnemy.FireRate = 30;
        NewEnemy.Target = Math.round(1 + Math.random());
        NewEnemy.TargetSwitch = 0
        NewEnemy.Path = [];

        AIEnemyData.push(NewEnemy);
        AIEnemyData[AIEnemyData.length - 1].img.src = "images/Tank3.png"
    }
    setTimeout(LevelEditorDrawing, 50);
}

function crashWith(obj, otherobj) { // used to determine if a point is inside another object bullets, line of sight, mouse click
    var trhy, tlhy, brhy, blhy, angletopright, angletopleft, anglebottomright, anglebottomleft, mytopright, mytopleft, mybottomleft, mybottomright, d1, d2, d3, d4
    var crash = false;
    // moves to the front of the otherobj uses point to determine crash
    var other = [otherobj.x + otherobj.height / 2 * Math.sin(otherobj.angle), otherobj.y - otherobj.height / 2 * Math.cos(otherobj.angle)];
    if (obj.Shape == "Rect") {
        trhy = Math.sqrt(Math.pow(obj.Th, 2) + Math.pow(obj.Lw, 2));
        tlhy = Math.sqrt(Math.pow(obj.Th, 2) + Math.pow(obj.Rw, 2));
        brhy = Math.sqrt(Math.pow(obj.Bh, 2) + Math.pow(obj.Rw, 2));
        blhy = Math.sqrt(Math.pow(obj.Bh, 2) + Math.pow(obj.Lw, 2));

        angletopright = Math.atan2(obj.Th, obj.Rw) + Math.PI / 2 - obj.angle;
        angletopleft = Math.atan2(obj.Th, -obj.Lw) + Math.PI / 2 - obj.angle;
        anglebottomright = Math.atan2(-obj.Bh, obj.Rw) + Math.PI / 2 - obj.angle;
        anglebottomleft = Math.atan2(-obj.Bh, -obj.Lw) + Math.PI / 2 - obj.angle;

        mytopright = [obj.x + trhy * Math.sin(angletopright), obj.y + trhy * Math.cos(angletopright)];
        mytopleft = [obj.x + tlhy * Math.sin(angletopleft), obj.y + tlhy * Math.cos(angletopleft)];
        mybottomleft = [obj.x + blhy * Math.sin(anglebottomleft), obj.y + blhy * Math.cos(anglebottomleft)];
        mybottomright = [obj.x + brhy * Math.sin(anglebottomright), obj.y + brhy * Math.cos(anglebottomright)];

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

        if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
            crash = true
        }

    } else if (obj.Shape == "Circle") {
        if (Math.sqrt(Math.pow(other[0] - obj.x, 2) + Math.pow(other[1] - obj.y, 2)) < obj.radius) {
            crash = true;
        }
    } else if (obj.Shape == "wall") {
        var hy = Math.sqrt(Math.pow(obj.height, 2) + Math.pow(obj.width, 2));

        angletopright = Math.atan2(obj.height, obj.width) + Math.PI / 2 - obj.angle;
        angletopleft = Math.atan2(obj.height, -obj.width) + Math.PI / 2 - obj.angle;
        anglebottomright = Math.atan2(-obj.height, obj.width) + Math.PI / 2 - obj.angle;
        anglebottomleft = Math.atan2(-obj.height, -obj.width) + Math.PI / 2 - obj.angle;

        mytopright = [obj.x + hy * Math.sin(angletopright), obj.y + hy * Math.cos(angletopright)];
        mytopleft = [obj.x + hy * Math.sin(angletopleft), obj.y + hy * Math.cos(angletopleft)];
        mybottomleft = [obj.x + hy * Math.sin(anglebottomleft), obj.y + hy * Math.cos(anglebottomleft)];
        mybottomright = [obj.x + hy * Math.sin(anglebottomright), obj.y + hy * Math.cos(anglebottomright)];

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

        if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
            crash = true
        }
    }
    return crash;
}

function WallCheck(obj, walls) { // checks if a bullet or a rectangle overlaps a wall
    var Hit = false;
    var wall, trhy, tlhy, brhy, blhy, angletopright, angletopleft, anglebottomright, anglebottomleft, other, Width, Height, d1, d2, d3, d4, topright, topleft, bottomleft, bottomright
    if (obj.Shape == "Rect") {
        var WallPoints

        trhy = Math.sqrt(Math.pow(obj.Th, 2) + Math.pow(obj.Lw, 2))
        tlhy = Math.sqrt(Math.pow(obj.Th, 2) + Math.pow(obj.Rw, 2))
        brhy = Math.sqrt(Math.pow(obj.Bh, 2) + Math.pow(obj.Rw, 2))
        blhy = Math.sqrt(Math.pow(obj.Bh, 2) + Math.pow(obj.Lw, 2))

        angletopright = Math.atan2(obj.Th, obj.Rw) + Math.PI / 2 - obj.angle;
        angletopleft = Math.atan2(obj.Th, -obj.Lw) + Math.PI / 2 - obj.angle;
        anglebottomright = Math.atan2(-obj.Bh, obj.Rw) + Math.PI / 2 - obj.angle;
        anglebottomleft = Math.atan2(-obj.Bh, -obj.Lw) + Math.PI / 2 - obj.angle;

        other = [obj.x + trhy * Math.sin(angletopright), obj.y + trhy * Math.cos(angletopright),
        obj.x + tlhy * Math.sin(angletopleft), obj.y + tlhy * Math.cos(angletopleft),
        obj.x + blhy * Math.sin(anglebottomleft), obj.y + blhy * Math.cos(anglebottomleft),
        obj.x + brhy * Math.sin(anglebottomright), obj.y + brhy * Math.cos(anglebottomright)
        ];

        for (let k = 0; k < walls.length; k++) {
            wall = walls[k]
            Width = wall.width / 2;
            Height = wall.height / 2;
            trhy = Math.sqrt(Math.pow(Height, 2) + Math.pow(Width, 2))
            tlhy = Math.sqrt(Math.pow(Height, 2) + Math.pow(Width, 2))
            brhy = Math.sqrt(Math.pow(Height, 2) + Math.pow(Width, 2))
            blhy = Math.sqrt(Math.pow(Height, 2) + Math.pow(Width, 2))

            angletopright = Math.atan2(Height, Width) + Math.PI / 2 - wall.angle;
            angletopleft = Math.atan2(Height, -Width) + Math.PI / 2 - wall.angle;
            anglebottomright = Math.atan2(-Height, Width) + Math.PI / 2 - wall.angle;
            anglebottomleft = Math.atan2(-Height, -Width) + Math.PI / 2 - wall.angle;

            topright = [wall.x + trhy * Math.sin(angletopright), wall.y + trhy * Math.cos(angletopright)];
            topleft = [wall.x + tlhy * Math.sin(angletopleft), wall.y + tlhy * Math.cos(angletopleft)];
            bottomleft = [wall.x + blhy * Math.sin(anglebottomleft), wall.y + blhy * Math.cos(anglebottomleft)];
            bottomright = [wall.x + brhy * Math.sin(anglebottomright), wall.y + brhy * Math.cos(anglebottomright)];

            for (let i = 0; i <= 6; i += 2) {
                // A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
                // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
                // top left to top right
                d1 = (other[i] - topleft[0]) * (topright[1] - topleft[1]) - (other[1 + i] - topleft[1]) * (topright[0] - topleft[0]);
                // bottom left to bottom right
                d3 = (other[i] - bottomleft[0]) * (bottomright[1] - bottomleft[1]) - (other[1 + i] - bottomleft[1]) * (bottomright[0] - bottomleft[0]);
                // top right to bottom right
                d2 = (other[i] - topright[0]) * (bottomright[1] - topright[1]) - (other[1 + i] - topright[1]) * (bottomright[0] - topright[0]);
                // top left to bottom left
                d4 = (other[i] - topleft[0]) * (bottomleft[1] - topleft[1]) - (other[1 + i] - topleft[1]) * (bottomleft[0] - topleft[0]);

                if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                    Hit = true;
                    return Hit;
                }
            }
            // check if WallPoints are in obj1
            WallPoints = [topright[0], topright[1], topleft[0], topleft[1], bottomleft[0], bottomleft[1], bottomright[0], bottomright[1]]
            for (let i = 0; i <= 6; i += 2) {
                // top left to top right
                d1 = (WallPoints[i] - other[2]) * (other[1] - other[3]) - (WallPoints[1 + i] - other[3]) * (other[0] - other[2]);
                // bottom left to bottom right
                d3 = (WallPoints[i] - other[4]) * (other[7] - other[5]) - (WallPoints[1 + i] - other[5]) * (other[6] - other[4]);
                // top right to bottom right
                d2 = (WallPoints[i] - other[0]) * (other[7] - other[1]) - (WallPoints[1 + i] - other[1]) * (other[6] - other[0]);
                // top left to bottom left
                d4 = (WallPoints[i] - other[2]) * (other[5] - other[3]) - (WallPoints[1 + i] - other[3]) * (other[4] - other[2]);

                if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                    Hit = true;
                    return Hit;
                }
            }
        }
    } else if (obj.Shape == "Bullet") {
        other = [obj.x, obj.y];

        for (let i = 0; i < walls.length; i++) {
            wall = walls[i]
            Width = wall.width / 2;
            Height = wall.height / 2;
            trhy = Math.sqrt(Math.pow(Height, 2) + Math.pow(Width, 2))
            tlhy = Math.sqrt(Math.pow(Height, 2) + Math.pow(Width, 2))
            brhy = Math.sqrt(Math.pow(Height, 2) + Math.pow(Width, 2))
            blhy = Math.sqrt(Math.pow(Height, 2) + Math.pow(Width, 2))


            angletopright = Math.atan2(Height, Width) + Math.PI / 2 - wall.angle;
            angletopleft = Math.atan2(Height, -Width) + Math.PI / 2 - wall.angle;
            anglebottomright = Math.atan2(-Height, Width) + Math.PI / 2 - wall.angle;
            anglebottomleft = Math.atan2(-Height, -Width) + Math.PI / 2 - wall.angle;

            topright = [wall.x + trhy * Math.sin(angletopright), wall.y + trhy * Math.cos(angletopright)];
            topleft = [wall.x + tlhy * Math.sin(angletopleft), wall.y + tlhy * Math.cos(angletopleft)];
            bottomleft = [wall.x + blhy * Math.sin(anglebottomleft), wall.y + blhy * Math.cos(anglebottomleft)];
            bottomright = [wall.x + brhy * Math.sin(anglebottomright), wall.y + brhy * Math.cos(anglebottomright)];

            // A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
            // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)

            // top left to top right
            d1 = (other[0] - topleft[0]) * (topright[1] - topleft[1]) - (other[1] - topleft[1]) * (topright[0] - topleft[0]);
            // bottom left to bottom right
            d3 = (other[0] - bottomleft[0]) * (bottomright[1] - bottomleft[1]) - (other[1] - bottomleft[1]) * (bottomright[0] - bottomleft[0]);
            // top right to bottom right
            d2 = (other[0] - topright[0]) * (bottomright[1] - topright[1]) - (other[1] - topright[1]) * (bottomright[0] - topright[0]);
            // top left to bottom left
            d4 = (other[0] - topleft[0]) * (bottomleft[1] - topleft[1]) - (other[1] - topleft[1]) * (bottomleft[0] - topleft[0]);

            if (((d1 > 0 && d3 < 0) && (d2 > 0 && d4 < 0)) || ((d1 < 0 && d3 > 0) && (d2 < 0 && d4 > 0))) {
                Hit = true
                return Hit;
            }
        }
    }
    return Hit;
}

function TanksOverlap(obj1) { // checks if a Rectangle overlaps the player tanks or the AItanks
    var overlap = false;
    if (obj1.Shape == "Rect") {
        // Define obj1
        var trhy, tlhy, brhy, blhy, angletopright, angletopleft, Obj1topright, Obj1topleft, Obj1bottomright, Obj1Points, Obj2topright, Obj2topleft, Obj2bottomright, d1, d2, d3, d4, Obj2Points

        trhy = Math.sqrt(Math.pow(obj1.Th, 2) + Math.pow(obj1.Lw, 2));
        tlhy = Math.sqrt(Math.pow(obj1.Th, 2) + Math.pow(obj1.Rw, 2));
        brhy = Math.sqrt(Math.pow(obj1.Bh, 2) + Math.pow(obj1.Rw, 2));
        blhy = Math.sqrt(Math.pow(obj1.Bh, 2) + Math.pow(obj1.Lw, 2));

        angletopright = Math.atan2(obj1.Th, obj1.Rw) + Math.PI / 2 - obj1.angle;
        angletopleft = Math.atan2(obj1.Th, -obj1.Lw) + Math.PI / 2 - obj1.angle;
        anglebottomright = Math.atan2(-obj1.Bh, obj1.Rw) + Math.PI / 2 - obj1.angle;
        anglebottomleft = Math.atan2(-obj1.Bh, -obj1.Lw) + Math.PI / 2 - obj1.angle;

        Obj1topright = [obj1.x + trhy * Math.sin(angletopright), obj1.y + trhy * Math.cos(angletopright)];
        Obj1topleft = [obj1.x + tlhy * Math.sin(angletopleft), obj1.y + tlhy * Math.cos(angletopleft)];
        Obj1bottomleft = [obj1.x + blhy * Math.sin(anglebottomleft), obj1.y + blhy * Math.cos(anglebottomleft)];
        Obj1bottomright = [obj1.x + brhy * Math.sin(anglebottomright), obj1.y + brhy * Math.cos(anglebottomright)];

        Obj1Points = [Obj1topright[0], Obj1topright[1], Obj1topleft[0], Obj1topleft[1], Obj1bottomleft[0], Obj1bottomleft[1], Obj1bottomright[0], Obj1bottomright[1]]
        if (VsGame || CoOpGame || LevelEditorInfo.Type == "CoOp") {
            if ((Tank2Data.x != obj1.x || Tank2Data.y != obj1.y) && Tank2Data.Alive) {
                obj2 = Tank2Data;
                trhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Lw, 2));
                tlhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Rw, 2));
                brhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Rw, 2));
                blhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Lw, 2));

                angletopright = Math.atan2(obj2.Th, obj2.Rw) + Math.PI / 2 - obj2.angle;
                angletopleft = Math.atan2(obj2.Th, -obj2.Lw) + Math.PI / 2 - obj2.angle;
                anglebottomright = Math.atan2(-obj2.Bh, obj2.Rw) + Math.PI / 2 - obj2.angle;
                anglebottomleft = Math.atan2(-obj2.Bh, -obj2.Lw) + Math.PI / 2 - obj2.angle;

                Obj2topright = [obj2.x + trhy * Math.sin(angletopright), obj2.y + trhy * Math.cos(angletopright)];
                Obj2topleft = [obj2.x + tlhy * Math.sin(angletopleft), obj2.y + tlhy * Math.cos(angletopleft)];
                Obj2bottomleft = [obj2.x + blhy * Math.sin(anglebottomleft), obj2.y + blhy * Math.cos(anglebottomleft)];
                Obj2bottomright = [obj2.x + brhy * Math.sin(anglebottomright), obj2.y + brhy * Math.cos(anglebottomright)];

                Obj2Points = [Obj2topright[0], Obj2topright[1], Obj2topleft[0], Obj2topleft[1], Obj2bottomleft[0], Obj2bottomleft[1], Obj2bottomright[0], Obj2bottomright[1]]

                for (let i = 0; i <= 6; i += 2) {
                    // A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
                    // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
                    // top left to top right
                    d1 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1topright[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1topright[0] - Obj1topleft[0]);
                    // bottom left to bottom right
                    d3 = (Obj2Points[i] - Obj1bottomleft[0]) * (Obj1bottomright[1] - Obj1bottomleft[1]) - (Obj2Points[1 + i] - Obj1bottomleft[1]) * (Obj1bottomright[0] - Obj1bottomleft[0]);
                    // top right to bottom right
                    d2 = (Obj2Points[i] - Obj1topright[0]) * (Obj1bottomright[1] - Obj1topright[1]) - (Obj2Points[1 + i] - Obj1topright[1]) * (Obj1bottomright[0] - Obj1topright[0]);
                    // top left to bottom left
                    d4 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1bottomleft[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1bottomleft[0] - Obj1topleft[0]);

                    if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                        overlap = true;
                        return overlap;
                    }

                    // top left to top right
                    d1 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2topright[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2topright[0] - Obj2topleft[0]);
                    // bottom left to bottom right
                    d3 = (Obj1Points[i] - Obj2bottomleft[0]) * (Obj2bottomright[1] - Obj2bottomleft[1]) - (Obj1Points[1 + i] - Obj2bottomleft[1]) * (Obj2bottomright[0] - Obj2bottomleft[0]);
                    // top right to bottom right
                    d2 = (Obj1Points[i] - Obj2topright[0]) * (Obj2bottomright[1] - Obj2topright[1]) - (Obj1Points[1 + i] - Obj2topright[1]) * (Obj2bottomright[0] - Obj2topright[0]);
                    // top left to bottom left
                    d4 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2bottomleft[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2bottomleft[0] - Obj2topleft[0]);

                    if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                        overlap = true;
                        return overlap;
                    }
                }
            }
            if ((Tank1Data.x != obj1.x || Tank1Data.y != obj1.y) && Tank1Data.Alive) {
                obj2 = Tank1Data;
                trhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Lw, 2));
                tlhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Rw, 2));
                brhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Rw, 2));
                blhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Lw, 2));

                angletopright = Math.atan2(obj2.Th, obj2.Rw) + Math.PI / 2 - obj2.angle;
                angletopleft = Math.atan2(obj2.Th, -obj2.Lw) + Math.PI / 2 - obj2.angle;
                anglebottomright = Math.atan2(-obj2.Bh, obj2.Rw) + Math.PI / 2 - obj2.angle;
                anglebottomleft = Math.atan2(-obj2.Bh, -obj2.Lw) + Math.PI / 2 - obj2.angle;

                Obj2topright = [obj2.x + trhy * Math.sin(angletopright), obj2.y + trhy * Math.cos(angletopright)];
                Obj2topleft = [obj2.x + tlhy * Math.sin(angletopleft), obj2.y + tlhy * Math.cos(angletopleft)];
                Obj2bottomleft = [obj2.x + blhy * Math.sin(anglebottomleft), obj2.y + blhy * Math.cos(anglebottomleft)];
                Obj2bottomright = [obj2.x + brhy * Math.sin(anglebottomright), obj2.y + brhy * Math.cos(anglebottomright)];

                Obj2Points = [Obj2topright[0], Obj2topright[1], Obj2topleft[0], Obj2topleft[1], Obj2bottomleft[0], Obj2bottomleft[1], Obj2bottomright[0], Obj2bottomright[1]]

                for (let i = 0; i <= 6; i += 2) {
                    // A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
                    // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
                    // top left to top right
                    d1 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1topright[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1topright[0] - Obj1topleft[0]);
                    // bottom left to bottom right
                    d3 = (Obj2Points[i] - Obj1bottomleft[0]) * (Obj1bottomright[1] - Obj1bottomleft[1]) - (Obj2Points[1 + i] - Obj1bottomleft[1]) * (Obj1bottomright[0] - Obj1bottomleft[0]);
                    // top right to bottom right
                    d2 = (Obj2Points[i] - Obj1topright[0]) * (Obj1bottomright[1] - Obj1topright[1]) - (Obj2Points[1 + i] - Obj1topright[1]) * (Obj1bottomright[0] - Obj1topright[0]);
                    // top left to bottom left
                    d4 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1bottomleft[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1bottomleft[0] - Obj1topleft[0]);

                    if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                        overlap = true;
                        return overlap;
                    }


                    // top left to top right
                    d1 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2topright[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2topright[0] - Obj2topleft[0]);
                    // bottom left to bottom right
                    d3 = (Obj1Points[i] - Obj2bottomleft[0]) * (Obj2bottomright[1] - Obj2bottomleft[1]) - (Obj1Points[1 + i] - Obj2bottomleft[1]) * (Obj2bottomright[0] - Obj2bottomleft[0]);
                    // top right to bottom right
                    d2 = (Obj1Points[i] - Obj2topright[0]) * (Obj2bottomright[1] - Obj2topright[1]) - (Obj1Points[1 + i] - Obj2topright[1]) * (Obj2bottomright[0] - Obj2topright[0]);
                    // top left to bottom left
                    d4 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2bottomleft[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2bottomleft[0] - Obj2topleft[0]);

                    if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                        overlap = true;
                        return overlap;
                    }
                }
            }
            for (let k = 0; k < AIEnemyData.length; k += 1) {
                if (AIEnemyData[k].x != obj1.x || AIEnemyData[k].y != obj1.y) {
                    obj2 = AIEnemyData[k];

                    trhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Lw, 2));
                    tlhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Rw, 2));
                    brhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Rw, 2));
                    blhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Lw, 2));

                    angletopright = Math.atan2(obj2.Th, obj2.Rw) + Math.PI / 2 - obj2.angle;
                    angletopleft = Math.atan2(obj2.Th, -obj2.Lw) + Math.PI / 2 - obj2.angle;
                    anglebottomright = Math.atan2(-obj2.Bh, obj2.Rw) + Math.PI / 2 - obj2.angle;
                    anglebottomleft = Math.atan2(-obj2.Bh, -obj2.Lw) + Math.PI / 2 - obj2.angle;

                    Obj2topright = [obj2.x + trhy * Math.sin(angletopright), obj2.y + trhy * Math.cos(angletopright)];
                    Obj2topleft = [obj2.x + tlhy * Math.sin(angletopleft), obj2.y + tlhy * Math.cos(angletopleft)];
                    Obj2bottomleft = [obj2.x + blhy * Math.sin(anglebottomleft), obj2.y + blhy * Math.cos(anglebottomleft)];
                    Obj2bottomright = [obj2.x + brhy * Math.sin(anglebottomright), obj2.y + brhy * Math.cos(anglebottomright)];

                    Obj2Points = [Obj2topright[0], Obj2topright[1], Obj2topleft[0], Obj2topleft[1], Obj2bottomleft[0], Obj2bottomleft[1], Obj2bottomright[0], Obj2bottomright[1]]

                    for (let i = 0; i <= 6; i += 2) {
                        // A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
                        // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
                        // top left to top right
                        d1 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1topright[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1topright[0] - Obj1topleft[0]);
                        // bottom left to bottom right
                        d3 = (Obj2Points[i] - Obj1bottomleft[0]) * (Obj1bottomright[1] - Obj1bottomleft[1]) - (Obj2Points[1 + i] - Obj1bottomleft[1]) * (Obj1bottomright[0] - Obj1bottomleft[0]);
                        // top right to bottom right
                        d2 = (Obj2Points[i] - Obj1topright[0]) * (Obj1bottomright[1] - Obj1topright[1]) - (Obj2Points[1 + i] - Obj1topright[1]) * (Obj1bottomright[0] - Obj1topright[0]);
                        // top left to bottom left
                        d4 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1bottomleft[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1bottomleft[0] - Obj1topleft[0]);

                        if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                            overlap = true;
                            return overlap;
                        }


                        // top left to top right
                        d1 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2topright[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2topright[0] - Obj2topleft[0]);
                        // bottom left to bottom right
                        d3 = (Obj1Points[i] - Obj2bottomleft[0]) * (Obj2bottomright[1] - Obj2bottomleft[1]) - (Obj1Points[1 + i] - Obj2bottomleft[1]) * (Obj2bottomright[0] - Obj2bottomleft[0]);
                        // top right to bottom right
                        d2 = (Obj1Points[i] - Obj2topright[0]) * (Obj2bottomright[1] - Obj2topright[1]) - (Obj1Points[1 + i] - Obj2topright[1]) * (Obj2bottomright[0] - Obj2topright[0]);
                        // top left to bottom left
                        d4 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2bottomleft[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2bottomleft[0] - Obj2topleft[0]);

                        if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                            overlap = true;
                            return overlap;
                        }
                    }
                }
            }
        } else { // Solo Game
            if (Tank1Data.x != obj1.x || Tank1Data.y != obj1.y) {
                obj2 = Tank1Data;

                trhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Lw, 2));
                tlhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Rw, 2));
                brhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Rw, 2));
                blhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Lw, 2));

                angletopright = Math.atan2(obj2.Th, obj2.Rw) + Math.PI / 2 - obj2.angle;
                angletopleft = Math.atan2(obj2.Th, -obj2.Lw) + Math.PI / 2 - obj2.angle;
                anglebottomright = Math.atan2(-obj2.Bh, obj2.Rw) + Math.PI / 2 - obj2.angle;
                anglebottomleft = Math.atan2(-obj2.Bh, -obj2.Lw) + Math.PI / 2 - obj2.angle;

                Obj2topright = [obj2.x + trhy * Math.sin(angletopright), obj2.y + trhy * Math.cos(angletopright)];
                Obj2topleft = [obj2.x + tlhy * Math.sin(angletopleft), obj2.y + tlhy * Math.cos(angletopleft)];
                Obj2bottomleft = [obj2.x + blhy * Math.sin(anglebottomleft), obj2.y + blhy * Math.cos(anglebottomleft)];
                Obj2bottomright = [obj2.x + brhy * Math.sin(anglebottomright), obj2.y + brhy * Math.cos(anglebottomright)];

                Obj2Points = [Obj2topright[0], Obj2topright[1], Obj2topleft[0], Obj2topleft[1], Obj2bottomleft[0], Obj2bottomleft[1], Obj2bottomright[0], Obj2bottomright[1]]

                for (let i = 0; i <= 6; i += 2) {
                    // A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
                    // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
                    // top left to top right
                    d1 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1topright[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1topright[0] - Obj1topleft[0]);
                    // bottom left to bottom right
                    d3 = (Obj2Points[i] - Obj1bottomleft[0]) * (Obj1bottomright[1] - Obj1bottomleft[1]) - (Obj2Points[1 + i] - Obj1bottomleft[1]) * (Obj1bottomright[0] - Obj1bottomleft[0]);
                    // top right to bottom right
                    d2 = (Obj2Points[i] - Obj1topright[0]) * (Obj1bottomright[1] - Obj1topright[1]) - (Obj2Points[1 + i] - Obj1topright[1]) * (Obj1bottomright[0] - Obj1topright[0]);
                    // top left to bottom left
                    d4 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1bottomleft[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1bottomleft[0] - Obj1topleft[0]);

                    if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                        overlap = true;
                        return overlap;
                    }


                    // top left to top right
                    d1 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2topright[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2topright[0] - Obj2topleft[0]);
                    // bottom left to bottom right
                    d3 = (Obj1Points[i] - Obj2bottomleft[0]) * (Obj2bottomright[1] - Obj2bottomleft[1]) - (Obj1Points[1 + i] - Obj2bottomleft[1]) * (Obj2bottomright[0] - Obj2bottomleft[0]);
                    // top right to bottom right
                    d2 = (Obj1Points[i] - Obj2topright[0]) * (Obj2bottomright[1] - Obj2topright[1]) - (Obj1Points[1 + i] - Obj2topright[1]) * (Obj2bottomright[0] - Obj2topright[0]);
                    // top left to bottom left
                    d4 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2bottomleft[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2bottomleft[0] - Obj2topleft[0]);

                    if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                        overlap = true;
                        return overlap;
                    }
                }
                for (let k = 0; k < AIEnemyData.length; k += 1) {
                    if (AIEnemyData[k].x != obj1.x || AIEnemyData[k].y != obj1.y) {
                        obj2 = AIEnemyData[k];

                        trhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Lw, 2));
                        tlhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Rw, 2));
                        brhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Rw, 2));
                        blhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Lw, 2));

                        angletopright = Math.atan2(obj2.Th, obj2.Rw) + Math.PI / 2 - obj2.angle;
                        angletopleft = Math.atan2(obj2.Th, -obj2.Lw) + Math.PI / 2 - obj2.angle;
                        anglebottomright = Math.atan2(-obj2.Bh, obj2.Rw) + Math.PI / 2 - obj2.angle;
                        anglebottomleft = Math.atan2(-obj2.Bh, -obj2.Lw) + Math.PI / 2 - obj2.angle;

                        Obj2topright = [obj2.x + trhy * Math.sin(angletopright), obj2.y + trhy * Math.cos(angletopright)];
                        Obj2topleft = [obj2.x + tlhy * Math.sin(angletopleft), obj2.y + tlhy * Math.cos(angletopleft)];
                        Obj2bottomleft = [obj2.x + blhy * Math.sin(anglebottomleft), obj2.y + blhy * Math.cos(anglebottomleft)];
                        Obj2bottomright = [obj2.x + brhy * Math.sin(anglebottomright), obj2.y + brhy * Math.cos(anglebottomright)];

                        Obj2Points = [Obj2topright[0], Obj2topright[1], Obj2topleft[0], Obj2topleft[1], Obj2bottomleft[0], Obj2bottomleft[1], Obj2bottomright[0], Obj2bottomright[1]];

                        for (let i = 0; i <= 6; i += 2) {
                            // A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
                            // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
                            // top left to top right
                            d1 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1topright[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1topright[0] - Obj1topleft[0]);
                            // bottom left to bottom right
                            d3 = (Obj2Points[i] - Obj1bottomleft[0]) * (Obj1bottomright[1] - Obj1bottomleft[1]) - (Obj2Points[1 + i] - Obj1bottomleft[1]) * (Obj1bottomright[0] - Obj1bottomleft[0]);
                            // top right to bottom right
                            d2 = (Obj2Points[i] - Obj1topright[0]) * (Obj1bottomright[1] - Obj1topright[1]) - (Obj2Points[1 + i] - Obj1topright[1]) * (Obj1bottomright[0] - Obj1topright[0]);
                            // top left to bottom left
                            d4 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1bottomleft[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1bottomleft[0] - Obj1topleft[0]);

                            if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                                overlap = true;
                                return overlap;
                            }


                            // top left to top right
                            d1 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2topright[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2topright[0] - Obj2topleft[0]);
                            // bottom left to bottom right
                            d3 = (Obj1Points[i] - Obj2bottomleft[0]) * (Obj2bottomright[1] - Obj2bottomleft[1]) - (Obj1Points[1 + i] - Obj2bottomleft[1]) * (Obj2bottomright[0] - Obj2bottomleft[0]);
                            // top right to bottom right
                            d2 = (Obj1Points[i] - Obj2topright[0]) * (Obj2bottomright[1] - Obj2topright[1]) - (Obj1Points[1 + i] - Obj2topright[1]) * (Obj2bottomright[0] - Obj2topright[0]);
                            // top left to bottom left
                            d4 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2bottomleft[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2bottomleft[0] - Obj2topleft[0]);

                            if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                                overlap = true;
                                return overlap;
                            }
                        }
                    }
                }

            } else {
                for (let k = 0; k < AIEnemyData.length; k += 1) {
                    if (AIEnemyData[k].x != obj1.x || AIEnemyData[k].y != obj1.y) {
                        obj2 = AIEnemyData[k];

                        trhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Lw, 2));
                        tlhy = Math.sqrt(Math.pow(obj2.Th, 2) + Math.pow(obj2.Rw, 2));
                        brhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Rw, 2));
                        blhy = Math.sqrt(Math.pow(obj2.Bh, 2) + Math.pow(obj2.Lw, 2));

                        angletopright = Math.atan2(obj2.Th, obj2.Rw) + Math.PI / 2 - obj2.angle;
                        angletopleft = Math.atan2(obj2.Th, -obj2.Lw) + Math.PI / 2 - obj2.angle;
                        anglebottomright = Math.atan2(-obj2.Bh, obj2.Rw) + Math.PI / 2 - obj2.angle;
                        anglebottomleft = Math.atan2(-obj2.Bh, -obj2.Lw) + Math.PI / 2 - obj2.angle;

                        Obj2topright = [obj2.x + trhy * Math.sin(angletopright), obj2.y + trhy * Math.cos(angletopright)];
                        Obj2topleft = [obj2.x + tlhy * Math.sin(angletopleft), obj2.y + tlhy * Math.cos(angletopleft)];
                        Obj2bottomleft = [obj2.x + blhy * Math.sin(anglebottomleft), obj2.y + blhy * Math.cos(anglebottomleft)];
                        Obj2bottomright = [obj2.x + brhy * Math.sin(anglebottomright), obj2.y + brhy * Math.cos(anglebottomright)];

                        Obj2Points = [Obj2topright[0], Obj2topright[1], Obj2topleft[0], Obj2topleft[1], Obj2bottomleft[0], Obj2bottomleft[1], Obj2bottomright[0], Obj2bottomright[1]]

                        for (let i = 0; i <= 6; i += 2) {
                            // A=(x1,y1) to B=(x2,y2) a point P=(x,y) falls on you need to compute the value:-
                            // d=(x−x1)(y2−y1)−(y−y1)(x2−x1)
                            // top left to top right
                            d1 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1topright[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1topright[0] - Obj1topleft[0]);
                            // bottom left to bottom right
                            d3 = (Obj2Points[i] - Obj1bottomleft[0]) * (Obj1bottomright[1] - Obj1bottomleft[1]) - (Obj2Points[1 + i] - Obj1bottomleft[1]) * (Obj1bottomright[0] - Obj1bottomleft[0]);
                            // top right to bottom right
                            d2 = (Obj2Points[i] - Obj1topright[0]) * (Obj1bottomright[1] - Obj1topright[1]) - (Obj2Points[1 + i] - Obj1topright[1]) * (Obj1bottomright[0] - Obj1topright[0]);
                            // top left to bottom left
                            d4 = (Obj2Points[i] - Obj1topleft[0]) * (Obj1bottomleft[1] - Obj1topleft[1]) - (Obj2Points[1 + i] - Obj1topleft[1]) * (Obj1bottomleft[0] - Obj1topleft[0]);

                            if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                                overlap = true;
                                return overlap;
                            }


                            // top left to top right
                            d1 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2topright[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2topright[0] - Obj2topleft[0]);
                            // bottom left to bottom right
                            d3 = (Obj1Points[i] - Obj2bottomleft[0]) * (Obj2bottomright[1] - Obj2bottomleft[1]) - (Obj1Points[1 + i] - Obj2bottomleft[1]) * (Obj2bottomright[0] - Obj2bottomleft[0]);
                            // top right to bottom right
                            d2 = (Obj1Points[i] - Obj2topright[0]) * (Obj2bottomright[1] - Obj2topright[1]) - (Obj1Points[1 + i] - Obj2topright[1]) * (Obj2bottomright[0] - Obj2topright[0]);
                            // top left to bottom left
                            d4 = (Obj1Points[i] - Obj2topleft[0]) * (Obj2bottomleft[1] - Obj2topleft[1]) - (Obj1Points[1 + i] - Obj2topleft[1]) * (Obj2bottomleft[0] - Obj2topleft[0]);

                            if (((d1 >= 0 && d3 <= 0) && (d2 >= 0 && d4 <= 0)) || ((d1 <= 0 && d3 >= 0) && (d2 <= 0 && d4 >= 0))) {
                                overlap = true;
                                return overlap;
                            }
                        }
                    }
                }
            }
        }
    }
}

function SaveLevel() {
    var NewLevel = {
        Type: LevelEditorInfo.Type,
        AIEnemyData: AIEnemyData,
        walls: walls,
        Tank2Data: Tank2Data,
        Tank1Data: Tank1Data
    }
    try {
        if (localStorage.SavedLevels) {
            SavedLevels = JSON.parse(localStorage.SavedLevels);
            if (SavedLevels.length < 3) {
                if (NewLevel.Type == "VS" && AIEnemyData.length != 0) {
                    alert("No enemys may exist in a VS game right now.")/////////////////////////////////////////////// try to get rid of
                } else {
                    SavedLevels.push(NewLevel);
                    localStorage.SavedLevels = JSON.stringify(SavedLevels);
                }
            } else {
                alert("Max number of levels reached delete a level to save.");
            }
        } else {
            SavedLevels = [];
            SavedLevels.push(NewLevel);
            localStorage.SavedLevels = JSON.stringify(SavedLevels);
            alert("Level Saved.");
        }
        for (i = 0; i < 3; i++) {
            document.getElementById("SoloPlayerLevel" + (i + 1)).hidden = true;
            document.getElementById("CoOpPlayerLevel" + (i + 1)).hidden = true;
            document.getElementById("DeletePlayerLevel" + (i + 1)).hidden = true;
            document.getElementById("EditPlayerLevel" + (i + 1)).hidden = true;
        }
        for (i = 0; i < SavedLevels.length; i++) {
            document.getElementById("EditPlayerLevel" + (i + 1)).hidden = false;
            document.getElementById("DeletePlayerLevel" + (i + 1)).hidden = false;
        }

    } catch (err) {
        alert("Level can not be Saved.")
    }
}

function LevelDelete(index) {
    var i
    SavedLevels.splice(index, 1);
    localStorage.SavedLevels = JSON.stringify(SavedLevels);
    for (i = 0; i < 3; i++) {
        document.getElementById("SoloPlayerLevel" + (i + 1)).hidden = true;
        document.getElementById("CoOpPlayerLevel" + (i + 1)).hidden = true;
        document.getElementById("DeletePlayerLevel" + (i + 1)).hidden = true;
        document.getElementById("EditPlayerLevel" + (i + 1)).hidden = true;
    }
    for (i = 0; i < SavedLevels.length; i++) {
        document.getElementById("EditPlayerLevel" + (i + 1)).hidden = false;
        document.getElementById("DeletePlayerLevel" + (i + 1)).hidden = false;
    }
    alert("Level Deleted.");
}

function PlayerLevel(index) {
    var j;
    Level = -1 * (index + 1);
    SavedLevels = JSON.parse(localStorage.SavedLevels);
    if (Level_Editor) {

    } else if (SavedLevels[index].Type == "Solo") {
        SoloGame = true;
        Level_Editor = false;
        document.getElementById("ButtonArea").hidden = false;
    } else if (SavedLevels[index].Type == "CoOp") {
        CoOpGame = true;
        Level_Editor = false;
        document.getElementById("ButtonArea").hidden = false;
    } else if (SavedLevels[index].Type == "VS") {
        VSGame = true;
        Level_Editor = false;
        document.getElementById("ButtonArea").hidden = false;
    }

    Bullets = [];
    document.getElementById("Menu").hidden = true;
    document.getElementById("Solo_Level_List").hidden = true;
    document.getElementById("CoOp_Level_List").hidden = true;
    document.getElementById("VS_Level_List").hidden = true;

    Tank1 = new Image();
    Tank1.src = Player1Tank.Tank;
    Tank2 = new Image();
    Tank2.src = Player2Tank.Tank;

    AIEnemyData = SavedLevels[index].AIEnemyData;
    walls = SavedLevels[index].walls;
    Tank2Data = SavedLevels[index].Tank2Data;
    Tank1Data = SavedLevels[index].Tank1Data;

    for (j = 0; j < walls.length; j++) {
        walls[j].img = new Image();
        walls[j].img.src = "images/Wall.png";
    }

    if (Level_Editor) {
        for (j = 0; j < AIEnemyData.length; j++) {
            if (AIEnemyData[j].AIType == "Target") {
                AIEnemyData[j].img = new Image();
                AIEnemyData[j].img.src = "images/Target.png";
            } else if (AIEnemyData[j].AIType == "Turret") {
                AIEnemyData[j].img = new Image();
                AIEnemyData[j].img.src = "images/Turret.png";
            } else if (AIEnemyData[j].AIType == "Chase" || AIEnemyData[j].AIType == "Dodge" || AIEnemyData[j].AIType == "PathFind") {
                AIEnemyData[j].img = new Image();
                AIEnemyData[j].img.src = "images/Tank3.png";
            }
        }
        
    } else {
        for (j = 0; j < AIEnemyData.length; j++) {
            if (AIEnemyData[j].AIType == "Target") {
                AIEnemyData[j].img = new Image();
                AIEnemyData[j].img.src = "images/Target.png";
            } else if (AIEnemyData[j].AIType == "Turret") {
                AIEnemyData[j].img = new Image();
                AIEnemyData[j].img.src = "images/Turret.png";
                AIEnemyData[j].Fireframe = 5;
            } else if (AIEnemyData[j].AIType == "Chase" || AIEnemyData[j].AIType == "Dodge" || AIEnemyData[j].AIType == "PathFind") {
                AIEnemyData[j].img = new Image();
                AIEnemyData[j].img.src = "images/Tank3.png";
                AIEnemyData[j].Fireframe = 5;
            }
        }
        myGameArea.start();
    }
    DetermineGridMap();
    document.getElementById("GameArea").hidden = false;

}

function ResetData() {
    try {
        localStorage.clear();
    } catch (err) {

    }
}

function LevelEditorDrawing() {
    myGameArea.clear();
    drawTank(Tank1, Tank1Data);
    if (LevelEditorInfo.Type == "CoOp" || LevelEditorInfo.Type == "VS") {
        drawTank(Tank2, Tank2Data);
    }
    for (let i = 0; i < AIEnemyData.length; i += 1) {
        drawTank(AIEnemyData[i].img, AIEnemyData[i]);
    }

    drawWallsAndBullets();
}

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}

function DetermineGridMap() { // Determines the grid state for the walls to generate 'open' and closed squares
    GridMap = [];
    var Info = {
        Shape: "Bullet",
        x: 0,
        y: 0
    }
    for (let i = 0; i < 260; i++) {
        GridMap[i] = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
        Info.x = Info.x + 5;
        Info.y = 0;
        for (let k = 0; k < 120; k++) {
            Info.y = Info.y + 5;
            if (20 >= Info.x || Info.x >= Thecanvas.width - 20 || WallCheck(Info, walls)) {
                GridMap[i][k] = false;
            }

            if (20 >= Info.y || Info.y >= Thecanvas.height - 20 || WallCheck(Info, walls)) {
                GridMap[i][k] = false;
            }
        }
    }
}

function FindConnectingPath(Point1, Point2) {
    var end = {
        x: Math.round(Point2.x / 50),
        y: Math.round(Point2.y / 50),
    }
    var start = {
        x: Math.round(Point1.x / 50),
        y: Math.round(Point1.y / 50),
        cost: 1,
        g: 0,
        f: 0,
        h: Math.abs(end.x - Math.round(Point1.x / 50)) + Math.abs(end.y - Math.round(Point1.y / 50)),
        visited: false,
        closed: false,
        parent: false,
    }
    var GridNodes = InitializeGrid();
    return Path = search(GridNodes, start, end, false, 'manhattan')
}

function InitializeGrid() {
    var GridNodes = [];

    for (let x = 0, xl = Math.floor(GridMap.length / 10); x < xl; x++) {
        GridNodes[x] = [];
        for (let y = 0, yl = Math.floor(GridMap[x].length / 10); y < yl; y++) {
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
            for (let k = 0, kl = 10; k < kl; k++) {
                for (let i = 0, il = 10; i < il; i++) {
                    var value = GridMap[x * 10 + k][y * 10 + i];
                    if (!value) {
                        node.visited = true; // has this square been visited 
                        node.closed = true; // is the square closed
                    }
                }
            }
            GridNodes[x][y] = node;
        }
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

/*
Things to Add:

Walls:
    add more types like buildings
    add water, bridges, different shaped walls
    When loading saved walls they are all black lines
 
AI:
    add different classes
    Wall Hit: if you hit a wall become parellel with it and pick direction either random, CW, CCW or toward player
        Do something different if you're set to dodge.
    What to do if you're pointing at a friendly unit
        If you're pointing at a friendly and the enemy is in the same direction and closer fire
        if enemy not in same general direction stop
        if further stop if turret
        stop if the friendly is closer then like 50px or something too

All:
    add more levels.
    Turrets and targets can be run over.
    TanksOverlap, WallCheck, Crashwith in one function.

VS:
    Add Ai to vs games when I make new levels

Level Editor: 
    add option to fire bullets.
    after death or on reset everything returns to start locations to really test the level.
    add option to load levels that already exist
    add option to make vs levels first must implement better vs screen
*/

