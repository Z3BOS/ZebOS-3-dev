// Zeb OS 3 Advanced Terminal Prompt App
import { BaseApp } from '../UIKit3/framework/index.js';
import { getVFSFileContent } from '../os3.js';

export class TerminalApp extends BaseApp {
    mount() {
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:#0f172a; color:#60a5fa; font-family:'Consolas', monospace; font-size:12px; padding:12px; overflow:hidden; user-select:text;">
                <div class="terminal-output" style="flex-grow:1; overflow-y:auto; display:flex; flex-direction:column; gap:4px;">
                    <div>Zeb OS 3 [Version 0.0.5 Pre-Alpha]</div>
                    <div>(c) Zeb Core Systems. All rights reserved.</div>
                    <div style="margin-top:8px; color:#94a3b8;">Type <span style="color:#ffffff;">'help'</span> to view available system commands.</div>
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
                const args = parts.slice(1).join(' ');

                switch (action) {
                    case 'help':
                        printLine('=================== ZEB OS 3 COMMAND MANUAL ===================', '#94a3b8');
                        printLine('  help                 - Display this command manual', '#ffffff');
                        printLine('  sysinfo              - View system specs, CPU & RAM status', '#ffffff');
                        printLine('  ver / version        - View OS build version', '#ffffff');
                        printLine('  cls / clear          - Clear terminal screen', '#ffffff');
                        printLine('  dir / ls             - List files in current VFS directory', '#ffffff');
                        printLine('  cat / read <file>    - Read file contents from VFS', '#ffffff');
                        printLine('  calc <expr>          - CLI math expression evaluator', '#ffffff');
                        printLine('  tasklist / ps        - View running processes & windows', '#ffffff');
                        printLine('  date                 - Display current system date', '#ffffff');
                        printLine('  time                 - Display current system time', '#ffffff');
                        printLine('  echo <text>          - Echo text string', '#ffffff');
                        printLine('  reboot / restart     - Reboot Zeb OS 3', '#ffffff');
                        printLine('  shutdown             - Power off OS', '#ffffff');
                        printLine('================================================================', '#94a3b8');
                        break;

                    case 'sysinfo':
                    case 'systeminfo':
                        printLine('Host Name:                 ZEB-OS3-STATION', '#ffffff');
                        printLine('OS Name:                   Zeb OS 3 Pre-Alpha 0.0.5', '#ffffff');
                        printLine('OS Build:                  0.0.5.build9a42 (Aero Glass Core)', '#ffffff');
                        printLine('Processor(s):              Zeb x86_64 Dual-Core @ 3.40 GHz', '#ffffff');
                        printLine('Total Physical Memory:     8,192 MB RAM', '#ffffff');
                        printLine('Available System Storage:  512 GB VFS (Virtual File System)', '#ffffff');
                        printLine('Display Resolution:        ' + window.innerWidth + 'x' + window.innerHeight, '#ffffff');
                        printLine('Active User:               Guest User', '#ffffff');
                        break;

                    case 'ver':
                    case 'version':
                        printLine('Zeb OS 3 Pre-Alpha 0.0.5 [Build 0.0.5.build9a42]');
                        break;

                    case 'cls':
                    case 'clear':
                        output.innerHTML = '';
                        break;

                    case 'dir':
                    case 'ls':
                        printLine(' Directory of Z:\\Users\\Guest\\Desktop', '#ffffff');
                        printLine(' 08/13/2026  12:00 PM    <DIR>          .', '#94a3b8');
                        printLine(' 08/13/2026  12:00 PM    <DIR>          ..', '#94a3b8');
                        printLine(' 08/13/2026  12:00 PM               108 welcome.txt', '#60a5fa');
                        printLine(' 08/13/2026  12:00 PM                42 untitled.txt', '#60a5fa');
                        printLine('               2 File(s)            150 bytes', '#ffffff');
                        break;

                    case 'cat':
                    case 'read':
                        if (!args) {
                            printLine('Usage: cat <filename>', '#ef4444');
                        } else {
                            const content = getVFSFileContent(args);
                            printLine(content, '#f8fafc');
                        }
                        break;

                    case 'calc':
                        if (!args) {
                            printLine('Usage: calc <expression> (e.g. calc 12 * 4 + 7)', '#ef4444');
                        } else {
                            try {
                                const res = eval(args);
                                printLine(`${args} = ${res}`, '#10b981');
                            } catch (err) {
                                printLine(`Syntax Error in expression '${args}'`, '#ef4444');
                            }
                        }
                        break;

                    case 'tasklist':
                    case 'ps':
                        printLine('Image Name                     PID     Mem Usage', '#ffffff');
                        printLine('========================= ======== ============', '#94a3b8');
                        printLine('os3_kernel.exe                0004     42,100 K', '#60a5fa');
                        printLine('aero_glass_wm.exe             0120     84,520 K', '#60a5fa');
                        printLine('zeb_terminal.exe              0482     18,300 K', '#60a5fa');
                        document.querySelectorAll('.window-frame').forEach((win, idx) => {
                            const title = win.querySelector('.window-title')?.textContent || 'App Window';
                            printLine(`${title.padEnd(25)} ${(1000 + idx).toString().padStart(8)}     24,800 K`, '#10b981');
                        });
                        break;

                    case 'date':
                        printLine(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), '#ffffff');
                        break;

                    case 'time':
                        printLine(new Date().toLocaleTimeString(), '#ffffff');
                        break;

                    case 'echo':
                        printLine(args || '', '#ffffff');
                        break;

                    case 'reboot':
                    case 'restart':
                    case 'shutdown':
                        printLine('Initiating system restart...', '#f59e0b');
                        setTimeout(() => location.reload(), 1000);
                        break;

                    default:
                        printLine(`'${action}' is not recognized as an internal or external command. Type 'help' for command list.`, '#ef4444');
                        break;
                }
            }
        });
    }
}
