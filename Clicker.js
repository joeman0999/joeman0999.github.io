var ClickNumber = 0;

function MainButtonClick() {
    ClickNumber += 1;
    document.getElementById("Clicks").innerHTML = ClickNumber;
}