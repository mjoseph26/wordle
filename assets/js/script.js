// Grab DOM elements

async function init() {
    /**
     * Define following variables:
     * - currentGuess
     * - currentRow
     * - answerLength
     * - done
     */
    let currentRow = 0;
    let currentGuess = '';
    const ANSWER_LENGTH = 5;
    const message = document.getElementById('success-msg');
    const letters = document.querySelectorAll('.wordboard-letter');
    console.log(message);
    console.log(letters);

    /**
     * Make API call, get word of the day.
     * Create array of characters
     */

    const url = 'https://words.dev-apis.com/word-of-the-day';
    const res = await fetch(url);
    const data = await res.json();
    let wordOfTheDay = data.word.toUpperCase();
    //console.log(wordOfTheDay);
    let wordParts = wordOfTheDay.split('');
    console.log(wordParts)


    function addLetter(letter) {
        // check if buffer is less than 5 characters
            // if so, add letter
            // if not, replace last letter with new letter
        if(currentGuess.length < ANSWER_LENGTH){
            currentGuess += letter;
        }else{
            currentGuess = currentGuess.substring(0,currentGuess.length - 1) + letter;
        }
        letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].textContent = letter;
    }

    function handleCommit(){
        // If word doesn't contain 5 letters...
        if (currentGuess.length !== ANSWER_LENGTH) return;

        // Mark 'correct', 'close', 'wrong' squares

        // Did the user win or lose?

        // set currentGuess to empty string
        // increment currentRow
        let guessParts = currentGuess.split('');
        let wordMap = makeMap(wordParts);
        //console.log(wordMap);
        //console.log(guessParts);
        for(let i = 0; i < ANSWER_LENGTH; i++){
            if(guessParts[i] === wordParts[i]){
                letters[currentRow * ANSWER_LENGTH + i].classList.add('correct');
                wordMap[guessParts[i]]--;
            }
        }

        for(let i = 0; i < ANSWER_LENGTH; i++){
            if(guessParts[i] === wordParts[i]){
                // do nothing
            } else if (wordParts.includes(guessParts[i]) && wordMap[guessParts[i]] > 0)/*make more accurate later */{
                letters[currentRow * ANSWER_LENGTH + i].classList.add('close');
                wordMap[guessParts[i]]--;
            }
            else{
                letters[currentRow * ANSWER_LENGTH + i].classList.add('wrong');
            }
        }

        if(currentGuess === wordOfTheDay){
            animate();
            message.textContent = 'You Win!';
            message.classList.add('complete');
        }else if(currentGuess === 5){
            animate();
            message.innerHTML = `You lose! The word was <span class="wotd">${wordOfTheDay}</span>`;
            message.classList.add('complete');
        }

        currentGuess = '';
        currentRow++;
    }

    function handleBackspace() {
        // Modify currentGuess and update DOM
        currentGuess = currentGuess.substring(0,currentGuess.length - 1);
        letters[currentRow * ANSWER_LENGTH + currentGuess.length].textContent = '';
    }


    /**
     * Listen for keystrokes and perform actions based on the following:
     * 
     * - is the key Enter
     * - is the key Backspace
     * - is the key a valid letter
     * - otherwise...
     */

    document.addEventListener('keydown',function(event){
        const action = event.key;

        if(action === 'Enter'){
            handleCommit();
        }else if(action == 'Backspace'){
            handleBackspace();
        }else if (isLetter(action)){
            addLetter(action.toUpperCase());
            //console.log(action);
        }
        else
        {

        }
        
    })
    
}


function isLetter(action) {
    // Check if keystroke is indeed a letter
    return /^[a-zA-Z]$/.test(action);
}

function makeMap(array) {
    // Create object of characters along with amount of occurrences in word.
    const obj = {};
    for(let i = 0; i < array.length; i++){
        if(obj[array[i]]){
            obj[array[i]]++;
        }
        else{
            obj[array[i]] = 1;
        }
    }
    return obj;
}

init();
