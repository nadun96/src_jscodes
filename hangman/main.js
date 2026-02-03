const wordEl = document.getElementById("word");
const wrongGuessesEl = document.getElementById("wrong-guesses");
const remainingEl = document.getElementById("remaining");
const keyboardEl = document.getElementById("keyboard");
const resetBtn = document.getElementById("reset-btn");

const words = [
  "javascript",
  "hangman",
  "programming",
  "developer",
  "interface",
  "computer",
  "software",
  "algorithm",
];

let selectedWord = "";
let guessedLetters = new Set();
let wrongGuesses = new Set();
const maxWrong = 8;

// --- Game State Functions ---
function pickRandomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

function isGameWon(word, guessedLetters) {
  return word.split("").every((char) => guessedLetters.has(char));
}

function isGameOver(wrongGuesses, maxWrong) {
  return wrongGuesses.size >= maxWrong;
}

function getDisplayWord(word, guessedLetters) {
  return word
    .split("")
    .map((char) => (guessedLetters.has(char) ? char : "_"))
    .join(" ");
}

// --- UI Rendering Functions ---
function renderWord(word, guessedLetters) {
  wordEl.textContent = getDisplayWord(word, guessedLetters);
}

function renderWrongGuesses(wrongGuesses) {
  wrongGuessesEl.textContent = Array.from(wrongGuesses).join(", ");
}

function renderRemainingGuesses(wrongGuesses, maxWrong) {
  remainingEl.textContent = maxWrong - wrongGuesses.size;
}

function disableAllKeys() {
  const keys = keyboardEl.querySelectorAll(".key");
  keys.forEach((key) => {
    key.disabled = true;
    key.classList.add("disabled");
  });
}

function disableKeyButton(button) {
  button.disabled = true;
  button.classList.add("disabled");
}

// --- Game Logic Functions ---
function handleCorrectGuess(letter, guessedLetters, word) {
  guessedLetters.add(letter);
  renderWord(word, guessedLetters);
  if (isGameWon(word, guessedLetters)) {
    alert("Congratulations! You won!");
    disableAllKeys();
  }
}

function handleWrongGuess(letter, wrongGuesses, word, maxWrong) {
  wrongGuesses.add(letter);
  renderWrongGuesses(wrongGuesses);
  renderRemainingGuesses(wrongGuesses, maxWrong);
  if (isGameOver(wrongGuesses, maxWrong)) {
    alert(`You lost! The word was "${word}".`);
    disableAllKeys();
  }
}

function handleGuess(
  letter,
  button,
  word,
  guessedLetters,
  wrongGuesses,
  maxWrong
) {
  if (guessedLetters.has(letter) || wrongGuesses.has(letter)) return;

  if (word.includes(letter)) {
    handleCorrectGuess(letter, guessedLetters, word);
  } else {
    handleWrongGuess(letter, wrongGuesses, word, maxWrong);
  }

  disableKeyButton(button);
}

// --- Keyboard Creation ---
function createKeyboard(onKeyPress) {
  const layout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  keyboardEl.innerHTML = "";

  layout.forEach((row) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("key-row");

    row.forEach((letter) => {
      const keyBtn = document.createElement("button");
      keyBtn.classList.add("key");
      keyBtn.textContent = letter;
      keyBtn.addEventListener("click", () => onKeyPress(letter, keyBtn));
      rowDiv.appendChild(keyBtn);
    });

    keyboardEl.appendChild(rowDiv);
  });
}

// --- Game Initialization ---
function initGame() {
  selectedWord = pickRandomWord(words);
  guessedLetters = new Set();
  wrongGuesses = new Set();

  renderWord(selectedWord, guessedLetters);
  renderWrongGuesses(wrongGuesses);
  renderRemainingGuesses(wrongGuesses, maxWrong);

  createKeyboard((letter, button) =>
    handleGuess(
      letter,
      button,
      selectedWord,
      guessedLetters,
      wrongGuesses,
      maxWrong
    )
  );
}

resetBtn.addEventListener("click", initGame);
initGame();
