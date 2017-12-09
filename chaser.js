const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < sprite1.radius + sprite2.radius;
}

class Sprite {
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

class Player extends Sprite {
  constructor(x, y, radius, speed) {
    super();
    this.image = new Image();
    this.image.src = "http://moziru.com/images/pies-clipart-cheese-pizza-12.png";
    Object.assign(this, { x, y, radius, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 25, 25);
  }
}

let player = new Player(500, 500, 5, 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, speed) {
    super();
    this.image = new Image();
    this.image.src = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/2.2.5/2/svg/1f924.svg";
    Object.assign(this, { x, y, radius, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 50, 50);
  }
}

let enemies;

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function drawStartScreen() {
  ctx.fillStyle = "brown";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "linen";
  ctx.font = "30px Brush Script MT";
  ctx.textAlign = "center";
  ctx.fillText("Avoid the hungry Customers!", canvas.width / 2, canvas.height / 2);
  canvas.addEventListener("click", startGame);

}

function drawDeathScreen() {
  ctx.fillStyle = "linen";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "brown";
  ctx.font = "30px Brush Script MT";
  ctx.textAlign = "center";
  ctx.fillText("You were gobbled up! Click to try again.", canvas.width / 2, canvas.height / 2);
  canvas.addEventListener("click", startGame);
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const L = Math.hypot(dx, dy);
  let distToMove = c1.radius + c2.radius - L;
  if (distToMove > 0) {
    dx /= L;
    dy /= L;
    c1.x -= dx * distToMove / 2;
    c1.y -= dy * distToMove / 2;
    c2.x += dx * distToMove / 2;
    c2.y += dy * distToMove / 2;
  }
}

function startGame() {
  canvas.removeEventListener("click", startGame);
    progressBar.value = 100;
    Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
    enemies = [
  new Enemy(80, 200, 25, 0.02),
  new Enemy(200, 250, 25, 0.01),
  new Enemy(150, 180, 25, 0.002),
  new Enemy(0, 200, 25, 0.008),
  new Enemy(400, 400, 25, 0.008),
];
    requestAnimationFrame(drawScene);
}

function updateScene() {
  moveToward(mouse, player, player.speed);
  enemies.forEach(enemy => moveToward(player, enemy, enemy.speed));
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i+1; j < enemies.length; j++) {
      pushOff(enemies[i], enemies[j]);
    }
  }
  enemies.forEach(enemy => {
    if (haveCollided(enemy, player)) {
      progressBar.value -= 2;
    }
  });
}

function clearBackground() {
  ctx.fillStyle = "lightbrown";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
  if (progressBar.value <= 0) {
    drawDeathScreen();
  } else {
    requestAnimationFrame(drawScene);
  }
}

drawStartScreen();
