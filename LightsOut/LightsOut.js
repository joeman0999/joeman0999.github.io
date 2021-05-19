function New_Game() {
    var pressNumber = Math.round(Math.random() * 10) + 5;
    var options = [...Array(24).keys()];
    while (pressNumber > 0) {
        pressNumber--;
        var toPress = options.splice(Math.round(Math.random() * (options.length - 1)), 1);
        var row = Math.floor(toPress / 5);
        var column = toPress % 5;
        press(row, column);
    }
}

function Reset() {
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 5; j++) {
            if (document.getElementById("Lights").childNodes[i*2 + 1].childNodes[j*2 + 1].classList.length > 1) {
                document.getElementById("Lights").childNodes[i*2 + 1].childNodes[j*2 + 1].classList.toggle("light");
            }
        }
    }
}

function press(row, column) {
    flip(row, column);
    flip(row - 1, column);
    flip(row + 1, column);
    flip(row, column - 1);
    flip(row, column + 1);
}

function flip(row, column) {
    if (row > -1 && row < 5 && column > -1 && column < 5) {
        document.getElementById("Lights").childNodes[row*2 + 1].childNodes[column*2 + 1].classList.toggle("light");
    }
}

