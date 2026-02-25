const board = document.getElementById("board");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("start-btn");
const turnCount = document.getElementById("turn-count");
const messageDisplay = document.getElementById("message");

let size = 3; // default 3x3
let tiles = []; // Array to store grid
let emptyTile = { row: 0, col: size - 1 };
let turns = 0;
let isStartGame = false;

window.onload = () => {
  initGame();
};

// Select size (n x n) of the board
difficultySelect.addEventListener("change", (e) => {
  size = parseInt(e.target.value);
  initGame();
});

// On click to shuffle tile
startBtn.addEventListener("click", (e) => {
  shuffleTiles();
  initGame();
});

function initGame() {
  board.innerHTML = ""; // Clear the whole inner html tags
  tiles = []; // Array JS to store individual tiles
  turns = 0; // Increase after tile moves
  turnCount.innerText = turns; // Var to display the number of turns on FE
  messageDisplay.innerText = ""; // Var to display message on FE
  isStartGame = true; // Game is not start

  board.style.setProperty("--size", size);
  for (let row = 0; row < size; row++) {
    let rows = [];
    for (let col = 0; col < size; col++) {
      // 1. Create each new tile
      let tile = document.createElement("div");
      tile.classList.add("tile");
      tile.id = `${row}-${col}`;

      // 2. Set bachground position for each
      // Exp: tiles[0][1] = 50% 0%, tiles[2][1] = 100% 50%
      let xPos = (col / (size - 1)) * 100;
      let yPos = (row / (size - 1)) * 100;
      tile.style.backgroundPosition = `${xPos}% ${yPos}%`;

      // Remove the top-right tile
      if (row === 0 && col === size - 1) {
        tile.classList.add("empty");
        emptyTile = { row: row, col: col };
      }
      tile.addEventListener("click", () => {moveTile(row, col)});

      board.appendChild(tile);
      rows.push(tile);
    }
    // Store whole tiles in JS Array
    tiles.push(rows);
  }
}


function shuffleTiles() {
  isStartGame = false; // Game is not start
  turns = 0;
  turnCount.innerText = turns;
  messageDisplay.innerText = "Shuffling...";
  startBtn.innerText = "Làm mới";

  let moves = 0;
  let maxMoves = size * 20;

  let interval = setInterval(function () {
    let neighbors = [];
    let r = emptyTile.row;
    let c = emptyTile.col;

    // Move tile up, down, left, right
    if (r > 0) neighbors.push({ r: r-1, c: c }); // Up
    if (r < size - 1) neighbors.push({ r: r+1, c: c }); // Down
    if (c < size - 1) neighbors.push({ r: r, c: c+1 }); // Right
    if (c > 0) neighbors.push({ r: r, c: c-1 });  // Left

    console.log(`print neighbors: ${neighbors}`);

    // Pick a random neighbor
    let randomNeighbor =
      neighbors[Math.floor(Math.random() * neighbors.length)];

    // Swap
    swapTiles(randomNeighbor.r, randomNeighbor.c, emptyTile.row, emptyTile.col);
    emptyTile = { row: randomNeighbor.r, col: randomNeighbor.c };

    moves++;
    if (moves >= maxMoves) {
      clearInterval(interval);
      isGameActive = true;
      messageDisplay.innerText = "Đã xào thẻ xong! Bắt đầu chơi...";
      setTimeout(()=>{
        messageDisplay.innerText = "";
      }, 3000);
    }
  }, 10);
}

function moveTile(r, c) {
  // Stop moving after win
  if (!isStartGame && turns > 0) return;

  // Check adjacency
  let isAdjacent =
    (Math.abs(emptyTile.row - r) === 1 && Math.abs(emptyTile.col === c)) ||
    (Math.abs(emptyTile.row === r) && Math.abs(emptyTile.col - c) === 1);

  if (isAdjacent) {
    swapTiles(r, c, emptyTile.row, emptyTile.col);
    emptyTile = { row: r, col: c };

    if (isStartGame) {
    turns++;
    turnCount.innerText = turns;
    checkWin();
    }
  }
}

function swapTiles(r1, c1, r2, c2) {
  let currTile = tiles[r1][c1];
  let destTile = tiles[r2][c2];

  // 1. Store currTile to temp
  let tempClass = currTile.className;
  let tempStyle = currTile.style.backgroundPosition;
  let tempId = currTile.id;

  // 2. Assign destTile to currTile
  currTile.className = destTile.className;
  currTile.style.backgroundPosition = destTile.style.backgroundPosition;
  currTile.id = destTile.id;

  // 3. Assign temp to destTile
  destTile.className = tempClass;
  destTile.style.backgroundPosition = tempStyle;
  destTile.id = tempId;
}

function checkWin() {
  let correctCount = 0;
  let totalTiles = size * size;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // The current tile at grid position [r][c]
      let tile = tiles[r][c];
      // The ID we assigned at init was "r-c" (original position)
      if (tile.id === `${r}-${c}`) {
        correctCount++;
      }
    }
  }

  if (correctCount === totalTiles) {
    messageDisplay.innerText = `Bạn thắng cuộc trong ${turns} lượt!`;
    isGameActive = false;
    // Reveal the missing piece
    let empty = document.querySelector(".empty");
    empty.classList.remove("empty");
  }
}
