const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const runnerImg = new Image();
runnerImg.src = "assets/runner.png";

const obstacleImg = new Image();
obstacleImg.src = "assets/obstacle.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

// Runner properties
let runner = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,
  dy: 0,
  gravity: 0.8,
  jumpPower: -12
};

let obstacles = [];
let score = 0;
let gameOver = false;
let bgX = 0;

// Jump control
document.addEventListener("keydown", e => {
  if (e.code === "Space" && runner.y >= 300) {
    runner.dy = runner.jumpPower;
  }
});

// Spawn obstacles
function spawnObstacle() {
  obstacles.push({ x: 800, y: 320, width: 50, height: 50 });
}
setInterval(spawnObstacle, 2000);

// Update game
function update() {
  if (gameOver) return;

  runner.y += runner.dy;
  runner.dy += runner.gravity;
  if (runner.y > 300) runner.y = 300;

  obstacles.forEach(o => o.x -= 5);

  obstacles.forEach(o => {
    if (
      runner.x < o.x + o.width &&
      runner.x + runner.width > o.x &&
      runner.y < o.y + o.height &&
      runner.y + runner.height > o.y
    ) {
      gameOver = true;
      alert("Game Over! Final Score: " + score);
      document.location.reload();
    }
  });

  score++;
  bgX -= 2;
  if (bgX <= -canvas.width) bgX = 0;
}

// Draw game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);

  ctx.drawImage(runnerImg, runner.x, runner.y, runner.width, runner.height);
  obstacles.forEach(o => ctx.drawImage(obstacleImg, o.x, o.y, o.width, o.height));

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
