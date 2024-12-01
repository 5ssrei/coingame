const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');

// 載入圖片資源
const images = {
    character: new Image(),
    fishBall: new Image(),
    tofu: new Image(),
    crabStick: new Image(),
    bomb: new Image()
};
images.character.src = './assets/character.png';
images.fishBall.src = './assets/fish_ball.png';
images.tofu.src = './assets/tofu.png';
images.crabStick.src = './assets/crab_stick.png';
images.bomb.src = './assets/bomb.png';

let gameInterval, dropInterval;
let player = { x: 375, y: 350, width: 50, height: 50 };
let items = [];
let score = 0;
let timeLeft = 30;

const itemTypes = [
    { name: 'fishBall', score: 5, image: images.fishBall },
    { name: 'tofu', score: 4, image: images.tofu },
    { name: 'crabStick', score: 3, image: images.crabStick },
    { name: 'bomb', score: -4, image: images.bomb }
];

function startGame() {
    resetGame();
    gameInterval = setInterval(updateGame, 16); // ~60fps
    dropInterval = setInterval(spawnItem, 1000);
}

function resetGame() {
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    items = [];
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = score;
    timerElement.textContent = timeLeft;
    startButton.disabled = true;
    setTimeout(() => startButton.disabled = false, 3000);
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    updateItems();
    drawItems();
    checkCollisions();
    if (timeLeft <= 0) endGame();
}

function drawPlayer() {
    ctx.drawImage(images.character, player.x, player.y, player.width, player.height);
}

function spawnItem() {
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const x = Math.random() * (canvas.width - 20);
    items.push({ x, y: 0, width: 40, height: 40, ...itemType });
}

function updateItems() {
    items.forEach(item => item.y += 5);
    items = items.filter(item => item.y < canvas.height);
}

function drawItems() {
    items.forEach(item => {
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
    });
}

function checkCollisions() {
    items.forEach((item, index) => {
        if (
            item.y + item.height >= player.y &&
            item.x < player.x + player.width &&
            item.x + item.width > player.x
        ) {
            score += item.score;
            scoreElement.textContent = score;
            items.splice(index, 1);
        }
    });
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(dropInterval);
    alert(score >= 50 ? 'You win! Claim your hotpot set!' : 'Try again!');
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') player.x = Math.max(0, player.x - 20);
    if (e.key === 'ArrowRight') player.x = Math.min(canvas.width - player.width, player.x + 20);
});

startButton.addEventListener('click', startGame);

setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
        timerElement.textContent = timeLeft;
    }
}, 1000);
