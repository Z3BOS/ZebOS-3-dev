// Zeb OS 3 Aero Minesweeper App
import { getIcon } from '../icons.js';
import { BaseApp } from '../UIKit3/framework/index.js';

const ROWS = 9;
const COLS = 9;
const TOTAL_MINES = 10;

// Classic per-count number colors, re-tuned so every value stays readable
// against UIKit3's dark slate cell background (the ZebOS2 originals used
// navy/black which vanish on dark glass).
const NUMBER_COLORS = ['', '#60a5fa', '#4ade80', '#f87171', '#a78bfa', '#fb923c', '#22d3ee', '#f8fafc', '#94a3b8'];

export class MinesApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);

        this.rows = ROWS;
        this.cols = COLS;
        this.totalMines = TOTAL_MINES;

        this.grid = [];
        this.mineLocations = new Set();
        this.revealedCount = 0;
        this.flagsLeft = this.totalMines;
        this.gameStarted = false;
        this.gameOver = false;
        this.timerSeconds = 0;
        this.timerInterval = null;

        this.faceEl = null;
        this.mineCounterEl = null;
        this.timerCounterEl = null;
        this.gridEl = null;

        this.boundKeyDown = (e) => this.handleKeyDown(e);
    }

    mount() {
        this.render(`
            <div class="mines-app">
                <style>
                    .mines-app {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        background: var(--bg-dark);
                        color: var(--text-main);
                        font-family: var(--main-font);
                        user-select: none;
                    }
                    .mines-toolbar {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 10px;
                        padding: 10px 14px;
                        background: rgba(30, 41, 59, 0.6);
                        border-bottom: 1px solid var(--aero-border);
                        flex-shrink: 0;
                    }
                    .mines-readout {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        min-width: 66px;
                        justify-content: center;
                        background: rgba(2, 6, 23, 0.85);
                        border: 1px solid var(--aero-border);
                        border-radius: 6px;
                        padding: 5px 10px;
                        font-family: var(--code-font);
                        font-size: 16px;
                        font-weight: 700;
                        color: var(--accent-cyan);
                        box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.6);
                    }
                    .mines-readout svg { width: 15px; height: 15px; flex-shrink: 0; }
                    .mines-face-btn { width: 38px; height: 38px; padding: 0; display: flex; align-items: center; justify-content: center; }
                    .mines-face-btn svg { width: 22px; height: 22px; }
                    .mines-grid-wrap {
                        flex-grow: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 14px;
                        overflow: auto;
                    }
                    .mines-grid {
                        display: grid;
                        grid-template-columns: repeat(${this.cols}, 28px);
                        grid-template-rows: repeat(${this.rows}, 28px);
                        gap: 2px;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid var(--aero-border);
                        border-radius: 6px;
                        padding: 6px;
                    }
                    .mines-cell {
                        width: 28px;
                        height: 28px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: 700;
                        font-size: 13px;
                        background: rgba(148, 163, 184, 0.16);
                        border: 1px solid rgba(255, 255, 255, 0.12);
                        border-radius: 3px;
                        cursor: pointer;
                        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15);
                    }
                    .mines-cell svg { width: 16px; height: 16px; }
                    .mines-cell.unrevealed:hover { background: rgba(96, 165, 250, 0.25); }
                    .mines-cell.revealed { background: rgba(2, 6, 23, 0.55); box-shadow: none; cursor: default; }
                    .mines-cell.mine-hit { background: #dc2626 !important; }
                    .mines-footer {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 10px;
                        flex-shrink: 0;
                    }
                    .mines-new-btn { padding: 3px 10px; font-size: 11px; display: flex; align-items: center; gap: 5px; }
                    .mines-new-btn svg { width: 13px; height: 13px; }
                </style>

                <div class="mines-toolbar">
                    <div class="mines-readout mines-counter">
                        ${getIcon('flag')}<span class="mines-counter-val">010</span>
                    </div>
                    <button class="aero-btn mines-face-btn" title="New Game">${getIcon('smileyNormal')}</button>
                    <div class="mines-readout mines-timer">
                        ${getIcon('timer')}<span class="mines-timer-val">000</span>
                    </div>
                </div>

                <div class="mines-grid-wrap">
                    <div class="mines-grid"></div>
                </div>

                <div class="aero-status-bar mines-footer">
                    <span class="aero-status-item">Left click: reveal | Right click: flag</span>
                    <button class="aero-btn mines-new-btn">${getIcon('refresh')} New Game</button>
                </div>
            </div>
        `);

        this.faceEl = this.body.querySelector('.mines-face-btn');
        this.mineCounterEl = this.body.querySelector('.mines-counter-val');
        this.timerCounterEl = this.body.querySelector('.mines-timer-val');
        this.gridEl = this.body.querySelector('.mines-grid');

        this.listen(this.faceEl, 'click', () => this.resetGame());
        this.listen(this.body.querySelector('.mines-new-btn'), 'click', () => this.resetGame());
        this.listen(window, 'keydown', this.boundKeyDown);

        this.resetGame();
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.timerSeconds = 0;
        this.gameStarted = false;
        this.gameOver = false;
        this.revealedCount = 0;
        this.flagsLeft = this.totalMines;

        this.timerCounterEl.textContent = '000';
        this.mineCounterEl.textContent = this.totalMines.toString().padStart(3, '0');
        this.faceEl.innerHTML = getIcon('smileyNormal');

        this.gridEl.innerHTML = '';
        this.grid = [];
        this.mineLocations.clear();

        for (let r = 0; r < this.rows; r++) {
            const rowArr = [];
            for (let c = 0; c < this.cols; c++) {
                const cellEl = document.createElement('div');
                cellEl.className = 'mines-cell unrevealed';

                // Plain addEventListener (not this.listen): cells are torn down and
                // rebuilt on every "New Game", so tracking them in BaseApp's cleanup
                // list would pile up references to detached elements over repeated
                // resets. They're garbage-collected naturally when gridEl is cleared.
                cellEl.addEventListener('click', () => this.handleCellClick(r, c));
                cellEl.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleCellRightClick(r, c);
                });

                this.gridEl.appendChild(cellEl);
                rowArr.push({
                    r, c,
                    element: cellEl,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0
                });
            }
            this.grid.push(rowArr);
        }
    }

    startFirstMove(firstR, firstC) {
        this.gameStarted = true;

        while (this.mineLocations.size < this.totalMines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            if (r === firstR && c === firstC) continue;
            const key = `${r},${c}`;
            if (!this.mineLocations.has(key)) {
                this.mineLocations.add(key);
                this.grid[r][c].isMine = true;
            }
        }

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c].isMine) continue;
                let count = 0;
                this.forEachNeighbor(r, c, (nr, nc) => {
                    if (this.grid[nr][nc].isMine) count++;
                });
                this.grid[r][c].neighborMines = count;
            }
        }

        this.timerInterval = setInterval(() => {
            if (this.timerSeconds < 999) {
                this.timerSeconds++;
                this.timerCounterEl.textContent = this.timerSeconds.toString().padStart(3, '0');
            }
        }, 1000);
    }

    forEachNeighbor(r, c, callback) {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                    callback(nr, nc);
                }
            }
        }
    }

    handleCellClick(r, c) {
        if (this.gameOver) return;
        const cell = this.grid[r][c];
        if (cell.isRevealed || cell.isFlagged) return;

        if (!this.gameStarted) {
            this.startFirstMove(r, c);
        }

        if (cell.isMine) {
            this.triggerLoss(cell);
            return;
        }

        this.revealCell(r, c);

        if (this.revealedCount === (this.rows * this.cols - this.totalMines)) {
            this.triggerWin();
        }
    }

    revealCell(r, c) {
        const cell = this.grid[r][c];
        if (cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;
        this.revealedCount++;
        cell.element.classList.remove('unrevealed');
        cell.element.classList.add('revealed');

        if (cell.neighborMines > 0) {
            cell.element.style.color = NUMBER_COLORS[cell.neighborMines];
            cell.element.textContent = cell.neighborMines;
        } else {
            this.forEachNeighbor(r, c, (nr, nc) => {
                if (!this.grid[nr][nc].isRevealed) {
                    this.revealCell(nr, nc);
                }
            });
        }
    }

    handleCellRightClick(r, c) {
        if (this.gameOver) return;
        const cell = this.grid[r][c];
        if (cell.isRevealed) return;

        if (!cell.isFlagged) {
            if (this.flagsLeft > 0) {
                cell.isFlagged = true;
                cell.element.innerHTML = getIcon('flag');
                this.flagsLeft--;
            }
        } else {
            cell.isFlagged = false;
            cell.element.innerHTML = '';
            this.flagsLeft++;
        }
        this.mineCounterEl.textContent = Math.max(0, this.flagsLeft).toString().padStart(3, '0');
    }

    triggerLoss(hitCell) {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        this.faceEl.innerHTML = getIcon('smileyDead');

        hitCell.element.classList.add('mine-hit');
        hitCell.element.innerHTML = getIcon('mines');

        this.mineLocations.forEach(key => {
            const [r, c] = key.split(',').map(Number);
            const cell = this.grid[r][c];
            if (!cell.isFlagged) {
                cell.element.innerHTML = getIcon('mines');
            }
        });
    }

    triggerWin() {
        this.gameOver = true;
        clearInterval(this.timerInterval);
        this.faceEl.innerHTML = getIcon('smileyCool');
        this.mineCounterEl.textContent = '000';

        this.mineLocations.forEach(key => {
            const [r, c] = key.split(',').map(Number);
            const cell = this.grid[r][c];
            if (!cell.isFlagged) {
                cell.isFlagged = true;
                cell.element.innerHTML = getIcon('flag');
            }
        });
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
        }
    }

    onCleanup() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }
}
