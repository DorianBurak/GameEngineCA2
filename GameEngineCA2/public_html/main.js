var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
var paddle = { x: 350, y: 580, w: 100, h: 10, s: 8 };
var ball = { x: 400, y: 300, r: 10, dx: 4, dy: -4, speed: 4 };
var blocks = [];
var points = 0;
var keys = {};
window.addEventListener('keydown', function(e) { keys[e.key] = true; });
window.addEventListener('keyup', function(e) { keys[e.key] = false; });

function drawPaddle() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();
}

function drawBlocks() {
  ctx.fillStyle = 'green';
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
}

function movePaddle() {
  if (keys['ArrowLeft'] && paddle.x > 0) paddle.x -= paddle.s;
  if (keys['ArrowRight'] && paddle.x + paddle.w < canvas.width) paddle.x += paddle.s;
}

function addBlock() {
  var block = {
    x: Math.random() * (canvas.width - 50),
    y: Math.random() * (canvas.height - 300),
    w: 50,
    h: 20
  };
  blocks.push(block);
}

function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  if (ball.x + ball.r > canvas.width || ball.x - ball.r < 0) {
    ball.dx = -ball.dx;
    points++;
    ball.speed += 0.1;
  }
  if (ball.y - ball.r < 0) {
    ball.dy = -ball.dy;
    points++;
    ball.speed += 0.1;
  }
  if (
    ball.y + ball.r > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.w
  ) {
    ball.dy = -ball.dy;
    ball.dx += (Math.random() - 0.5) * 2;
  }

  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    if (
      ball.x + ball.r > b.x &&
      ball.x - ball.r < b.x + b.w &&
      ball.y + ball.r > b.y &&
      ball.y - ball.r < b.y + b.h
    ) {
      ball.dy = -ball.dy;
      ball.dx += (Math.random() - 0.5) * 2;
    }
  }

  if (ball.y + ball.r > canvas.height) {
    alert('Game Over! Points: ' + points);
  }

  ball.dx = Math.sign(ball.dx) * ball.speed;
  ball.dy = Math.sign(ball.dy) * ball.speed;

  if (points > 0 && points % 10 === 0 && blocks.length < points / 10) {
    addBlock();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle();
  drawBall();
  drawBlocks();

  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText('Points: ' + points, 10, 20);
}

function loop() {
  movePaddle();
  updateBall();
  draw();
  requestAnimationFrame(loop);
}
loop();