const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 180, y: 500, width: 40, height: 40, color: "red" };
let obstacles = [];
let score = 0;

// Draw player
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw obstacles
function drawObstacles() {
  ctx.fillStyle = "black";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));
}

// Update obstacles
function updateObstacles() {
  obstacles.forEach(o => o.y += 5);
  obstacles = obstacles.filter(o => o.y < canvas.height);

  if (Math.random() < 0.03) {
    obstacles.push({ x: Math.random() * 360, y: -20, width: 40, height: 40 });
  }
}

// Collision detection
function checkCollision() {
  for (let o of obstacles) {
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      alert("Game Over! Final Score: " + score);
      document.location.reload();
    }
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
  updateObstacles();
  checkCollision();
  score++;
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 10, 20);
  requestAnimationFrame(gameLoop);
}

gameLoop();

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
  if (e.key === "ArrowRight" && player.x < canvas.width - player.width) player.x += 20;
});
