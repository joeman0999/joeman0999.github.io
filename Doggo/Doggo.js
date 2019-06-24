// Get canvas
var Thecanvas = {
	width: 900,
	height: 600
}

var Bounds = {
	xMin: 40,
	yMin: 40,
	xMax: 880,
	yMax: 560
}

var myGameArea = {
	canvas: document.createElement("canvas"),
	start: function () {
		myGameArea.keys = [];
		frame = 0;
		this.canvas.setAttribute("id", "GameArea")
		this.canvas.width = Thecanvas.width;
		this.canvas.height = Thecanvas.height;
		this.context = this.canvas.getContext("2d");
		this.context.font = "10px Arial";
		this.context.fillStyle = "black";
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', keydownhandler)
		window.addEventListener('keyup', keyuphandler)

	},
	stop: function () {
		myGameArea.keys = [];
		clearInterval(this.interval);
		window.removeEventListener('keydown',keydownhandler);
		window.removeEventListener('keyup',keyuphandler);
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
	myGameArea.clear;
	document.getElementById("ButtonArea").hidden = true;
	if (document.getElementById("GameArea")) {
		document.getElementById("GameArea").hidden = true;
	}
	document.getElementById("Menu").hidden = false;
}

// Create sprite sheet
var Person = new Image();

// Load sprite sheet
Person.src = "images/Walking Sprite.png";

// Create sprite
var PersonData = {
	context: myGameArea.canvas.getContext("2d"),
	x: 50,
	y: 50,
	speedX: 0,
	speedY: 0,
	width: 476,
	height: 424,
	image: Person,
	ticksPerFrame: 4,
	ticks: 0,
	xFrame: 4,
	yFrame: 0,
	StartFrame: 4,
	numberOfXFrames: 12,
	numberOfYFrames: 8,
	TotalFramesPerAnimation: 1,
	Characterx: 0,
	Charactery: 0,
	Th: 15,
	Bh: 15,
	Rw: 20,
	Lw: 20,
	angle: 0,
};

var FollowDog = new Image();

FollowDog.src = "images/Dogs.png";

var FollowDogData = {
	context: myGameArea.canvas.getContext("2d"),
	x: 90,
	y: 50,
	speedX: 0,
	speedY: 0,
	width: 384,
	height: 256,
	image: FollowDog,
	ticksPerFrame: 4,
	ticks: 0,
	xFrame: 1,
	yFrame: 0,
	StartFrame: 1,
	numberOfXFrames: 12,
	numberOfYFrames: 8,
	TotalFramesPerAnimation: 1,
	Characterx: 0,
	Charactery: 0,
	Th: 20,
	Bh: 10,
	Rw: 16,
	Lw: 16,
	angle: 0,
	DogPush: false,
	DogPresent: true,
	BarkFrame: Math.random() * 100 + 150,
	LastBark: 0,
	BarkDuration: 0,
}

var Tree = new Image();
Tree.src = "images/Tree.png";
var RedHouse = new Image();
RedHouse.src = "images/Red House.png";
var Objects = [
	{
		Object: "Tree",
		context: myGameArea.canvas.getContext("2d"),
		x: 200,
		y: 200,
		width: 39,
		height: 46,
		image: Tree,
		xFrame: 0,
		yFrame: 0,
		numberOfXFrames: 1,
		numberOfYFrames: 1,
		Th: 23,
		Bh: 18,
		Rw: 18,
		Lw: 18,
		angle: 0,
	},{
		Object: "Tree",
		context: myGameArea.canvas.getContext("2d"),
		x: 400,
		y: 400,
		width: 39,
		height: 46,
		image: Tree,
		xFrame: 0,
		yFrame: 0,
		numberOfXFrames: 1,
		numberOfYFrames: 1,
		Th: 23,
		Bh: 18,
		Rw: 18,
		Lw: 18,
		angle: 0,
	}, {
		Object: "Tree",
		context: myGameArea.canvas.getContext("2d"),
		x: 250,
		y: 300,
		width: 39,
		height: 46,
		image: Tree,
		xFrame: 0,
		yFrame: 0,
		numberOfXFrames: 1,
		numberOfYFrames: 1,
		Th: 23,
		Bh: 18,
		Rw: 18,
		Lw: 18,
		angle: 0,
	}, {
		Object: "Tree",
		context: myGameArea.canvas.getContext("2d"),
		x: 281,
		y: 92,
		width: 39,
		height: 46,
		image: Tree,
		xFrame: 0,
		yFrame: 0,
		numberOfXFrames: 1,
		numberOfYFrames: 1,
		Th: 23,
		Bh: 18,
		Rw: 18,
		Lw: 18,
		angle: 0,
	}, {
		Object: "Tree",
		context: myGameArea.canvas.getContext("2d"),
		x: 481,
		y: 92,
		width: 39,
		height: 46,
		image: Tree,
		xFrame: 0,
		yFrame: 0,
		numberOfXFrames: 1,
		numberOfYFrames: 1,
		Th: 23,
		Bh: 18,
		Rw: 18,
		Lw: 18,
		angle: 0,
	}, {
		Object: "RedHouse",
		context: myGameArea.canvas.getContext("2d"),
		x: 130,
		y: 375,
		width: 96,
		height: 96,
		image: RedHouse,
		xFrame: 0,
		yFrame: 0,
		numberOfXFrames: 1,
		numberOfYFrames: 1,
		Th: 34,
		Bh: 39,
		Rw: 39,
		Lw: 39,
		angle: 0,
	}
]

var MyText = [];

function updateGameArea() {
	myGameArea.clear();
	frame += 1;
	PersonData = updateCharacter(PersonData);
	render(PersonData);
	if (FollowDogData.DogPresent) {
		FollowDogData = updateFollowDog(FollowDogData);
		render(FollowDogData);
	}
	for (var k = 0; k < Objects.length; k++) {
		render(Objects[k])
	}
	WriteText();
}

function updateCharacter(Data) {
	Data.speedX = 0;
	Data.speedY = 0;
	if (myGameArea.keys && myGameArea.keys[37]) {
		Data.speedX = -3;
		if (Data.yFrame != Data.Charactery * 4 + 1) {
			Data.TotalFramesPerAnimation = 3;
			Data.StartFrame = Data.Characterx * 3;
			Data.xFrame = Data.Characterx * 3;
			Data.yFrame = Data.Charactery * 4 + 1;
		}
	} else if (myGameArea.keys && myGameArea.keys[39]) {
		Data.speedX = 3;
		if (Data.yFrame != Data.Charactery * 4 + 2) {
			Data.TotalFramesPerAnimation = 3;
			Data.StartFrame = Data.Characterx * 3;
			Data.xFrame = Data.Characterx * 3;
			Data.yFrame = Data.Charactery * 4 + 2;
		}
	} else if (myGameArea.keys && myGameArea.keys[38]) {
		Data.speedY = 3;
		if (Data.yFrame != Data.Charactery * 4 + 3) {
			Data.TotalFramesPerAnimation = 3;
			Data.StartFrame = Data.Characterx * 3;
			Data.xFrame = Data.Characterx * 3;
			Data.yFrame = Data.Charactery * 4 + 3;
		}
	} else if (myGameArea.keys && myGameArea.keys[40]) {
		Data.speedY = -3;
		if (Data.yFrame != Data.Charactery * 4 || Data.StartFrame == Data.Characterx * 3 + 1) {
			Data.TotalFramesPerAnimation = 3;
			Data.StartFrame = Data.Characterx * 3;
			Data.xFrame = Data.Characterx * 3;
			Data.yFrame = Data.Charactery * 4;
		}
	} else {
		Data.TotalFramesPerAnimation = 1;
		Data.xFrame = Data.Characterx * 3 + 1;
		Data.yFrame = Data.Charactery * 4;
		Data.StartFrame = Data.Characterx * 3 + 1;
	}
	Data.x += Data.speedX;
	Data.y -= Data.speedY;
	if (Data.x + Data.Rw / 2 > Bounds.xMax || Data.x - Data.Rw / 2 < Bounds.xMin || Data.y + Data.Th / 2 > Bounds.yMax || Data.y - Data.Th / 2 < Bounds.yMin) {
		Data.x -= Data.speedX;
		Data.y += Data.speedY;
		FollowDogData.DogPush = false;
	} else if (FollowDogData.DogPresent && Collision(Data, FollowDogData)) {
		//Data.x -= Data.speedX;
		//Data.y += Data.speedY;
		FollowDogData.x += Data.speedX;
		FollowDogData.y -= Data.speedY;
		for (var ii = 0; ii < Objects.length; ii++) {
			if (Collision(FollowDogData, Objects[ii])) {
				Data.x -= Data.speedX;
				Data.y += Data.speedY;
				break;
			}
		}
		var objhit = false;
		FollowDogData.x -= Data.speedX;
		FollowDogData.y += Data.speedY;
		for (var ii = 0; ii < Objects.length; ii++) {
			if (Collision(Data, Objects[ii])) {
				Data.x -= Data.speedX;
				Data.y += Data.speedY;
				objhit = true;
				break;
			}
		}
		if (objhit == false) {
			FollowDogData.DogPush = true;
		}
	} else {
		FollowDogData.DogPush = false;
		for(var ii = 0; ii< Objects.length; ii++) {
			if (Collision(Data, Objects[ii])) {
				Data.x -= Data.speedX;
				Data.y += Data.speedY;
				break;
			}
		}
	}
	

	Data.ticks += 1;

	if (Data.ticks >= Data.ticksPerFrame) {

		Data.ticks = 0;

		// If the current frame index is in range
		if (Data.xFrame < Data.TotalFramesPerAnimation + Data.StartFrame - 1) {
			// Go to the next frame
			Data.xFrame += 1;
		} else if (Data.xFrame = Data.TotalFramesPerAnimation + Data.StartFrame - 1) {
			Data.xFrame = Data.StartFrame;
		} 
	}
	return Data;
};

function updateFollowDog(Data) {
	var x, y
	x = PersonData.x - Data.x;
	y = Data.y - PersonData.y;

	Data.speedX = 0;
	Data.speedY = 0;
	if (Math.abs(x) > 50) {
		if (x < -10) {
			Data.speedX = -2;
			if (Data.yFrame != Data.Charactery * 4 + 1) {
				Data.TotalFramesPerAnimation = 3;
				Data.StartFrame = Data.Characterx * 3;
				Data.xFrame = Data.Characterx * 3;
				Data.yFrame = Data.Charactery * 4 + 1;
			}
		} else if (x > 10) {
			Data.speedX = 2;
			if (Data.yFrame != Data.Charactery * 4 + 2) {
				Data.TotalFramesPerAnimation = 3;
				Data.StartFrame = Data.Characterx * 3;
				Data.xFrame = Data.Characterx * 3;
				Data.yFrame = Data.Charactery * 4 + 2;
			}
		}
	} else if (Math.abs(y) > 50) {
		if (y > 0) {
			Data.speedY = 2;
			if (Data.yFrame != Data.Charactery * 4 + 3) {
				Data.TotalFramesPerAnimation = 3;
				Data.StartFrame = Data.Characterx * 3;
				Data.xFrame = Data.Characterx * 3;
				Data.yFrame = Data.Charactery * 4 + 3;
			}
		} else if (y < 0) {
			Data.speedY = -2;
			if (Data.yFrame != Data.Charactery * 4 || Data.StartFrame == Data.Characterx * 3 + 1) {
				Data.TotalFramesPerAnimation = 3;
				Data.StartFrame = Data.Characterx * 3;
				Data.xFrame = Data.Characterx * 3;
				Data.yFrame = Data.Charactery * 4;
			}
		}

	} else if (Data.DogPush) {
		if (PersonData.speedX == -3) {
			Data.speedX = -3;
			if (Data.yFrame != Data.Charactery * 4 + 1) {
				Data.TotalFramesPerAnimation = 3;
				Data.StartFrame = Data.Characterx * 3;
				Data.xFrame = Data.Characterx * 3;
				Data.yFrame = Data.Charactery * 4 + 1;
			}
		} else if (PersonData.speedX == 3) {
			Data.speedX = 3;
			if (Data.yFrame != Data.Charactery * 4 + 2) {
				Data.TotalFramesPerAnimation = 3;
				Data.StartFrame = Data.Characterx * 3;
				Data.xFrame = Data.Characterx * 3;
				Data.yFrame = Data.Charactery * 4 + 2;
			}
		} else if (PersonData.speedY == 3) {
			Data.speedY = 3;
			if (Data.yFrame != Data.Charactery * 4 + 3) {
				Data.TotalFramesPerAnimation = 3;
				Data.StartFrame = Data.Characterx * 3;
				Data.xFrame = Data.Characterx * 3;
				Data.yFrame = Data.Charactery * 4 + 3;
			}
		} else if (PersonData.speedY == -3) {
			Data.speedY = -3;
			if (Data.yFrame != Data.Charactery * 4 || Data.StartFrame == Data.Characterx * 3 + 1) {
				Data.TotalFramesPerAnimation = 3;
				Data.StartFrame = Data.Characterx * 3;
				Data.xFrame = Data.Characterx * 3;
				Data.yFrame = Data.Charactery * 4;
			}
		}
	}else {
		Data.TotalFramesPerAnimation = 1;
		Data.xFrame = Data.Characterx * 3 + 1;
		Data.yFrame = Data.Charactery * 4;
		Data.StartFrame = Data.Characterx * 3 + 1;
	} 

	Data.x += Data.speedX;
	Data.y -= Data.speedY;

	for (var ii = 0; ii < Objects.length; ii++) {
		if (Collision(Data, Objects[ii])) {
			Data.x -= Data.speedX;
			Data.y += Data.speedY;
			break;
		}
	}

	Data.ticks += 1;
	if (frame < Data.LastBark + Data.BarkDuration) {
		let newText = {
			text: "Woof!",
			x: Data.x,
			y: Data.y
		}
		if (Data.speedX == 0) {
			newText.x += 15;
		} else if (Data.speedX > 0) {
			newText.x += 20;
		} else {
			newText.x -= 45;
		}
		MyText.push(newText);
	} else if (frame > Data.BarkFrame) {
		Data.BarkFrame = frame + Math.random() * 200 + 100;
		Data.LastBark = frame;
		Data.BarkDuration = Math.random() * 10 + 25;
	}

	if (Data.ticks >= Data.ticksPerFrame) {

		Data.ticks = 0;

		// If the current frame index is in range
		if (Data.xFrame < Data.TotalFramesPerAnimation + Data.StartFrame - 1) {
			// Go to the next frame
			Data.xFrame += 1;
		} else if (Data.xFrame = Data.TotalFramesPerAnimation + Data.StartFrame - 1) {
			Data.xFrame = Data.StartFrame;
		}
	}
	return Data;
}

function render(Data) {

	// Draw the animation
	// Data.context.drawImage
	
	Data.context.drawImage(
		Data.image,
		Data.xFrame * Data.width / Data.numberOfXFrames,
		Data.yFrame * Data.height / Data.numberOfYFrames,
		Data.width / Data.numberOfXFrames,
		Data.height / Data.numberOfYFrames,
		Data.x - (Data.width / Data.numberOfXFrames)/2,
		Data.y - (Data.height / Data.numberOfYFrames)/2,
		Data.width / Data.numberOfXFrames,
		Data.height / Data.numberOfYFrames);
		
};

function Draw(Data) {
	for (var k = 0; k < Data.x.length; k++) {
		Data.context.drawImage(Data.image, Data.x[k], Data.y[k])
	}
}

function WriteText() {
	for (let i = 0; i < MyText.length; ++i) {
		var width = myGameArea.context.measureText(MyText[i].text).width + 4;
		myGameArea.context.fillStyle = 'White';
		myGameArea.context.fillRect(MyText[i].x - 2, MyText[i].y - 10, width, 12);
		myGameArea.context.fillStyle = 'Black';
		myGameArea.context.fillText(MyText[i].text, MyText[i].x, MyText[i].y);
	}
	MyText = [];
}

function CharacterSelect() {
	var Selector, value
	Selector = document.getElementById("Character-selector");
	value = Selector.value;
	if (value >= 0 && value <= 3) {
		PersonData.Characterx = value;
		PersonData.Charactery = 0;
	} else {
		PersonData.Characterx = value - 4;
		PersonData.Charactery = 1;
	}
}

function AnimalSelect() {
	var Selector, value
	Selector = document.getElementById("Animal-selector");
	value = Selector.value;
	if (value >= 0 && value <= 3) {
		FollowDogData.Characterx = value;
		FollowDogData.Charactery = 0;
	} else {
		FollowDogData.Characterx = value - 4;
		FollowDogData.Charactery = 1;
	}
}

function Collision(obj1, obj2) {
	var overlap = false;
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

	d1, d2, d3, d4
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

function keydownhandler(e) {
	myGameArea.keys = (myGameArea.keys || []);
	myGameArea.keys[e.keyCode] = (e.type == "keydown");
}

function keyuphandler(e) {
	myGameArea.keys[e.keyCode] = (e.type == "keydown");
}

/*
Fix the gray around the characters
Come up with Concept
Cut out rooms and different floors from the paint files you currently have
Same with buildings
*/