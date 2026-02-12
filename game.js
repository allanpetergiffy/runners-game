// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player setup
const player = {
  x: 50,
  y: canvas.height - 100,
  width: 80,
  height: 80,
  velocityY: 0,
  gravity: 1
};

// Runner GIF
const runnerSprite = new Image();
runnerSprite.src = 'assets/runner.gif';

// Background
const background = new Image();
background.src = 'assets/background.png';
let bgX = 0;

// Obstacles
let obstacles = [];
let obstacleSpeed = 5;
const obstacleSprite = new Image();
obstacleSprite.src = 'assets/obstacle.png';

// Score
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Game loop reference
let gameLoop;

// Sounds
const jumpSound = new Audio('assets/jump.mp3');

// Controls
document.addEventListener('keydown', e => {
  if (e.code === 'Space') jump();
});
document.addEventListener('touchstart', () => {
  jump();
});

// Jump function
function jump() {
  if (player.y === canvas.height - player.height) {
    player.velocityY = -15;
    jumpSound.play();
  }
}

// Update player
function updatePlayer() {
  player.y += player.velocityY;
  player.velocityY += player.gravity;

  if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
    player.velocityY = 0;
  }
}

// Draw player
function drawPlayer() {
  ctx.drawImage(runnerSprite, player.x, player.y, player.width, player.height);
}

// Create obstacles
function createObstacle() {
  const obstacle = {
    x: canvas.width,
    y: canvas.height - 60,
    width: 50,
    height: 50
  };
  obstacles.push(obstacle);
}

// Update obstacles
function updateObstacles() {
  obstacles.forEach(obstacle => {
    obstacle.x -= obstacleSpeed;
  });

  obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

  // Difficulty scaling
  if (score % 500 === 0 && score !== 0) {
    obstacleSpeed += 1;
  }
}

// Draw obstacles
function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.drawImage(obstacleSprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Collision detection
function checkCollision() {
  obstacles.forEach(obstacle => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameOver();
    }
  });
}

// Score update
function updateScore() {
  score++;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
  document.getElementById('scoreDisplay').innerText =
    `Score: ${score} | High Score: ${highScore}`;
}

// Game over
function gameOver() {
  cancelAnimationFrame(gameLoop);

  const gameOverDiv = document.createElement('div');
  gameOverDiv.innerHTML = `
    <h2>Game Over</h2>
    <p>Your score: ${score}</p>
    <button id="restartBtn">Restart</button>
  `;
  gameOverDiv.style.textAlign = 'center';
  document.body.appendChild(gameOverDiv);

  document.getElementById('restartBtn').addEventListener('click', () => {
    document.body.removeChild(gameOverDiv);
    resetGame();
  });
}

// Reset game
function resetGame() {
  score = 0;
  obstacles = [];
  obstacleSpeed = 5;
  player.y = canvas.height - player.height;
  startGame();
}

// Draw background
function drawBackground() {
  bgX -= 2;
  if (bgX <= -canvas.width) bgX = 0;
  ctx.drawImage(background, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(background, bgX + canvas.width, 0, canvas.width, canvas.height);
}

// Main game loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  updatePlayer();
  drawPlayer();

  updateObstacles();
  drawObstacles();

  checkCollision();
  updateScore();

  gameLoop = requestAnimationFrame(loop);
}

// Start game
function startGame() {
  setInterval(createObstacle, 2000); // spawn obstacle every 2s
  loop();
}

// Initialize
document.getElementById('scoreDisplay').innerText =
  `Score: ${score} | High Score: ${highScore}`;
startGame();
