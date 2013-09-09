/**

 TODO:
 - Fetch quotes from remote source
 - Fix random encoding generator
 - Additional actions: once-per-game hint; wipe out all guesses; give up and see quote; ...
 - Disable inputs when the puzzle is solved
 - Improve visuals with better CSS

*/

(function() {

    var encryptedQuote,
        evaluatedQuote,
        guessFrom,
        guessTo,
        playerInfo,
        playAgain,
        actualEncoding = {},
        playerEncoding = {},
        encryptedQuoteText = '',
        alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        alphabetLetterRegex = /^[A-Z]$/;

    $(function init() {
        encryptedQuote = $('#encrypted-quote');
        evaluatedQuote = $('#evaluated-quote');
        guessFrom = $('#guess-from');
        guessTo = $('#guess-to')
        playerInfo = $('#player-info');
        playAgain = $('#play-again').click(reset);

        $('#guess-form').on('submit', processGuess);

        reset();
    });

    // Resets the game.
    function reset(ev) {
        if (ev) ev.preventDefault();

        playAgain.hide();
        playerInfo.hide();

        actualEncoding = generateRandomEncoding();
        playerEncoding = {};
        encryptedQuoteText = encode(getQuote(), actualEncoding);

        updateDisplay();
    }

    // Handles a player's guess.
    function processGuess(ev) {        
        if (ev) ev.preventDefault();

        playerInfo.hide();

        var encrypted = guessFrom.val().toUpperCase();
        var actual = guessTo.val().toUpperCase();

        // ensure that the player has provided a valid guess
        if (!alphabetLetterRegex.test(encrypted) || !alphabetLetterRegex.test(actual)) {
            playerInfo
                .text('Guesses must be single letters of the alphabet.')
                .removeClass('congrats')
                .addClass('warning')
                .show();
            return;
        }

        // don't let the same encrypted letter stand for more than one real letter
        for (var letter in playerEncoding) {
            if (playerEncoding.hasOwnProperty(letter) && playerEncoding[letter] === encrypted) {
                delete playerEncoding[letter];
                break;
            }
        }
        
        // record the new guess and update the display
        playerEncoding[actual] = encrypted;
        updateDisplay();

        // check whether the player has successfully decoded the quote    
        if (checkWinCondition()) {
            playAgain.show();
            playerInfo
                .text('You figured it out!')
                .removeClass('warning')
                .addClass('congrats')
                .show();
        }
    }

    // Updates the puzzle lines and clears the controls.
    function updateDisplay() {
        encryptedQuote.text(encryptedQuoteText);
        evaluatedQuote.text(decode(encryptedQuoteText, playerEncoding));
        guessFrom.val('').focus();
        guessTo.val('');
    }

    // Checks whether the evaluated quote matches the actual quote.
    function checkWinCondition() {
        var evaluatedQuoteText = decode(encryptedQuoteText, playerEncoding);
        for (var i = 0; i < evaluatedQuoteText.length; i++) {
            var evaluatedLetter = evaluatedQuoteText[i];
            var encryptedLetter = encryptedQuoteText[i];
            if (alphabetLetterRegex.test(encryptedLetter) && actualEncoding[evaluatedLetter] !== encryptedLetter) {
                return false;
            }
        }
        return true;
    }

    // Generates an encoding of real letters to encrypted letters.
    // TODO: This method still has an edge case that can result in an infinite loop.
    // Write a fool-proof way to select values so that no letter maps to itself.
    function generateRandomEncoding() {
        var encoding = {};
        var keys = alphabet.slice(0);
        var vals = alphabet.slice(0);

        while (keys.length > 0) {
            var key = keys.shift();
            var val_idx = (function getNonMatchingLetter() {
                var idx = Math.floor(Math.random() * vals.length);
                return vals[idx] === key ? getNonMatchingLetter() : idx;
            })();
            encoding[key] = vals.splice(val_idx, 1).pop();
        }

        return encoding;
    }

    // Produces an encrypted string from a plaintext and an encoding.
    function encode(plaintext, encoding) {
        var result = plaintext.split('');
        for (var i = 0; i < result.length; i++) {
            var plaintextLetter = result[i].toUpperCase();
            result[i] = encoding[plaintextLetter] || plaintextLetter;
        }
        return result.join('');
    }

    // Produces a (supposed) plaintext from an encrypted string and an encoding.
    // Letters that aren't available in the encoding are transcribed as underscores.
    function decode(encrypted, encoding) {
        var result = encrypted.split('');
        var invertedEncoding = _invertEncoding(encoding);
        for (var i = 0; i < result.length; i++) {
            var encryptedLetter = result[i].toUpperCase();
            if (alphabetLetterRegex.test(encryptedLetter)) {
                result[i] = invertedEncoding[encryptedLetter] || '_';
            }
        }
        return result.join('');

        function _invertEncoding(enc) {
            inverted = {};
            for (var letter in enc) {
                if (enc.hasOwnProperty(letter)) {
                    inverted[enc[letter]] = letter;
                }
            }
            return inverted;
        }
    }

    // TODO: Fetch quotes from a remote source.
    function getQuote() {
        return 'Isn\'t JavaScript so much fun?';
    }

})();
