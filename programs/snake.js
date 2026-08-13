// Zeb OS 3 Aero Snake App
import { getIcon } from '../icons.js';
import { BaseApp } from '../UIKit3/framework/index.js';
import { showSystemAlert } from '../os3.js';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const TICK_MS = 100;

export class SnakeApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);

        this.canvas = null;
        this.ctx = null;
        this.scoreEl = null;

        this.gridSize = GRID_SIZE;
        this.snake = [];
        this.food = { x: 0, y: 0 };
        this.dx = this.gridSize;
        this.dy = 0;
        this.score = 0;
        this.gameOver = false;
        this.tickInterval = null;

        this.keyHandler = (e) => this.handleKeyDown(e);
    }

    mount() {
        this.render(`
            <div class="snake-app">
                <style>
                    .snake-app {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        background: var(--bg-dark);
                        color: var(--text-main);
                        font-family: var(--main-font);
                        user-select: none;
                    }
                    .snake-header {
                        flex-shrink: 0;
                    }
                    .snake-header svg { width: 14px; height: 14px; }
                    .snake-canvas-wrap {
                        flex-grow: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                        padding: 12px;
                    }
                    .snake-canvas {
                        width: 100%;
                        height: 100%;
                        max-width: ${CANVAS_SIZE}px;
                        max-height: ${CANVAS_SIZE}px;
                        aspect-ratio: 1 / 1;
                        image-rendering: pixelated;
                        background: var(--bg-dark);
                        border: 1px solid var(--aero-border);
                        border-radius: 6px;
                        box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.6);
                    }
                    .snake-controls {
                        flex-shrink: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 4px;
                        padding: 6px 0 10px;
                    }
                    .snake-dir-row { display: flex; align-items: center; gap: 4px; }
                    .snake-dir-btn, .snake-new-btn {
                        width: 34px;
                        height: 34px;
                        padding: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .snake-dir-btn svg, .snake-new-btn svg { width: 17px; height: 17px; }
                </style>

                <div class="aero-status-bar snake-header">
                    <span class="aero-status-item">${getIcon('snake')} Aero Snake</span>
                    <span class="aero-status-item">Score: <span class="snake-score">0</span></span>
                </div>

                <div class="snake-canvas-wrap">
                    <canvas class="snake-canvas" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}"></canvas>
                </div>

                <div class="snake-controls">
                    <button class="aero-btn snake-dir-btn" data-dir="up" title="Up">${getIcon('arrowUp')}</button>
                    <div class="snake-dir-row">
                        <button class="aero-btn snake-dir-btn" data-dir="left" title="Left">${getIcon('arrowLeft')}</button>
                        <button class="aero-btn snake-new-btn" title="New Game">${getIcon('refresh')}</button>
                        <button class="aero-btn snake-dir-btn" data-dir="right" title="Right">${getIcon('arrowRight')}</button>
                    </div>
                    <button class="aero-btn snake-dir-btn" data-dir="down" title="Down">${getIcon('arrowDown')}</button>
                </div>

                <div class="aero-status-bar">
                    <span class="aero-status-item">Arrow keys or buttons to move</span>
                    <span class="aero-status-item">Esc: exit</span>
                </div>
            </div>
        `);

        this.canvas = this.body.querySelector('.snake-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = this.body.querySelector('.snake-score');

        this.listen(window, 'keydown', this.keyHandler);
        this.body.querySelectorAll('.snake-dir-btn').forEach(btn => {
            this.listen(btn, 'click', () => this.handleDirButton(btn.dataset.dir));
        });
        this.listen(this.body.querySelector('.snake-new-btn'), 'click', () => this.resetGame());

        this.resetGame();
        this.tickInterval = setInterval(() => this.tick(), TICK_MS);
    }

    resetGame() {
        this.gameOver = false;
        this.snake = [
            { x: 160, y: 200 },
            { x: 140, y: 200 },
            { x: 120, y: 200 }
        ];
        this.dx = this.gridSize;
        this.dy = 0;
        this.score = 0;
        this.scoreEl.textContent = this.score;
        this.spawnFood();
        this.draw();
    }

    spawnFood() {
        this.food.x = Math.floor(Math.random() * (this.canvas.width / this.gridSize)) * this.gridSize;
        this.food.y = Math.floor(Math.random() * (this.canvas.height / this.gridSize)) * this.gridSize;
    }

    handleDirButton(dir) {
        if (dir === 'up' && this.dy === 0) { this.dx = 0; this.dy = -this.gridSize; }
        if (dir === 'down' && this.dy === 0) { this.dx = 0; this.dy = this.gridSize; }
        if (dir === 'left' && this.dx === 0) { this.dx = -this.gridSize; this.dy = 0; }
        if (dir === 'right' && this.dx === 0) { this.dx = this.gridSize; this.dy = 0; }
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') { e.preventDefault(); this.close(); return; }
        if (e.key === 'ArrowUp' && this.dy === 0) { this.dx = 0; this.dy = -this.gridSize; }
        if (e.key === 'ArrowDown' && this.dy === 0) { this.dx = 0; this.dy = this.gridSize; }
        if (e.key === 'ArrowLeft' && this.dx === 0) { this.dx = -this.gridSize; this.dy = 0; }
        if (e.key === 'ArrowRight' && this.dx === 0) { this.dx = this.gridSize; this.dy = 0; }
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    }

    tick() {
        if (this.gameOver) return;

        // Calculate raw next segment projection vectors
        let nextX = this.snake[0].x + this.dx;
        let nextY = this.snake[0].y + this.dy;

        // Wrap-around physics: loop coordinates smoothly to the opposite boundary edge
        if (nextX < 0) nextX = this.canvas.width - this.gridSize;
        if (nextX >= this.canvas.width) nextX = 0;
        if (nextY < 0) nextY = this.canvas.height - this.gridSize;
        if (nextY >= this.canvas.height) nextY = 0;

        const head = { x: nextX, y: nextY };

        if (this.checkSelfCollision(head)) {
            this.gameOver = true;
            const finalScore = this.score;
            showSystemAlert('Aero Snake', `Game Over! Final score: ${finalScore}`, 'info').then(() => {
                this.resetGame();
            });
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreEl.textContent = this.score;
            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkSelfCollision(head) {
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    draw() {
        const w = this.canvas.width;
        const h = this.canvas.height;

        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, w, h);

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        for (let i = 0; i < w; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0); this.ctx.lineTo(i, h);
            this.ctx.moveTo(0, i); this.ctx.lineTo(w, i);
            this.ctx.stroke();
        }

        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(this.food.x + 2, this.food.y + 2, this.gridSize - 4, this.gridSize - 4);

        this.snake.forEach((segment, idx) => {
            this.ctx.fillStyle = idx === 0 ? '#60a5fa' : '#2563eb';
            this.ctx.fillRect(segment.x + 1, segment.y + 1, this.gridSize - 2, this.gridSize - 2);
        });
    }

    onCleanup() {
        clearInterval(this.tickInterval);
        this.tickInterval = null;
    }
}
