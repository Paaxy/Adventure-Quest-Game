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

// Quest system setup
const quests = [
    {
        name: 'Reach the destination!',
        description: 'Go to the far right of the screen.',
        targetX: canvas.width - 100, // target position
        progress: 0,
        completed: false,
        reward: 'You’ve reached the goal!'
    }
];

let activeQuest = quests[0]; // Start with the first quest

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
    checkQuestProgress();
    renderPlayer();
    renderFloor();
    renderQuest();
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

// Quest progress tracking
function checkQuestProgress() {
    if (!activeQuest.completed) {
        // Check if the player has reached the target X position for this quest
        if (player.x >= activeQuest.targetX) {
            activeQuest.progress = 100;
            activeQuest.completed = true;
            alert(activeQuest.reward);
        } else {
            activeQuest.progress = Math.floor((player.x / activeQuest.targetX) * 100);
        }
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

// Render quest info
function renderQuest() {
    const questText = document.getElementById('questText');
    const questProgress = document.getElementById('questProgress');
    
    questText.textContent = `Quest: ${activeQuest.name}`;
    questProgress.textContent = `Progress: ${activeQuest.progress}%`;
}

// Start the game loop
gameLoop();
