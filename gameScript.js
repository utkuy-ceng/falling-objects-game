document.addEventListener("DOMContentLoaded", () => {
  const playArea = document.getElementById("play-area");
  const gameContainer = document.getElementById("game-container");
  const scoreDisplay = document.getElementById("score");
  const untilNextCardDisplay = document.getElementById("until-next-card");
  const player = document.getElementById("player");
  let score = 0;
  let health = 5; // Assuming 3 hearts to start with
  let lastPosition = 0; // Keep track of the last cursor position
  let cardsDisplayed = 0;
  let caughtBurnObjects = 0;
  let comboCounter = 0;
  let scoreMultiplier = 1;
  let spawningInterval;

  document.addEventListener("mousemove", (e) => {
    const currentPosition = e.clientX;

    if (currentPosition > lastPosition) {
      player.classList.remove("mirror");
    } else if (currentPosition < lastPosition) {
      player.classList.add("mirror");
    }

    lastPosition = currentPosition;
  });

  const scoreMessages = [
    "Cooking up a storm!",
    "Bistro's touched out!",
    "Spot-on, like they aimed!",
    "Luck's laugh, not clover's!",
    "Out-circled squares!",
    "Dining in victory!",
    "Victory revealed!",
    "Aloha to farewells!",
    "Totally toasted!",
  ];

  const objectImages = ["/assets/pizzaSlice.png", "/assets/burger.png"];

  const cardsContent = [
    // Define your cards content here
    // Example:
    {
      title: "Card 1",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    {
      title: "Card 2",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    {
      title: "Card 3",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    {
      title: "Card 4",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    {
      title: "Card 5",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    {
      title: "Card 6",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    {
      title: "Card 7",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    {
      title: "Card 8",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    {
      title: "Card 9",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    {
      title: "Card 10",
      img: "/assets/feature-of-engineering.jpeg",
      text: "Text about this feature!",
    },
    // Add up to 10 card details
  ];

  document.addEventListener("mousemove", (e) => {
    const relativeX = e.clientX - playArea.offsetLeft;
    player.style.left =
      Math.max(
        0,
        Math.min(playArea.offsetWidth - player.offsetWidth, relativeX)
      ) + "px";
  });

  function showScoreMessage() {
    const messageEl = document.createElement("div");
    messageEl.classList.add("score-message");
    messageEl.textContent =
      scoreMessages[cardsDisplayed % scoreMessages.length];

    // Set up initial styles for the message
    messageEl.style.position = "absolute";
    messageEl.style.left = "50%";
    messageEl.style.top = "50%";
    messageEl.style.transform = "translate(-50%, -50%)";
    messageEl.style.whiteSpace = "nowrap";
    messageEl.style.opacity = 0;
    messageEl.style.fontSize = "24px";
    messageEl.style.color = "#000";
    messageEl.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    messageEl.style.padding = "10px";
    messageEl.style.zIndex = 1000;

    // Append message to the play-area
    playArea.appendChild(messageEl);

    // Create image element
    const imageEl = document.createElement("img");
    imageEl.src = "/assets/chefWoman.png";
    imageEl.style.width = "250px";
    imageEl.style.height = "auto";
    imageEl.style.position = "absolute";
    imageEl.style.top = "33.2%";
    imageEl.style.left = "50%";
    imageEl.style.transform = "translate(-50%, -50%)";
    imageEl.style.zIndex = "1000";
    imageEl.classList.add("score-image");

    // Append image to the play-area
    playArea.appendChild(imageEl);

    // Set up keyframes for animation
    const keyframes = [
      { transform: "translate(-50%, -50%)", opacity: 0 },
      { transform: "translate(-50%, -50%)", opacity: 1, offset: 0.2 },
      { transform: "translate(-50%, -50%)", opacity: 1, offset: 0.8 },
      { transform: "translate(-50%, -50%)", opacity: 0 },
    ];

    const animationOptions = {
      duration: 4500,
      easing: "ease-in-out",
    };

    // Start the animation for both elements
    messageEl.animate(keyframes, animationOptions);
    imageEl.animate(keyframes, animationOptions);

    // Remove the message and image after the animation completes
    setTimeout(() => {
      messageEl.remove();
      imageEl.remove();
    }, animationOptions.duration);
  }

  // Run the function to show the message

  function spawnObject() {
    const object = document.createElement("img");
    const isBurnObject = Math.random() < 0.1; // 10% chance for a "burn" object
    object.style.left = Math.random() * (playArea.offsetWidth - 50) + "px";

    if (isBurnObject) {
      object.src = "/assets/sneakyBurn.png";
      object.classList.add("object", "burn");
    } else {
      const randomImageIndex = Math.floor(Math.random() * objectImages.length);
      object.src = objectImages[randomImageIndex];
      object.classList.add("object");
    }

    playArea.appendChild(object);

    let fallSpeed = calculateFallSpeed(); // Simplified for brevity

    function fall() {
      if (!object.parentElement) return;
      object.style.top = object.offsetTop + fallSpeed + "px";

      if (checkCollision(object, player)) {
        objectCaught(object, isBurnObject); // Pass isBurnObject correctly
      } else if (object.offsetTop > playArea.offsetHeight) {
        object.remove();
        if (!isBurnObject) {
          // Missed non-burn object logic, if needed
        }
      } else {
        requestAnimationFrame(fall);
      }
    }

    fall();
  }

  function calculateFallSpeed() {
    const baseSpeed = 2; // Base speed of falling objects
    const speedIncrement = 0.1; // Increment per 10 points scored
    const randomFactor = Math.random() * 2; // Adding randomness to the fall speed

    // The fall speed increases as the score gets higher but also has a random component
    return baseSpeed + Math.floor(score / 10) * speedIncrement + randomFactor;
  }

  function endGame() {
    clearInterval(spawningInterval); // Stop spawning new objects
    playArea.classList.add("fade-out");

    setTimeout(() => {
      playArea.innerHTML = ""; // Clear the play area
      const endGameMessage = document.createElement("h2");
      endGameMessage.textContent = getEndGameMessage(score);
      endGameMessage.style.fontFamily = "KA1";
      playArea.appendChild(endGameMessage);

      // Try to find the gameOverForm
      let gameOverForm = document.getElementById("game-over-form");
      // If it doesn't exist, create it dynamically
      if (!gameOverForm) {
        gameOverForm = document.createElement("div");
        gameOverForm.id = "game-over-form";
        gameOverForm.innerHTML = `
                <form id="player-details-form">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" required>
                    <label for="surname">Surname:</label>
                    <input type="text" id="surname" name="surname" required>
                    <button type="submit">Submit</button>
                </form>
            `;
        gameOverForm.style.display = "none"; // Initially hidden
        document.body.appendChild(gameOverForm); // Append it to the body or another container as appropriate
      }

      // Now, safely show the form
      gameOverForm.style.display = "block";
      playArea.classList.add("fade-in");
      gameContainer.style.cursor = "auto";
      playArea.appendChild(gameOverForm);

      playArea.style.backgroundImage = "url('/assets/background.png')";
    }, 1000);
  }

  function checkCollision(obj1, obj2) {
    const obj1Rect = obj1.getBoundingClientRect();
    const obj2Rect = obj2.getBoundingClientRect();
    return !(
      obj1Rect.bottom < obj2Rect.top ||
      obj1Rect.top > obj2Rect.bottom ||
      obj1Rect.right < obj2Rect.left ||
      obj1Rect.left > obj2Rect.right
    );
  }

  function objectCaught(object, isBurnObject) {
    if (!isBurnObject) {
      // Handling for non-burn objects
      comboCounter++;
      let pointsAwarded = calculatePoints(1); // Assuming 1 point per object
      score += pointsAwarded;
      updateScoreDisplay();

      if (comboCounter % 10 === 0 && scoreMultiplier < 3) {
        scoreMultiplier += 0.5;
        showComboMultiplierFeedback();
      }
    } else {
      // Handling for burn objects
      console.log("lololo");
      handleBurnObjectCatch();
    }

    object.remove(); // Remove object from play area regardless of type
  }

  function calculatePoints(basePoints) {
    return basePoints * scoreMultiplier;
  }

  function resetComboAndMultiplier() {
    comboCounter = 0;
    scoreMultiplier = 1;
    // Consider providing UI feedback here as well
  }

  function calculatePoints(basePoints) {
    return basePoints * scoreMultiplier;
  }

  function handleBurnObjectCatch() {
    console.log("Burn object caught, handling..."); // Debugging line
    health--;
    console.log(`New health: ${health}`); // Debugging line to check health decrement
    updateHealthDisplay();
    resetComboAndMultiplier();

    playArea.style.backgroundColor = "red";
    setTimeout(() => (playArea.style.backgroundColor = ""), 500);

    if (health <= 0) {
      console.log("Health depleted, ending game..."); // Debugging line
      endGame();
    }
  }

  function showComboMultiplierFeedback() {
    // Display new multiplier visually, e.g., "Multiplier: x1.5!"
    const feedbackElement = document.createElement("div");
    feedbackElement.textContent = `Multiplier: x${scoreMultiplier}!`;
    feedbackElement.style.position = "absolute";
    feedbackElement.style.top = "10%";
    feedbackElement.style.left = "50%";
    feedbackElement.style.transform = "translateX(-50%)";
    feedbackElement.style.color = "yellow";
    feedbackElement.style.fontSize = "20px";
    feedbackElement.style.zIndex = 1000;
    feedbackElement.style.fontFamily = "KA1";
    playArea.appendChild(feedbackElement);

    setTimeout(() => {
      playArea.removeChild(feedbackElement);
    }, 2000); // Remove feedback after 2 seconds
  }

  function updateScore(points) {
    score += points * scoreMultiplier;
    updateScoreDisplay(); // Refresh the score display on the UI
  }

  function updateScoreDisplay() {
    scoreDisplay.textContent = score;
    const objectsUntilNextCard = 10 - (score % 10);
    untilNextCardDisplay.textContent =
      objectsUntilNextCard === 10 ? 0 : objectsUntilNextCard;

    if (
      score % 10 === 0 &&
      score !== 0 &&
      cardsDisplayed < cardsContent.length
    ) {
      showScoreMessage();
      displayCard();
    }

    // Check if the score reaches 90 and end the game if true
    if (score >= 100) {
      endGame();
    }
  }

  function updateHealthDisplay() {
    const healthBars = document.getElementById("health-bars");
    // Ensure existing hearts are cleared before redrawing
    while (healthBars.firstChild) {
      healthBars.removeChild(healthBars.firstChild);
    }

    // Redraw hearts based on current health
    for (let i = 0; i < health; i++) {
      const heartImg = document.createElement("img");
      heartImg.src = "/assets/heart.png";
      heartImg.classList.add("heart");
      healthBars.appendChild(heartImg);
    }
  }

  function displayCard() {
    const cardData = cardsContent[cardsDisplayed];
    const card = document.createElement("div");
    card.classList.add("card", "cardFadeIn"); // Use the specific fadeIn animation for cards
    card.style.backgroundImage = `url(${cardData.img})`; // Set the background image
    card.innerHTML = `
        <h3>${cardData.title}</h3>
        <p>${cardData.text}</p>
    `;
    document.getElementById("sidebar").appendChild(card);
    cardsDisplayed++;
  }

  function getEndGameMessage(score) {
    if (score < 30) {
      return "You have high potential, but you need the correct companion. Today is your lucky day.";
    } else if (score < 50) {
      return "We can see you have really good lemons. Let's make lemonade together!";
    } else {
      return "What a player! We would never want to miss you among us. Join us today!";
    }
  }

  spawningInterval = setInterval(spawnObject, 500); // Example, adjust time as needed
});
