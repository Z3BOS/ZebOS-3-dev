// Zeb OS 3 Calculator App
import { BaseApp } from '../UIKit3/framework/index.js';

export class CalcApp extends BaseApp {
    mount() {
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:#1e293b; padding:12px; gap:10px; font-family:'Segoe UI', sans-serif;">
                <input type="text" class="calc-display" value="0" readonly style="width:100%; height:44px; background:#0f172a; border:1px solid #334155; border-radius:6px; color:#60a5fa; font-family:'Consolas', monospace; font-size:22px; text-align:right; padding:0 12px; outline:none;">
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; flex-grow:1;">
                    <button class="aero-btn calc-btn" data-val="C" style="background:#ef4444; color:#fff; font-weight:bold;">C</button>
                    <button class="aero-btn calc-btn" data-val="(">(</button>
                    <button class="aero-btn calc-btn" data-val=")">)</button>
                    <button class="aero-btn calc-btn" data-val="/" style="background:#0078d7; color:#fff;">÷</button>

                    <button class="aero-btn calc-btn" data-val="7">7</button>
                    <button class="aero-btn calc-btn" data-val="8">8</button>
                    <button class="aero-btn calc-btn" data-val="9">9</button>
                    <button class="aero-btn calc-btn" data-val="*" style="background:#0078d7; color:#fff;">×</button>

                    <button class="aero-btn calc-btn" data-val="4">4</button>
                    <button class="aero-btn calc-btn" data-val="5">5</button>
                    <button class="aero-btn calc-btn" data-val="6">6</button>
                    <button class="aero-btn calc-btn" data-val="-" style="background:#0078d7; color:#fff;">-</button>

                    <button class="aero-btn calc-btn" data-val="1">1</button>
                    <button class="aero-btn calc-btn" data-val="2">2</button>
                    <button class="aero-btn calc-btn" data-val="3">3</button>
                    <button class="aero-btn calc-btn" data-val="+" style="background:#0078d7; color:#fff;">+</button>

                    <button class="aero-btn calc-btn" data-val="0" style="grid-column:span 2;">0</button>
                    <button class="aero-btn calc-btn" data-val=".">.</button>
                    <button class="aero-btn calc-btn" data-val="=" style="background:#10b981; color:#fff; font-weight:bold;">=</button>
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
