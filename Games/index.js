var stars = [];
var fps = 50;
var numStars = 1000;
var context, screenW, screenH;
var Games = [
    {
        Name: 'Tanks',
        Location: 'Tanks/Tanks.html',
        Image: "url('GameImages/Tanks.png')",
        Description: "Try to destroy the enemy whether it be your friend or the computer, but don't let them destroy you first.",
        Desktop: true,
        Mobile: true,
        Multi: true
    }, {
        Name: 'Checkers',
        Location: 'Checkers/Checkers.html',
        Image: "url('GameImages/Checkers.png')",
        Description: 'The classic board game of moving and jumping. Play vs. the computer, or against a friend.',
        Desktop: true,
        Mobile: true,
        Multi: true
    }, {
        Name: 'Snake',
        Location: 'Snake/Snake.html',
        Image: "url('GameImages/Snake.png')",
        Description: "Slither around and eat fruit to grow as long as possible. But don't hit the wall, your tail, or your friend!",
        Desktop: true,
        Mobile: true,
        Multi: true
    }, {
        Name: 'Mouse Game',
        Location: 'Mouse/Mouse.html',
        Image: "url('GameImages/Mouse.png')",
        Description: 'Try to trap the cats before they eat you!',
        Desktop: true,
        Mobile: false,
        Multi: false
    }, {
        Name: 'Pong',
        Location: 'Pong/Pong.html',
        Image: "url('GameImages/Pong.png')",
        Description: 'The classic atari arcade game Pong. Play with your friend or against the computer.',
        Desktop: true,
        Mobile: false,
        Multi: true
    }, {
        Name: 'Skull Bowling',
        Location: 'Skeleton Bowling/index.html',
        Image: "url('GameImages/SkeletonBowling.png')",
        Description: "Bowl with your own skull! It's a good thing your pain nerves have decayed!",
        Desktop: true,
        Mobile: false,
        Multi: false
    }, {
        Name: 'Paper',
        Location: 'Paper/Paper.html',
        Image: "url('GameImages/Paper.png')",
        Description: 'Try to cover the board in your territory.',
        Desktop: true,
        Mobile: true,
        Multi: true
    }, {
        Name: 'Breakout',
        Location: 'Breakout/Breakout.html',
        Image: "url('GameImages/Breakout.png')",
        Description: 'Destroy all the bricks!',
        Desktop: true,
        Mobile: true,
        Multi: false
    }, {
        Name: 'Blackjack',
        Location: 'Blackjack/Blackjack.html',
        Image: "url('GameImages/Blackjack.png')",
        Description: "It's you against the dealer. Get Twenty-One to win!",
        Desktop: true,
        Mobile: true,
        Multi: false
    }, {
        Name: 'Lights Out',
        Location: 'LightsOut/LightsOut.html',
        Image: "url('GameImages/LightsOut.png')",
        Description: "Try to turn off all the lights!",
        Desktop: true,
        Mobile: true,
        Multi: false
    }, {
        Name: 'Geography',
        Location: 'Geography/Geography.html',
        Image: "url('GameImages/Geography.png')",
        Description: "Test your geography skills of US States or the Countries of the World!!",
        Desktop: true,
        Mobile: true,
        Multi: false
    }
]

window.onload = function () {
    LoadGames('Home');
    const canvas = document.getElementById("space");
    context = canvas.getContext("2d");
    setCanvasSize(canvas);

    for (let i = 0; i < numStars; i++) {
        stars.push(createRandomStar());
    }

    window.addEventListener('resize', () => {
        setCanvasSize(canvas);
        for (let s of stars) {
            if (s.x > screenW) s.x = Math.random() * screenW;
            if (s.y > screenH) s.y = Math.random() * screenH;
        }
    });

    requestAnimationFrame(animate); // smoother than setInterval
};

function setCanvasSize(canvas) {
    screenW = canvas.width = document.documentElement.clientWidth;
    // screenH = canvas.height = window.innerHeight;

    // screenW = canvas.width = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    screenH = canvas.height = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
}

function createRandomStar() {
    return newStar(
        Math.random() * screenW,
        Math.random() * screenH,
        2 + Math.random() * 2,
        Math.random()
    );
}


function ResizeWindow() {
    var canvas = document.getElementById("space");
    setCanvasSize(canvas)
    // screenW = canvas.width = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    // screenH = canvas.height = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);

    stars = [];
    for (let i = 0; i < numStars; i++) {
        var x = Math.round(Math.random() * screenW);
        var y = Math.round(Math.random() * screenH);
        var length = 2 + Math.random() * 2;
        var opacity = Math.random();

        // Create a new star and draw
        var star = newStar(x, y, length, opacity);

        // Add the the stars array
        stars.push(star);
    }
}

