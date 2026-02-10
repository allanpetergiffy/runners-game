const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: 50, y: canvas.height - 100, width: 50, height: 50, dy: 0, jumping: false };
let obstacles = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

document.getElementById("highScore").textContent = highScore;

function drawPlayer() {
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));
}

function updateObstacles() {
  obstacles.forEach(o => o.x -= 5);
  obstacles = obstacles.filter(o => o.x + o.width > 0);

  if (Math.random() < 0.02) {
    obstacles.push({ x: canvas.width, y: canvas.height - 50, width: 50, height: 50 });
  }
}

function checkCollision() {
  return obstacles.some(o =>
    player.x < o.x + o.width &&
    player.x + player.width > o.x &&
    player.y < o.y + o.height &&
    player.y + player.height > o.y
  );
}

function jump() {
  if (!player.jumping) {
    player.dy = -15;
    player.jumping = true;
  }
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});

document.addEventListener("touchstart", jump);

function updatePlayer() {
  player.y += player.dy;
  player.dy += 1; // gravity
  if (player.y >= canvas.height - 100) {
    player.y = canvas.height - 100;
    player.dy = 0;
    player.jumping = false;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawObstacles();
  updatePlayer();
  updateObstacles();

  if (checkCollision()) {
    if (score > highScore) {
      localStorage.setItem("highScore", score);
    }
    alert("Game Over! Your score: " + score);
    document.location.reload();
  }

  score++;
  document.getElementById("score").textContent = score;

  requestAnimationFrame(gameLoop);
}

gameLoop();
