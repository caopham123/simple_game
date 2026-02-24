const board = document.getElementById("board");
const difficultySelect = document.getElementById("difficulty");
const startBtn = document.getElementById("start-btn");
const turnCount = document.getElementById("turn-count");
const messageDisplay = document.getElementById("message");

let size = 3; // default 3x3
let tiles = []; // Array to store grid
let emptyTile = { row: 0, col: 0 };
let turns = 0;
let isStart = false;

window.onload = () => {
  initGame();
};

difficultySelect.addEventListener("change", (e) => {
  size = parseInt(e.target.value);
  console.log(size);
  initGame();
});

startBtn.addEventListener("click", (e) => {
  shuffleTiles();
});

function initGame() {
  board.innerHTML = "";
  tiles = [];
  turns = 0;
  turnCount.innerText = turns;
  messageDisplay.innerText = "";
  isStart = false;

  board.style.setProperty("--size", size);
  for (let row = 0; row < size; row++) {
    let rows = [];
    for (let col = 0; col < size; col++) {
      // 1. Create each new tile
      let tile = document.createElement("div");
      tile.classList.add("tile");
      tile.id = `${row}-${col}`;

      // 2. Set bachground position for each
      let xPos = (col / (size - 1)) * 100;
      let yPos = (row / (size - 1)) * 100;
      tile.style.backgroundPosition = `${xPos}% ${yPos}%`;

      // Remove the top-right tile
      if (row === 0 && col === size - 1) {
        tile.classList.add("empty");
        emptyTile = { row: `${row}`, col: `${col}` };
      }

      tile.addEventListener("click", () => moveTile(row, col));

      board.appendChild(tile);
      rows.push(tile);
    }
    // Store whole tiles in JS Array
    tiles.push(rows);
  }
}

function shuffleTiles() {}

function moveTile(r, c) {
  // Stop moving after win
  if (!isStart && turns > 0) return;

  // Check adjacency
  let isAdjacent =
    (Math.abs(emptyTile.row - r) === 1 && Math.abs(emptyTile.col === c)) ||
    (Math.abs(emptyTile.row === r) && Math.abs(emptyTile.col - c) === 1);

  if (isAdjacent) {
    swapTiles(row, col, emptyTile.row, emptyTile.col);
    emptyTile = {row: r, col: c};

    if (isStart){
      turns++;
      turnCount.innerText = turns;
      checkWin();
    }
  }
}

function swapTiles(r1, c1, r2, c2){
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

function checkWin(){
  
}