function animate() {
    context.clearRect(0, 0, screenW, screenH);
    for (let i = 0; i < numStars; ++i) {
        draw(stars[i]);
    }
    requestAnimationFrame(animate);
}

function newStar(x, y, length, opacity) {
    let Star = {
        x: x,
        y: y,
        length: length,
        opacity: opacity,
        factor: 1,
        increment: Math.random() * .03 + .001,
    }
    return Star;
}

function draw(Star) {
    context.rotate((Math.PI * 1 / 10));

    // Save the context
    context.save();

    // move into the middle of the canvas, just to make room
    context.translate(Star.x, Star.y);

    // Change the opacity
    if (Star.opacity > 1) {
        Star.factor = -1;
    }
    else if (Star.opacity <= 0) {
        Star.factor = 1;

        Star.x = Math.round(Math.random() * screenW);
        Star.y = Math.round(Math.random() * screenH);
    }

    Star.opacity += Star.increment * Star.factor;

    context.beginPath()
    for (var i = 5; i--;) {
        context.lineTo(0, Star.length);
        context.translate(0, Star.length);
        context.rotate((Math.PI * 2 / 10));
        context.lineTo(0, - Star.length);
        context.translate(0, - Star.length);
        context.rotate(-(Math.PI * 6 / 10));
    }
    context.lineTo(0, Star.length);
    context.closePath();
    context.fillStyle = "rgba(255, 255, 200, " + Star.opacity + ")";
    context.shadowBlur = 5;
    context.shadowColor = '#ffff33';
    context.fill();

    context.restore();
}

function updateGames(Games) {
    GameArea = document.getElementById("GameArea");
    while (GameArea.hasChildNodes()) {  
        GameArea.removeChild(GameArea.firstChild);
    }
    for (let i = 0; i < Games.length; i++) {
        var newElement = document.createElement('div');
        newElement.className = 'Game-Option';

        var imageButton = document.createElement('button');
        imageButton.className = 'Game-Image-Button';
        imageButton.style.backgroundImage = Games[i].Image;
        imageButton.onclick = function () { location.href = Games[i].Location; };
        newElement.appendChild(imageButton);

        var infoDiv = document.createElement('div');
        infoDiv.className = 'Game-Info';

        var nameButton = document.createElement('button');
        nameButton.className = 'Game-Text-Button';
        nameButton.onclick = function () { location.href = Games[i].Location; };
        nameButton.innerHTML = Games[i].Name;
        infoDiv.appendChild(nameButton);

        var description = document.createElement('p');
        description.className = 'Game-Description';
        description.innerHTML = Games[i].Description;
        infoDiv.appendChild(description);

        newElement.appendChild(infoDiv);
        GameArea.appendChild(newElement);
    }
}

function LoadGames(method) {
    var newElement = document.getElementById('Group-text');
    document.getElementsByClassName("active")[0].className = "";

    switch (method) {
        case 'Home':
            updateGames(Games);
            newElement.innerHTML = 'All Games';
            document.getElementById("HomeMenu").className = "active";
            break;
        case 'Desktop':
            var List = [];
            for (let i = 0; i < Games.length; i++) {
                if (Games[i].Desktop == true) List.push(Games[i]);
            }
            updateGames(List);
            newElement.innerHTML = 'Desktop Games';
            document.getElementById("DesktopMenu").className = "active";
            break;
        case 'Mobile':
            var List = [];
            for (let i = 0; i < Games.length; i++) {
                if (Games[i].Mobile == true) List.push(Games[i]);
            }
            updateGames(List);
            newElement.innerHTML = 'Mobile Games';
            document.getElementById("MobileMenu").className = "active";
            break;
        case 'Multi':
            var List = [];
            for (let i = 0; i < Games.length; i++) {
                if (Games[i].Multi == true) List.push(Games[i]);
            }
            updateGames(List);
            newElement.innerHTML = 'Multiplayer Games';
            document.getElementById("MultiMenu").className = "active";
            break;
        case 'A-Z':
            var List = JSON.parse(JSON.stringify(Games));
            List.sort((a, b) => (a.Name > b.Name) ? 1 : -1);
            updateGames(List);
            newElement.innerHTML = 'All Games A-Z';
            document.getElementById("A-ZMenu").className = "active";
            break;
    }
    
    // document.getElementById('GameArea').insertBefore(newElement, document.getElementById('GameArea').childNodes[0]);
}