// var mapping = {};
// var quote = "this is a test";
// // var encryptedQuote = "guvf vf n grfg";
// // var quoteDisplay = "____ __ _ ____";
// var encryptedQuote = "";
// var quoteDisplay = "";

// function makeAGuess(a, b){
// 	mapping[a] = b;
// 	console.log(JSON.stringify(mapping));
// 	console.log(encryptedQuote);

// 	for(var key in mapping){
// 		for (var loc=[],i=encryptedQuote.length;i--;) if (encryptedQuote[i]==key){
// 			quoteDisplay = quoteDisplay.substring(0, i) + mapping[key] + quoteDisplay.substring(i+1);
// 		}
// 	}

// 	console.log(quoteDisplay);

// 	if(quoteDisplay.indexOf("_") == -1){
// 		console.log("You figured it out!");
// 	}
// 	return mapping;
// }

// //generate quote and encrypted quote (set puzzle)
// function encryptQuote(rawQuote){
// 	quote = rawQuote;
// 	encoding = {};

// 	alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
// 	keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
// 	while(alphabet.length > 0){
// 		var randomAlpha = Math.floor(Math.random()*alphabet.length);
// 		encoding[keys[0]] = alphabet[randomAlpha];
// 		keys.splice(0,1);
// 		alphabet.splice(randomAlpha, 1);
// 	}
// 	for (var i = 0, len = quote.length; i < len; i++) {
// 		if(quote[i] == " "){
// 			encryptedQuote = encryptedQuote + " ";
// 			quoteDisplay = quoteDisplay + " ";
// 			continue;
// 		}
// 			encryptedQuote = encryptedQuote + encoding[quote[i]];
// 			quoteDisplay = quoteDisplay + "_";
// 	}

// }


(function() {

  var encryptedQuote, quoteDisplay, encoding, blankQuote, guessMapping, playerInfoElement, playAgainButton;

  $(function init() {

	setUpEncoding();
	// encoding = generateEncoding();
	// blankQuote = $("p#encrypted-quote-blank");


	// displayQuote("a");
	// $('#guess-button').on('click', processGuess);
	// guessMapping = {};

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
	blankQuote.html(quoteDisplay);

	//if no "_" then check if they are correct
	if(quoteDisplay.indexOf("_") == -1){
		if(checkWinCondition()){
			playerInfoElement.html("You figured it out!").css('color', 'MidnightBlue').show();
			if(playAgainButton === undefined){
				console.log("creating button");
				// playAgainButton = $('body').append(
				// 			$('<button>Play again</button>').click( function () { setUpEncoding(); })
				// 			);
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
