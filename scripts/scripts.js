const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let isAnimating = true;
let balls = [];
let ballCount = 25;
let demonCircle = {
    x: 0,
    y: 0,
    radius: 50 // 恶魔圈的半径
};
let isDemonCircleStationary = false; // 用于跟踪恶魔圈是否静止

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeBalls();
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
    return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function() {
    if ((this.x + this.size) >= canvas.width || (this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= canvas.height || (this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
};

Ball.prototype.checkCollision = function(otherBall) {
    const dx = this.x - otherBall.x;
    const dy = this.y - otherBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.size + otherBall.size) {
        this.color = randomColor();
        otherBall.color = randomColor();
    }
};

function initializeBalls() {
    balls = [];
    for (let i = 0; i < ballCount; i++) {
        let size = random(10, 20);
        let ball = new Ball(
            random(0 + size, canvas.width - size),
            random(0 + size, canvas.height - size),
            random(-7, 7),
            random(-7, 7),
            randomColor(),
            size
        );
        balls.push(ball);
    }
}

function drawDemonCircle() {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.setLineDash([5, 5]); // 虚线效果
    ctx.arc(demonCircle.x, demonCircle.y, demonCircle.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]); // 重置为实线
}

function checkDemonCollision() {
    for (let i = balls.length - 1; i >= 0; i--) {
        const dx = balls[i].x - demonCircle.x;
        const dy = balls[i].y - demonCircle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < balls[i].size + demonCircle.radius) {
            balls.splice(i, 1); // 移除被恶魔圈抓到的球
        }
    }
}

function loop() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();

        for (let j = i + 1; j < balls.length; j++) {
            balls[i].checkCollision(balls[j]);
        }
    }

    drawDemonCircle(); // 绘制恶魔圈
    checkDemonCollision(); // 检测碰撞

    if (isAnimating) {
        requestAnimationFrame(loop);
    }
}

    // 处理鼠标移动事件来更新恶魔圈的位置
    canvas.addEventListener('mousemove', (event) => {
        if (!isDemonCircleStationary) {
            demonCircle.x = event.clientX;
            demonCircle.y = event.clientY;
        }
    });

    // 处理双击事件来切换恶魔圈的静止状态
    canvas.addEventListener('dblclick', () => {
        isDemonCircleStationary = !isDemonCircleStationary;
    });

    document.getElementById('ball-count').addEventListener('input', function() {
    ballCount = parseInt(this.value, 10);
    initializeBalls();
});
    document.getElementById('toggle-button').addEventListener('click', function() {
    isAnimating = !isAnimating;
    this.textContent = isAnimating ? '停止动画' : '开始动画';
    if (isAnimating) {
        loop();
    }
});

    // 初始化画布和小球
    resizeCanvas();
    loop();

