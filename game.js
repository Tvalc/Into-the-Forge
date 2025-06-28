const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const size = 4; // 4x4 grid
const tileSize = canvas.width / size;
let board = [];
let emptyTile = { x: size - 1, y: size - 1 };
let moveCount = 0;

function createSolvedBoard() {
  let arr = [];
  let n = 1;
  for (let y = 0; y < size; y++) {
    arr[y] = [];
    for (let x = 0; x < size; x++) {
      arr[y][x] = n;
      n++;
    }
  }
  arr[size - 1][size - 1] = 0;
  return arr;
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const val = board[y][x];
      if (val !== 0) {
        ctx.fillStyle = '#4682b4';
        ctx.fillRect(x * tileSize + 2, y * tileSize + 2, tileSize - 4, tileSize - 4);
        ctx.fillStyle = '#fff';
        ctx.fillText(val, x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
      }
    }
  }
}

function shuffle(times = 1000) {
  for (let i = 0; i < times; i++) {
    let moves = getValidMoves();
    let move = moves[Math.floor(Math.random() * moves.length)];
    moveTile(move.x, move.y);
    moveCount = 0;
  }
}

function getValidMoves() {
  let moves = [];
  const { x, y } = emptyTile;
  if (x > 0) moves.push({ x: x - 1, y });
  if (x < size - 1) moves.push({ x: x + 1, y });
  if (y > 0) moves.push({ x, y: y - 1 });
  if (y < size - 1) moves.push({ x, y: y + 1 });
  return moves;
}

function moveTile(x, y) {
  const { x: ex, y: ey } = emptyTile;
  if ((Math.abs(ex - x) === 1 && ey === y) || (Math.abs(ey - y) === 1 && ex === x)) {
    board[ey][ex] = board[y][x];
    board[y][x] = 0;
    emptyTile.x = x;
    emptyTile.y = y;
    return true;
  }
  return false;
}

function handleClick(e) {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  
  const x = Math.floor(mx / tileSize);
  const y = Math.floor(my / tileSize);
  
  if (moveTile(x, y)) {
    moveCount++;
    updateMoveCount();
    drawBoard();
    if (isSolved()) setTimeout(() => alert('Puzzle Solved in ' + moveCount + ' moves!'), 100);
  }
}

function isSolved() {
  let n = 1;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (y === size -1 && x === size -1) return board[y][x] === 0;
      if (board[y][x] !== n) return false;
      n++;
    }
  }
}

function updateMoveCount() {
  document.getElementById('moveCount').textContent = `Moves: ${moveCount}`;
}

function resetGame() {
  board = createSolvedBoard();
  emptyTile = { x: size -1, y: size -1 };
  moveCount = 0;
  shuffle(500);
  updateMoveCount();
  drawBoard();
}

canvas.addEventListener('click', handleClick);

// Initialize
resetGame();