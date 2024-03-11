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
    if (isBurnObject) {
      object.src = "/assets/sneakyBurn.png"; // Path to your burn image
      object.classList.add("object", "burn");
    } else {
      const randomImageIndex = Math.floor(Math.random() * objectImages.length);
      object.src = objectImages[randomImageIndex];
      object.classList.add("object");
    }
    object.style.left = Math.random() * (playArea.offsetWidth - 50) + "px";
    playArea.appendChild(object);

    // Adjust fallSpeed based on the score
    const baseSpeed = 2; // Starting speed
    const speedIncrement = 0.1; // Speed increase per 10 points
    let fallSpeed =
      baseSpeed + Math.floor(score / 10) * speedIncrement + Math.random() * 2; // Adding a little randomness

    function fall() {
      if (!object.parentElement) return; // Stop if object is already removed
      object.style.top = object.offsetTop + fallSpeed + "px";

      if (checkCollision(object, player)) {
        objectCaught(object, isBurnObject);
      } else if (object.offsetTop > playArea.offsetHeight) {
        if (!isBurnObject) {
          caughtBurnObjects++;
          health--;
          updateHealthDisplay();
        }
        object.remove(); // Remove the object regardless
      } else {
        requestAnimationFrame(fall);
      }
    }

    fall();
  }

  function endGame() {
    clearInterval(spawningInterval); // Stop spawning new objects
    playArea.classList.add("fade-out");

    setTimeout(() => {
      playArea.innerHTML = ""; // Clear the play area
      const endGameMessage = document.createElement("h2");
      endGameMessage.textContent = getEndGameMessage(score);
      endGameMessage.style.fontFamily = 'KA1';
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
    }, 500);
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
      // Only increment score if the caught object is not a burn object
      score++;
      updateScoreDisplay();
    } else {
      // If the object is a burn object, increment the burn object counter
      caughtBurnObjects++;
      health--;
      updateHealthDisplay();
      // Change the play-area's background color as visual feedback
      playArea.style.backgroundColor = "red";
      setTimeout(() => {
        playArea.style.backgroundColor = ""; // Reset the background after 0.5s
      }, 500);

      // Check if more than 5 burn objects have been caught
      if (caughtBurnObjects >= 5) {
        endGame(); // End the game
        return; // Exit the function to prevent further execution
      }
    }
    object.remove(); // Remove the object from the play area
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
    // Clear the current hearts
    while (healthBars.firstChild) {
      healthBars.removeChild(healthBars.firstChild);
    }

    // Add hearts back according to the current health
    for (let i = 0; i < health; i++) {
      const heartImg = document.createElement("img");
      heartImg.src = "/assets/heart.png"; // Make sure this path matches your heart image's location
      heartImg.classList.add("heart");
      healthBars.appendChild(heartImg);
    }

    // Optionally, you might want to add a condition to handle when health is 0,
    // such as showing a game over screen or disabling game controls.
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
