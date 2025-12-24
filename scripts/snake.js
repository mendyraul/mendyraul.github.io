const canvas = document.getElementById("snakeCanvas");
const scoreEl = document.getElementById("snakeScore");
const startBtn = document.getElementById("snakeStart");
const autoBtn = document.getElementById("snakeAuto");
const stopBtn = document.getElementById("snakeStop");
const restartBtn = document.getElementById("snakeRestart");
const statusEl = document.getElementById("snakeStatus");

if (canvas && scoreEl && startBtn && autoBtn && stopBtn && restartBtn && statusEl) {
  const ctx = canvas.getContext("2d");
  const gridSize = 20;
  let cellSize = 16;
  let intervalId = null;
  let hasStarted = false;
  let autoMode = false;
  let score = 0;
  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };
  let snake = [];
  let food = null;
  let touchStart = null;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cellSize = rect.width / gridSize;
  }

  function resetGame() {
    score = 0;
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    snake = [{ x: 8, y: 10 }];
    food = null;
    updateScore();
    setStatus("Press Start to play.");
  }

  function updateScore() {
    scoreEl.textContent = String(score);
  }

  function setStatus(message) {
    statusEl.textContent = message;
  }

  function spawnFood() {
    let candidate;
    do {
      candidate = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    } while (snake.some((segment) => segment.x === candidate.x && segment.y === candidate.y));
    food = candidate;
  }

  function getNextOnCycle(head) {
    if (head.y % 2 === 0) {
      if (head.x < gridSize - 1) {
        return { x: head.x + 1, y: head.y };
      }
      return { x: head.x, y: (head.y + 1) % gridSize };
    }
    if (head.x > 0) {
      return { x: head.x - 1, y: head.y };
    }
    return { x: head.x, y: (head.y + 1) % gridSize };
  }

  function maybeAutoSteer() {
    if (!autoMode) return;
    const head = snake[0];
    const next = getNextOnCycle(head);
    const dx = next.x - head.x;
    const dy = next.y - head.y;
    if (dx === 1 || dx === -(gridSize - 1)) setDirection({ x: 1, y: 0 });
    else if (dx === -1 || dx === gridSize - 1) setDirection({ x: -1, y: 0 });
    else if (dy === 1 || dy === -(gridSize - 1)) setDirection({ x: 0, y: 1 });
    else if (dy === -1 || dy === gridSize - 1) setDirection({ x: 0, y: -1 });
  }

  function setDirection(next) {
    if (direction.x + next.x === 0 && direction.y + next.y === 0) return;
    nextDirection = next;
  }

  function step() {
    maybeAutoSteer();
    direction = nextDirection;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0) head.x = gridSize - 1;
    if (head.x >= gridSize) head.x = 0;
    if (head.y < 0) head.y = gridSize - 1;
    if (head.y >= gridSize) head.y = 0;
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      stopGame();
      return;
    }

    snake.unshift(head);
    if (food && head.x === food.x && head.y === food.y) {
      score += 1;
      updateScore();
      spawnFood();
    } else {
      snake.pop();
    }

    if (snake.length === gridSize * gridSize) {
      stopGame();
      setStatus(autoMode ? "AI wins." : "Congratulations, you win!");
      return;
    }

    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#11261a";
    ctx.fillRect(0, 0, gridSize * cellSize, gridSize * cellSize);

    ctx.fillStyle = "#6fe36f";
    snake.forEach((segment, index) => {
      const inset = index === 0 ? 1.5 : 1;
      ctx.fillRect(
        segment.x * cellSize + inset,
        segment.y * cellSize + inset,
        cellSize - inset * 2,
        cellSize - inset * 2
      );
    });

    if (food) {
      ctx.fillStyle = "#ff6b6b";
      ctx.beginPath();
      ctx.arc(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize * 0.35,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  function startGame() {
    if (intervalId) return;
    hasStarted = true;
    if (!food) {
      spawnFood();
      draw();
    }
    setStatus(autoMode ? "AI is playing..." : "Good luck!");
    intervalId = window.setInterval(step, 120);
  }

  function stopGame() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
    setStatus("Paused.");
  }

  function restartGame() {
    stopGame();
    autoMode = false;
    resetGame();
    draw();
    if (hasStarted) {
      startGame();
    }
  }

  function handleKey(event) {
    if (autoMode) return;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        setDirection({ x: 0, y: -1 });
        break;
      case "ArrowDown":
        event.preventDefault();
        setDirection({ x: 0, y: 1 });
        break;
      case "ArrowLeft":
        event.preventDefault();
        setDirection({ x: -1, y: 0 });
        break;
      case "ArrowRight":
        event.preventDefault();
        setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  }

  function handleTouchStart(event) {
    if (autoMode) return;
    const touch = event.touches[0];
    if (!touch) return;
    touchStart = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event) {
    if (autoMode) return;
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    touchStart = null;

    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection({ x: dx > 0 ? 1 : -1, y: 0 });
    } else {
      setDirection({ x: 0, y: dy > 0 ? 1 : -1 });
    }
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    draw();
  });

  document.addEventListener("keydown", handleKey);
  canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
  canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
  startBtn.addEventListener("click", startGame);
  autoBtn.addEventListener("click", () => {
    autoMode = true;
    setStatus("AI is playing...");
    startGame();
  });
  stopBtn.addEventListener("click", stopGame);
  restartBtn.addEventListener("click", restartGame);

  resizeCanvas();
  resetGame();
  draw();
}
