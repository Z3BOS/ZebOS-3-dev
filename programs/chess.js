// Zeb OS 3 Chess App - UI layer over the cherry/ rules engine (UIKit3 Aero Glass)
import { createInitialState, squareName } from '../cherry/board.js';
import { getLegalMovesForSquare, getGameStatus, makeMove } from '../cherry/rules.js';
import { getBestMove } from '../cherry/engine.js';
import { getIcon } from '../icons.js';
import { BaseApp } from '../UIKit3/framework/index.js';

const PIECE_GLYPH = {
    wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
    bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

const PROMO_ORDER = ['Q', 'R', 'B', 'N'];
const POINT_VALUE = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };

export class ChessApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);

        this.state = createInitialState();
        this.selected = null;
        this.legalTargets = [];
        this.vsComputer = true;
        this.aiThinking = false;
        this.aiTimeoutId = null;
        this.pendingPromotion = null;

        this.lastMove = null;
        this.moveHistory = [];
        this.capturedByWhite = [];
        this.capturedByBlack = [];
        this.forcedResult = null;

        this.boundKeyDown = (e) => this.handleKeyDown(e);
    }

    mount() {
        this.listen(window, 'keydown', this.boundKeyDown);
        this.renderUI();
    }

    onCleanup() {
        if (this.aiTimeoutId) {
            clearTimeout(this.aiTimeoutId);
            this.aiTimeoutId = null;
        }
    }

    // ==========================================================================
    // RENDER
    // ==========================================================================
    renderUI() {
        if (!this.body) return;

        const status = getGameStatus(this.state);
        const isGameOver = !!this.forcedResult || status === 'checkmate' || status === 'stalemate';
        const inCheck = status === 'check' || status === 'checkmate';
        const kingSquare = this.findKingSquare(this.state.turn);

        this.render(`
            <div class="chess-app-root">
                <div class="chess-toolbar">
                    <button class="aero-btn aero-btn-primary chess-new-game-btn">${getIcon('refresh')} New Game</button>
                    <button class="aero-btn aero-btn-danger chess-resign-btn" ${isGameOver ? 'disabled' : ''}>${getIcon('flag')} Resign</button>
                    <label class="chess-toggle-label">
                        <input type="checkbox" class="aero-checkbox chess-vs-computer-toggle" ${this.vsComputer ? 'checked' : ''}>
                        <span>vs Computer</span>
                    </label>
                    <div style="flex-grow:1;"></div>
                    <span class="aero-badge ${this.statusBadgeClass(status)}">${this.buildStatusText(status)}</span>
                </div>
                <div class="chess-main">
                    <div class="chess-board-wrap">
                        <div class="chess-board-frame">
                            <div style="display:flex;">
                                <div class="chess-coord-ranks">${this.renderRankLabels()}</div>
                                <div class="chess-board">${this.renderSquares(inCheck, kingSquare)}</div>
                            </div>
                            <div class="chess-coord-files">${this.renderFileLabels()}</div>
                        </div>
                        ${this.pendingPromotion ? this.renderPromotionOverlay() : ''}
                        ${isGameOver ? this.renderGameOverBanner(status) : ''}
                    </div>
                    <div class="chess-sidebar">
                        <div class="chess-panel">
                            <div class="chess-panel-title">Captured by White</div>
                            <div class="chess-captured-row">
                                ${this.capturedByWhite.length ? this.capturedByWhite.map(p => `<span class="chess-piece black-piece chess-mini-piece">${PIECE_GLYPH[p]}</span>`).join('') : `<span class="chess-empty-note">None</span>`}
                            </div>
                        </div>
                        <div class="chess-panel">
                            <div class="chess-panel-title">Captured by Black</div>
                            <div class="chess-captured-row">
                                ${this.capturedByBlack.length ? this.capturedByBlack.map(p => `<span class="chess-piece white-piece chess-mini-piece">${PIECE_GLYPH[p]}</span>`).join('') : `<span class="chess-empty-note">None</span>`}
                            </div>
                        </div>
                        <div class="chess-material-diff">${this.buildMaterialDiffText()}</div>
                        <div class="chess-panel chess-history-panel">
                            <div class="chess-panel-title">Move History</div>
                            <div class="chess-history-list">
                                ${this.moveHistory.length ? this.renderHistory() : `<div class="chess-empty-note chess-empty-note-block">No moves played</div>`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.bindEvents();

        const historyList = this.body.querySelector('.chess-history-list');
        if (historyList) historyList.scrollTop = historyList.scrollHeight;
    }

    statusBadgeClass(status) {
        if (this.forcedResult?.type === 'resign' || status === 'checkmate') return 'aero-badge-danger';
        if (status === 'stalemate') return 'aero-badge-warning';
        if (status === 'check') return 'aero-badge-warning';
        return 'aero-badge-info';
    }

    buildStatusText(status) {
        if (this.forcedResult?.type === 'resign') {
            const winner = this.forcedResult.loser === 'w' ? 'Black' : 'White';
            return `${winner} wins — resignation`;
        }
        if (status === 'checkmate') {
            const winner = this.state.turn === 'w' ? 'Black' : 'White';
            return `Checkmate — ${winner} wins!`;
        }
        if (status === 'stalemate') return 'Stalemate — Draw';
        if (this.aiThinking) return 'Computer is thinking…';
        const toMove = this.state.turn === 'w' ? 'White' : 'Black';
        return status === 'check' ? `${toMove} to move — Check!` : `${toMove} to move`;
    }

    buildMaterialDiffText() {
        const whiteGain = this.capturedByWhite.reduce((sum, p) => sum + POINT_VALUE[p[1]], 0);
        const blackGain = this.capturedByBlack.reduce((sum, p) => sum + POINT_VALUE[p[1]], 0);
        const diff = whiteGain - blackGain;
        if (diff === 0) return '';
        return diff > 0 ? `White +${diff}` : `Black +${-diff}`;
    }

    renderRankLabels() {
        let html = '';
        for (let r = 7; r >= 0; r--) html += `<span>${r + 1}</span>`;
        return html;
    }

    renderFileLabels() {
        let html = '';
        for (let f = 0; f < 8; f++) html += `<span>${String.fromCharCode(97 + f)}</span>`;
        return html;
    }

    renderSquares(inCheck, kingSquare) {
        let html = '';
        for (let displayRow = 0; displayRow < 8; displayRow++) {
            const r = 7 - displayRow;
            for (let f = 0; f < 8; f++) {
                const isLight = (r + f) % 2 === 1;
                const piece = this.state.board[r][f];
                const isSelected = this.selected && this.selected.r === r && this.selected.f === f;
                const target = this.legalTargets.find(t => t.to.r === r && t.to.f === f);
                const isCheckSquare = inCheck && kingSquare && kingSquare.r === r && kingSquare.f === f;
                const isLastFrom = this.lastMove && this.lastMove.from.r === r && this.lastMove.from.f === f;
                const isLastTo = this.lastMove && this.lastMove.to.r === r && this.lastMove.to.f === f;

                const classes = ['chess-square', isLight ? 'light' : 'dark'];
                if (isSelected) classes.push('selected');
                if (isCheckSquare) classes.push('in-check');
                if (isLastFrom) classes.push('last-move-from');
                if (isLastTo) classes.push('last-move-to');
                if (target) classes.push((piece || target.isEnPassant) ? 'legal-capture' : 'legal-target');

                let glyphHtml = '';
                if (piece) {
                    const colorClass = piece[0] === 'w' ? 'white-piece' : 'black-piece';
                    glyphHtml = `<span class="chess-piece ${colorClass}">${PIECE_GLYPH[piece]}</span>`;
                }

                html += `<div class="${classes.join(' ')}" data-r="${r}" data-f="${f}">${glyphHtml}</div>`;
            }
        }
        return html;
    }

    renderPromotionOverlay() {
        const color = this.state.turn;
        const buttons = PROMO_ORDER.map(type => `
            <button class="chess-promo-btn ${color === 'w' ? 'white-piece' : 'black-piece'}" data-promo="${type}">${PIECE_GLYPH[color + type]}</button>
        `).join('');
        return `
            <div class="chess-promo-overlay">
                <div class="chess-promo-panel">${buttons}</div>
            </div>
        `;
    }

    renderGameOverBanner(status) {
        return `
            <div class="chess-gameover-banner">
                <div class="chess-gameover-panel">${this.buildStatusText(status)}</div>
            </div>
        `;
    }

    renderHistory() {
        let html = '';
        for (let i = 0; i < this.moveHistory.length; i += 2) {
            const moveNum = i / 2 + 1;
            const whiteMove = this.moveHistory[i] || '';
            const blackMove = this.moveHistory[i + 1] || '';
            html += `
                <div class="chess-history-row">
                    <span class="move-num">${moveNum}.</span>
                    <span class="move-white">${whiteMove}</span>
                    <span class="move-black">${blackMove}</span>
                </div>
            `;
        }
        return html;
    }

    findKingSquare(color) {
        for (let r = 0; r < 8; r++) {
            for (let f = 0; f < 8; f++) {
                if (this.state.board[r][f] === color + 'K') return { r, f };
            }
        }
        return null;
    }

    buildNotation(preState, move, isCheck, isCheckmate) {
        if (move.isCastle === 'K') return 'O-O' + (isCheckmate ? '#' : isCheck ? '+' : '');
        if (move.isCastle === 'Q') return 'O-O-O' + (isCheckmate ? '#' : isCheck ? '+' : '');

        const pieceLetter = move.piece[1] === 'P' ? '' : move.piece[1];
        const capture = !!preState.board[move.to.r][move.to.f] || move.isEnPassant;
        let notation = pieceLetter;
        if (move.piece[1] === 'P' && capture) notation += squareName(move.from.r, move.from.f)[0];
        if (capture) notation += 'x';
        notation += squareName(move.to.r, move.to.f);
        if (move.isPromotion) notation += '=' + move.promotion;
        if (isCheckmate) notation += '#';
        else if (isCheck) notation += '+';
        return notation;
    }

    recordCapture(piece) {
        if (piece[0] === 'w') this.capturedByBlack.push(piece);
        else this.capturedByWhite.push(piece);
    }

    // ==========================================================================
    // EVENTS
    // ==========================================================================
    bindEvents() {
        this.body.querySelector('.chess-new-game-btn')?.addEventListener('click', () => this.newGame());
        this.body.querySelector('.chess-resign-btn')?.addEventListener('click', () => this.resign());

        const vsComputerToggle = this.body.querySelector('.chess-vs-computer-toggle');
        if (vsComputerToggle) {
            vsComputerToggle.addEventListener('change', (e) => this.setVsComputer(e.target.checked));
        }

        if (this.pendingPromotion) {
            const overlay = this.body.querySelector('.chess-promo-overlay');
            if (overlay) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) this.cancelPromotion();
                });
            }
            this.body.querySelectorAll('.chess-promo-btn').forEach(btn => {
                btn.addEventListener('click', () => this.choosePromotion(btn.dataset.promo));
            });
            return;
        }

        if (this.aiThinking || this.forcedResult) return;

        this.body.querySelectorAll('.chess-square').forEach(sq => {
            sq.addEventListener('click', () => {
                this.handleSquareClick(parseInt(sq.dataset.r, 10), parseInt(sq.dataset.f, 10));
            });
        });
    }

    handleSquareClick(r, f) {
        if (this.aiThinking || this.pendingPromotion || this.forcedResult) return;

        if (this.selected && this.selected.r === r && this.selected.f === f) {
            this.selected = null;
            this.legalTargets = [];
            this.renderUI();
            return;
        }

        const piece = this.state.board[r][f];

        if (this.selected) {
            const target = this.legalTargets.find(t => t.to.r === r && t.to.f === f);
            if (target) {
                if (target.isPromotion) {
                    this.pendingPromotion = { from: this.selected, to: { r, f } };
                    this.selected = null;
                    this.legalTargets = [];
                    this.renderUI();
                    return;
                }
                this.commitMove(this.selected, { r, f }, null);
                return;
            }
        }

        if (piece && piece[0] === this.state.turn) {
            this.selected = { r, f };
            this.legalTargets = getLegalMovesForSquare(this.state, r, f);
        } else {
            this.selected = null;
            this.legalTargets = [];
        }
        this.renderUI();
    }

    cancelPromotion() {
        if (!this.pendingPromotion) return;
        const { from } = this.pendingPromotion;
        this.pendingPromotion = null;
        this.selected = from;
        this.legalTargets = getLegalMovesForSquare(this.state, from.r, from.f);
        this.renderUI();
    }

    choosePromotion(pieceType) {
        const { from, to } = this.pendingPromotion;
        this.pendingPromotion = null;
        this.commitMove(from, to, pieceType);
    }

    commitMove(from, to, promotion) {
        const preState = this.state;
        const result = makeMove(this.state, from, to, promotion);
        if (!result) return;

        const { state: nextState, move } = result;
        const capturedPiece = preState.board[to.r][to.f] || (move.isEnPassant ? preState.board[from.r][to.f] : null);
        if (capturedPiece) this.recordCapture(capturedPiece);

        this.state = nextState;
        this.lastMove = { from, to };

        const status = getGameStatus(this.state);
        this.moveHistory.push(this.buildNotation(preState, move, status === 'check', status === 'checkmate'));

        this.selected = null;
        this.legalTargets = [];
        this.renderUI();
        this.maybeTriggerAI();
    }

    maybeTriggerAI() {
        const status = getGameStatus(this.state);
        if (this.forcedResult || status === 'checkmate' || status === 'stalemate') return;
        if (!this.vsComputer || this.state.turn !== 'b') return;

        this.aiThinking = true;
        this.renderUI();

        this.aiTimeoutId = setTimeout(() => {
            this.aiTimeoutId = null;
            const preState = this.state;
            const move = getBestMove(this.state, { maxDepth: 6, timeLimitMs: 800 });
            this.aiThinking = false;
            if (move) {
                const result = makeMove(this.state, move.from, move.to, move.promotion);
                if (result) {
                    const capturedPiece = preState.board[move.to.r][move.to.f] || (move.isEnPassant ? preState.board[move.from.r][move.to.f] : null);
                    if (capturedPiece) this.recordCapture(capturedPiece);
                    this.state = result.state;
                    this.lastMove = { from: move.from, to: move.to };
                    const status2 = getGameStatus(this.state);
                    this.moveHistory.push(this.buildNotation(preState, result.move, status2 === 'check', status2 === 'checkmate'));
                }
            }
            this.renderUI();
        }, 500);
    }

    setVsComputer(enabled) {
        this.vsComputer = enabled;
        if (!enabled && this.aiTimeoutId) {
            clearTimeout(this.aiTimeoutId);
            this.aiTimeoutId = null;
            this.aiThinking = false;
        }
        this.renderUI();
        if (enabled) this.maybeTriggerAI();
    }

    resign() {
        if (this.forcedResult) return;
        const status = getGameStatus(this.state);
        if (status === 'checkmate' || status === 'stalemate') return;
        this.forcedResult = { type: 'resign', loser: this.state.turn };
        if (this.aiTimeoutId) { clearTimeout(this.aiTimeoutId); this.aiTimeoutId = null; }
        this.aiThinking = false;
        this.renderUI();
    }

    newGame() {
        if (this.aiTimeoutId) clearTimeout(this.aiTimeoutId);
        this.state = createInitialState();
        this.selected = null;
        this.legalTargets = [];
        this.aiThinking = false;
        this.aiTimeoutId = null;
        this.pendingPromotion = null;
        this.lastMove = null;
        this.moveHistory = [];
        this.capturedByWhite = [];
        this.capturedByBlack = [];
        this.forcedResult = null;
        this.renderUI();
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            if (this.pendingPromotion) this.cancelPromotion();
            else this.close();
        }
    }
}
