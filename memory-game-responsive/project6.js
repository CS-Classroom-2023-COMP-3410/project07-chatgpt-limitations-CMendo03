document.addEventListener("DOMContentLoaded", () => {
  /* ====== Setup: References ====== */
  const gameWrapper = document.querySelector(".game-wrapper");
  const fruitBorderContainer = document.querySelector(".fruit-border");
  const gameContainer = document.querySelector(".game-container");
  const gameGrid = document.getElementById("game-grid");
  const moveCounter = document.getElementById("move-counter");
  const timerDisplay = document.getElementById("timer");
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");

  const fruitOptions = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍍", "🥝", "🍉"];
  const fruitSize = 40; // approximate pixel spacing for each fruit

  function createFruit(x, y) {
    const fruitItem = document.createElement("div");
    fruitItem.classList.add("fruit-item");
    fruitItem.textContent = fruitOptions[Math.floor(Math.random() * fruitOptions.length)];
    fruitItem.style.left = `${x}px`;
    fruitItem.style.top = `${y}px`;

    const animations = ["rotateDance", "bounceDance", "wiggleDance"];
    fruitItem.style.animation = `${animations[Math.floor(Math.random() * animations.length)]} 3s infinite`;

    fruitBorderContainer.appendChild(fruitItem);
  }

// Existing function to generate fruit border around the game container:
function generateFruitBorder() {
  // Clear any existing fruits
  fruitBorderContainer.innerHTML = "";

  // Get the game container's position relative to the viewport
  const rect = gameContainer.getBoundingClientRect();

  // Define a little offset (so fruits don't overlap the game container)
  const offset = 10;

  // Top border (from left edge to right edge)
  for (let x = rect.left; x < rect.right; x += fruitSize) {
    createFruit(x, rect.top - fruitSize - offset);
  }
  // Bottom border
  for (let x = rect.left; x < rect.right; x += fruitSize) {
    createFruit(x, rect.bottom + offset);
  }
  // Left border
  for (let y = rect.top; y < rect.bottom; y += fruitSize) {
    createFruit(rect.left - fruitSize - offset, y);
  }
  // Right border
  for (let y = rect.top; y < rect.bottom; y += fruitSize) {
    createFruit(rect.right + offset, y);
  }
}

// Attach a ResizeObserver to the game container:
if (typeof ResizeObserver !== 'undefined') {
  const resizeObserver = new ResizeObserver(() => {
    generateFruitBorder();
  });
  resizeObserver.observe(gameContainer);
} else {
  // Fallback: also update on window resize if ResizeObserver isn't supported
  window.addEventListener("resize", generateFruitBorder);
}


  // Update the fruit border when the window resizes or when the game container changes size
  window.addEventListener("resize", generateFruitBorder);

  /* ====== Game Logic ====== */
  const cards = [
    "🍎", "🍎", "🍌", "🍌", "🍇", "🍇", "🍓", "🍓",
    "🍒", "🍒", "🍍", "🍍", "🥝", "🥝", "🍉", "🍉"
  ];

  const fruitDanceMap = {
    "🍎": "pivot-dance",
    "🍌": "bounce-dance",
    "🍇": "top-pivot-dance",
    "🍓": "surprise-dance",
    "🍒": "swing-dance",
    "🍍": "jitter-dance",
    "🥝": "spin-dance",
    "🍉": "float-dance"
  };

  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let gameTimer = null;
  let secondsElapsed = 0;
  let gameStarted = false;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function initializeGame() {
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    secondsElapsed = 0;
    moveCounter.textContent = moves;
    timerDisplay.textContent = "0:00";
    clearInterval(gameTimer);
    gameGrid.innerHTML = "";
    gameStarted = true;
    restartButton.disabled = false;
    startButton.disabled = true;

    // Expand the game container (triggers the CSS transition)
    gameContainer.classList.add("expanded");

    // Delay generating the fruit border until after the transition
    setTimeout(generateFruitBorder, 600);

    shuffle(cards).forEach(card => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");

      const cardInner = document.createElement("div");
      cardInner.classList.add("card-inner");

      const cardFront = document.createElement("div");
      cardFront.classList.add("card-front");

      const cardBack = document.createElement("div");
      cardBack.classList.add("card-back");

      const fruitSpan = document.createElement("span");
      fruitSpan.textContent = card;
      fruitSpan.classList.add(fruitDanceMap[card]);
      cardBack.appendChild(fruitSpan);

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      cardElement.appendChild(cardInner);

      cardElement.addEventListener("click", flipCard);
      gameGrid.appendChild(cardElement);
    });

    startTimer();
  }

  function startTimer() {
    clearInterval(gameTimer);
    secondsElapsed = 0;
    gameTimer = setInterval(() => {
      secondsElapsed++;
      const minutes = Math.floor(secondsElapsed / 60);
      const seconds = secondsElapsed % 60;
      timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
  }

  function flipCard() {
    if (!gameStarted || flippedCards.length === 2) return;

    if (!this.classList.contains("flip")) {
      this.classList.add("flip");
      flippedCards.push(this);

      if (flippedCards.length === 2) {
        moves++;
        moveCounter.textContent = moves;
        checkForMatch();
      }
    }
  }

  function checkForMatch() {
    const [card1, card2] = flippedCards;
    const cardBack1 = card1.querySelector(".card-back");
    const cardBack2 = card2.querySelector(".card-back");
    const fruit1 = cardBack1.querySelector("span");
    const fruit2 = cardBack2.querySelector("span");

    if (cardBack1.textContent === cardBack2.textContent) {
      card1.classList.add("match");
      card2.classList.add("match");

      // Preserve the dancing animation
      fruit1.style.animation = getComputedStyle(fruit1).animation;
      fruit2.style.animation = getComputedStyle(fruit2).animation;

      matchedPairs++;
      flippedCards = [];

      if (matchedPairs === cards.length / 2) {
        clearInterval(gameTimer);
        setTimeout(() => {
          triggerConfetti();
          alert(`🎉 Congratulations! You completed the game in ${moves} moves and ${timerDisplay.textContent}.`);
        }, 500);
      }
    } else {
      setTimeout(() => {
        card1.classList.remove("flip");
        card2.classList.remove("flip");
        flippedCards = [];
      }, 1000);
    }
  }

  function triggerConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.classList.add("confetti-container");
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.animationDelay = `${Math.random()}s`;
      confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }

  startButton.addEventListener("click", initializeGame);
  restartButton.addEventListener("click", () => {
    // Optionally, remove the expanded class to “shrink” the game container before restarting
    gameContainer.classList.remove("expanded");
    setTimeout(() => {
      initializeGame();
    }, 300);
  });
});
