//Tell the library which element to use for the table
cards.init({table:'#card-table', type:BLACKJACK});

//Create a new deck of cards
var deck = new cards.Deck();
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 50;

//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all);
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
var upperhand = new cards.Hand({y:60});
var lowerhands = [new cards.Hand({y:340, faceUp:true})];
var money = 500;

var currentHand = 0;

var discardPile = new cards.Deck({faceUp:false});
discardPile.x -= 150;

var slider = document.getElementById("initialBet");
var output = document.getElementById("initialBetDisplay");
var moneyDisplay = document.getElementById("money");
var bets = [];
bets.push(document.getElementById("bet1"));
bets.push(document.getElementById("bet2"));
bets.push(document.getElementById("bet3"));
bets.push(document.getElementById("bet4"));
bets[0].style.paddingTop= "400px";
bets[1].style.paddingTop= "400px";
bets[2].style.paddingTop= "400px";
bets[3].style.paddingTop= "400px";

var initialBet = slider.value;
output.innerHTML = "Next Bet $" + initialBet; // Display the default slider value
moneyDisplay.innerHTML = "$" + money;

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
	initialBet = this.value;
	output.innerHTML = "Next Bet $" + initialBet;
}

//Penetration should be 4-5 out of 6 decks

//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	
	currentHand = 0;
	discardHand(upperhand);
	while (lowerhands.length > 1) {
		discardHand(lowerhands.pop());
	}
	discardHand(lowerhands[0]);
	if (discardPile.length > 5*52) {
		while ( discardPile.length != 0) {
			deck.addCard(discardPile[0]);
			shuffle(deck);
		}
	} else if (discardPile.length > 4*52 && Math.random() < .7) {
		while ( discardPile.length != 0) {
			deck.addCard(discardPile[0]);
			cards.shuffle(deck);
		}
	}
	discardPile.render();
	$('#initialBetDisplay').hide();
	$('#initialBet').hide();
	$('#deal').hide();
	$('#hit').show();
	$('#stay').show();
	$('#doubleDown').show();
	insurance = false;
	bets[0].innerHTML = "$" + initialBet;
	bets[1].innerHTML = "";
	bets[2].innerHTML = "";
	bets[3].innerHTML = "";
	lowerhands[0].x = 300;
	bets[0].style.paddingLeft = "275px";
	var i = 0;
	var totalCount = 4;
	var speed = 100;
	function dealOne() {
        if (i == totalCount) {
          return;
		}
		
		if (i == 0) {
			lowerhands[0].addCard(deck.topCard());
			lowerhands[0].render({
				callback: dealOne,
				speed: speed
			});
		} else if (i == 1) {
			upperhand.addCard(deck.topCard());
			upperhand.render({
				callback: dealOne,
				speed: speed
			});
		} else if (i == 2) {
			lowerhands[0].addCard(deck.topCard());
			lowerhands[0].render({
				callback: dealOne,
				speed: speed
			});
			if(lowerhands[0][0].rank == lowerhands[0][1].rank) {
				$('#split').show();
			}
		} else {
			newCard = deck.topCard();
			newCard.showCard();
			newCard.faceUp = true;
			upperhand.addCard(newCard);
			upperhand.render({
				callback: dealOne,
				speed: speed
			});
			if(upperhand[1].rank == 1) {
				$('#insurance').show();
			}
		}        
        i++;
	  }
	currentHand = 0;
	dealOne();
});

$('#hit').click(function() {
	$('#split').hide();
	$('#doubleDown').hide();
	lowerhands[currentHand].addCard(deck.topCard());
	lowerhands[currentHand].render();
	var result = handValue(lowerhands[currentHand]);
	if (result[0] > 20) {
		$('#hit').hide();
	}
});

$('#stay').click(function() {
	$('#split').hide();
	if (currentHand < lowerhands.length - 1) {
		currentHand++;
		$('#hit').show();
		$('#doubleDown').show();
	} else {
		$('#insurance').hide();
		$('#hit').hide();
		$('#stay').hide();
		$('#doubleDown').hide();
		upperhand[0].showCard();
		upperhand[0].faceUp = true;
		casinoPlay(upperhand);		
	}
})

$('#doubleDown').click(function() {
	$('#split').hide();
	bets[currentHand].innerHTML = "$" + initialBet * 2;
	lowerhands[currentHand].addCard(deck.topCard());
	lowerhands[currentHand].render();
	if (currentHand < lowerhands.length - 1) {
		currentHand++;
	} else {
		$('#insurance').hide();
		$('#doubleDown').hide();
		$('#hit').hide();
	}
});

