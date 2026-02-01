// ----- Screen States -----
const SCREENS = {
  MENU: "menu",
  PLAYING: "playing",
  WIN: "win",
  LOSE: "lose"
};

// ----- Game State -----
const gameState = {
  screen: SCREENS.MENU,
  phrase: "",
  guessedLetters: new Set(),
  lives: 5
};





// DOM References (cached once)

// ----- Screen Elements -----
const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const winScreen = document.getElementById("win-screen");
const loseScreen = document.getElementById("lose-screen");

// ----- UI Elements -----
const startBtn = document.getElementById("start-btn");
const playAgainBtns = document.querySelectorAll(".play-again-btn");

const phraseDisplay = document.getElementById("phrase-display");
const livesDisplay = document.getElementById("lives");
const guessedLettersDisplay = document.getElementById("guessed-letters");

const winPhrase = document.getElementById("win-phrase");
const losePhrase = document.getElementById("lose-phrase");







// Phrases to guess
const PHRASES = [
  "HELLO WORLD",
  "PHRASE HUNTER",
  "OPENAI CHATGPT",
  "JAVASCRIPT ROCKS",
  "WEB DEVELOPMENT",
  "KARYLLE DELANTES",
  "GAME DEVELOPMENT",
  "GAME ASSETS",
  "OPEN WORLD",
  "CCS 106"
];

function getRandomPhrase() {
  const index = Math.floor(Math.random() * PHRASES.length);
  return PHRASES[index];
}







// Screen Management
function hideAllScreens() {
  menuScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  winScreen.classList.add("hidden");
  loseScreen.classList.add("hidden");
}

function showScreen(screen) {
  hideAllScreens();

  switch (screen) {
    case SCREENS.MENU:
      menuScreen.classList.remove("hidden");
      break;
    case SCREENS.PLAYING:
      gameScreen.classList.remove("hidden");
      break;
    case SCREENS.WIN:
      winScreen.classList.remove("hidden");
      break;
    case SCREENS.LOSE:
      loseScreen.classList.remove("hidden");
      break;
  }
}







// Start/Reset Game
function startGame() {
  gameState.phrase = getRandomPhrase();
  gameState.guessedLetters.clear();
  gameState.lives = 5;
  gameState.screen = SCREENS.PLAYING;

  render();
}







// Guessing Logic
function guessLetter(letter) {
  if (gameState.screen !== SCREENS.PLAYING) return;
  if (gameState.guessedLetters.has(letter)) return;

  gameState.guessedLetters.add(letter);

  if (!gameState.phrase.includes(letter)) {
    gameState.lives--;
  }

  checkGameStatus();
}







// Win/Loose Checker
function checkGameStatus() {
  const lettersOnly = gameState.phrase.replace(/ /g, "");
  const allGuessed = [...lettersOnly].every(ch =>
    gameState.guessedLetters.has(ch)
  );

  if (allGuessed) {
    gameState.screen = SCREENS.WIN;
  } else if (gameState.lives <= 0) {
    gameState.screen = SCREENS.LOSE;
  }
}







// Rendering Functions
function render() {
  showScreen(gameState.screen);

  if (gameState.screen === SCREENS.PLAYING) {
    renderPhrase();
    renderLives();
    renderGuessedLetters();
  }

  if (gameState.screen === SCREENS.WIN) {
    winPhrase.textContent = `"${gameState.phrase}"`;
  }

  if (gameState.screen === SCREENS.LOSE) {
    losePhrase.textContent = `"${gameState.phrase}"`;
  }
}







// Phrase Render
function renderPhrase() {
  phraseDisplay.innerHTML = "";

  for (const ch of gameState.phrase) {
    const span = document.createElement("span");

    if (ch === " ") {
      span.textContent = " ";
      span.classList.add("space");
    } else if (gameState.guessedLetters.has(ch)) {
      span.textContent = ch;
    } else {
      span.textContent = "_";
    }

    phraseDisplay.appendChild(span);
  }
}







// Lives Renderer
function renderLives() {
  livesDisplay.textContent = "❤️ ".repeat(gameState.lives);
}







// Guessed Letters Renderer
function renderGuessedLetters() {
  guessedLettersDisplay.textContent =
    "Guessed letters: " +
    [...gameState.guessedLetters].join(" ");
}







// Event Listeners
startBtn.addEventListener("click", startGame);

playAgainBtns.forEach(btn => {
  btn.addEventListener("click", startGame);
});

document.addEventListener("keydown", (e) => {
  const letter = e.key.toUpperCase();

  if (!/^[A-Z]$/.test(letter)) return;

  guessLetter(letter);
  render();
});







// Initial Renderer
render();

