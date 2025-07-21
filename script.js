const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function drawBoard() {
    boardEl.innerHTML = '';
    board.forEach((cell, idx) => {
        const div = document.createElement('div');
        div.className = 'cell';
        div.textContent = cell;
        div.addEventListener('click', () => handleClick(idx));
        boardEl.appendChild(div);
    });
}

function handleClick(i) {
    if (board[i] || gameOver) return;

    board[i] = 'X';
    clickSound.play();
    drawBoard();
    document.querySelectorAll('.cell')[i].classList.add('clicked');

    if (checkWin('X')) return endGame('You Win!');
    if (boardFull()) return endGame('It\'s a Draw!');

    statusEl.textContent = 'AI is thinking...';

    setTimeout(aiMove, 500);
}

function aiMove() {
    if (gameOver) return;

    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    board[move] = 'O';
    clickSound.play();
    drawBoard();
    document.querySelectorAll('.cell')[move].classList.add('clicked');

    if (checkWin('O')) return endGame('AI Wins!');
    if (boardFull()) return endGame('It\'s a Draw!');

    statusEl.textContent = 'Your Turn';
}

function minimax(newBoard, depth, isMaximizing) {
    if (checkWin('O', newBoard)) return 10 - depth;
    if (checkWin('X', newBoard)) return depth - 10;
    if (boardFull(newBoard)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (!newBoard[i]) {
                newBoard[i] = 'O';
                let score = minimax(newBoard, depth + 1, false);
                newBoard[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < newBoard.length; i++) {
            if (!newBoard[i]) {
                newBoard[i] = 'X';
                let score = minimax(newBoard, depth + 1, true);
                newBoard[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(player, tempBoard = board) {
    return winPatterns.some(pattern =>
        pattern.every(index => tempBoard[index] === player)
    );
}

function boardFull(tempBoard = board) {
    return tempBoard.every(cell => cell);
}

function endGame(msg) {
    statusEl.textContent = msg;
    gameOver = true;

    if (msg.includes('Win')) {
        winSound.play();
        highlightWinningCells();
    } else if (msg.includes('Draw')) {
        drawSound.play();
    }
}

function highlightWinningCells() {
    for (let pattern of winPatterns) {
        if (pattern.every(index => board[index] === 'X') || pattern.every(index => board[index] === 'O')) {
            pattern.forEach(index => document.querySelectorAll('.cell')[index].classList.add('win'));
            return;
        }
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    statusEl.textContent = 'Your Turn';
    drawBoard();
}

resetBtn.addEventListener('click', resetGame);

drawBoard();
statusEl.textContent = 'Your Turn';
