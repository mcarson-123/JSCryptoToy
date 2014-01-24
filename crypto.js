// todo:
//     make pretty (css)
//  -print out correct guesses in a different color in quoteDisplay
//             -animate? ie flash a couple times a correct guess
//     -center elements on screen
//     -use pretty button
(function() {
    var quote = {},
        allQuotes = {},
        encryptedQuote,
        encryptedQuoteText = [],
        evaluatedQuote,
        encoding = {},//plain letter -> encoded letter
        guesses = {},//encoded letter -> plain letter (represents player's guesses)
        guessFrom,
        guessTo,
        playerInfo,
        resetButton,
        gameSpace,
        alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    $(function init() {
        gameSpace = $("#game-space");
        encryptedQuote = $("#encrypted-quote");
        evaluatedQuote = $("#evaluated-quote");
        guessFrom = $("#guess-from");
        guessTo = $("#guess-to");
        playerInfo = $("#player-info");
        resetButton = $("#play-again").click(setUpGame);

        $('#guess-form').on('submit', processGuess);
        getQuote();

        setUpGame();

    });

    function setUpGame(){
        guesses = {};
        playerInfo.html('');

        // check if a quote file has already been selected
        if(allQuotes.length && allQuotes.length !== 0) {
            gameSpace.show();
            var randomIndex = Math.floor(Math.random()*allQuotes.length);
            quote = allQuotes[randomIndex].split('');
            encoding = generateEncoding();
            encryptedQuote.text((encryptedQuoteText = encryptQuote()).join(""));
            // evaluatedQuote.text(evaluateQuote().join(""));
            evaluateQuote();
            resetButton.hide();
        }else{
            playerInfo.html('Please select a file of quotes to begin');
        }

    }

    function getQuote(){
        var reader = new FileReader();
        reader.onload = generateNewQuote;
        $("#quoteFile").on("change", function() {
            reader.readAsText(this.files[0]);
        });
    }

    function generateNewQuote(evt){
        allQuotes = this.result.split(/\n/);
        allQuotes = _.filter(allQuotes, function(quote){
            return (/\S/).test(quote);
        });
        setUpGame();
    }

    function generateEncoding(){
        var encodingValues = alphabet.slice();
        var encoding = {};

        // takes a copy of the alphabet array and moves each letter to a random index. 
        // it is possible that by the end a letter will have a mapping to itself, the recursive method
        // called below (ensureUniqueMapping()) attempts to fix any cases of this.
        $.each(alphabet, function encode(index, alphaLetter){
            var randomIndex = Math.floor(Math.random()*alphabet.length);
            encodingValues = _.without(encodingValues, alphaLetter);
            encodingValues.splice(randomIndex, 0, alphaLetter);

        });

        //attempt to ensure no letter maps to itself
        encodingValues = ensureUniqueMapping(encodingValues);

        //generate encoding map of plain letter -> encoded letter
        $.each(alphabet, function encode(index, alphaLetter){
            encoding[alphaLetter] = encodingValues[index];
        });
        return encoding;
    }

    function ensureUniqueMapping(encodingValues){
        $.each(alphabet, function encode(index, alphaLetter){
            if(alphaLetter == encodingValues[index]){
                //swap with next encoding, using wrap for end value
                var swapIndex = index+1;
                if (alphaLetter == _.last(alphabet)) {
                    swapIndex = 0;
                }
                encodingValues[index] = encodingValues[swapIndex];
                encodingValues[swapIndex] = alphaLetter;
                //check again for unique mapping now we've fixed one instance.
                ensureUniqueMapping(encodingValues);
            }
        });

        return encodingValues;
    }

    function encryptQuote(){
        var encryptedQuoteText = [];
        $.each(quote, function(index, letter){
            letter = letter.toUpperCase();
            if (_.contains(alphabet, letter)) {
                encryptedQuoteText.push(encoding[letter]);
            } else {
                encryptedQuoteText.push(letter);
            }
        });
        return encryptedQuoteText;

    }

    // // create the text to print out for the guessed letters
    // // starts out like "____" and gets populated with guesses
    // function evaluateQuote(){
    //     var evaluatedQuoteText = [];
    //     $.each(encryptedQuoteText, function(index, letter){
    //         if (_.contains(alphabet, letter)) {
    //             if(_.contains(_.keys(guesses), letter) && guesses[letter] !== ''){
    //                 evaluatedQuoteText.push(guesses[letter]);
    //                 evaluatedQuoteText.push('<span class="CorrectGuess">'+guesses[letter]+'</span>');
    //             }else{
    //                 evaluatedQuoteText.push("_");
    //             }
    //         } else {
    //             evaluatedQuoteText.push(letter);
    //         }
    //     });
    //     return evaluatedQuoteText;
    // }

    // create the text to print out for the guessed letters
    // starts out like "____" and gets populated with guesses
    function evaluateQuote(){
        evaluatedQuote.text('');
        var invertedEncoding = _.invert(encoding); //want encoded letter -> plain letter (same format as guesses)
        $.each(encryptedQuoteText, function(index, encodedLetter){
            if (_.contains(alphabet, encodedLetter)) {
                if(_.contains(_.keys(guesses), encodedLetter) && guesses[encodedLetter] !== ''){
                    //check if correct guess or not
                    if(guesses[encodedLetter] === invertedEncoding[encodedLetter]){
                        evaluatedQuote.append('<span class="correctGuess">'+guesses[encodedLetter]+'</span>');
                    } else{
                        evaluatedQuote.append(guesses[encodedLetter]);
                    }
                }else{
                    evaluatedQuote.append("_");
                }
            } else {
                evaluatedQuote.append(encodedLetter);
            }
        });
    }

    function processGuess(ev){
        if (ev) ev.preventDefault();
        playerInfo.html('');

        var guessFromLetter = guessFrom.val().toUpperCase();
        guessFrom.val('');
        var guessToLetter = guessTo.val().toUpperCase();
        guessTo.val('');

        if(guessFromLetter == guessToLetter || !_.contains(alphabet, guessFromLetter) || !_.contains(alphabet, guessToLetter)){
            playerInfo.html(( (guessFromLetter == guessToLetter) ? "Guesses must be unique" : "Guesses must be letters"));
            playerInfo.removeClass('win')
                        .addClass('warning');
            guessFrom.focus();
            return;
        }

        //do validation on guess
        //check if guessTo aleady exists, if so remove it from previous guess
        if(_.contains(_.values(guesses), guessToLetter)){
            _.each(_.keys(guesses), function(guess){
                if(guesses[guess] == guessToLetter){
                    guesses[guess] = '';
                }
            });
        }

        guesses[guessFromLetter] = guessToLetter;

        evaluateQuote();
        // evaluatedQuote.text(evaluateQuote().join(""));
        // var evaluated = evaluateQuote();
        // _.each(evaluated, function(letter){
        //     evaluatedQuote.append('<span class="correctGuess">' + letter + '</span>');
        // });
        
        
        if(evaluateWin()){
            playerInfo.html("You Win!");
            playerInfo.removeClass('warning')
                        .addClass('win');
            resetButton.show();
            resetButton.focus();
        }else{
            guessFrom.focus();
        }
    }

    function evaluateWin(){
        // first check if there are no "_" in evaluated quote text
        if (evaluatedQuote.text().indexOf("_") != -1) {
            return false;
        }
        //check if guesses matches encoding (but opposite)
        for(var i = 0; i < encryptedQuoteText.length; i++){
            var evaluatedLetter = evaluatedQuote.text().split("")[i]; //may be actual letter
            var encryptedLetter = encryptedQuoteText[i]; //encoding to actual letter
            //encoding plain letter -> encoded letter
            if(_.contains(alphabet, evaluatedLetter) && encoding[evaluatedLetter] != encryptedLetter){
                return false;
            }
        }
        return true;
    }

})();