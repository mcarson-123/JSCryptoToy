// todo:
// change quotes for displays into char arrays
// deal with capital letters: 
//		-in original quote (keep caps in those locations)
//		-in guesses - ignore caps
//
//	make pretty (css)
//  -print out correct guesses in a different color in quoteDisplay
//		-animate? ie flash a couple times a correct guess
//	-center elements on screen
//	-use pretty button
//
//	eventually: make AJAX calls to get real quotes


(function() {

  var encryptedQuote, quoteDisplay, encoding, blankQuote, guessMapping, playerInfoElement, playAgainButton;

  $(function init() {

	setUpEncoding();

	playerInfoElement = $('<p>add info here</p>').hide().appendTo('body');
  });
	
	function setUpEncoding(){

	if(playAgainButton !== undefined && playAgainButton.is(':visible')){
		playAgainButton.hide();
	}

	encoding = generateEncoding();
	blankQuote = $("p#encrypted-quote-blank");


	displayQuote("a");
	$('#guess-button').on('click', processGuess);
	guessMapping = {};
  }

	//display encrypted quote and blank quote to be filled in
  function displayQuote(quote) {
	encryptQuote(quote);
	$("p#encrypted-quote").html(encryptedQuote);
	blankQuote.html(quoteDisplay);
  }

  function processGuess(a,b){
	if(playerInfoElement.is(':visible')){
		playerInfoElement.hide();
	}
	var guessEncryptedLetter = $("#guess-from").val();
	var guessRealLetter = $("#guess-to").val();
	if(guessEncryptedLetter.length != 1 || guessRealLetter.length != 1){
		playerInfoElement.html("guesses must be single letters").css('color', 'crimson').show();
		return;
	}
	
	guessMapping[guessEncryptedLetter] = guessRealLetter;

	for (var i = 0; i < encryptedQuote.length; i++) {
		var encryptedLetter = encryptedQuote.charAt(i);
		//if mapping contains encrypted letter,  set character at x in quote display to mapping[encryptedLetter]
		if(encryptedLetter in guessMapping){
			quoteDisplay = quoteDisplay.substring(0, i) + guessMapping[encryptedLetter] + quoteDisplay.substring(i+1);
		}
	}
	//reset quote display text element
	// blankQuote.html(quoteDisplay);
	blankQuote.html().replace();

	//if no "_" then check if they are correct
	if(quoteDisplay.indexOf("_") == -1){
		if(checkWinCondition()){
			playerInfoElement.html("You figured it out!").css('color', 'MidnightBlue').show();
			if(playAgainButton === undefined){
				console.log("creating button");
				playAgainButton = $('<button>Play again</button>').click( function () { setUpEncoding(); }).appendTo($('body'));
				console.log(playAgainButton.html);
			}
			playAgainButton.show();
			return;
		}
	}
  }

	function checkWinCondition(){
		for(var i = 0; i < quoteDisplay.length; i++){
			if(quoteDisplay.charAt(i) == " "){
				continue;
			}
			if(encryptedQuote.charAt(i) != encoding[quoteDisplay.charAt(i)]){
				console.log("encrypted letter: "+encryptedQuote.charAt(i)+ " real letter: "+ quoteDisplay.charAt(i) + " " +encoding[quoteDisplay.charAt(i)]);
				console.log(encoding);
				return false;
			}
		}
		return true;
	}

/**
encoding = {realLetter: encryped letter}
*/
  function generateEncoding(){
	encoding = {};
	alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		while(alphabet.length > 0){
			var randomAlpha = Math.floor(Math.random()*alphabet.length);
			encoding[keys[0]] = alphabet[randomAlpha];
			keys.splice(0,1);
			alphabet.splice(randomAlpha, 1);
		}
		return encoding;
  }

  //generate quote and encrypted quote (set puzzle)
	function encryptQuote(rawQuote){
		encryptedQuote = "";
		quoteDisplay = "";

		for (var i = 0, len = rawQuote.length; i < len; i++) {
			if(rawQuote[i] == " "){
				encryptedQuote = encryptedQuote + " ";
				quoteDisplay = quoteDisplay + " ";
				continue;
			}
				encryptedQuote = encryptedQuote + encoding[rawQuote[i]];
				quoteDisplay = quoteDisplay + "_";
		}
	}


})();