$('#split').click(function() {
	$('#split').hide();
	if (lowerhands.length == 1) {
		lowerhands[0].x = 200;
		bets[0].style.paddingLeft = "175px";
		lowerhands.push(new cards.Hand({x: 400, y:340, faceUp:true}));
		bets[1].innerHTML = "$" + initialBet;
		bets[1].style.paddingLeft = "375px";
		lowerhands[1].addCard(lowerhands[0][0]);
		lowerhands[0].addCard(deck.topCard());
		lowerhands[1].addCard(deck.topCard());
		if (lowerhands[0][0].rank != 1) {
			if(lowerhands[0][0].rank == lowerhands[0][1].rank || lowerhands[1][0].rank == lowerhands[1][1].rank) {
				$('#split').show();
			}
		} else {
			$('#doubleDown').hide();
		}
	} else if (lowerhands.length == 2) {
		lowerhands[0].x = 150;
		bets[0].style.paddingLeft = "125px";
		lowerhands[1].x = 300;
		bets[1].style.paddingLeft = "275px";
		lowerhands.push(new cards.Hand({x: 450, y:340, faceUp:true}));
		bets[2].innerHTML = "$" + initialBet;
		bets[2].style.paddingLeft = "425px";
		if (lowerhands[0][0].rank == lowerhands[0][1].rank) {
			lowerhands[2].addCard(lowerhands[0][0]);
			lowerhands[0].addCard(deck.topCard());
			lowerhands[2].addCard(deck.topCard());
		} else {
			lowerhands[2].addCard(lowerhands[1][0]);
			lowerhands[1].addCard(deck.topCard());
			lowerhands[2].addCard(deck.topCard());
		}
		lowerhands[2].render({speed: 100});
		if(lowerhands[0][0].rank == lowerhands[0][1].rank || lowerhands[1][0].rank == lowerhands[1][1].rank || lowerhands[2][0].rank == lowerhands[2][1].rank) {
			$('#split').show();
		}
	} else {
		lowerhands[0].x = 50;
		bets[0].style.paddingLeft = "25px";
		lowerhands[1].x = 200;
		bets[1].style.paddingLeft = "175px";
		lowerhands[2].x = 350;
		bets[2].style.paddingLeft = "325px";
		lowerhands.push(new cards.Hand({x: 500, y:340, faceUp:true}));
		bets[3].innerHTML = "$" + initialBet;
		bets[3].style.paddingLeft = "475px";
		if (lowerhands[0][0].rank == lowerhands[0][1].rank) {
			lowerhands[3].addCard(lowerhands[0][0]);
			lowerhands[0].addCard(deck.topCard());
			lowerhands[3].addCard(deck.topCard());
		} else if (lowerhands[1][0].rank == lowerhands[1][1].rank) {
			lowerhands[3].addCard(lowerhands[1][0]);
			lowerhands[1].addCard(deck.topCard());
			lowerhands[3].addCard(deck.topCard());
		} else {
			lowerhands[3].addCard(lowerhands[2][0]);
			lowerhands[2].addCard(deck.topCard());
			lowerhands[3].addCard(deck.topCard());
		}
		lowerhands[2].render({speed: 100});
		lowerhands[3].render({speed: 100});
	}
	lowerhands[0].render({speed: 100});
	lowerhands[1].render({speed: 100});
});

$('#insurance').click(function() {
	$('#insurance').hide();
	insurance = true;
});

function handValue(hand) {
	var value = 0;
	var aceCount = 0;
	var acesAsOnes = 0;
	var type = "hard";
	for (var i = 0; i < hand.length; i++) {
		var rank = hand[i].rank;
		if (rank == 1) {
			aceCount++;
			value += 11;
		} else if (rank < 11) {
			value += rank;
		} else {
			value += 10;
		}
		while (value > 21 && aceCount != acesAsOnes) {
			acesAsOnes++;
			value -= 10;
		}
	}
	if (aceCount != acesAsOnes) {
		type == "soft";
	}
	return [value, type];
}

function casinoPlay(hand) {
	var result = handValue(hand);
	var speed = 500;
	function hit() {
		newCard = deck.topCard();
		newCard.showCard()
		newCard.faceUp = true;
		hand.addCard(newCard);
		result = handValue(hand);
		if (result[0] < 17) {
			hand.render({
				callback: hit,
				speed: speed
			});
		} else {
			hand.render({
				speed: speed
			});
			setTimeout(calculateMoney, 550);
			setTimeout(function(){ $('#deal').show(); }, 1500);
		}
	}
	if (result[0] < 17) {
		setTimeout(hit, speed);
	} else {
		setTimeout(calculateMoney, 500);
		setTimeout(function(){ $('#deal').show(); }, 1500);
	}
}

function discardHand(hand) {
	while ( hand.length != 0) {
		discardPile.addCard(hand[0]);
	}
}

function calculateMoney() {
	var dealer = handValue(upperhand);
	var dealer = dealer[0];
	var change = 0;
	if (insurance ) {
		if (dealer == 21 && upperhand.length == 2) {
			change += parseInt(initialBet);
		} else {
			change -= parseInt(initialBet)/2;
		}
	}

	for (var i = 0; i < lowerhands.length; i++) {
		var result = handValue(lowerhands[i]);
		var result = result[0];
		if (result > 21) {
			change -= parseInt(bets[i].innerHTML.slice(1,bets[i].innerHTML.length));
		} else if (result == 21 && lowerhands[i].length == 2) {
			if (dealer != 21 || upperhand.length != 2) {
				change += parseInt(bets[i].innerHTML.slice(1,bets[i].innerHTML.length)) / 2 * 3;
			}
		} else if (result == 21) {
			if (dealer != 21) {
				change += parseInt(bets[i].innerHTML.slice(1,bets[i].innerHTML.length));
			}
		} else if (dealer > 21) {
			change += parseInt(bets[i].innerHTML.slice(1,bets[i].innerHTML.length));
		} else if (result > dealer) {
			change += parseInt(bets[i].innerHTML.slice(1,bets[i].innerHTML.length));
		} else if (result < dealer) {
			change -= parseInt(bets[i].innerHTML.slice(1,bets[i].innerHTML.length));
		}
	}
	if (change > 0) {
		alert("You won $" + change);
	} else if (change < 0) {
		alert("You lost $" + change);
	}
	money += change;
	moneyDisplay.innerHTML = "$" + money;
	$('#initialBetDisplay').show();
	$('#initialBet').show();
}