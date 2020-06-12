const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-btn");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");

const figureParts = document.querySelectorAll(".figure-part");

// TODO : make DB request for words
const words = ["application", "programming", "interface", "arknights"];

let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

// Show hidden word
function displayWord() {
    wordEl.innerHTML = `
        ${selectedWord.split("").map(letter => `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter : ``}
        </span>`)
            .join("")}
    `;
    const innerWord = wordEl.innerText.replace(/\n/g, ''); // remove newline characters
    if (innerWord === selectedWord) {
        finalMessage.innerText = "Congratulations ! You won !";
        popup.style.display = 'flex';
        window.removeEventListener('keydown', onKeyDown);
    }
}

function updateWrongLettersEl() {
    // Display wrong letters
    wrongLettersEl.innerHTML = `
        ${wrongLetters.length > 0 ? '<p>Wrong letters</p>' : ''}
        ${wrongLetters.map(letter => `<span>${letter}</span>`)}
    `;
    // Display svg parts
    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    // Check if lost
    if (wrongLetters.length === figureParts.length) {
        finalMessage.innerText = `Unlucky ! The word was ${selectedWord}`;
        popup.style.display = 'flex';
        window.removeEventListener('keydown', onKeyDown);
    }
}

function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Keypress handling
function onKeyDown(e) {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key;

        if (selectedWord.includes(letter)) {
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);
                displayWord();
            } else {
                showNotification();
            }
        } else {
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLettersEl();
            } else {
                showNotification();
            }
        }
    }
}

// Event listeners
window.addEventListener('keydown', onKeyDown); // event parameter is automatically passed

playAgainBtn.addEventListener('click', () => {
    window.addEventListener('keydown', onKeyDown);
    correctLetters.splice(0);
    wrongLetters.splice(0);
    
    selectedWord = words[Math.floor(Math.random() * words.length)];

    displayWord();
    updateWrongLettersEl();
    popup.style.display = 'none';
});

displayWord();