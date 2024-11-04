const board = document.getElementById('board');
const cells = document.querySelectorAll('[data-cell]');
const status = document.getElementById('status');
const restartButton = document.getElementById('restartButton');
const twoPlayerButton = document.getElementById('twoPlayerButton');
const vsComputerButton = document.getElementById('vsComputerButton');

const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const X_IMAGE = 'https://th.bing.com/th?id=OIP.F9_DNan44nfcXSL5q-_jxQHaHi&w=247&h=252&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2';
const O_IMAGE = 'https://th.bing.com/th/id/OIP.uPjtDeJZq1YUJkLN1bIrAwHaE8?w=300&h=200&c=7&r=0&o=5&pid=1.7';

let currentPlayer = X_CLASS;
let isVsComputer = false;
let gameActive = true;

startGame();

restartButton.addEventListener('click', startGame);
twoPlayerButton.addEventListener('click', () => setGameMode(false));
vsComputerButton.addEventListener('click', () => setGameMode(true));

function setGameMode(vsComputer) {
    isVsComputer = vsComputer;
    twoPlayerButton.classList.toggle('active', !vsComputer);
    vsComputerButton.classList.toggle('active', vsComputer);
    startGame();
}

function startGame() {
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.innerHTML = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    currentPlayer = X_CLASS;
    gameActive = true;
    status.textContent = `${currentPlayer.toUpperCase()}'s turn`;
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    board.classList.add(currentPlayer);
}

function handleClick(e) {
    const cell = e.target;
    if (!gameActive || cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)) {
        return;
    }
    placeMark(cell, currentPlayer);
    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (isVsComputer && currentPlayer === O_CLASS) {
            setTimeout(computerMove, 500);
        }
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    const img = document.createElement('img');
    img.src = currentClass === X_CLASS ? X_IMAGE : O_IMAGE;
    img.alt = currentClass.toUpperCase();
    cell.appendChild(img);
}

function swapTurns() {
    currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
    status.textContent = `${currentPlayer.toUpperCase()}'s turn`;
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    board.classList.add(currentPlayer);
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cells[index].classList.contains(currentClass);
        });
    });
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function endGame(draw) {
    gameActive = false;
    if (draw) {
        status.textContent = "It's a draw!";
    } else {
        status.textContent = `${currentPlayer.toUpperCase()} wins!`;
    }
}

function computerMove() {
    if (!gameActive) return;
    
    let availableCells = [...cells].filter(cell => 
        !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS)
    );
    
    if (availableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cell = availableCells[randomIndex];
        placeMark(cell, O_CLASS);
        if (checkWin(O_CLASS)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
        }
    }
}