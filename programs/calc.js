// Zeb OS 3 Calculator App
import { BaseApp } from '../UIKit3/framework/index.js';

export class CalcApp extends BaseApp {
    mount() {
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:#0f172a; padding:12px; gap:10px; font-family:'Segoe UI', sans-serif;">
                <input type="text" class="calc-display" value="0" readonly style="width:100%; height:46px; background:#020617; border:1px solid #334155; border-radius:6px; color:#60a5fa; font-family:'Consolas', monospace; font-size:24px; text-align:right; padding:0 12px; outline:none;">
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; flex-grow:1;">
                    <button class="aero-btn calc-btn" data-val="C" style="background:#dc2626; color:#fff; border-color:#f87171;">C</button>
                    <button class="aero-btn calc-btn" data-val="(">(</button>
                    <button class="aero-btn calc-btn" data-val=")">)</button>
                    <button class="aero-btn calc-btn" data-val="/" style="background:#2563eb; color:#fff;">÷</button>

                    <button class="aero-btn calc-btn" data-val="7">7</button>
                    <button class="aero-btn calc-btn" data-val="8">8</button>
                    <button class="aero-btn calc-btn" data-val="9">9</button>
                    <button class="aero-btn calc-btn" data-val="*" style="background:#2563eb; color:#fff;">×</button>

                    <button class="aero-btn calc-btn" data-val="4">4</button>
                    <button class="aero-btn calc-btn" data-val="5">5</button>
                    <button class="aero-btn calc-btn" data-val="6">6</button>
                    <button class="aero-btn calc-btn" data-val="-" style="background:#2563eb; color:#fff;">-</button>

                    <button class="aero-btn calc-btn" data-val="1">1</button>
                    <button class="aero-btn calc-btn" data-val="2">2</button>
                    <button class="aero-btn calc-btn" data-val="3">3</button>
                    <button class="aero-btn calc-btn" data-val="+" style="background:#2563eb; color:#fff;">+</button>

                    <button class="aero-btn calc-btn" data-val="0" style="grid-column:span 2;">0</button>
                    <button class="aero-btn calc-btn" data-val=".">.</button>
                    <button class="aero-btn calc-btn" data-val="=" style="background:#16a34a; color:#fff; border-color:#4ade80;">=</button>
                </div>
            </div>
        `);

        const display = this.body.querySelector('.calc-display');
        let expr = '';

        this.body.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.val;
                if (val === 'C') {
                    expr = '';
                    display.value = '0';
                } else if (val === '=') {
                    try {
                        display.value = eval(expr) || '0';
                        expr = display.value;
                    } catch (e) {
                        display.value = 'Error';
                        expr = '';
                    }
                } else {
                    if (display.value === '0' || display.value === 'Error') expr = '';
                    expr += val;
                    display.value = expr;
                }
            });
        });
    }
}
