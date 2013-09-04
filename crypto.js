/**
 * todo:
 * change quotes for displays into char arrays
 * deal with capital letters: 
 * - in original quote (keep caps in those locations)
 * - in guesses (ignore caps)
 * improve presentation with CSS
 * eventually: make AJAX calls to get real quotes
 */

(function() {

    var encryptedQuote,
        quoteDisplay,
        encoding,
        blankQuote,
        guessMapping,
        playerInfoElement,
        playAgainButton,
        guessFrom,
        guessTo,
        alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    $(function init() {
        playerInfoElement = $('<p>').hide().appendTo('body');
        playAgainButton = $('<button>').text('Play again').click(setUpEncoding).hide().appendTo('body');
        blankQuote = $("#encrypted-quote-blank");
        guessFrom = $("#guess-from");
        guessTo = $("#guess-to")

        setUpEncoding();

        $('#guess-button').on('click', processGuess); // TODO: convert to proper event handler
    });

    // TODO: refactor into one-time setup and reset functions
    function setUpEncoding() {
        if (playAgainButton !== undefined && playAgainButton.is(':visible')) {
            playAgainButton.hide();
        }

        encoding = generateEncoding();

        displayQuote("a");
        guessMapping = {};
    }

    // Displays the encrypted quote and blank quote to be filled in.
    function displayQuote(quote) {
        encryptQuote(quote);
        $("#encrypted-quote").html(encryptedQuote);
        blankQuote.html(quoteDisplay); // TODO: avoid html()
    }

    // Handles a player's guess.
    function processGuess(ev) {
        ev.preventDefault();
        
        if (playerInfoElement.is(':visible')) { 
            playerInfoElement.hide();
        }
        var guessEncryptedLetter = guessFrom.val();
        var guessRealLetter = guessTo.val();
        if (guessEncryptedLetter.length != 1 || guessRealLetter.length != 1) {
            playerInfoElement.text("guesses must be single letters").css('color', 'crimson').show(); // TODO: kill css()
            return;
        }
        
        guessMapping[guessEncryptedLetter] = guessRealLetter;

        for (var i = 0; i < encryptedQuote.length; i++) {
            var encryptedLetter = encryptedQuote.charAt(i);
            //if mapping contains encrypted letter,  set character at x in quote display to mapping[encryptedLetter]
            if (encryptedLetter in guessMapping) {
                quoteDisplay = quoteDisplay.substring(0, i) + guessMapping[encryptedLetter] + quoteDisplay.substring(i+1);
            }
        }
        //reset quote display text element
        // blankQuote.html(quoteDisplay);
        blankQuote.html().replace();
    
        //if no "_" then check if they are correct
        if (quoteDisplay.indexOf("_") == -1) {
            if (checkWinCondition()) {
                playerInfoElement.text("You figured it out!").css('color', 'MidnightBlue').show(); // TODO: kill css()
                playAgainButton.show();
            }
        }
    }

    // Checks whether the evaluated quote matches the actual quote.
    function checkWinCondition() {
        for (var i = 0; i < quoteDisplay.length; i++) {
            if (quoteDisplay.charAt(i) == " ") {
                continue;
            }
            if (encryptedQuote.charAt(i) != encoding[quoteDisplay.charAt(i)]) {
                console.log("encrypted letter: " + encryptedQuote.charAt(i) + " real letter: " + quoteDisplay.charAt(i) + " " + encoding[quoteDisplay.charAt(i)]);
                console.log(encoding);
                return false;
            }
        }
        return true;
    }

    // Generates an encoding of real letters to encrypted letters.
    function generateEncoding() {
        encoding = {};
        var keys = alphabet.slice(0);
        while (alphabet.length > 0) {
            var randomAlpha = Math.floor(Math.random() * alphabet.length);
            encoding[keys[0]] = alphabet[randomAlpha];
            keys.splice(0,1);
            alphabet.splice(randomAlpha, 1);
        }
        return encoding;
    }

    // Generate quote and encrypted quote (set puzzle)
    function encryptQuote(rawQuote) {
        encryptedQuote = "";
        quoteDisplay = "";

        for (var i = 0, len = rawQuote.length; i < len; i++) {
            if (rawQuote[i] == " ") {
                encryptedQuote = encryptedQuote + " ";
                quoteDisplay = quoteDisplay + " ";
                continue;
            }
            encryptedQuote = encryptedQuote + encoding[rawQuote[i]];
            quoteDisplay = quoteDisplay + "_";
        }
    }
})();
