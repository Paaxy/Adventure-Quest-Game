// Set up the canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

let keys = {};
let touchControls = { left: false, right: false, jump: false };

// Player setup
const player = {
    x: 50,
    y: 350,
    width: 50,
    height: 50,
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    gravity: 0.8,
    jumpPower: -12,
    grounded: false
};

// Floor setup (as a simple ground)
const floor = {
    x: 0,
    y: canvas.height - 50,
    width: canvas.width,
    height: 50
};

// Event listeners for keyboard and mobile controls
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

// Mobile touch controls
document.getElementById('left').addEventListener('touchstart', () => touchControls.left = true);
document.getElementById('left').addEventListener('touchend', () => touchControls.left = false);

document.getElementById('right').addEventListener('touchstart', () => touchControls.right = true);
document.getElementById('right').addEventListener('touchend', () => touchControls.right = false);

document.getElementById('jump').addEventListener('touchstart', () => touchControls.jump = true);
document.getElementById('jump').addEventListener('touchend', () => touchControls.jump = false);

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    applyGravity();
    detectCollision();
    renderPlayer();
    renderFloor();
    requestAnimationFrame(gameLoop);
}

// Move player based on keyboard or touch controls
function movePlayer() {
    if (keys['ArrowLeft'] || keys['a'] || touchControls.left) {
        player.velocityX = -player.speed;
    } else if (keys['ArrowRight'] || keys['d'] || touchControls.right) {
        player.velocityX = player.speed;
    } else {
        player.velocityX = 0;
    }

    if (keys['ArrowUp'] || keys['w'] || touchControls.jump) {
        if (player.grounded) {
            player.velocityY = player.jumpPower;
            player.grounded = false;
        }
    }

    player.x += player.velocityX;
    player.y += player.velocityY;
}

// Apply gravity to the player
function applyGravity() {
    if (player.y + player.height < canvas.height - floor.height) {
        player.velocityY += player.gravity;
    } else {
        player.velocityY = 0;
        player.grounded = true;
    }
}

// Detect collision with the floor
function detectCollision() {
    if (player.y + player.height >= canvas.height - floor.height) {
        player.y = canvas.height - player.height - floor.height;
    }
}

// Render player character
function renderPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Render the floor
function renderFloor() {
    ctx.fillStyle = 'green';
    ctx.fillRect(floor.x, floor.y, floor.width, floor.height);
}

// Start the game loop
gameLoop();
