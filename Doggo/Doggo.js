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

var fadeit = 0;
var fade = "None";
var fadeComplete = false;
var Area = 0;

var myGameArea = {
	canvas: document.createElement("canvas"),
	start: function () {
		myGameArea.keys = [];
		frame = 0;
		this.canvas.setAttribute("id", "GameArea");
		this.canvas.width = Thecanvas.width * Multiplier;
		this.canvas.height = Thecanvas.height * Multiplier;
		this.context = this.canvas.getContext("2d");
		myGameArea.context.font = "1rem Arial";
		this.context.fillStyle = "black";
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', keydownhandler);
		window.addEventListener('keyup', keyuphandler);
		document.getElementById("GameArea").addEventListener('touchstart', handleTouchStart);
		document.getElementById("GameArea").addEventListener('touchmove', handleTouchMove);
		document.getElementById("GameArea").addEventListener('touchend', handleTouchEnd);
	},
	stop: function () {
		document.getElementById("GameArea").removeEventListener('touchstart', handleMenuButtons);
		document.getElementById("GameArea").removeEventListener('mousedown', handleMenuButtons);
	},
	pause: function () {
		myGameArea.keys = [];
		clearInterval(this.interval);
		document.getElementById("ButtonArea").hidden = true;
		window.removeEventListener('keydown', keydownhandler);
		window.removeEventListener('keyup', keyuphandler);
		document.getElementById("GameArea").removeEventListener('touchstart', handleTouchStart);
		document.getElementById("GameArea").removeEventListener('touchmove', handleTouchMove);
		document.getElementById("GameArea").removeEventListener('touchend', handleTouchEnd);

		PauseArea();
		document.getElementById("GameArea").addEventListener('touchstart', handleMenuButtons);
		document.getElementById("GameArea").addEventListener('mousedown', handleMenuButtons);
	},
	unpause: function () {
		document.getElementById("ButtonArea").hidden = false;
		document.getElementById("GameArea").removeEventListener('touchstart', handleMenuButtons);
		document.getElementById("GameArea").removeEventListener('mousedown', handleMenuButtons);

		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', keydownhandler);
		window.addEventListener('keyup', keyuphandler);
		document.getElementById("GameArea").addEventListener('touchstart', handleTouchStart);
		document.getElementById("GameArea").addEventListener('touchmove', handleTouchMove);
		document.getElementById("GameArea").addEventListener('touchend', handleTouchEnd);
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

var Person = new Image();
Person.src = "images/Walking Sprite.png";

var PersonData = {
	x: 70,
	y: 70,
	speedX: 0,
	speedY: 0,
	direction: "None",
	width: 476,
	height: 320,
	image: Person,
	ticksPerFrame: 4,
	ticks: 0,
	xFrame: 4,
	yFrame: 0,
	StartFrame: 4,
	numberOfXFrames: 12,
	numberOfYFrames: 8,
	UsualFramesPerAnimation: 3,
	TotalFramesPerAnimation: 1,
	IdleX: 1,
	Characterx: 0,
	Charactery: 0,
	Th: 25,
	Bh: 10,
	Rw: 20,
	Lw: 20,
	angle: 0
}

var PersonItems = {
	misc: [],
	money: 0,
	petFood: 0
};

var FollowDog = new Image();
FollowDog.src = "images/Dogs.png";
var FollowDogData = {
	x: 110,
	y: 60,
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
	UsualFramesPerAnimation: 3,
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
var PetStore = new Image();
PetStore.src = "images/PetStore.png";

var Maps = [
	{
		Objects: [
			{
				Object: "Tree",
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
			}, {
				Object: "Tree",
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
				x: 351,
				y: 142,
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
				x: 581,
				y: 162,
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
				x: 811,
				y: 362,
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
			}, {
				Object: "RedHouse",
				x: 530,
				y: 275,
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
			}, {
				Object: "RedHouse",
				x: 730,
				y: 475,
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
			}, {
				Object: "RedHouse",
				x: 730,
				y: 225,
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
		],
		CollisionAreas: [
			{
				Object: "House 1 Enter",
				x: 140,
				y: 440,
				Th: 3,
				Bh: 3,
				Rw: 3,
				Lw: 3,
				angle: 0,
				text: "Enter",
				area: 0,
				newArea: 1,
				newx: 450,
				newy: 425
			}, {
				Object: "House 2 Enter",
				x: 540,
				y: 335,
				Th: 3,
				Bh: 3,
				Rw: 3,
				Lw: 3,
				angle: 0,
				text: "Locked",
				additionalText: ["Enter"],
				area: 0,
				newArea: 3,
				newx: 450,
				newy: 425,
				requirment: "Key 1"
			}, {
				Object: "House 3 Enter",
				x: 740,
				y: 535,
				Th: 3,
				Bh: 3,
				Rw: 3,
				Lw: 3,
				angle: 0,
				text: "Locked",
				area: 0,
				newArea: 5,
				newx: 450,
				newy: 425,
				requirment: "Key?"
			}, {
				Object: "House 4 Enter",
				x: 740,
				y: 285,
				Th: 3,
				Bh: 3,
				Rw: 3,
				Lw: 3,
				angle: 0,
				text: "Locked",
				area: 0,
				newArea: 6,
				newx: 450,
				newy: 425,
				requirment: "Key?"
			}, {
				Object: "Map Area 2 Enter",
				x: 425,
				y: 25,
				Th: 3,
				Bh: 15,
				Rw: 40,
				Lw: 40,
				angle: 0,
				text: "Continue",
				area: 0,
				newArea: 2,
				newx: 420,
				newy: 540
			}
		]
	}, {
		Objects: [

		],
		CollisionAreas: [
			{
				Object: "House 1 Exit",
				x: 450,
				y: 425,
				width: 10,
				height: 10,
				Th: 3,
				Bh: 3,
				Rw: 3,
				Lw: 3,
				angle: 0,
				text: "Exit",
				area: 1,
				newArea: 0,
				newx: 140,
				newy: 440
			}
		]
	}, {
		Objects: [
			{
				Object: "PetStore",
				x: 350,
				y: 275,
				width: 213,
				height: 159,
				image: PetStore,
				xFrame: 0,
				yFrame: 0,
				numberOfXFrames: 1,
				numberOfYFrames: 1,
				Th: 40,
				Bh: 72,
				Rw: 100,
				Lw: 100,
				angle: 0,
			}, {
				Object: "Old Man",
				x: 310,
				y: 365,
				width: 476,
				height: 320,
				image: Person,
				xFrame: 1,
				yFrame: 0,
				numberOfXFrames: 12,
				numberOfYFrames: 8,
				Th: 25,
				Bh: 10,
				Rw: 20,
				Lw: 20,
				angle: 0,
			}
		],
		CollisionAreas: [
			{
				Object: "Map Area 1 Enter",
				x: 425,
				y: 565,
				Th: 15,
				Bh: 3,
				Rw: 40,
				Lw: 40,
				angle: 0,
				text: "Continue",
				area: 2,
				newArea: 0,
				newx: 425,
				newy: 55
			}, {
				Object: "Pet Store Enter",
				x: 350,
				y: 355,
				Th: 5,
				Bh: 5,
				Rw: 5,
				Lw: 5,
				angle: 0,
				text: "Locked",
				additionalText: ["Enter"],
				area: 2,
				newArea: 4,
				newx: 450,
				newy: 425,
				requirment: "Key 2"
			}, {
				Object: "Find Keys",
				x: 350,
				y: 355,
				Th: 5,
				Bh: 5,
				Rw: 5,
				Lw: 5,
				angle: 0,
				text: "Can you help me?",
				additionalText: ["I seem to have left the store keys at my house.", "Would you go get them for me I'm old and slow?", "Thank you! Here are my house keys."],
				area: 2,
				newx: 450,
				newy: 425,
				gives: "Key 1",
				gave: false,
				timer: 50
			}
		]
	}, {
		Objects: [

		],
		CollisionAreas: [
			{
				Object: "House 1 Exit",
				x: 450,
				y: 425,
				width: 10,
				height: 10,
				Th: 3,
				Bh: 3,
				Rw: 3,
				Lw: 3,
				angle: 0,
				text: "Exit",
				area: 3,
				newArea: 0,
				newx: 540,
				newy: 345
			}
		]
	}
]

var MyText = [];
var InnerButton = new Image();
InnerButton.src = "images/InnerButton.png";
var OuterButton = new Image();
OuterButton.src = "images/OuterButton.png";
var EnterButton = new Image();
EnterButton.src = "images/EnterButton.png";

var Button = {
	visible: false,
	x: 0,
	y: 0,
	innerX: 0,
	innerY: 0,
	side: "left",
	enter: false,
	frame: -40,
	enterX: 0,
	enterY: 0
}

window.onload = function () {
	var screenW = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
	var screenH = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
	if (screenW / 900 < screenH / 600) {
		var size = Math.floor(screenW * .95);
		Multiplier = size / 900;
	} else {
		var size = Math.floor(screenH * .95);
		Multiplier = size / 600;
	}
	window.addEventListener('resize', ResizeWindow);
	window.addEventListener("orientationchange", ResizeWindow);
	alert("New Update!!! Sorry it's been a while. This game is really hard to add to. Also, I've been busy with a brand new game!! Releasing soon!");
}

function ResizeWindow() {
	var screenW = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
	var screenH = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
	if (screenW / 900 < screenH / 600) {
		var size = Math.floor(screenW * .95);
		Multiplier = size / 900;
	} else {
		var size = Math.floor(screenH * .95);
		Multiplier = size / 600;
	}
	if (document.getElementById("GameArea")) {
		myGameArea.canvas.width = Thecanvas.width * Multiplier;
		myGameArea.canvas.height = Thecanvas.height * Multiplier;
	}
}

function keydownhandler(e) {
	myGameArea.keys = (myGameArea.keys || []);
	myGameArea.keys[e.keyCode] = (e.type == "keydown");
	if (e.keyCode == 87) {
		PersonData.direction = 'up';
	} else if (e.keyCode == 83) {
		PersonData.direction = 'down';
	} else if (e.keyCode == 68) {
		PersonData.direction = 'right';
	} else if (e.keyCode == 65) {
		PersonData.direction = 'left';
	}
}

function keyuphandler(e) {
	myGameArea.keys[e.keyCode] = (e.type == "keydown");
	if (e.keyCode == 87 && PersonData.direction == 'up') {
		PersonData.direction = "None";
	} else if (e.keyCode == 83 && PersonData.direction == 'down') {
		PersonData.direction = "None";
	} else if (e.keyCode == 68 && PersonData.direction == 'right') {
		PersonData.direction = "None";
	} else if (e.keyCode == 65 && PersonData.direction == 'left') {
		PersonData.direction = "None";
	}
	if (myGameArea.keys[87]) {
		PersonData.direction = 'up';
	} else if (myGameArea.keys[83]) {
		PersonData.direction = 'down';
	} else if (myGameArea.keys[68]) {
		PersonData.direction = 'right';
	} else if (myGameArea.keys[65]) {
		PersonData.direction = 'left';
	}
}

function handleTouchStart(e) {
	e.preventDefault();
	PersonData.direction = "None";
	var distance = Thecanvas.width * Multiplier;
	var index = -1;
	if (Button.side == "left") {
		for (let i = 0; i < e.touches.length; ++i) {
			if (e.touches[i].clientX - 10 < Thecanvas.width * Multiplier / 2 && Math.sqrt(Math.pow(Button.x - e.touches[i].clientX - 10, 2) + Math.pow(Button.y - e.touches[i].clientY - 10, 2)) < distance) {
				Button.innerX = e.touches[i].clientX - 10;
				Button.innerY = e.touches[i].clientY - 10;
				if (Button.visible) {
					distance = Math.sqrt(Math.pow(Button.x - e.touches[i].clientX - 10, 2) + Math.pow(Button.y - e.touches[i].clientY - 10, 2));
					index = i;
				} else {
					distance = 0;
					Button.visible = true;
					index = i;
					Button.x = e.touches[i].clientX - 10;
					Button.y = e.touches[i].clientY - 10;
				}
			} else {
				Button.enter = true;
				Button.enterX = e.touches[i].clientX - 10;
				Button.enterY = e.touches[i].clientY - 10;
				Button.frame = frame;
			}
		}
	}
	if (Button.visible) {
		if (distance < 40 * Multiplier) {
			Button.innerX = e.touches[index].clientX - 10;
			Button.innerY = e.touches[index].clientY - 10;
		} else {
			var Theta = Math.atan2(e.touches[index].clientY - 10 - Button.y, e.touches[index].clientX - 10 - Button.x);
			if (Theta >= Math.PI * 2) {
				Theta -= Math.PI * 2;
			} else if (Theta < 0) {
				Theta += Math.PI * 2;
			}
			Button.innerX = Math.cos(Theta) * 40 * Multiplier + Button.x;
			Button.innerY = Math.sin(Theta) * 40 * Multiplier + Button.y;
		}
		if (Math.abs(Button.innerX - Button.x) > Math.abs(Button.y - Button.innerY)) {
			if (Button.innerX - Button.x > 0) {
				PersonData.direction = 'right';
			} else {
				PersonData.direction = 'left';
			}
		} else if (Button.y != Button.innerY) {
			if (Button.y - Button.innerY > 0) {
				PersonData.direction = 'up';
			} else {
				PersonData.direction = 'down';
			}
		}
	}
}

function handleTouchMove(e) {
	e.preventDefault();
	if (Button.visible) {
		var distance = Thecanvas.width * Multiplier;
		var index = -1;
		if (Button.side == "left") {
			for (let i = 0; i < e.touches.length; ++i) {
				if (Math.sqrt(Math.pow(Button.x - e.touches[i].clientX - 10, 2) + Math.pow(Button.y - e.touches[i].clientY - 10, 2)) < distance) {
					distance = Math.sqrt(Math.pow(Button.x - e.touches[i].clientX - 10, 2) + Math.pow(Button.y - e.touches[i].clientY - 10, 2));
					index = i;
				}
			}
		}
		if (Button.visible) {
			if (distance < 40 * Multiplier) {
				Button.innerX = e.touches[index].clientX - 10;
				Button.innerY = e.touches[index].clientY - 10;
			} else {
				var Theta = Math.atan2(e.touches[index].clientY - 10 - Button.y, e.touches[index].clientX - 10 - Button.x);
				if (Theta >= Math.PI * 2) {
					Theta -= Math.PI * 2;
				} else if (Theta < 0) {
					Theta += Math.PI * 2;
				}
				Button.innerX = Math.cos(Theta) * 40 * Multiplier + Button.x;
				Button.innerY = Math.sin(Theta) * 40 * Multiplier + Button.y;
			}
			if (Math.abs(Button.innerX - Button.x) > Math.abs(Button.y - Button.innerY)) {
				if (Button.innerX - Button.x > 0) {
					PersonData.direction = 'right';
				} else {
					PersonData.direction = 'left';
				}
			} else if (Button.y != Button.innerY){
				if (Button.y - Button.innerY > 0) {
					PersonData.direction = 'up';
				} else {
					PersonData.direction = 'down';
				}
			}
		}
	}
}

function handleTouchEnd(e) {
	if (Button.side == "left") {
		for (let i = 0; i < e.touches.length; ++i) {
			if (e.touches[i].clientX - 10 < Thecanvas.width * Multiplier / 2 && Math.sqrt(Math.pow(Button.x - e.touches[i].clientX - 10, 2) + Math.pow(Button.y - e.touches[i].clientY - 10, 2)) < distance) {
				return;
			}
		}
		PersonData.direction = "None";
		Button.visible = false;
	}
}

function handleMenuButtons(e) {
	var click = {
		x: 0,
		y: 0
	}
	if (e.touches) {
		click.x = e.touches[0].clientX - 10;
		click.y = e.touches[0].clientY - 10;
	} else {
		click.x = e.clientX - 10;
		click.y = e.clientY - 10;
	}

	myGameArea.context.font = "2rem Arial";
	var MenuText = [
		{
			text: "Resume",
			y: 200
		},
		{
			text: "Exit Game",
			y: 400
		}
	];
	
	for (let i = 0; i < MenuText.length; ++i) {
		var dw = (myGameArea.context.measureText(MenuText[i].text).width) / 2;
		var dh = myGameArea.context.measureText("M").width;
		if (click.x >= Thecanvas.width / 2 * Multiplier - dw && click.x <= Thecanvas.width / 2 * Multiplier + dw && click.y <= MenuText[i].y * Multiplier && click.y >= MenuText[i].y * Multiplier - dh) {
			if (MenuText[i].text == "Resume") {
				myGameArea.unpause();
			} else {
				Menu();
			}
		}
	}
}

function StartGame() {
	document.getElementById("Menu").hidden = true;
	if (document.getElementById("GameArea")) {
		document.getElementById("GameArea").hidden = false;
	}
	myGameArea.start();
	document.getElementById("ButtonArea").hidden = false;
	fadeit = 100;
	fade = "in";
	AreaSelect(0);
	CharacterSelect();
	AnimalSelect();
}

function Menu() {
	myGameArea.stop();
	myGameArea.clear();
	if (document.getElementById("GameArea")) {
		document.getElementById("GameArea").hidden = true;
	}
	document.getElementById("Menu").hidden = false;
}

function PauseArea() {
	myGameArea.context.fillStyle = 'Black';
	myGameArea.context.globalAlpha = .5;
	myGameArea.context.fillRect(0, 0, Thecanvas.width * Multiplier, Thecanvas.height * Multiplier);
	myGameArea.context.globalAlpha = 1;
	
	myGameArea.context.font = "2rem Arial";
	var MenuText = [
		{
			text: "Resume",
			y: 200
		},
		{
			text: "Exit Game",
			y: 400
		}
	];

	for (let i = 0; i < MenuText.length; ++i) {
		var dw = (myGameArea.context.measureText(MenuText[i].text).width) / 2;
		myGameArea.context.fillStyle = 'Grey';
		myGameArea.context.fillText(MenuText[i].text, Thecanvas.width / 2 * Multiplier - dw, MenuText[i].y * Multiplier);
	}
}

function updateGameArea() {
	myGameArea.clear();
	++frame;
	PersonData = updateCharacter(PersonData);
	render(PersonData);
	if (FollowDogData.DogPresent) {
		FollowDogData = updateFollowDog(FollowDogData);
		render(FollowDogData);
	}
	for (var k = 0; k < Maps[Area].Objects.length; k++) {
		render(Maps[Area].Objects[k])
	}
	WriteText();
	DrawButton();
	if (fade == "out" || fade == "in") {
		Fade();
	}
}

function updateCharacter(Data) {
	Data.speedX = 0;
	Data.speedY = 0;
	if (Data.direction == 'left') {
		Data.speedX = -3;
		if (Data.yFrame != Data.Charactery * 4 + 1) {
			Data.TotalFramesPerAnimation = Data.UsualFramesPerAnimation;
			Data.StartFrame = Data.Characterx * Data.UsualFramesPerAnimation;
			Data.xFrame = Data.Characterx * Data.UsualFramesPerAnimation;
			Data.yFrame = Data.Charactery * 4 + 1;
		}
	} else if (Data.direction == 'right') {
		Data.speedX = 3;
		if (Data.yFrame != Data.Charactery * 4 + 2) {
			Data.TotalFramesPerAnimation = Data.UsualFramesPerAnimation;
			Data.StartFrame = Data.Characterx * Data.UsualFramesPerAnimation;
			Data.xFrame = Data.Characterx * Data.UsualFramesPerAnimation;
			Data.yFrame = Data.Charactery * 4 + 2;
		}
	} else if (Data.direction == 'up') {
		Data.speedY = 3;
		if (Data.yFrame != Data.Charactery * 4 + 3) {
			Data.TotalFramesPerAnimation = Data.UsualFramesPerAnimation;
			Data.StartFrame = Data.Characterx * Data.UsualFramesPerAnimation;
			Data.xFrame = Data.Characterx * Data.UsualFramesPerAnimation;
			Data.yFrame = Data.Charactery * 4 + 3;
		}
	} else if (Data.direction == 'down') {
		Data.speedY = -3;
		if (Data.yFrame != Data.Charactery * 4 || Data.TotalFramesPerAnimation == 1) {
			Data.TotalFramesPerAnimation = Data.UsualFramesPerAnimation;
			Data.StartFrame = Data.Characterx * Data.UsualFramesPerAnimation;
			Data.xFrame = Data.Characterx * Data.UsualFramesPerAnimation;
			Data.yFrame = Data.Charactery * 4;
		}
	} else {
		Data.TotalFramesPerAnimation = 1;
		Data.xFrame = Data.IdleX;
		Data.yFrame = Data.Charactery * 4;
		Data.StartFrame = Data.IdleX;
	}
	if (fade != "out") {
		Data.x += Data.speedX;
		Data.y -= Data.speedY;
	}
	if (Data.x + Data.Rw / 2 > Bounds.xMax || Data.x - Data.Rw / 2 < Bounds.xMin || Data.y + Data.Th / 2 > Bounds.yMax || Data.y - Data.Th / 2 < Bounds.yMin) {
		Data.x -= Data.speedX;
		Data.y += Data.speedY;
		FollowDogData.DogPush = false;
	} else if (FollowDogData.DogPresent && Collision(Data, FollowDogData)) {
		FollowDogData.x += Data.speedX;
		FollowDogData.y -= Data.speedY;
		for (let i = 0; i < Maps[Area].Objects.length; i++) {
			if (Collision(FollowDogData, Maps[Area].Objects[i])) {
				Data.x -= Data.speedX;
				Data.y += Data.speedY;
				break;
			}
		}
		var objhit = false;
		if (FollowDogData.x + FollowDogData.Rw / 2 > Bounds.xMax || FollowDogData.x - FollowDogData.Rw / 2 < Bounds.xMin || FollowDogData.y + FollowDogData.Th / 2 > Bounds.yMax || FollowDogData.y - FollowDogData.Th / 2 < Bounds.yMin) {
			Data.x -= Data.speedX;
			Data.y += Data.speedY;
			FollowDogData.x -= Data.speedX;
			FollowDogData.y += Data.speedY;
			objhit = true;
		} else {
			FollowDogData.x -= Data.speedX;
			FollowDogData.y += Data.speedY;
			for (let i = 0; i < Maps[Area].Objects.length; i++) {
				if (Collision(Data, Maps[Area].Objects[i])) {
					Data.x -= Data.speedX;
					Data.y += Data.speedY;
					objhit = true;
					break;
				}
			}
		}		
		if (objhit == false) {
			FollowDogData.DogPush = true;
		}
	} else {
		FollowDogData.DogPush = false;
		for (let i = 0; i < Maps[Area].Objects.length; i++) {
			if (Collision(Data, Maps[Area].Objects[i])) {
				Data.x -= Data.speedX;
				Data.y += Data.speedY;
				break;
			}
		}
	}
	for (let i = 0; i < Maps[Area].CollisionAreas.length; i++) {
		if (Area == Maps[Area].CollisionAreas[i].area && Collision(Data, Maps[Area].CollisionAreas[i])) {
			if (fadeComplete) {
				fadeComplete = false;
				Data.x = Maps[Area].CollisionAreas[i].newx;
				Data.y = Maps[Area].CollisionAreas[i].newy;
				FollowDogData.x = Data.x + 40;
				FollowDogData.y = Data.y;
				AreaSelect(Maps[Area].CollisionAreas[i].newArea);
				break;
			}
			let newText = {
				text: Maps[Area].CollisionAreas[i].text,
				x: Data.x,
				y: Data.y
			}
			if (Data.y < 80) {
				newText.x += 20;
			} else {
				newText.y -= 20;
			}
			if (newText.text == "Enter" || newText.text == "Continue" || newText.text == "Exit") {
				if ((myGameArea.keys && myGameArea.keys[13] || Button.enter) && fade == "None") {
					fade = "out";
				}
			} else if (Maps[Area].CollisionAreas[i].additionalText && Maps[Area].CollisionAreas[i].additionalText.length != 0) {
				if (newText.text == "Locked") {
					for (let ii = 0; ii < PersonItems.misc.length; ++ii) {
						if (PersonItems.misc[ii] == Maps[Area].CollisionAreas[i].requirment) {
							newText.text = "Unlock";
						}
					}
					if ((myGameArea.keys && myGameArea.keys[13] || Button.enter) && fade == "None") {
						for (let ii = 0; ii < PersonItems.misc.length; ++ii) {
							if (PersonItems.misc[ii] == Maps[Area].CollisionAreas[i].requirment) {
								Maps[Area].CollisionAreas[i].text = Maps[Area].CollisionAreas[i].additionalText[0];
								Maps[Area].CollisionAreas[i].additionalText.splice(0, 1);
								PersonItems.misc.splice(ii, 1);
							}
						}
					}
				} else {
					if ((myGameArea.keys && myGameArea.keys[13] || Button.enter) && fade == "None") {
						Maps[Area].CollisionAreas[i].text = Maps[Area].CollisionAreas[i].additionalText[0];
						Maps[Area].CollisionAreas[i].additionalText.splice(0, 1);
						myGameArea.keys[13] = false; 
						Button.enter = false;
						if (Maps[Area].CollisionAreas[i].additionalText.length == 0 && Maps[Area].CollisionAreas[i].gives && !Maps[Area].CollisionAreas[i].gave) {
							PersonItems.misc.push(Maps[Area].CollisionAreas[i].gives);
							Maps[Area].CollisionAreas[i].gave = true;
						}
					}
				}
			} else {
				if (Maps[Area].CollisionAreas[i].timer > 0) {
					--Maps[Area].CollisionAreas[i].timer;
				} else {
					continue;
				}
			}
			MyText.push(newText);
		}
	}

	Button.enter = false;
	anim(Data);

	return Data;
}

function updateFollowDog(Data) {
	var x, y;
	x = PersonData.x - Data.x;
	y = Data.y - PersonData.y;

	Data.speedX = 0;
	Data.speedY = 0;
	if (Math.abs(x) > 50) {
		if (x < -10) {
			Data.speedX = -2;
			if (Data.yFrame != Data.Charactery * 4 + 1) {
				Data.TotalFramesPerAnimation = Data.UsualFramesPerAnimation;
				Data.StartFrame = Data.Characterx * Data.UsualFramesPerAnimation;
				Data.xFrame = Data.Characterx * Data.UsualFramesPerAnimation;
				Data.yFrame = Data.Charactery * 4 + 1;
			}
		} else if (x > 10) {
			Data.speedX = 2;
			if (Data.yFrame != Data.Charactery * 4 + 2) {
				Data.TotalFramesPerAnimation = Data.UsualFramesPerAnimation;
				Data.StartFrame = Data.Characterx * Data.UsualFramesPerAnimation;
				Data.xFrame = Data.Characterx * Data.UsualFramesPerAnimation;
				Data.yFrame = Data.Charactery * 4 + 2;
			}
		}
	} else if (Math.abs(y) > 50) {
		if (y > 0) {
			Data.speedY = 2;
			if (Data.yFrame != Data.Charactery * 4 + 3) {
				Data.TotalFramesPerAnimation = Data.UsualFramesPerAnimation;
				Data.StartFrame = Data.Characterx * Data.UsualFramesPerAnimation;
				Data.xFrame = Data.Characterx * Data.UsualFramesPerAnimation;
				Data.yFrame = Data.Charactery * 4 + 3;
			}
		} else if (y < 0) {
			Data.speedY = -2;
			if (Data.yFrame != Data.Charactery * 4 || Data.StartFrame == Data.Characterx * 3 + 1) {
				Data.TotalFramesPerAnimation = Data.UsualFramesPerAnimation;
				Data.StartFrame = Data.Characterx * Data.UsualFramesPerAnimation;
				Data.xFrame = Data.Characterx * Data.UsualFramesPerAnimation;
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

	if (Data.x + Data.Rw / 2 > Bounds.xMax || Data.x - Data.Rw / 2 < Bounds.xMin || Data.y + Data.Th / 2 > Bounds.yMax || Data.y - Data.Th / 2 < Bounds.yMin) {
		Data.x -= Data.speedX;
		Data.y += Data.speedY;
	}

	for (let i = 0; i < Maps[Area].Objects.length; i++) {
		if (Collision(Data, Maps[Area].Objects[i])) {
			Data.x -= Data.speedX;
			Data.y += Data.speedY;
			break;
		}
	}

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

	anim(Data);

	return Data;
}

function anim(Data) {
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
}

function render(Data) {
	myGameArea.context.drawImage(
		Data.image,
		Data.xFrame * Data.width / Data.numberOfXFrames,
		Data.yFrame * Data.height / Data.numberOfYFrames,
		Data.width / Data.numberOfXFrames,
		Data.height / Data.numberOfYFrames,
		(Data.x - (Data.width / Data.numberOfXFrames) / 2) * Multiplier,
		(Data.y - (Data.height / Data.numberOfYFrames) / 2) * Multiplier,
		(Data.width / Data.numberOfXFrames) * Multiplier,
		(Data.height / Data.numberOfYFrames) * Multiplier);
		
}

function DrawButton() {
	if (Button.visible) {
	myGameArea.context.globalAlpha = .5;
	myGameArea.context.drawImage(
		OuterButton,
		Button.x - (120 * Multiplier / 2),
		Button.y - (120 * Multiplier / 2),
		120 * Multiplier,
		120 * Multiplier);
	myGameArea.context.globalAlpha = 1;
	myGameArea.context.drawImage(
		InnerButton,
		Button.innerX - (40 * Multiplier / 2),
		Button.innerY - (40 * Multiplier / 2),
		40 * Multiplier,
		40 * Multiplier);
	}
	if (Button.frame + 40 > frame) {
		myGameArea.context.globalAlpha = (Button.frame + 40 - frame) / 40;
		myGameArea.context.drawImage(
			EnterButton,
			Button.enterX - (20 * Multiplier / 2 / ((Button.frame + 50 - frame) / 40)),
			Button.enterY - (20 * Multiplier / 2 / ((Button.frame + 50 - frame) / 40)),
			20 * Multiplier / ((Button.frame + 50 - frame) / 40),
			20 * Multiplier / ((Button.frame + 50 - frame) / 40));
		myGameArea.context.globalAlpha = 1;
	}
}

function WriteText() {
	myGameArea.context.font = "1rem Arial";
	var height = myGameArea.context.measureText("M").width;
	var dh = height;
	for (let i = 0; i < MyText.length; ++i) {
		var width = (myGameArea.context.measureText(MyText[i].text).width);
		myGameArea.context.fillStyle = 'White';
		myGameArea.context.fillRect((MyText[i].x * Multiplier) - ((width * 1.1 - width) / 2), (MyText[i].y * Multiplier) - dh, width * 1.1, height * 1.2);
		myGameArea.context.fillStyle = 'Black';
		myGameArea.context.fillText(MyText[i].text, MyText[i].x * Multiplier, MyText[i].y * Multiplier);
	}
	MyText = [];
}

function CharacterSelect() {
	var Selector, value
	Selector = document.getElementById("Character-selector");
	value = Selector.value;
	if (value < 4) {
		Person.src = "images/Walking Sprite.png";
		PersonData = {
			x: 70,
			y: 70,
			speedX: 0,
			speedY: 0,
			direction: "None",
			width: 476,
			height: 320,
			image: Person,
			ticksPerFrame: 4,
			ticks: 0,
			xFrame: 4,
			yFrame: 0,
			StartFrame: 4,
			numberOfXFrames: 12,
			numberOfYFrames: 8,
			UsualFramesPerAnimation: 3,
			TotalFramesPerAnimation: 1,
			IdleX: (value * 3) + 1,
			Characterx: value,
			Charactery: 0,
			Th: 25,
			Bh: 10,
			Rw: 20,
			Lw: 20,
			angle: 0,
		}
	} else if (value < 8) {
		Person.src = "images/Walking Sprite.png";
		PersonData = {
			x: 70,
			y: 70,
			speedX: 0,
			speedY: 0,
			direction: "None",
			width: 476,
			height: 320,
			image: Person,
			ticksPerFrame: 4,
			ticks: 0,
			xFrame: 4,
			yFrame: 0,
			StartFrame: 4,
			numberOfXFrames: 12,
			numberOfYFrames: 8,
			UsualFramesPerAnimation: 3,
			TotalFramesPerAnimation: 1,
			IdleX: (value - 4) * 3 + 1,
			Characterx: value - 4,
			Charactery: 1,
			Th: 25,
			Bh: 10,
			Rw: 20,
			Lw: 20,
			angle: 0,
		}
	} else {
		if (value == 8) {
			Person.src = "images/Joe.png";
		} else if (value == 9) {
			Person.src = "images/Nichole.png";
		}
		PersonData = {
			x: 70,
			y: 70,
			speedX: 0,
			speedY: 0,
			direction: "None",
			width: 128,
			height: 192,
			image: Person,
			ticksPerFrame: 4,
			ticks: 0,
			xFrame: 0,
			yFrame: 0,
			StartFrame: 4,
			numberOfXFrames: 4,
			numberOfYFrames: 4,
			UsualFramesPerAnimation: 4,
			TotalFramesPerAnimation: 1,
			IdleX: 0,
			Characterx: 0,
			Charactery: 0,
			Th: 26,
			Bh: 20,
			Rw: 15,
			Lw: 15,
			angle: 0,
		}
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
	FollowDogData.x = 110;
	FollowDogData.y = 60;
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

function Fade() {
	if (fade == "in") {
		fadeit--;
	} else {
		fadeit++;
	}
	myGameArea.context.fillStyle = 'Black';
	myGameArea.context.globalAlpha = fadeit/100;
	myGameArea.context.fillRect(0, 0, Thecanvas.width * Multiplier, Thecanvas.height * Multiplier);
	myGameArea.context.globalAlpha = 1;
	if (fadeit >= 100) {
		fadeit = 100;
		fade = "in";
		fadeComplete = true;
	} else if (fadeit <= 0) {
		fadeit = 0;
		fade = "None";
	}
}

function AreaSelect(area) {
	Area = area;
	switch (Area) {
		case 0:
			myGameArea.canvas.style.backgroundImage = "url('images/Grass.png')";
			Bounds = {
				xMin: 40,
				yMin: 40,
				xMax: 880,
				yMax: 560
			}
			break;
		case 1:
			myGameArea.canvas.style.backgroundImage = "url('images/House1.png')";
			Bounds = {
				xMin: 310,
				yMin: 250,
				xMax: 580,
				yMax: 445
			}
			break;
		case 2:
			myGameArea.canvas.style.backgroundImage = "url('images/Grass2.png')";
			Bounds = {
				xMin: 40,
				yMin: 40,
				xMax: 880,
				yMax: 560
			}
			break;
		case 3:
			myGameArea.canvas.style.backgroundImage = "url('images/House1.png')";
			Bounds = {
				xMin: 310,
				yMin: 250,
				xMax: 580,
				yMax: 445
			}
			break;
	}
}

/*
Fix the gray around the characters
Come up with Concept
Cut out rooms and different floors from the paint files you currently have
Same with buildings
Cool map in the menu.
Name of the location you're entering in the top left corner with a nice background banner
*/