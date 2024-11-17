const board = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let playerXMoves = [];
let playerOMoves = [];
let isGameOver = false;
let selectedMark = null;
let moveInProgress = false;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Handle placing a mark
const handleCellClick = (index) => {
  if (gameState[index] || isGameOver || moveInProgress) return;

  if ((currentPlayer === 'X' && playerXMoves.length < 3) || (currentPlayer === 'O' && playerOMoves.length < 3)) {
    gameState[index] = currentPlayer;
    board[index].textContent = currentPlayer;

    if (currentPlayer === 'X') {
      playerXMoves.push(index);
    } else {
      playerOMoves.push(index);
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `${currentPlayer}'s turn`;

    if (playerXMoves.length === 3 && playerOMoves.length === 3) {
      enableMoveMarks();
    } else {
      checkForWinnerAfterDelay(); // Check for winner after placing the mark
    }
  }
};

// Enable moving marks
const enableMoveMarks = () => {
  statusDisplay.textContent = `${currentPlayer}, you can move your marks!`;
  board.forEach((cell, index) => {
    if (gameState[index] === currentPlayer) {
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', () => selectMarkToMove(index), { once: true });
    } else {
      cell.style.cursor = 'default';
    }
  });
};

// Select or deselect a mark to move
const selectMarkToMove = (index) => {
  if (selectedMark === index) {
    deselectMark(); // If the same mark is selected again, deselect it
  } else {
    if (selectedMark !== null) {
      deselectMark(); // Deselect the previous mark if any
    }
    selectedMark = index;
    moveInProgress = true;
    statusDisplay.textContent = `Selected ${currentPlayer} at index ${index + 1}. `;
    highlightEmptyCells();
  }
};

// Deselect the current mark
const deselectMark = () => {
  selectedMark = null;
  moveInProgress = false;
  statusDisplay.textContent = `${currentPlayer}, select a mark to move!`;
  resetHighlights();
};

// Highlight empty cells for potential moves
const highlightEmptyCells = () => {
  board.forEach((cell, i) => {
    if (gameState[i] === null) {
      cell.style.backgroundColor = 'lightgreen';
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', handleMove, { once: true });
    }
  });
};

// Reset highlights
const resetHighlights = () => {
  board.forEach(cell => {
    cell.style.backgroundColor = '';
    cell.style.cursor = 'default';
    cell.removeEventListener('click', handleMove);
  });
};

// Handle the movement of a mark
const handleMove = (event) => {
  const targetIndex = Array.from(board).indexOf(event.target);

  if (gameState[targetIndex] !== null || selectedMark === null) return;

  // Update the game state
  gameState[targetIndex] = currentPlayer;
  gameState[selectedMark] = null;

  board[selectedMark].textContent = '';
  board[targetIndex].textContent = currentPlayer;

  // Update the player's moves
  const playerMoves = currentPlayer === 'X' ? playerXMoves : playerOMoves;
  const markIndex = playerMoves.indexOf(selectedMark);
  playerMoves[markIndex] = targetIndex;

  moveInProgress = false;
  selectedMark = null;
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `${currentPlayer}'s turn`;

  // Reset highlights
  resetHighlights();

  checkForWinnerAfterDelay(); // Check for winner after completing the move
  enableMoveMarks();
};

// Check for a winner after a delay to ensure UI updates
const checkForWinnerAfterDelay = () => {
  setTimeout(() => {
    if (checkWinner()) {
      isGameOver = true;
      alert(`${currentPlayer === 'X' ? 'O' : 'X'} wins!`);
      restartGame();
    }
  }, 100);
};

// Check for a winner
const checkWinner = () => {
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c];
  });
};

// Restart the game
const restartGame = () => {
  gameState.fill(null);
  playerXMoves = [];
  playerOMoves = [];
  currentPlayer = 'X';
  isGameOver = false;
  moveInProgress = false;
  selectedMark = null;
  statusDisplay.textContent = "X's turn";
  board.forEach(cell => {
    cell.textContent = '';
    cell.style.backgroundColor = '';
    cell.style.cursor = 'default';
    cell.removeEventListener('click', handleMove);
  });
};

// Add event listeners to each cell
board.forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});

// Restart the game when the restart button is clicked
restartBtn.addEventListener('click', restartGame);
