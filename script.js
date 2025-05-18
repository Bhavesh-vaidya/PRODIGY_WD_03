const boardEl = document.getElementById('board');
    const messageEl = document.getElementById('message');
    const restartBtn = document.getElementById('restart');
    const modeSelect = document.getElementById('modeSelect');
    const playerSelect = document.getElementById('playerSelect');

    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let humanPlayer = 'X';
    let aiPlayer = 'O';
    let gameOver = false;
    let mode = modeSelect.value;

    modeSelect.addEventListener('change', () => {
      mode = modeSelect.value;
      restartGame();
    });

    playerSelect.addEventListener('change', () => {
      humanPlayer = playerSelect.value;
      aiPlayer = humanPlayer === 'X' ? 'O' : 'X';
      restartGame();
    });

    function renderBoard() {
      boardEl.innerHTML = '';
      board.forEach((cell, idx) => {
        const cellEl = document.createElement('div');
        cellEl.className = 'cell';
        cellEl.dataset.index = idx;
        cellEl.textContent = cell || '';
        if (!cell && !gameOver) {
          cellEl.addEventListener('click', handleClick);
        } else {
          cellEl.classList.add('disabled');
        }
        boardEl.appendChild(cellEl);
      });
    }

    function handleClick(e) {
      const index = e.target.dataset.index;
      if (board[index] || gameOver) return;

      if (mode === 'ai' && currentPlayer !== humanPlayer) return;

      board[index] = currentPlayer;
      renderBoard();
      if (checkWin(currentPlayer)) {
        messageEl.textContent = `${currentPlayer} wins!`;
        gameOver = true;
        return;
      } else if (board.every(cell => cell)) {
        messageEl.textContent = "It's a draw!";
        gameOver = true;
        return;
      }

      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

      if (mode === 'ai' && currentPlayer === aiPlayer && !gameOver) {
        setTimeout(() => {
          const bestMove = getBestMove(board, aiPlayer);
          board[bestMove] = aiPlayer;
          renderBoard();
          if (checkWin(aiPlayer)) {
            messageEl.textContent = `${aiPlayer} wins!`;
            gameOver = true;
          } else if (board.every(cell => cell)) {
            messageEl.textContent = "It's a draw!";
            gameOver = true;
          } else {
            currentPlayer = humanPlayer;
          }
        }, 300);
      }
    }

    function checkWin(player) {
      const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
      ];
      return winPatterns.some(pattern =>
        pattern.every(idx => board[idx] === player)
      );
    }

    function getBestMove(board, player) {
      function minimax(newBoard, isMaximizing) {
        if (checkWin(aiPlayer)) return { score: 1 };
        if (checkWin(humanPlayer)) return { score: -1 };
        if (newBoard.every(cell => cell)) return { score: 0 };

        let best = isMaximizing ? { score: -Infinity } : { score: Infinity };
        newBoard.forEach((cell, index) => {
          if (!cell) {
            newBoard[index] = isMaximizing ? aiPlayer : humanPlayer;
            const result = minimax(newBoard, !isMaximizing);
            newBoard[index] = null;
            result.index = index;

            if (isMaximizing && result.score > best.score) {
              best = result;
            } else if (!isMaximizing && result.score < best.score) {
              best = result;
            }
          }
        });
        return best;
      }
      return minimax([...board], true).index;
    }

    function restartGame() {
      board = Array(9).fill(null);
      humanPlayer = playerSelect.value;
      aiPlayer = humanPlayer === 'X' ? 'O' : 'X';
      currentPlayer = 'X';
      gameOver = false;
      messageEl.textContent = '';
      renderBoard();
      if (mode === 'ai' && currentPlayer === aiPlayer) {
        setTimeout(() => {
          const bestMove = getBestMove(board, aiPlayer);
          board[bestMove] = aiPlayer;
          renderBoard();
          currentPlayer = humanPlayer;
        }, 300);
      }
    }

    restartBtn.addEventListener('click', restartGame);
    renderBoard();