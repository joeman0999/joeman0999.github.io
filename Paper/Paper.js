var Player1Data, canvas
var LandGrid = [];
var TrailGrid = [];
var Land = [];
var Bots = [];
var NumberBots = 50;
var BotCam = false;
var BotCams = [];
var GameType = "";
var xDown = null;
var yDown = null;
var Multiplier = 1;

Land.push(new Image());
Land[0].src = "images/Land1.png";
Land.push(new Image());
Land[1].src = "images/Land2.png";
for (let i = 0; i < NumberBots; ++i) {
	Land.push(new Image());
	Land[i+2].src = "images/Land3.png";
}

var Thecanvas = {
	BoardWidth: 5000,
	BoardHeight: 5000,
	width: 580, // used in other places too if changed will need to be looked at
	height: 580 // in Griddraw for example as drawing box is changed
}

var Person = new Image();
Person.src = 'images/Player1.png';

var Person2 = new Image();
Person2.src = 'images/Player2.png';

var Person3 = new Image();
Person3.src = 'images/Player3.png';

var Player1Data = {
	id: 1,
	x: 290,
	y: 290,
	Boardx: 550,
	Boardy: 850,
	speedX: 0,
	speedY: 5,
	angle: 0,
	width: 20,
	height: 20,
	image: Person,
	Trail: false,
	Direction: "up",
	NewDirection: "",
	Alive: true
};

var Player2Data = {
	id: 2,
	x: 290,
	y: 290,
	Boardx: 850,
	Boardy: 550,
	speedX: -5,
	speedY: 0,
	angle: 0,
	width: 20,
	height: 20,
	image: Person2,
	Trail: false,
	Direction: "left",
	Alive: true
};

window.onload = function () {
	var screenW = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
	var screenH = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight) - 70;
	var min = Math.min(screenW, screenH);
	var size = Math.floor(min);
	Multiplier = size / 580;
}

