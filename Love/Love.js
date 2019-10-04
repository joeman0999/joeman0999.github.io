var love = 0;
var loveMult = 1;
var dollars = 0;
var TapTimeout;
var peopleNames = [

];

window.onload = function () {
    var screenW = Math.max(document.body.scrollWidth, document.documentElement.offsetWidth, document.documentElement.clientWidth);
    var screenH = Math.max(document.body.scrollHeight, document.documentElement.offsetHeight, document.documentElement.clientHeight);
    var min = Math.min(screenW, screenH);
    var size = Math.floor(min * .5);
    Multiplier = size / 500;
}

function tapScreen() {
    document.getElementById('settingsScreen').hidden = true;
    document.getElementById('Buttons').hidden = false;
    document.getElementById('peopleScreen').hidden = true;
    document.getElementById('upgradeScreen').hidden = true;
    document.getElementById('giftScreen').hidden = true;
}

function peopleScreen() {
    document.getElementById('settingsScreen').hidden = true;
    document.getElementById('Buttons').hidden = true;
    document.getElementById('peopleScreen').hidden = false;
    document.getElementById('upgradeScreen').hidden = true;
    document.getElementById('giftScreen').hidden = true;
}

function upgradeScreen() {
    document.getElementById('settingsScreen').hidden = true;
    document.getElementById('Buttons').hidden = true;
    document.getElementById('peopleScreen').hidden = true;
    document.getElementById('peopleScreen').hidden = true;
    document.getElementById('upgradeScreen').hidden = false;
    document.getElementById('giftScreen').hidden = true;
}

function giftScreen() {
    document.getElementById('settingsScreen').hidden = true;
    document.getElementById('Buttons').hidden = true;
    document.getElementById('peopleScreen').hidden = true;
    document.getElementById('peopleScreen').hidden = true;
    document.getElementById('upgradeScreen').hidden = true;
    document.getElementById('giftScreen').hidden = false;
}

function settings() {
    document.getElementById('settingsScreen').hidden = false;
    document.getElementById('Buttons').hidden = true;
    document.getElementById('peopleScreen').hidden = true;
    document.getElementById('upgradeScreen').hidden = true;
    document.getElementById('giftScreen').hidden = true;
}

function gender(input) {
    if (input == 0) {
        // Into Men
    } else {
        // Into Women
    }
}

function loveClick() {
    love += 1*loveMult;
    if (love >= 100) {
        document.getElementById('peopleScreenButton').hidden = false;
    } else if (love > 1000) {
        //document.getElementById('upgradeScreen').hidden = false;
    }
    updateText();
    var element = document.getElementById("loveArea");
    if (element.childElementCount > 7) {
        for (let k = 0; k < element.childElementCount - 5; k++) {
            element.removeChild(element.firstChild);
        }
    }
    var para = document.createElement("p");
    var node = document.createTextNode("+" + (1 * loveMult));
    para.appendChild(node);
    var left = (Math.random() - .6) * 15 + 50;
    var top = (Math.random() - .5) * 20 + 30;
    para.style.left = left + "%";
    para.style.top = top + "%";
    para.style.position = "absolute";
    para.addEventListener("click", loveClick);
    para.className = "noselect";
    element.appendChild(para);
    clearTimeout(TapTimeout);
    TapTimeout = setTimeout(removeTapText, 200);
}

function moneyClick() {
    dollars++;
    updateText();
}

function people(input) {
    if (input == 1 && love >= 100) {
        loveMult = 2;
        document.getElementById('people 1').hidden = true;
        love -= 100;
    } else if (input == 2 && love >= 200 && loveMult == 2) {
        loveMult = 4;
        document.getElementById('people 2').hidden = true;
        love -= 200;
    }
    updateText();
}

function upgrade(input) {

}

function gift(input) {

}

function updateText() {
    document.getElementById("love").innerHTML = 'Love: ' + Math.floor(love);
    document.getElementById("dollars").innerHTML = 'Money: ' + Math.floor(dollars);
}

function removeTapText() {
    var element = document.getElementById("loveArea");
    if (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    if (element.childElementCount > 0) {
        TapTimeout = setTimeout(removeTapText, 200);
    }
}