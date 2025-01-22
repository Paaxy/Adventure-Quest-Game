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

// Floor setup (for collision)
const floor = {
    y: canvas.height - 50,
    height: 50
};

// Endless world setup
const world = {
    offsetX: 0, // Horizontal offset for the world (camera movement)
    scrollSpeed: 2, // How fast the world scrolls
    width: 2000 // The size of the world (more than the canvas width)
};

// Camera setup
const camera = {
    x: 0, // Camera's position (initially at the start of the world)
    width: canvas.width, // Camera's viewport width (the canvas width)
    height: canvas.height // Camera's height (the canvas height)
};

// Quest system setup with multiple quests
const quests = [
    {
        name: 'Reach the destination!',
        description: 'Go to the far right of the screen.',
        targetX: 1500, // Target position to reach
        progress: 0,
        completed: false,
        reward: 'You’ve reached the goal!',
        type: 'location'
    },
    {
        name: 'Jump over the obstacle!',
        description: 'Jump over the green block in the middle of the screen.',
        targetX: 2000, // position to jump over
        targetY: 350, // position of the obstacle
        progress: 0,
        completed: false,
        reward: 'You jumped successfully!',
        type: 'jump'
    }
];

let currentQuestIndex = 0;
let activeQuest = quests[currentQuestIndex];

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
    renderWorld();
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

// Check quest progress
function checkQuestProgress() {
    if (!activeQuest.completed) {
        if (activeQuest.type === 'location' && player.x >= activeQuest.targetX) {
            activeQuest.progress = 100;
            activeQuest.completed = true;
            alert(activeQuest.reward);
            currentQuestIndex++;
            if (currentQuestIndex < quests.length) {
                activeQuest = quests[currentQuestIndex];
            }
        } else if (activeQuest.type === 'jump' && player.x >= activeQuest.targetX && player.y < activeQuest.targetY) {
            activeQuest.progress = 100;
            activeQuest.completed = true;
            alert(activeQuest.reward);
            currentQuestIndex++;
            if (currentQuestIndex < quests.length) {
                activeQuest = quests[currentQuestIndex];
            }
        } else {
            activeQuest.progress = Math.floor((player.x / activeQuest.targetX) * 100);
        }
    }
}

// Render the endless world (background, scrolling)
function renderWorld() {
    // Move the world horizontally to create an endless scroll
    world.offsetX -= world.scrollSpeed;
    if (world.offsetX <= -world.width) {
        world.offsetX = 0;
    }

    // Camera follows the player (keep player in the center)
    camera.x = player.x - camera.width / 2;

    // Draw the world (background)
    ctx.fillStyle = '#87ceeb'; // Light blue sky color
    ctx.fillRect(camera.x, 0, world.width, canvas.height);
}

// Render player character
function renderPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x - camera.x, player.y, player.width, player.height);
}

// Render the floor
function renderFloor() {
    ctx.fillStyle = 'green';
    ctx.fillRect(0 - camera.x, floor.y, world.width, floor.height);
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