var myGameAreas = [
	{
		canvas: document.createElement("canvas"),
		frame: 0,
		start: function () {
			this.canvas.setAttribute("id", "GameArea1");
			this.canvas.width = Thecanvas.width * Multiplier;
			this.canvas.height = Thecanvas.height * Multiplier;
			this.context = this.canvas.getContext("2d");
			document.body.insertBefore(this.canvas, document.body.childNodes[0]);
			this.frame = 0;
			this.interval = setInterval(updateGameArea, 30);
			window.addEventListener('keydown', keydownhandler);
			window.addEventListener('touchstart', handleTouchStart);
			window.addEventListener('touchmove', handleTouchMove);

			GridReset();
		},
		stop: function () {
			clearInterval(this.interval);
		},
		clear: function () {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}, {
		canvas: document.createElement("canvas"),
		start: function () {

			this.canvas.setAttribute("id", "GameArea2");
			this.canvas.width = Thecanvas.width * Multiplier;
			this.canvas.height = Thecanvas.height * Multiplier;
			this.context = this.canvas.getContext("2d");

			document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		},
		clear: function () {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}
];

function onePlayer() {
	GameType = "onePlayer";
	myGameAreas[0].start();
	Player2Data.Alive = false;

	document.getElementById("Menu").hidden = true;
	document.getElementById("ButtonArea").hidden = false;
	if (document.getElementById("GameArea1")) {
		document.getElementById("GameArea1").hidden = false;
	}

	Player1Data = Respawn(Player1Data);
	for (let i = 0; i < NumberBots; ++i) {
		Bots[i] = newBot();
		Bots[i].id = i + 3;
		Bots[i] = Respawn(Bots[i]);
	}
}

function twoPlayer() {
	GameType = "twoPlayer";
	myGameAreas[1].start();
	myGameAreas[0].start();

	document.getElementById("Menu").hidden = true;
	document.getElementById("ButtonArea").hidden = false;
	if (document.getElementById("GameArea1")) {
		document.getElementById("GameArea1").hidden = false;
	}
	if (document.getElementById("GameArea2")) {
		document.getElementById("GameArea2").hidden = false;
	}
	
	Player1Data = Respawn(Player1Data);
	Player2Data = Respawn(Player2Data);

	//var Loc = [((Player2Data.Boardy + 10) / 20) - 1, ((Player2Data.Boardx + 10) / 20) - 1];

	for (let i = 0; i < NumberBots; ++i) {
		Bots[i] = newBot();
		Bots[i].id = i + 3;
		Bots[i] = Respawn(Bots[i]);
	}
	
}

function Menu() {
	myGameAreas[0].stop();
	document.getElementById("ButtonArea").hidden = true;
	if (document.getElementById("GameArea1")) {
		window.removeEventListener('keydown', keydownhandler);
		window.removeEventListener('touchstart', handleTouchStart);
		window.removeEventListener('touchmove', handleTouchMove);
		document.getElementById("GameArea1").hidden = true;

	}
	if (document.getElementById("GameArea2")) {
		document.getElementById("GameArea2").hidden = true;
	}

	document.getElementById("Menu").hidden = false;
}

function keydownhandler(e) {
	if (e.keyCode == 87) {
		Player1Data.NewDirection = 'up';
	} else if (e.keyCode == 83) {
		Player1Data.NewDirection = 'down';
	} else if (e.keyCode == 68) {
		Player1Data.NewDirection = 'right';
	} else if (e.keyCode == 65) {
		Player1Data.NewDirection = 'left';
	} else if (e.keyCode == 37) {
		Player2Data.NewDirection = "left";
	} else if (e.keyCode == 39) {
		Player2Data.NewDirection = "right";
	} else if (e.keyCode == 38) {
		Player2Data.NewDirection = "up";
	} else if (e.keyCode == 40) {
		Player2Data.NewDirection = "down";
	}
}

function handleTouchStart(evt) {
	evt.preventDefault();
	xDown = evt.touches[0].clientX;
	yDown = evt.touches[0].clientY;
}

function handleTouchMove(evt) {
	evt.preventDefault();
	if (!xDown || !yDown) {
		return;
	}
	var xUp = evt.touches[0].clientX;
	var yUp = evt.touches[0].clientY;
	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
		if (xDiff > 0) {
			Player1Data.NewDirection = 'left';
		} else {
			Player1Data.NewDirection = 'right';
		}
	} else {
		if (yDiff > 0) {
			Player1Data.NewDirection = 'up';
		} else {
			Player1Data.NewDirection = 'down';
		}
	}

	xDown = null;
	yDown = null;
}

function newBot() {
	
	bot = {
		Alive: true,
		Boardx: 0,
		Boardy: 0,
		speedX: 0,
		speedY: 0,
		id: 0,
		angle: 0,
		width: 20,
		height: 20,
		image: Person3,
		x: 290,
		y: 290
	}
	return bot;
}

function GridReset() {
	LandGrid = [];
	TrailGrid = [];
	for (let i = 0; i < 250; ++i) {
		LandGrid.push([]);
		TrailGrid.push([]);
		for (let k = 0; k < 250; ++k) {
			LandGrid[i].push(0);
			TrailGrid[i].push(0);
		}
	}
}

function updateGameArea() {
	myGameAreas[0].clear();
	if (GameType == "twoPlayer") {
		myGameAreas[1].clear();
	}
	++myGameAreas[0].frame;

	Collision();

	Player1Data = updatePlayer(Player1Data);

	for (let i = 0; i < NumberBots; ++i) {
		Bots[i] = updateBot(Bots[i]);
	}

	if (GameType == "twoPlayer") {
		Player2Data = updatePlayer(Player2Data);
		GridDraw(Player2Data, 1);
	}
	
	GridDraw(Player1Data, 0);
	
	for (let i = 0; i < NumberBots; ++i) {
		if (Bots[i].Alive) {
			draw(Bots[i]);
		}
	}
	if (Player1Data.Alive) {
		Player1Draw(Player1Data);
	}
	if (Player2Data.Alive && GameType == "twoPlayer") {
		Player2Draw(Player2Data);
	}
	DrawBotCams();
}

function draw(Info) {
	myGameAreas[0].context.save();
	myGameAreas[0].context.translate((Info.Boardx - Player1Data.Boardx + Player1Data.x) * Multiplier, (Info.Boardy - Player1Data.Boardy + Player1Data.y) * Multiplier);
	myGameAreas[0].context.rotate(Info.angle);
	myGameAreas[0].context.drawImage(Info.image, -(Info.width / 2) * Multiplier, -(Info.height / 2) * Multiplier, Info.width * Multiplier, Info.height * Multiplier);
	myGameAreas[0].context.restore();

	if (GameType == "twoPlayer") {
		myGameAreas[1].context.save();
		myGameAreas[1].context.translate((Info.Boardx - Player2Data.Boardx + Player2Data.x) * Multiplier, (Info.Boardy - Player2Data.Boardy + Player2Data.y) * Multiplier);
		myGameAreas[1].context.rotate(Info.angle);
		myGameAreas[1].context.drawImage(Info.image, -(Info.width / 2) * Multiplier, -(Info.height / 2) * Multiplier, Info.width * Multiplier, Info.height * Multiplier);
		myGameAreas[1].context.restore();
	}
}

function Player1Draw(Info) {

	myGameAreas[0].context.save();
	myGameAreas[0].context.translate(Info.x * Multiplier, Info.y * Multiplier);
	myGameAreas[0].context.rotate(Info.angle);
	myGameAreas[0].context.drawImage(Info.image, -(Info.width / 2) * Multiplier, -(Info.height / 2) * Multiplier, Info.width * Multiplier, Info.height * Multiplier);
	myGameAreas[0].context.restore();

	if (GameType == "twoPlayer") {
		myGameAreas[1].context.save();
		myGameAreas[1].context.translate((Info.Boardx - Player2Data.Boardx + Player2Data.x) * Multiplier, (Info.Boardy - Player2Data.Boardy + Player2Data.y) * Multiplier);
		myGameAreas[1].context.rotate(Info.angle);
		myGameAreas[1].context.drawImage(Info.image, -(Info.width / 2) * Multiplier, -(Info.height / 2) * Multiplier, Info.width * Multiplier, Info.height * Multiplier);
		myGameAreas[1].context.restore();
	}
}

function Player2Draw(Info) {
	myGameAreas[1].context.save();
	myGameAreas[1].context.translate(Info.x * Multiplier, Info.y * Multiplier);
	myGameAreas[1].context.rotate(Info.angle);
	myGameAreas[1].context.drawImage(Info.image, -(Info.width / 2) * Multiplier, -(Info.height / 2) * Multiplier, Info.width * Multiplier, Info.height * Multiplier);
	myGameAreas[1].context.restore();

	myGameAreas[0].context.save();
	myGameAreas[0].context.translate((Info.Boardx - Player1Data.Boardx + Player1Data.x) * Multiplier, (Info.Boardy - Player1Data.Boardy + Player1Data.y) * Multiplier);
	myGameAreas[0].context.rotate(Info.angle);
	myGameAreas[0].context.drawImage(Info.image, -(Info.width / 2) * Multiplier, -(Info.height / 2) * Multiplier, Info.width * Multiplier, Info.height * Multiplier);
	myGameAreas[0].context.restore();
}

function GridDraw(Data, canvasNum) {
	var rc = Math.floor((Data.Boardy + 10) / 20) - 1;
	var cc = Math.floor((Data.Boardx + 10) / 20) - 1;

	var yMin = rc - 15;
	var yMax = rc + 16;
	var xMin = cc - 15;
	var xMax = cc + 16;
	if (yMin < 0) {
		yMin = 0;
		yMax = 31;
	} else if (yMax > 249) {
		yMax = 250;
		yMin = 218;
	}
	if (xMin < 0) {
		xMin = 0;
		xMax = 31;
	} else if (xMax > 249) {
		xMax = 250;
		xMin = 218;
	}

	for (let i = yMin; i < yMax; ++i) {
		for (let k = xMin; k < xMax; ++k) {
			if (LandGrid[i][k] != 0) {

				myGameAreas[canvasNum].context.save();
				myGameAreas[canvasNum].context.translate((k * 20 + 10 - Data.Boardx + Data.x) * Multiplier, (i * 20 + 10 - Data.Boardy + Data.y) * Multiplier);
				myGameAreas[canvasNum].context.drawImage(Land[LandGrid[i][k] - 1], -10 * Multiplier, -10 * Multiplier, 20 * Multiplier, 20 * Multiplier);
				myGameAreas[canvasNum].context.restore();
			}
			if (TrailGrid[i][k] != 0) {
				myGameAreas[canvasNum].context.globalAlpha = .4;
				myGameAreas[canvasNum].context.save();
				myGameAreas[canvasNum].context.translate((k * 20 + 10 - Data.Boardx + Data.x) * Multiplier, (i * 20 + 10 - Data.Boardy + Data.y) * Multiplier);
				myGameAreas[canvasNum].context.drawImage(Land[TrailGrid[i][k] - 1], -10 * Multiplier, -10 * Multiplier, 20 * Multiplier, 20 * Multiplier);
				myGameAreas[canvasNum].context.restore();
				myGameAreas[canvasNum].context.globalAlpha = 1;

			}
		}
	}
}

function updatePlayer(Data) {
	if (Data.Alive) {
		if (Data.Direction != Data.NewDirection && Data.NewDirection != "") {
			if (Data.NewDirection == "left" && Data.Direction != "right") {
				if (((Data.Boardy + 10) % 20)  == 0) {
					Data.speedX = -5;
					Data.speedY = 0;
					Data.Direction = Data.NewDirection;
					Data.NewDirection = "";
				}
			} else if (Data.NewDirection == "right" && Data.Direction != "left") {
				if (((Data.Boardy + 10) % 20) == 0) {
					Data.speedX = 5;
					Data.speedY = 0;
					Data.Direction = Data.NewDirection;
					Data.NewDirection = "";
				}
			} else if (Data.NewDirection == "up" && Data.Direction != "down") {
				if (((Data.Boardx + 10) % 20) == 0) {
					Data.speedY = 5;
					Data.speedX = 0;
					Data.Direction = Data.NewDirection;
					Data.NewDirection = "";
				}
			} else if (Data.NewDirection == "down" && Data.Direction != "up") {
				if (((Data.Boardx + 10) % 20) == 0) {
					Data.speedY = -5;
					Data.speedX = 0;
					Data.Direction = Data.NewDirection;
					Data.NewDirection = "";
				}
			}
		}

		if (((Data.Boardx + 10) % 20) == 0 && ((Data.Boardy + 10) % 20) == 0) {
			var r = ((Data.Boardy + 10) / 20) - 1;
			var c = ((Data.Boardx + 10) / 20) - 1;
			if (LandGrid[r][c] == Data.id) {
				if (Data.Trail == true) {
					Data.Trail = false;
					Fill(Data.id, [r, c]);
				}
			}

			if (TrailGrid[r][c] != 0) {
				if (TrailGrid[r][c] == 1) {
					Player1Data.Alive = false;
					Kill(1);
				} else if (TrailGrid[r][c] == 2) {
					Player2Data.Alive = false;
					Kill(2);
				} else {
					Bots[TrailGrid[r][c]-3].Alive = false;
					Kill(TrailGrid[r][c]);
				}
			} 
			if (LandGrid[r][c] != Data.id && Data.Alive) {
				TrailGrid[r][c] = Data.id;
				Data.Trail = true;
			}

		}
		Data.Boardy -= Data.speedY;
		Data.Boardx += Data.speedX;

		if ((Data.Boardx > Thecanvas.BoardWidth - Thecanvas.width / 2) || (Data.Boardx < Thecanvas.width / 2) || Data.x < Thecanvas.width / 2 || (Data.x > Thecanvas.width / 2)) {
			if (Data.Boardx < Data.width / 2 || Data.Boardx + Data.width / 2 > Thecanvas.BoardWidth) {
				Data.Alive = false;
				Kill(Data.id);
				Data.Boardx -= Data.speedX;
			} else {
				if (Data.Boardx <= Thecanvas.width / 2) {
					Data.x = Data.Boardx;
				} else if (Data.Boardx > Thecanvas.BoardWidth - Thecanvas.width / 2){
					Data.x = 290 + 290 - (Thecanvas.BoardWidth - Data.Boardx);
				} else {
					Data.x = 290;
				}
			}
		}
		if ((Data.Boardy > Thecanvas.BoardHeight - Thecanvas.height / 2) || (Data.Boardy < Thecanvas.height / 2) || Data.y < Thecanvas.height / 2 || Data.y > Thecanvas.height / 2) {
			if (Data.Boardy < Data.height / 2 || Data.Boardy + Data.height / 2 > Thecanvas.BoardHeight) {
				Data.Alive = false;
				Kill(Data.id);
				Data.Boardy += Data.speedY;
			} else {
				if (Data.Boardy < Thecanvas.height / 2) {
					Data.y = Data.Boardy;
				} else if (Data.Boardy > Thecanvas.BoardHeight - Thecanvas.height / 2) {
					Data.y = 290 + 290 - (Thecanvas.BoardHeight - Data.Boardy);
				} else {
					Data.y = 290;
				}
			}
		}
	} else { // used as a spectator
		
		if (myGameAreas[0].frame % 4 == 0) { // Right now you respawn whenever this happens because I said so
			Data = Respawn(Data);
			return Data;
		}

		if (Data.Direction != Data.NewDirection && Data.NewDirection != "") {
			if (Data.NewDirection == "left" && Data.Direction != "right") {
				if (((Data.Boardy + 10) % 20) == 0) {
					Data.speedX = -5;
					Data.speedY = 0;
					Data.Direction = Data.NewDirection;
					Data.NewDirection = "";
				}
			} else if (Data.NewDirection == "right" && Data.Direction != "left") {
				if (((Data.Boardy + 10) % 20) == 0) {
					Data.speedX = 5;
					Data.speedY = 0;
					Data.Direction = Data.NewDirection;
					Data.NewDirection = "";
				}
			} else if (Data.NewDirection == "up" && Data.Direction != "down") {
				if (((Data.Boardx + 10) % 20) == 0) {
					Data.speedY = 5;
					Data.speedX = 0;
					Data.Direction = Data.NewDirection;
					Data.NewDirection = "";
				}
			} else if (Data.NewDirection == "down" && Data.Direction != "up") {
				if (((Data.Boardx + 10) % 20) == 0) {
					Data.speedY = -5;
					Data.speedX = 0;
					Data.Direction = Data.NewDirection;
					Data.NewDirection = "";
				}
			}
		}
		Data.Boardy -= Data.speedY;
		Data.Boardx += Data.speedX;

		if ((Data.Boardx > Thecanvas.BoardWidth - Thecanvas.width / 2) || (Data.Boardx < Thecanvas.width / 2) || Data.x < Thecanvas.width / 2 || (Data.x > Thecanvas.width / 2)) {
			if (Data.Boardx < Data.width / 2 || Data.Boardx + Data.width / 2 > Thecanvas.BoardWidth) {
				Data.Boardx -= Data.speedX;
			} else {
				Data.x += Data.speedX;
			}
		}
		if ((Data.Boardy > Thecanvas.BoardHeight - Thecanvas.height / 2) || (Data.Boardy < Thecanvas.height / 2) || Data.y < Thecanvas.height / 2 || Data.y > Thecanvas.height / 2) {
			if (Data.Boardy < Data.height / 2 || Data.Boardy + Data.height / 2 > Thecanvas.BoardHeight) {
				Data.Boardy += Data.speedY;
			} else {
				Data.y -= Data.speedY;
			}
		}
	}

	return Data;
};

function updateBot(Data) {
	if (Data.Alive) {
		if (((Data.Boardx + 10) % 20) == 0 && ((Data.Boardy + 10) % 20) == 0) {
			var r = ((Data.Boardy + 10) / 20) - 1;
			var c = ((Data.Boardx + 10) / 20) - 1;
			if (LandGrid[r][c] == Data.id) {
				if (Data.Trail == true) {
					Data.Trail = false;
					Fill(Data.id, [r, c]);
				}
			}

			if (TrailGrid[r][c] != 0) {
				if (TrailGrid[r][c] == 1) {
					Player1Data.Alive = false;
					Kill(1);
				} else if (TrailGrid[r][c] == 2) {
					Player2Data.Alive = false;
					Kill(2);
				} else {
					Bots[TrailGrid[r][c]-3].Alive = false;
					Kill(TrailGrid[r][c]);
				}
			} 

			if (LandGrid[r][c] != Data.id && Data.Alive) {
				TrailGrid[r][c] = Data.id;
				Data.Trail = true;
			}

		}
		Data.Boardy -= Data.speedY;
		Data.Boardx += Data.speedX;

		if ((Data.Boardx > Thecanvas.BoardWidth - Thecanvas.width / 2) || (Data.Boardx < Thecanvas.width / 2) || Data.x < Thecanvas.width / 2 || (Data.x > Thecanvas.width / 2)) {
			if (Data.Boardx < Data.width / 2 || Data.Boardx + Data.width / 2 > Thecanvas.BoardWidth) {
				Data.Alive = false;
				Kill(Data.id);
				Data.Boardx -= Data.speedX;
			} else {
				if (Data.Boardx <= Thecanvas.width / 2) {
					Data.x = Data.Boardx;
				} else if (Data.Boardx > Thecanvas.BoardWidth - Thecanvas.width / 2) {
					Data.x = 290 + 290 - (Thecanvas.BoardWidth - Data.Boardx);
				} else {
					Data.x = 290;
				}
			}
		}
		if ((Data.Boardy > Thecanvas.BoardHeight - Thecanvas.height / 2) || (Data.Boardy < Thecanvas.height / 2) || Data.y < Thecanvas.height / 2 || Data.y > Thecanvas.height / 2) {
			if (Data.Boardy < Data.height / 2 || Data.Boardy + Data.height / 2 > Thecanvas.BoardHeight) {
				Data.Alive = false;
				Kill(Data.id);
				Data.Boardy += Data.speedY;
			} else {
				if (Data.Boardy < Thecanvas.height / 2) {
					Data.y = Data.Boardy;
				} else if (Data.Boardy > Thecanvas.BoardHeight - Thecanvas.height / 2) {
					Data.y = 290 + 290 - (Thecanvas.BoardHeight - Data.Boardy);
				} else {
					Data.y = 290;
				}
			}
		}
	} else {
		if (myGameAreas[0].frame % 4 == 0) {
			Data = Respawn(Data);
		}
	}
	return Data;
}

function randomSpawnLoc() {
	var Loc = [];
	var r = Math.round(Math.random() * 246) + 2;
	var c = Math.round(Math.random() * 246) + 2;
	if (LandGrid[r][c] == 0 && TrailGrid[r][c] == 0) {
		if (LandGrid[r - 1][c] == 0 && TrailGrid[r - 1][c] == 0) {
			if (LandGrid[r - 1][c + 1] == 0 && TrailGrid[r - 1][c + 1] == 0) {
				if (LandGrid[r][c + 1] == 0 && TrailGrid[r][c + 1] == 0) {
					if (LandGrid[r + 1][c + 1] == 0 && TrailGrid[r + 1][c + 1] == 0) {
						if (LandGrid[r + 1][c] == 0 && TrailGrid[r + 1][c] == 0) {
							if (LandGrid[r + 1][c - 1] == 0 && TrailGrid[r + 1][c - 1] == 0) {
								if (LandGrid[r][c - 1] == 0 && TrailGrid[r][c - 1] == 0) {
									if (LandGrid[r - 1][c - 1] == 0 && TrailGrid[r - 1][c - 1] == 0) {
										Loc = [r, c];
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return Loc;
}

function Spawn(Loc, id) {
	var r = Loc[0];
	var c = Loc[1];

	LandGrid[r][c]         = id;
	LandGrid[r - 1][c]     = id;
	LandGrid[r - 1][c + 1] = id;
	LandGrid[r][c + 1]     = id;
	LandGrid[r + 1][c + 1] = id;
	LandGrid[r + 1][c]     = id;
	LandGrid[r + 1][c - 1] = id;
	LandGrid[r][c - 1]     = id;
	LandGrid[r - 1][c - 1] = id;
}

function Fill(id, start) {
	var locs = [];
	var Checked = Array(250);

	Checked[start[0]] = Array(250);
	Checked[start[0]][start[1]] = true;
	locs.push([start[0] + 1, start[1]]);
	locs.push([start[0] - 1, start[1]]);
	locs.push([start[0], start[1] + 1]);
	locs.push([start[0], start[1] - 1]);

	var loc, r, c;
	while (locs.length != 0) {
		loc = locs.shift();
		r = loc[0];
		c = loc[1];

		if (r < 0 || r > 249 || c < 0 || c > 249 || (Checked[r] && Checked[r][c])) {
			continue;
		}

		if (TrailGrid[r][c] == id) {
			if (Checked[r]) {
				Checked[r][c] = true;
			} else {
				Checked[r] = Array(250);
				Checked[r][c] = true;
			}

			LandGrid[r][c] = id;
			TrailGrid[r][c] = 0;

			InnerFill(id, [r + 1, c], Checked);
			InnerFill(id, [r - 1, c], Checked);
			InnerFill(id, [r, c + 1], Checked);
			InnerFill(id, [r, c - 1], Checked);

			locs.push([r + 1, c]);
			locs.push([r - 1, c]);
			locs.push([r, c + 1]);
			locs.push([r, c - 1]);

		}
	}
}

function InnerFill(id, start, Checked) {
	var r = start[0];
	var c = start[1];
	if (r < 0 || r > 249 || c < 0 || c > 249 || (Checked[r] && Checked[r][c]) || TrailGrid[r][c] == id || LandGrid[r][c] == id) {
		return;
	}

	var filled = [];
	var surrounded = true;
	var locs = [start];
	var loc;
	while (locs.length != 0) {
		loc = locs.shift();
		r = loc[0];
		c = loc[1];

		if (r < 0 || r > 249 || c < 0 || c > 249) {
			return;
		}

		if ((Checked[r] && Checked[r][c]) || TrailGrid[r][c] == id || LandGrid[r][c] == id)
			continue;

		if (Checked[r]) {
			Checked[r][c] = true;
		} else {
			Checked[r] = Array(250);
			Checked[r][c] = true;
		}

		if (surrounded) {
			filled.push(loc);
		}

		locs.push([r + 1, c]);
		locs.push([r - 1, c]);
		locs.push([r, c + 1]);
		locs.push([r, c - 1]);
	}
	if (surrounded) {
		while (filled.length != 0) {
			loc = filled.pop();
			LandGrid[loc[0]][loc[1]] = id;
			TrailGrid[loc[0]][loc[1]] = 0;
		}
	}
}

function Kill(id) {
	for (let i = 0; i < 250; ++i) {
		for (let k = 0; k < 250; ++k) {
			if (LandGrid[i][k] == id) {
				LandGrid[i][k] = 0;
			}
			if (TrailGrid[i][k] == id) {
				TrailGrid[i][k] = 0;
			}
		}
	}
}

function Collision() {
	var r, c, r1, r2, c1, c2;
	if (Player1Data.Boardx == Player2Data.Boardx && Player1Data.Boardy == Player2Data.Boardy && Player1Data.Alive && Player2Data.Alive) {
		r = ((Player1Data.Boardy + 10) / 20) - 1;
		c = ((Player1Data.Boardx + 10) / 20) - 1;
		if (r % 1 == 0) {
			if (c % 1 == 0) {
				if (LandGrid[r][c] == 1) {
					Player1Data.Alive = false;
					Kill(1);
				} else if (LandGrid[r][c] == 2) {
					Player2Data.Alive = false;
					Kill(2);
				} else {
					Player1Data.Alive = false;
					Kill(1);
					Player2Data.Alive = false;
					Kill(2);
				}
			} else {
				c1 = Math.ceil(c);
				c2 = Math.floor(c);
				if (LandGrid[r][c1] == 1 && LandGrid[r][c2] == 1) {
					Player2Data.Alive = false;
					Kill(2);
				} else if (LandGrid[r][c1] == 2 && LandGrid[r][c2] == 2) {
					Player1Data.Alive = false;
					Kill(1);
				} else {
					Player1Data.Alive = false;
					Kill(1);
					Player2Data.Alive = false;
					Kill(2);
				}
			}
		} else {
			r1 = Math.ceil(r);
			r2 = Math.floor(r);
			if (LandGrid[r1][c] == 1 && LandGrid[r2][c] == 1) {
				Player2Data.Alive = false;
				Kill(2);
			} else if (LandGrid[r1][c] == 2 && LandGrid[r2][c] == 2) {
				Player1Data.Alive = false;
				Kill(1);
			} else {
				Player1Data.Alive = false;
				Kill(1);
				Player2Data.Alive = false;
				Kill(2);
			}
		}
	}

	for (let i = 0; i < Bots.length; ++i) {
		if (Bots[i].Alive) {
			if (Player1Data.Boardx == Bots[i].Boardx && Player1Data.Boardy == Bots[i].Boardy && Player1Data.Alive) {
				r = ((Player1Data.Boardy + 10) / 20) - 1;
				c = ((Player1Data.Boardx + 10) / 20) - 1;
				if (r % 1 == 0) {
					if (c % 1 == 0) {
						if (LandGrid[r][c] == 1) {
							Bots[i].Alive = false;
							Kill(Bots[i].id);
						} else if (LandGrid[r][c] == Bots[i].id) {
							Player1Data.Alive = false;
							Kill(1);
						} else {
							Player1Data.Alive = false;
							Kill(1);
							Bots[i].Alive = false;
							Kill(Bots[i].id);
						}
					} else {
						c1 = Math.ceil(c);
						c2 = Math.floor(c);
						if (LandGrid[r][c1] == 1 && LandGrid[r][c2] == 1) {
							Bots[i].Alive = false;
							Kill(Bots[i].id);
						} else if (LandGrid[r][c1] == Bots[i].id && LandGrid[r][c1] == Bots[i].id) {
							Player1Data.Alive = false;
							Kill(1);
						} else {
							Player1Data.Alive = false;
							Kill(1);
							Bots[i].Alive = false;
							Kill(Bots[i].id);
						}
					}
				} else {
					r1 = Math.ceil(r);
					r2 = Math.floor(r);
					if (LandGrid[r1][c] == 1 && LandGrid[r2][c] == 1) {
						Bots[i].Alive = false;
						Kill(Bots[i].id);
					} else if (LandGrid[r1][c] == Bots[i].id && LandGrid[r2][c] == Bots[i].id) {
						Player1Data.Alive = false;
						Kill(1);
					} else {
						Player1Data.Alive = false;
						Kill(1);
						Bots[i].Alive = false;
						Kill(Bots[i].id);
					}
				}
			}
			if (Player2Data.Boardx == Bots[i].Boardx && Player2Data.Boardy == Bots[i].Boardy && Player2Data.Alive) {
				r = ((Player2Data.Boardy + 10) / 20) - 1;
				c = ((Player2Data.Boardx + 10) / 20) - 1;
				if (r % 1 == 0) {
					if (c % 1 == 0) {
						if (LandGrid[r][c] == 2) {
							Bots[i].Alive = false;
							Kill(Bots[i].id);
						} else if (LandGrid[r][c] == Bots[i].id) {
							Player2Data.Alive = false;
							Kill(2);
						} else {
							Player2Data.Alive = false;
							Kill(2);
							Bots[i].Alive = false;
							Kill(Bots[i].id);
						}
					} else {
						c1 = Math.ceil(c);
						c2 = Math.floor(c);
						if (LandGrid[r][c1] == 2 && LandGrid[r][c2] == 2) {
							Bots[i].Alive = false;
							Kill(Bots[i].id);
						} else if (LandGrid[r][c1] == Bots[i].id && LandGrid[r][c2] == Bots[i].id) {
							Player2Data.Alive = false;
							Kill(2);
						} else {
							Player2Data.Alive = false;
							Kill(2);
							Bots[i].Alive = false;
							Kill(Bots[i].id);
						}
					}
				} else {
					r1 = Math.ceil(r);
					r2 = Math.floor(r);
					if (LandGrid[r1][c] == 2 && LandGrid[r2][c] == 2) {
						Bots[i].Alive = false;
						Kill(Bots[i].id);
					} else if (LandGrid[r1][c] == Bots[i].id && LandGrid[r2][c] == Bots[i].id) {
						Player2Data.Alive = false;
						Kill(2);
					} else {
						Player2Data.Alive = false;
						Kill(2);
						Bots[i].Alive = false;
						Kill(Bots[i].id);
					}
				}
			}
			for (let k = i + 3; k < Bots.length; ++k) {
				if (Bots[i].Boardx == Bots[k].Boardx && Bots[i].Boardy == Bots[k].Boardy && Bots[k].Alive) {
					r = ((Bots[i].Boardy + 10) / 20) - 1;
					c = ((Bots[i].Boardx + 10) / 20) - 1;
					if (r % 1 == 0) {
						if (c % 1 == 0) {
							if (LandGrid[r][c] == Bots[i].id) {
								Bots[k].Alive = false;
								Kill(Bots[k].id);
							} else if (LandGrid[r][c] == Bots[k].id) {
								Bots[i].Alive = false;
								Kill(Bots[i].id);
							} else {
								Bots[i].Alive = false;
								Kill(Bots[i].id);
								Bots[k].Alive = false;
								Kill(Bots[k].id);
							}
						} else {
							c1 = Math.ceil(c);
							c2 = Math.floor(c);
							if (LandGrid[r][c1] == Bots[i].id && LandGrid[r][c2] == Bots[i].id) {
								Bots[k].Alive = false;
								Kill(Bots[k].id);
							} else if (LandGrid[r][c1] == Bots[k].id && LandGrid[r][c2] == Bots[k].id) {
								Bots[i].Alive = false;
								Kill(Bots[i].id);
							} else {
								Bots[i].Alive = false;
								Kill(Bots[i].id);
								Bots[k].Alive = false;
								Kill(Bots[k].id);
							}
						}
					} else {
						r1 = Math.ceil(r);
						r2 = Math.floor(r);
						if (LandGrid[r1][c] == Bots[i].id && LandGrid[r2][c] == Bots[i].id) {
							Bots[k].Alive = false;
							Kill(Bots[k].id);
						} else if (LandGrid[r1][c] == Bots[k].id && LandGrid[r2][c] == Bots[k].id) {
							Bots[i].Alive = false;
							Kill(Bots[i].id);
						} else {
							Bots[i].Alive = false;
							Kill(Bots[i].id);
							Bots[k].Alive = false;
							Kill(Bots[k].id);
						}
					}
				}
			}
		}
	}
}

function Respawn(Data) {
	var Loc = randomSpawnLoc();
	var tries = 0;
	while (Loc.length < 1 && tries < 10) {

		Loc = randomSpawnLoc();
		++tries;
	}
	if (Loc.length < 1) {
		return Data;
	}
	Data.Alive = true;
	Data.Boardx = Loc[1] * 20 + 10;
	Data.Boardy = Loc[0] * 20 + 10;
	Spawn(Loc, Data.id);
	if (Data.id < 3) {
		if (Loc[0] < 9) {
			Data.Direction = "down";
		} else if (Loc[0] > 240) {
			Data.Direction = "up";
		} else {
			if (Loc[1] < 9) {
				Data.Direction = "right";
			} else if (Loc[1] > 240) {
				Data.Direction = "left";
			} else {
				var d = Math.round(Math.random()*100) % 4;
				if (d == 0) {
					Data.Direction = "up";
				} else if (d == 1) {
					Data.Direction = "right";
				} else if (d == 2) {
					Data.Direction = "down";
				} else {
					Data.Direction = "left";
				}
			}
		}
		if (Data.Direction == "up") {
			Data.speedX = 0;
			Data.speedY = 5;
		} else if (Data.Direction == "right") {
			Data.speedX = 5;
			Data.speedY = 0;
		} else if (Data.Direction == "down") {
			Data.speedX = 0;
			Data.speedY = -5;
		} else {
			Data.speedX = -5;
			Data.speedY = 0;
		}
		//Data = updatePlayer(Data);
	} else {
		var d = Math.round(Math.random() * 100) % 4;
		if (d == 0) {
			Data.speedX = 0;
			Data.speedY = 5;
		} else if (d == 1) {
			Data.speedX = 5;
			Data.speedY = 0;
		} else if (d == 2) {
			Data.speedX = 0;
			Data.speedY = -5;
		} else {
			Data.speedX = -5;
			Data.speedY = 0;
		}
	}
	
	return Data;
}

function CreateBotCam(index) {
	BotCam = true;
	var newGameArea = {
		canvas: document.createElement("canvas"),
		start: function () {

			this.canvas.setAttribute("id", ("GameArea" + index));
			this.canvas.width = Thecanvas.width * Multiplier;
			this.canvas.height = Thecanvas.height * Multiplier;
			this.context = this.canvas.getContext("2d");

			document.body.insertBefore(this.canvas, document.body.childNodes[document.body.childNodes.length-1]);
		},
		clear: function () {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}
	myGameAreas.push(newGameArea);
	myGameAreas[myGameAreas.length-1].start();
	BotCams.push(index);
}

function DrawBotCams() {

	for (let i = 2; i < myGameAreas.length; ++i) {
		myGameAreas[i].clear();
		GridDraw(Bots[BotCams[i - 2]], i);

		myGameAreas[i].context.save();
		myGameAreas[i].context.translate(Player1Data.Boardx - Bots[BotCams[i - 2]].Boardx + Bots[BotCams[i - 2]].x, Player1Data.Boardy - Bots[BotCams[i - 2]].Boardy + Bots[BotCams[i - 2]].y);
		myGameAreas[i].context.rotate(Player1Data.angle);
		myGameAreas[i].context.drawImage(Player1Data.image, -(Player1Data.width / 2), -(Player1Data.height / 2), Player1Data.width, Player1Data.height);
		myGameAreas[i].context.restore();

		if (GameType == "twoPlayer") {
			myGameAreas[i].context.save();
			myGameAreas[i].context.translate(Player2Data.Boardx - Bots[BotCams[i - 2]].Boardx + Bots[BotCams[i - 2]].x, Player2Data.Boardy - Bots[BotCams[i - 2]].Boardy + Bots[BotCams[i - 2]].y);
			myGameAreas[i].context.rotate(Player2Data.angle);
			myGameAreas[i].context.drawImage(Player2Data.image, -(Player2Data.width / 2), -(Player2Data.height / 2), Player2Data.width, Player2Data.height);
			myGameAreas[i].context.restore();
		}
		for (let k = 0; k < Bots.length; ++k) {
			if (k != BotCams[i - 2]) {
				myGameAreas[i].context.save();
				myGameAreas[i].context.translate(Bots[k].Boardx - Bots[BotCams[i - 2]].Boardx + Bots[BotCams[i - 2]].x, Bots[k].Boardy - Bots[BotCams[i - 2]].Boardy + Bots[BotCams[i - 2]].y);
				myGameAreas[i].context.rotate(Bots[k].angle);
				myGameAreas[i].context.drawImage(Bots[k].image, -(Bots[k].width / 2), -(Bots[k].height / 2), Bots[k].width, Bots[k].height);
				myGameAreas[i].context.restore();
			} else {
				myGameAreas[i].context.save();
				myGameAreas[i].context.translate(Bots[BotCams[i - 2]].x, Bots[BotCams[i - 2]].y);
				myGameAreas[i].context.rotate(Bots[BotCams[i - 2]].angle);
				myGameAreas[i].context.drawImage(Bots[BotCams[i - 2]].image, -(Bots[BotCams[i - 2]].width / 2), -(Bots[BotCams[i - 2]].height / 2), Bots[BotCams[i - 2]].width, Bots[BotCams[i - 2]].height);
				myGameAreas[i].context.restore();
			}
		}
	}
}

/*
Add respawn (maybe press a button? or a timer? or both? I'm not sure. Ask for opinions)
Add AI

Add Names above players
Add top 5ish % covered
Add Character Selection
Add animated characters?

*/