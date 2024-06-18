const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
context.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = createMatrix(COLS, ROWS);
let player;
let dropCounter = 0;
let dropInterval = 500;
let lastTime = 0;
let gameOver = false;
let score = 0;

// Create a matrix of given width and height filled with zeros
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

// Check if the player's matrix collides with the board or the walls
function collide(board, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && 
                (board[y + o.y] && 
                board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Merge the player's matrix into the board
function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// Draw the given matrix on the canvas at the specified offset
function drawMatrix(matrix, offset, color) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = color;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// Clear the canvas and draw the board and player
function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(board, {x: 0, y: 0}, 'gray');
    drawMatrix(player.matrix, player.pos, player.color);
}

// Reset the player position and create a new random piece
function playerReset() {
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.pos.y = 0;
    player.pos.x = (COLS / 2 | 0) - (player.matrix[0].length / 2 | 0);
    player.color = randomColor();

    if (collide(board, player)) {
        board.forEach(row => row.fill(0));
        gameOver = true;
    }
}

// Create a new piece based on the specified type
function createPiece(type) {
    if (type === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [1, 1],
            [1, 1],
        ];
    } else if (type === 'L') {
        return [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0],
        ];
    } else if (type === 'J') {
        return [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    } else if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ];
    }
}

// Rotate the player's matrix 90 degrees
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

// Drop the player piece by one row and check for collision
function playerDrop() {
    player.pos.y++;
    if (collide(board, player)) {
        player.pos.y--;
        merge(board, player);
        checkLineClear();
        updateScore();
        playerReset();
    }
    dropCounter = 0;
}

// Check and clear completed lines, update score
function checkLineClear() {
    outer: for (let y = board.length - 1; y >= 0; --y) {
        for (let x = 0; x < board[y].length; ++x) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;
        score += 10;
        if (score % 100 === 0) {
            dropInterval = Math.max(dropInterval - 100, 100); // Decrease drop interval but not below 100ms
        }
    }
}

// Update the score display
function updateScore() {
    scoreDisplay.innerText = 'Score: ' + score;
}

// Update the game state (called every frame)
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }
    draw();
    if (!gameOver) {
        requestAnimationFrame(update);
    } else {
        alert('Game Over! Your score: ' + score);
    }
}

// Reset the game state and start the game loop
function resetGame() {
    board = createMatrix(COLS, ROWS);
    player = {
        pos: {x: 0, y: 0},
        matrix: null,
        color: '',
    };
    score = 0;
    updateScore();
    playerReset();
    gameOver = false;
    dropInterval = 500; // Reset drop interval
    update();
}

// Generate a random color for the piece
function randomColor() {
    const colors = ['green', 'blue', 'yellow', 'red'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Event listener for keyboard input to move or rotate the player piece
document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        player.pos.x--;
        if (collide(board, player)) {
            player.pos.x++;
        }
    } else if (event.key === 'ArrowRight') {
        player.pos.x++;
        if (collide(board, player)) {
            player.pos.x--;
        }
    } else if (event.key === 'ArrowDown') {
        playerDrop();
    } else if (event.key === 'ArrowUp') {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, 1);
        while (collide(board, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -1);
                player.pos.x = pos;
                return;
            }
        }
    }
    draw();
});

// Event listener for the start button to reset and start the game
startButton.addEventListener('click', () => {
    resetGame();
});

// Initial game setup
resetGame();
