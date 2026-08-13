// Zeb OS 3 Advanced Scientific & Standard Calculator App
import { BaseApp } from '../UIKit3/framework/index.js';

export class CalcApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
        this.mode = 'standard'; // 'standard' or 'scientific'
        this.expression = '';
        this.latexExpr = '';
        this.currentValue = '0';
        this.shouldResetScreen = false;
    }

    mount() {
        this.renderApp();
    }

    renderApp() {
        const isSci = this.mode === 'scientific';
        
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:#0f172a; padding:10px; gap:8px; font-family:'Segoe UI', sans-serif; user-select:none;">
                <!-- Mode Selector Toolbar -->
                <div style="display:flex; align-items:center; gap:6px; background:rgba(30, 41, 59, 0.8); padding:4px; border-radius:6px; border:1px solid rgba(255,255,255,0.12);">
                    <button class="aero-btn mode-btn ${!isSci ? 'aero-btn-primary' : ''}" data-mode="standard" style="flex:1; padding:4px 8px; font-size:11px;">Standard</button>
                    <button class="aero-btn mode-btn ${isSci ? 'aero-btn-primary' : ''}" data-mode="scientific" style="flex:1; padding:4px 8px; font-size:11px;">Scientific</button>
                </div>

                <!-- Dual-Line Math Screen (LaTeX / Expression & Main Result) -->
                <div style="background:rgba(2, 6, 23, 0.95); border:1px solid rgba(255, 255, 255, 0.2); border-radius:6px; padding:8px 12px; display:flex; flex-direction:column; justify-content:center; align-items:flex-end; box-shadow:inset 0 2px 6px rgba(0,0,0,0.7);">
                    <div class="calc-latex-screen" style="font-size:11px; color:#94a3b8; font-family:'Consolas', monospace; height:16px; overflow:hidden; white-space:nowrap;">${this.latexExpr || '&nbsp;'}</div>
                    <div class="calc-main-screen" style="font-size:26px; font-weight:700; color:#60a5fa; font-family:'Consolas', monospace; overflow:hidden; white-space:nowrap; text-shadow:0 0 10px rgba(96, 165, 250, 0.4);">${this.currentValue}</div>
                </div>

                <!-- Keypad Grid -->
                <div style="display:grid; grid-template-columns:repeat(${isSci ? 5 : 4}, 1fr); gap:6px; flex-grow:1;">
                    ${isSci ? `
                        <button class="aero-btn calc-btn" data-act="sin">sin</button>
                        <button class="aero-btn calc-btn" data-act="cos">cos</button>
                        <button class="aero-btn calc-btn" data-act="tan">tan</button>
                        <button class="aero-btn calc-btn" data-act="log">log</button>
                        <button class="aero-btn calc-btn" data-act="ln">ln</button>

                        <button class="aero-btn calc-btn" data-act="sqrt">√x</button>
                        <button class="aero-btn calc-btn" data-act="sqr">x²</button>
                        <button class="aero-btn calc-btn" data-act="pow">xʸ</button>
                        <button class="aero-btn calc-btn" data-act="pi">π</button>
                        <button class="aero-btn calc-btn" data-act="e">e</button>
                    ` : ''}

                    <button class="aero-btn calc-btn" data-act="clear" style="background:#dc2626; color:#fff; border-color:#f87171;">C</button>
                    <button class="aero-btn calc-btn" data-act="(">(</button>
                    <button class="aero-btn calc-btn" data-act=")">)</button>
                    ${isSci ? `<button class="aero-btn calc-btn" data-act="fact">n!</button>` : ''}
                    <button class="aero-btn calc-btn" data-act="op" data-val="/" style="background:#2563eb; color:#fff;">÷</button>

                    <button class="aero-btn calc-btn" data-act="num" data-val="7">7</button>
                    <button class="aero-btn calc-btn" data-act="num" data-val="8">8</button>
                    <button class="aero-btn calc-btn" data-act="num" data-val="9">9</button>
                    ${isSci ? `<button class="aero-btn calc-btn" data-act="recip">1/x</button>` : ''}
                    <button class="aero-btn calc-btn" data-act="op" data-val="*" style="background:#2563eb; color:#fff;">×</button>

                    <button class="aero-btn calc-btn" data-act="num" data-val="4">4</button>
                    <button class="aero-btn calc-btn" data-act="num" data-val="5">5</button>
                    <button class="aero-btn calc-btn" data-act="num" data-val="6">6</button>
                    ${isSci ? `<button class="aero-btn calc-btn" data-act="pm">±</button>` : ''}
                    <button class="aero-btn calc-btn" data-act="op" data-val="-" style="background:#2563eb; color:#fff;">-</button>

                    <button class="aero-btn calc-btn" data-act="num" data-val="1">1</button>
                    <button class="aero-btn calc-btn" data-act="num" data-val="2">2</button>
                    <button class="aero-btn calc-btn" data-act="num" data-val="3">3</button>
                    ${isSci ? `<button class="aero-btn calc-btn" data-act="percent">%</button>` : ''}
                    <button class="aero-btn calc-btn" data-act="op" data-val="+" style="background:#2563eb; color:#fff;">+</button>

                    <button class="aero-btn calc-btn" data-act="num" data-val="0" style="grid-column:${isSci ? 'span 2' : 'span 2'};">0</button>
                    <button class="aero-btn calc-btn" data-act="num" data-val=".">.</button>
                    <button class="aero-btn calc-btn" data-act="equals" style="background:#16a34a; color:#fff; border-color:#4ade80; ${isSci ? 'grid-column:span 2;' : ''}">=</button>
                </div>
            </div>
        `);

        this.bindEvents();
    }

    bindEvents() {
        // Mode Switchers
        this.body.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetMode = btn.dataset.mode;
                if (this.mode !== targetMode) {
                    this.mode = targetMode;
                    
                    // Adjust parent window frame size
                    const frame = this.body.closest('.window-frame');
                    if (frame) {
                        frame.style.width = this.mode === 'scientific' ? '460px' : '320px';
                        frame.style.height = this.mode === 'scientific' ? '460px' : '420px';
                    }
                    this.renderApp();
                }
            });
        });

        // Keypad buttons
        this.body.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const act = btn.dataset.act;
                const val = btn.dataset.val;
                this.handleAction(act, val);
            });
        });
    }

    handleAction(act, val) {
        if (act === 'num') {
            if (this.shouldResetScreen || this.currentValue === '0' || this.currentValue === 'Error') {
                this.currentValue = val === '.' ? '0.' : val;
                this.shouldResetScreen = false;
            } else {
                if (val === '.' && this.currentValue.includes('.')) return;
                this.currentValue += val;
            }
        } else if (act === 'op') {
            this.expression += `${this.currentValue} ${val} `;
            this.latexExpr += `${this.currentValue} ${val === '*' ? '\\times' : val === '/' ? '\\div' : val} `;
            this.shouldResetScreen = true;
        } else if (act === 'clear') {
            this.expression = '';
            this.latexExpr = '';
            this.currentValue = '0';
            this.shouldResetScreen = false;
        } else if (act === 'equals') {
            this.expression += this.currentValue;
            this.latexExpr += this.currentValue;
            try {
                // Safely evaluate math expression
                let evalExpr = this.expression
                    .replace(/sin\(/g, 'Math.sin(')
                    .replace(/cos\(/g, 'Math.cos(')
                    .replace(/tan\(/g, 'Math.tan(')
                    .replace(/log\(/g, 'Math.log10(')
                    .replace(/ln\(/g, 'Math.log(')
                    .replace(/sqrt\(/g, 'Math.sqrt(')
                    .replace(/π/g, 'Math.PI')
                    .replace(/\be\b/g, 'Math.E')
                    .replace(/\^/g, '**');

                let res = eval(evalExpr);
                if (typeof res === 'number') {
                    if (!isFinite(res)) res = 'Error';
                    else res = Math.round(res * 100000000) / 100000000;
                }
                this.currentValue = String(res);
                this.latexExpr += ` = ${res}`;
                this.expression = '';
                this.shouldResetScreen = true;
            } catch (e) {
                this.currentValue = 'Error';
                this.expression = '';
                this.shouldResetScreen = true;
            }
        } else if (act === 'sin') {
            this.expression += 'sin(';
            this.latexExpr += '\\sin(';
            this.shouldResetScreen = false;
        } else if (act === 'cos') {
            this.expression += 'cos(';
            this.latexExpr += '\\cos(';
            this.shouldResetScreen = false;
        } else if (act === 'tan') {
            this.expression += 'tan(';
            this.latexExpr += '\\tan(';
            this.shouldResetScreen = false;
        } else if (act === 'log') {
            this.expression += 'log(';
            this.latexExpr += '\\log_{10}(';
            this.shouldResetScreen = false;
        } else if (act === 'ln') {
            this.expression += 'ln(';
            this.latexExpr += '\\ln(';
            this.shouldResetScreen = false;
        } else if (act === 'sqrt') {
            this.expression += 'sqrt(';
            this.latexExpr += '\\sqrt{';
            this.shouldResetScreen = false;
        } else if (act === 'sqr') {
            const num = parseFloat(this.currentValue) || 0;
            this.currentValue = String(num * num);
            this.latexExpr = `${num}^2 = ${this.currentValue}`;
            this.shouldResetScreen = true;
        } else if (act === 'pow') {
            this.expression += `${this.currentValue}^`;
            this.latexExpr += `${this.currentValue}^{`;
            this.shouldResetScreen = true;
        } else if (act === 'pi') {
            this.currentValue = String(Math.PI.toFixed(8));
            this.shouldResetScreen = true;
        } else if (act === 'e') {
            this.currentValue = String(Math.E.toFixed(8));
            this.shouldResetScreen = true;
        } else if (act === 'recip') {
            const num = parseFloat(this.currentValue);
            this.currentValue = num !== 0 ? String(1 / num) : 'Error';
            this.latexExpr = `1 / ${num} = ${this.currentValue}`;
            this.shouldResetScreen = true;
        } else if (act === 'fact') {
            let n = parseInt(this.currentValue);
            if (isNaN(n) || n < 0) {
                this.currentValue = 'Error';
            } else {
                let f = 1;
                for (let i = 2; i <= n; i++) f *= i;
                this.currentValue = String(f);
                this.latexExpr = `${n}! = ${f}`;
            }
            this.shouldResetScreen = true;
        } else if (act === 'pm') {
            if (this.currentValue !== '0') {
                this.currentValue = this.currentValue.startsWith('-') ? this.currentValue.slice(1) : '-' + this.currentValue;
            }
        } else if (act === '(' || act === ')') {
            this.expression += act;
            this.latexExpr += act;
        }

        this.updateScreens();
    }

    updateScreens() {
        const latexEl = this.body.querySelector('.calc-latex-screen');
        const mainEl = this.body.querySelector('.calc-main-screen');
        if (latexEl) latexEl.innerHTML = this.latexExpr || '&nbsp;';
        if (mainEl) mainEl.textContent = this.currentValue;
    }
}
