
import { getIcon } from '../icons.js';
import { BaseApp } from '../UIKit3/framework/index.js';
import { getRegistrySnapshot, playSystemSound, showSystemConfirm } from '../os3.js';

export class ActivityCenterApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
        this.selectedProgram = null;
        this.clockHandle = null;

        this.programs = [
            { key: 'activitycenter', icon: 'activitycenter', label: 'Activity Center', desc: 'System activity & launcher dashboard', execPath: 'Z:\\ZebApps\\Activity Center\\activitycenter.exe', category: 'System Utility', version: '3.0.1', size: '185 KB', ram: '1.4 MB', status: 'Running' },
            { key: 'explorer', icon: 'explorer', label: 'Zeb Explorer', desc: 'Browse virtual file system folders & drives', execPath: 'Z:\\ZebApps\\Zeb Explorer\\explorer.exe', category: 'File Management', version: '3.0.1', size: '410 KB', ram: '2.2 MB', status: 'Ready' },
            { key: 'editor', icon: 'editor', label: 'Text Editor', desc: 'Edit text, scripts, & configuration files', execPath: 'Z:\\ZebApps\\Text Editor\\editor.exe', category: 'Productivity', version: '3.0.1', size: '142 KB', ram: '0.9 MB', status: 'Ready' },
            { key: 'terminal', icon: 'terminal', label: 'Zeb Terminal', desc: 'Command prompt interface for system tasks', execPath: 'Z:\\ZebApps\\Terminal\\cmd.exe', category: 'Developer Tools', version: '3.0.1', size: '220 KB', ram: '1.1 MB', status: 'Ready' },
            { key: 'paint', icon: 'paint', label: 'Paint Studio', desc: 'Raster graphics editor & drawing suite', execPath: 'Z:\\ZebApps\\Paint Studio\\paint.exe', category: 'Graphics & Design', version: '3.0.1', size: '512 KB', ram: '3.5 MB', status: 'Ready' },
            { key: 'calc', icon: 'calc', label: 'Calculator', desc: 'Perform standard & scientific calculations', execPath: 'Z:\\ZebApps\\Calculator\\calc.exe', category: 'Utilities', version: '3.0.1', size: '96 KB', ram: '0.5 MB', status: 'Ready' },
            { key: 'taskmgr', icon: 'taskmgr', label: 'Task Manager', desc: 'Monitor processes & running windows', execPath: 'Z:\\ZebApps\\Task Manager\\taskmgr.exe', category: 'System Diagnostics', version: '3.0.1', size: '340 KB', ram: '1.6 MB', status: 'Ready' },
            { key: 'media', icon: 'media', label: 'Media Player', desc: 'Play audio waveforms & media streams', execPath: 'Z:\\ZebApps\\Media Player\\player.exe', category: 'Multimedia', version: '3.0.1', size: '620 KB', ram: '4.1 MB', status: 'Ready' },
            { key: 'solitaire', icon: 'solitaire', label: 'Klondike Solitaire', desc: 'Classic card solitaire engine', execPath: 'Z:\\ZebApps\\Solitaire\\solitaire.exe', category: 'Entertainment', version: '3.0.1', size: '280 KB', ram: '1.7 MB', status: 'Ready' },
            { key: 'chess', icon: 'chess', label: 'Chess Engine', desc: 'Strategic chess engine vs. computer', execPath: 'Z:\\ZebApps\\Chess\\chess.exe', category: 'Entertainment', version: '3.0.1', size: '490 KB', ram: '2.8 MB', status: 'Ready' },
            { key: 'personalize', icon: 'personalize', label: 'Display Properties', desc: 'Customize wallpaper, schemes, & themes', execPath: 'Z:\\ZebApps\\System Info\\desk.cpl', category: 'Control Panel', version: '3.0.1', size: '150 KB', ram: '1.0 MB', status: 'Ready' },
            { key: 'camera', icon: 'camera', label: 'Camera', desc: 'Webcam snapshot capture suite', execPath: 'Z:\\ZebApps\\Camera\\camera.exe', category: 'Multimedia', version: '3.0.1', size: '310 KB', ram: '2.5 MB', status: 'Ready' },
            { key: 'snake', icon: 'snake', label: 'Snake Game', desc: 'Classic arcade snake game', execPath: 'Z:\\ZebApps\\Snake Game\\snake.exe', category: 'Entertainment', version: '3.0.1', size: '88 KB', ram: '0.6 MB', status: 'Ready' },
            { key: 'mines', icon: 'mines', label: 'Minesweeper', desc: 'Classic mine clearing puzzle game', execPath: 'Z:\\ZebApps\\Minesweeper\\mines.exe', category: 'Entertainment', version: '3.0.1', size: '120 KB', ram: '0.8 MB', status: 'Ready' },
            { key: 'vm', icon: 'vm', label: 'ZebVM Manager', desc: 'Virtual Machine manager & guest OS emulator', execPath: 'Z:\\ZebApps\\ZebVM\\zebvm.exe', category: 'System Utility', version: '3.0.1', size: '680 KB', ram: '4.5 MB', status: 'Ready' },
            { key: 'courgette', icon: 'courgette', label: 'System Info', desc: 'Hardware diagnostics & kernel specs', execPath: 'Z:\\ZebApps\\System Info\\courgette.exe', category: 'System Diagnostics', version: '3.0.1', size: '160 KB', ram: '1.0 MB', status: 'Ready' },
            { key: 'regedit', icon: 'regedit', label: 'Registry Editor', desc: 'System registry keys & configuration tree', execPath: 'Z:\\ZebOS\\regedit.exe', category: 'System Utility', version: '3.0.1', size: '240 KB', ram: '1.2 MB', status: 'Ready' },
            { key: 'viewer', icon: 'viewer', label: 'Zeb Viewer', desc: 'Image & media viewer application', execPath: 'Z:\\ZebApps\\Zeb Viewer\\viewer.exe', category: 'Graphics & Design', version: '3.0.1', size: '215 KB', ram: '1.5 MB', status: 'Ready' }
        ];
    }

    mount() {
        this.render(`
            <div class="ac-app">
                <style>
                    .ac-app {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        background: var(--bg-dark);
                        color: var(--text-main);
                        font-family: var(--main-font);
                        box-sizing: border-box;
                        user-select: none;
                    }
                    .ac-toolbar {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        padding: 8px 10px;
                        background: rgba(30, 41, 59, 0.6);
                        border-bottom: 1px solid var(--aero-border);
                        flex-shrink: 0;
                        flex-wrap: wrap;
                    }
                    .ac-toolbar .ac-spacer { flex-grow: 1; }
                    .ac-body {
                        display: flex;
                        gap: 10px;
                        padding: 10px;
                        flex: 1;
                        min-height: 0;
                        box-sizing: border-box;
                    }
                    .ac-panel {
                        background: rgba(15, 23, 42, 0.55);
                        border: 1px solid var(--aero-border);
                        border-radius: 8px;
                        box-shadow: var(--glass-reflection);
                    }
                    .ac-list-panel {
                        width: 44%;
                        min-width: 230px;
                        display: flex;
                        flex-direction: column;
                        min-height: 0;
                    }
                    .ac-panel-title {
                        font-size: 11.5px;
                        font-weight: 700;
                        padding: 8px 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid var(--aero-border);
                        color: var(--accent-cyan);
                        flex-shrink: 0;
                    }
                    .ac-panel-title .ac-count { font-weight: 400; color: var(--text-muted); font-size: 10.5px; }
                    #ac-program-list {
                        overflow-y: auto;
                        flex: 1;
                        padding: 4px;
                    }
                    .ac-row {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 6px;
                        padding: 6px 8px;
                        margin-bottom: 2px;
                        border-radius: 6px;
                        cursor: pointer;
                        border: 1px solid transparent;
                    }
                    .ac-row:hover { background: rgba(59, 130, 246, 0.18); }
                    .ac-row.selected { background: rgba(37, 99, 235, 0.45); border-color: var(--accent-cyan); }
                    .ac-row-icon { width: 22px; height: 22px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
                    .ac-row-icon svg { width: 20px; height: 20px; }
                    .ac-row-text { display: flex; flex-direction: column; min-width: 0; }
                    .ac-row-title { font-weight: 600; font-size: 11.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                    .ac-row-desc { font-size: 10.5px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                    .ac-row-run-btn { flex-shrink: 0; padding: 2px 8px !important; font-size: 10.5px !important; }

                    .ac-right { flex: 1; min-width: 270px; display: flex; flex-direction: column; gap: 10px; min-height: 0; }
                    .ac-diag-grid {
                        font-size: 11.5px;
                        line-height: 1.6;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 3px 10px;
                        padding: 10px;
                    }
                    .ac-diag-grid b { color: var(--text-muted); font-weight: 600; }

                    .ac-detail-panel { flex: 1; display: flex; flex-direction: column; min-height: 0; }
                    #ac-detail-content { flex: 1; overflow-y: auto; padding: 10px; font-size: 11.5px; line-height: 1.5; }
                    .ac-detail-head {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 10px;
                        background: rgba(2, 6, 23, 0.5);
                        border: 1px solid var(--aero-border);
                        border-radius: 6px;
                        padding: 8px;
                    }
                    .ac-detail-head svg { width: 30px; height: 30px; }
                    .ac-detail-name { font-weight: 700; font-size: 13px; }
                    .ac-detail-cat { font-size: 10.5px; color: var(--text-muted); }
                    .ac-code {
                        font-family: var(--code-font);
                        background: rgba(2, 6, 23, 0.6);
                        border: 1px solid var(--aero-border);
                        border-radius: 4px;
                        padding: 1px 5px;
                        font-size: 10.5px;
                        word-break: break-all;
                    }
                    .ac-meta-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 4px 10px;
                        margin-top: 10px;
                        background: rgba(2, 6, 23, 0.4);
                        border: 1px solid var(--aero-border);
                        border-radius: 6px;
                        padding: 8px;
                    }
                    .ac-meta-grid b { color: var(--text-muted); font-weight: 600; }
                    .ac-actions-panel { padding: 8px 10px; flex-shrink: 0; }
                    .ac-actions-grid {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(110px, 1fr));
                        gap: 6px;
                        margin-top: 6px;
                    }
                    .ac-actions-grid .aero-btn { font-size: 11px; padding: 5px 8px; justify-content: flex-start; }
                </style>

                <div class="ac-toolbar">
                    <button class="aero-btn app-toolbar-btn" id="ac-run-selected">${getIcon('play')} Run Selected</button>
                    <button class="aero-btn app-toolbar-btn" id="ac-open-props">${getIcon('settings')} Properties</button>
                    <button class="aero-btn app-toolbar-btn" id="ac-refresh">${getIcon('refresh')} Refresh</button>
                    <span class="ac-spacer"></span>
                    <button class="aero-btn app-toolbar-btn" id="ac-close">${getIcon('winClose')} Close</button>
                </div>

                <div class="ac-body">
                    <div class="ac-panel ac-list-panel">
                        <div class="ac-panel-title">
                            <span>System Applications</span>
                            <span class="ac-count">(${this.programs.length} Registered)</span>
                        </div>
                        <div id="ac-program-list"></div>
                    </div>

                    <div class="ac-right">
                        <div class="ac-panel">
                            <div class="ac-panel-title">
                                <span>System Diagnostics</span>
                                <span class="aero-badge aero-badge-success">Online</span>
                            </div>
                            <div class="ac-diag-grid">
                                <div><b>User:</b> <span id="ac-user">Guest</span></div>
                                <div><b>OS Version:</b> <span id="ac-version">3.0.1</span></div>
                                <div><b>Date:</b> <span id="ac-date">--</span></div>
                                <div><b>Time:</b> <span id="ac-time">--:--:--</span></div>
                                <div style="grid-column:span 2;"><b>Active Window:</b> <span id="ac-active-window">None</span></div>
                            </div>
                        </div>

                        <div class="ac-panel ac-detail-panel">
                            <div class="ac-panel-title"><span>Application Overview</span></div>
                            <div id="ac-detail-content"></div>
                        </div>

                        <div class="ac-panel ac-actions-panel">
                            <div class="ac-panel-title" style="border:none; padding:0 0 4px 0;"><span>Quick Actions</span></div>
                            <div class="ac-actions-grid">
                                <button class="aero-btn app-toolbar-btn" id="ac-action-showdesktop">${getIcon('home')} Show Desktop</button>
                                <button class="aero-btn app-toolbar-btn" id="ac-action-taskmgr">${getIcon('taskmgr')} Task Manager</button>
                                <button class="aero-btn app-toolbar-btn" id="ac-action-files">${getIcon('explorer')} File Explorer</button>
                                <button class="aero-btn app-toolbar-btn" id="ac-action-personalize">${getIcon('personalize')} Display Props</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.renderProgramList();
        this.bindEvents();
        this.startClock();
        this.refreshStatus();
    }

    renderProgramList() {
        const list = this.body.querySelector('#ac-program-list');
        if (!list) return;

        list.innerHTML = '';
        this.programs.forEach((p, index) => {
            const row = document.createElement('div');
            row.className = 'ac-row';
            row.dataset.key = p.key;

            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; min-width:0; flex:1;">
                    <div class="ac-row-icon">${getIcon(p.icon)}</div>
                    <div class="ac-row-text">
                        <span class="ac-row-title">${p.label}</span>
                        <span class="ac-row-desc">${p.desc}</span>
                    </div>
                </div>
                <button class="aero-btn app-toolbar-btn ac-row-run-btn" data-run="${p.key}">Run</button>
            `;

            this.listen(row, 'click', () => this.selectProgramRow(row, p));
            this.listen(row, 'dblclick', () => this.runApp(p.key));

            const runBtn = row.querySelector('.ac-row-run-btn');
            if (runBtn) {
                this.listen(runBtn, 'click', (e) => {
                    e.stopPropagation();
                    this.runApp(p.key);
                });
            }

            if (index === 0) this.selectProgramRow(row, p);

            list.appendChild(row);
        });
    }

    selectProgramRow(rowElement, program) {
        this.body.querySelectorAll('.ac-row').forEach(r => r.classList.remove('selected'));
        rowElement.classList.add('selected');
        this.selectedProgram = program;
        this.updateDetailCard(program);
        playSystemSound('click');
    }

    updateDetailCard(p) {
        const detailContainer = this.body.querySelector('#ac-detail-content');
        if (!detailContainer || !p) return;

        detailContainer.innerHTML = `
            <div class="ac-detail-head">
                ${getIcon(p.icon)}
                <div>
                    <div class="ac-detail-name">${p.label}</div>
                    <div class="ac-detail-cat">${p.category}</div>
                </div>
            </div>

            <div style="margin-bottom:6px;"><b style="color:var(--text-muted);">Description:</b> ${p.desc}</div>
            <div style="margin-bottom:4px;"><b style="color:var(--text-muted);">Executable Path:</b><br><span class="ac-code">${p.execPath}</span></div>

            <div class="ac-meta-grid">
                <div><b>Version:</b> ${p.version}</div>
                <div><b>Binary Size:</b> ${p.size}</div>
                <div><b>RAM Footprint:</b> ${p.ram}</div>
                <div><b>Status:</b> <span class="aero-badge aero-badge-success">${p.status}</span></div>
            </div>

            <div style="display:flex; gap:8px; margin-top:12px;">
                <button class="aero-btn aero-btn-primary" id="ac-card-run">${getIcon('play')} Launch Program</button>
                <button class="aero-btn" id="ac-card-props">${getIcon('settings')} View Properties</button>
            </div>
        `;

        const cardRun = detailContainer.querySelector('#ac-card-run');
        if (cardRun) this.listen(cardRun, 'click', () => this.runApp(p.key));

        const cardProps = detailContainer.querySelector('#ac-card-props');
        if (cardProps) this.listen(cardProps, 'click', () => this.showProgramProperties(p));
    }

    showProgramProperties(program) {
        if (!program) return;
        playSystemSound('click');

        const existing = document.getElementById('ac-properties-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'ac-properties-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; width: 100vw; height: 100vh;
            background: rgba(2, 6, 23, 0.65);
            backdrop-filter: blur(8px);
            display: flex; align-items: center; justify-content: center;
            z-index: 100010;
        `;

        overlay.innerHTML = `
            <div class="aero-dialog" style="width:380px;">
                <div class="aero-dialog-header">
                    ${getIcon(program.icon)}
                    <span>${program.label} Properties</span>
                </div>
                <div class="aero-dialog-body">
                    <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                        <div class="ac-meta-grid" style="grid-template-columns:110px 1fr;">
                            <b>Type:</b><span>Application Executable (.exe)</span>
                            <b>Location:</b><span class="ac-code">${program.execPath}</span>
                            <b>Size on disk:</b><span>${program.size}</span>
                            <b>Memory footprint:</b><span>${program.ram}</span>
                            <b>Kernel version:</b><span>${program.version}</span>
                            <b>Status:</b><span class="aero-badge aero-badge-success">${program.status}</span>
                        </div>
                    </div>
                </div>
                <div class="aero-dialog-footer">
                    <button class="aero-btn aero-btn-primary" id="ac-modal-ok">OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const close = () => overlay.remove();
        overlay.querySelector('#ac-modal-ok').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    }

    runApp(key) {
        playSystemSound('open');
        window.dispatchEvent(new CustomEvent('zebos-run-launch', { detail: { app: key } }));
    }

    bindEvents() {
        const on = (selector, type, fn) => {
            const el = this.body.querySelector(selector);
            if (!el) return;
            this.listen(el, type, fn);
        };

        on('#ac-run-selected', 'click', () => {
            if (this.selectedProgram) this.runApp(this.selectedProgram.key);
        });

        on('#ac-open-props', 'click', () => {
            if (this.selectedProgram) this.showProgramProperties(this.selectedProgram);
        });

        on('#ac-refresh', 'click', () => {
            playSystemSound('click');
            this.refreshStatus();
            this.renderProgramList();
        });

        on('#ac-close', 'click', () => this.close());

        on('#ac-action-taskmgr', 'click', () => this.runApp('taskmgr'));
        on('#ac-action-files', 'click', () => this.runApp('explorer'));
        on('#ac-action-personalize', 'click', () => this.runApp('personalize'));

        on('#ac-action-showdesktop', 'click', async () => {
            const confirmed = await showSystemConfirm('Show Desktop', 'Minimize all open windows and show desktop?', { okText: 'Yes', cancelText: 'No', iconType: 'info' });
            if (!confirmed) return;
            const ownFrame = this.body.closest('.window-frame');
            document.querySelectorAll('.window-frame').forEach(frame => {
                if (frame !== ownFrame) frame.style.display = 'none';
            });
        });
    }

    refreshStatus() {
        const reg = getRegistrySnapshot();
        const userEl = this.body.querySelector('#ac-user');
        const versionEl = this.body.querySelector('#ac-version');
        const dateEl = this.body.querySelector('#ac-date');
        const activeEl = this.body.querySelector('#ac-active-window');

        if (userEl) userEl.textContent = reg.currentUser || 'Guest';
        if (versionEl) versionEl.textContent = reg.version || '3.0.1';
        if (dateEl) dateEl.textContent = new Date().toLocaleDateString();
        if (activeEl) {
            const activeTitle = document.querySelector('.window-frame.active-window .window-title span');
            activeEl.textContent = activeTitle ? activeTitle.textContent.trim() : 'None';
        }
    }

    startClock() {
        const timeEl = this.body.querySelector('#ac-time');
        if (!timeEl) return;

        const tick = () => {
            timeEl.textContent = new Date().toLocaleTimeString();
            const activeEl = this.body.querySelector('#ac-active-window');
            if (activeEl) {
                const activeTitle = document.querySelector('.window-frame.active-window .window-title span');
                activeEl.textContent = activeTitle ? activeTitle.textContent.trim() : 'None';
            }
        };
        tick();
        this.clockHandle = setInterval(tick, 1000);
    }

    onCleanup() {
        if (this.clockHandle) clearInterval(this.clockHandle);
    }
}
