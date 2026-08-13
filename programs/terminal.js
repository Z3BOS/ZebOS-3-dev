// Zeb OS 3 Terminal Prompt App
import { BaseApp } from '../UIKit3/framework/index.js';

export class TerminalApp extends BaseApp {
    mount() {
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:#0f172a; color:#60a5fa; font-family:'Consolas', monospace; font-size:12px; padding:12px; overflow:hidden;">
                <div class="terminal-output" style="flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; gap:4px;">
                    <div>Zeb OS 3 [Version 0.0.2 Pre-Alpha]</div>
                    <div>(c) Zeb Core Systems. All rights reserved.</div>
                    <div style="margin-top:8px;">Type 'help' to view available system commands.</div>
                </div>
                <div style="display:flex; align-items:center; gap:6px; margin-top:8px;">
                    <span style="color:#10b981;">Z:\\Users\\Guest&gt;</span>
                    <input type="text" class="terminal-input" style="flex-grow:1; background:transparent; border:none; outline:none; color:#ffffff; font-family:'Consolas', monospace; font-size:12px;" autofocus>
                </div>
            </div>
        `);

        const output = this.body.querySelector('.terminal-output');
        const input = this.body.querySelector('.terminal-input');

        const printLine = (text, color = '#60a5fa') => {
            const line = document.createElement('div');
            line.style.color = color;
            line.textContent = text;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                printLine(`Z:\\Users\\Guest> ${cmd}`, '#10b981');
                input.value = '';

                if (!cmd) return;

                const parts = cmd.split(' ');
                const action = parts[0].toLowerCase();

                switch (action) {
                    case 'help':
                        printLine('Available Commands:');
                        printLine('  help      - Display this command manual');
                        printLine('  cls/clear - Clear terminal screen');
                        printLine('  ver       - Show operating system version');
                        printLine('  dir       - List files in current directory');
                        printLine('  echo      - Output text string');
                        printLine('  reboot    - Restart Zeb OS 3');
                        break;
                    case 'cls':
                    case 'clear':
                        output.innerHTML = '';
                        break;
                    case 'ver':
                        printLine('Zeb OS 3 Pre-Alpha 0.0.2 [Aero Glass Core]');
                        break;
                    case 'dir':
                        printLine(' Directory of Z:\\Users\\Guest');
                        printLine(' <DIR>     Desktop');
                        printLine(' <DIR>     Documents');
                        printLine(' <DIR>     Pictures');
                        printLine(' 1 File(s) welcome.txt');
                        break;
                    case 'echo':
                        printLine(parts.slice(1).join(' '));
                        break;
                    case 'reboot':
                        location.reload();
                        break;
                    default:
                        printLine(`'${action}' is not recognized as an internal command. Type 'help' for assistance.`, '#ef4444');
                }
            }
        });
    }
}
