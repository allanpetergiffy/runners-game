const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Runner properties
let runner = {
  x: 50,
  y: 300,
  width: 40,
  height: 40,
  dy: 0,
  gravity: 0.8,
  jumpPower: -12
};

let obstacles = [];
let score = 0;
let gameOver = false;

// Jump control
document.addEventListener("keydown", e => {
  if (e.code === "Space" && runner.y >= 300) {
    runner.dy = runner.jumpPower;
  }
});

// Spawn obstacles every 2 seconds
function spawnObstacle() {
  obstacles.push({ x: 800, y: 320, width: 40, height: 40 });
}
setInterval(spawnObstacle, 2000);

// Update game state
function update() {
  if (gameOver) return;

  // Runner physics
  runner.y += runner.dy;
  runner.dy += runner.gravity;
  if (runner.y > 300) runner.y = 300;

  // Move obstacles
  obstacles.forEach(o => o.x -= 5);

  // Collision detection
  obstacles.forEach(o => {
    if (
      runner.x < o.x + o.width &&
      runner.x + runner.width > o.x &&
      runner.y < o.y + o.height &&
      runner.y + runner.height > o.y
    ) {
      gameOver = true;
      alert("Game Over! Final Score: " + score);
      document.location.reload(); // restart game
    }
  });

  // Increase score
  score++;
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Runner
  ctx.fillStyle = "yellow";
  ctx.fillRect(runner.x, runner.y, runner.width, runner.height);

  // Obstacles
  ctx.fillStyle = "red";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));

  // Score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 650, 30);
}

// Game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
