var stars = [];
var fps = 50;
var numStars = 1000;
var context, screenW, screenH;

window.onload = function () {
    var canvas = document.getElementById("space");
    screenW = canvas.width = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    screenH = canvas.height = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
    
    context = canvas.getContext("2d");
    for (var i = 0; i < numStars; i++) {
        var x = Math.round(Math.random() * screenW);
        var y = Math.round(Math.random() * screenH);
        var length = 2 + Math.random() * 2;
        var opacity = Math.random();

        // Create a new star and draw
        var star = newStar(x, y, length, opacity);

        // Add the the stars array
        stars.push(star);
    }

    window.addEventListener('resize', ResizeWindow);
    setInterval(animate, 1000 / fps);
    alert("Please wait as long as it takes. I will wait for you forever if I have to. I love you. I'm sorry it's taking so long. Have faith. <3 Always! Boop!")
}

function ResizeWindow() {
    var canvas = document.getElementById("space");
    screenW = canvas.width = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    screenH = canvas.height = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);

    stars = [];
    for (var i = 0; i < numStars; i++) {
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