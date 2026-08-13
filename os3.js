// Zeb OS 3 Pre-Alpha 0.0.5 Core Kernel & Window Manager
import { getIcon } from './icons.js';

let systemState = {
    version: "3.0.1 Pre-Alpha 0.0.5",
    currentUser: "Guest",
    uptime: 0,
    activeApp: null,
    hasLoggedInBefore: false,
    fileSystem: {
        "Users": {
            type: "dir",
            content: {
                "Guest": {
                    type: "dir",
                    content: {
                        "Desktop": { type: "dir", content: { "welcome.txt": { type: "file", content: "Welcome to Zeb OS 3 Pre-Alpha 0.0.5!\nEnjoy the next generation Aero Glass operating system." } } },
                        "Documents": { type: "dir", content: {} },
                        "Pictures": { type: "dir", content: {} },
                        "Downloads": { type: "dir", content: {} }
                    }
                }
            }
        }
    }
};

let zIndexCounter = 100;
let activeWindows = new Map();
let soundAudioCtx = null;

// VFS Helpers
export function getVFSFileContent(path) {
    return "Welcome to Zeb OS 3 Pre-Alpha 0.0.5!\nEnjoy the next generation Aero Glass operating system.";
}

export function saveFileToVFS(path, content) {
    return true;
}

export function getActiveWindowsList() {
    const list = [];
    activeWindows.forEach((win, winId) => {
        list.push({ id: winId, title: win.title, element: win.element });
    });
    return list;
}

// Sound Effects Synthesizer
export function playSystemSound(type = 'click') {
    try {
        if (!soundAudioCtx) {
            soundAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (soundAudioCtx.state === 'suspended') {
            soundAudioCtx.resume();
        }
        const osc = soundAudioCtx.createOscillator();
        const gain = soundAudioCtx.createGain();
        osc.connect(gain);
        gain.connect(soundAudioCtx.destination);

        const now = soundAudioCtx.currentTime;
        if (type === 'click') {
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'open') {
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        }
    } catch (e) {}
}

// Window Management
export function createWindow(title, iconName, winId, customW = 600, customH = 420) {
    playSystemSound('open');
    let existingWin = document.getElementById(winId);
    if (existingWin) {
        bringToFront(existingWin);
        return existingWin.querySelector('.window-body');
    }

    const frame = document.createElement('div');
    frame.id = winId;
    frame.className = 'window-frame active-window';
    const defaultW = customW;
    const defaultH = customH;
    const offset = (activeWindows.size % 8) * 20;
    const centerLeft = Math.max(10, Math.floor((window.innerWidth - defaultW) / 2) + offset);
    const centerTop = Math.max(10, Math.floor((window.innerHeight - 40 - defaultH) / 2) + offset);

    frame.style.width = `${defaultW}px`;
    frame.style.height = `${defaultH}px`;
    frame.style.left = `${centerLeft}px`;
    frame.style.top = `${centerTop}px`;
    frame.style.zIndex = ++zIndexCounter;

    frame.innerHTML = `
        <div class="window-header">
            <div class="window-title">
                ${getIcon(iconName)}
                <span>${title}</span>
            </div>
            <div class="window-controls">
                <button class="win-btn min-btn">${getIcon('winMin')}</button>
                <button class="win-btn max-btn">${getIcon('winMax')}</button>
                <button class="win-btn close-btn">${getIcon('winClose')}</button>
            </div>
        </div>
        <div class="window-body"></div>
    `;

    document.getElementById('window-workspace').appendChild(frame);

    const bodyEl = frame.querySelector('.window-body');
    const closeBtn = frame.querySelector('.close-btn');
    const minBtn = frame.querySelector('.min-btn');
    const maxBtn = frame.querySelector('.max-btn');
    const header = frame.querySelector('.window-header');

    // Dragging
    let isDragging = false;
    let offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.win-btn')) return;
        isDragging = true;
        offsetX = e.clientX - frame.offsetLeft;
        offsetY = e.clientY - frame.offsetTop;
        bringToFront(frame);
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        frame.style.left = `${Math.max(0, Math.min(window.innerWidth - frame.offsetWidth, e.clientX - offsetX))}px`;
        frame.style.top = `${Math.max(0, Math.min(window.innerHeight - frame.offsetHeight - 40, e.clientY - offsetY))}px`;
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    frame.addEventListener('mousedown', () => bringToFront(frame));

    closeBtn.addEventListener('click', () => closeWindow(winId));
    minBtn.addEventListener('click', () => { frame.style.display = 'none'; updateTaskbar(); });

    // Maximize toggle
    let isMax = false, prevBounds = null;
    maxBtn.addEventListener('click', () => {
        if (!isMax) {
            prevBounds = { left: frame.style.left, top: frame.style.top, width: frame.style.width, height: frame.style.height };
            frame.style.left = '0px';
            frame.style.top = '0px';
            frame.style.width = '100vw';
            frame.style.height = 'calc(100vh - 40px)';
            isMax = true;
        } else {
            frame.style.left = prevBounds.left;
            frame.style.top = prevBounds.top;
            frame.style.width = prevBounds.width;
            frame.style.height = prevBounds.height;
            isMax = false;
        }
    });

    activeWindows.set(winId, { title, iconName, element: frame });
    updateTaskbar();

    return bodyEl;
}

export function bringToFront(frame) {
    document.querySelectorAll('.window-frame').forEach(f => f.classList.remove('active-window'));
    frame.classList.add('active-window');
    frame.style.zIndex = ++zIndexCounter;
    frame.style.display = 'flex';
    updateTaskbar();
}

export function closeWindow(winId) {
    const win = activeWindows.get(winId);
    if (win) {
        win.element.remove();
        activeWindows.delete(winId);
        updateTaskbar();
    }
}

function updateTaskbar() {
    const tabsContainer = document.getElementById('taskbar-tabs-zone');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';
    activeWindows.forEach((win, winId) => {
        const isFocused = win.element.classList.contains('active-window') && win.element.style.display !== 'none';
        const tab = document.createElement('div');
        tab.className = `taskbar-tab ${isFocused ? 'active-tab' : ''}`;
        tab.innerHTML = `
            ${getIcon(win.iconName)}
            <span class="taskbar-tab-title">${win.title}</span>
        `;
        tab.addEventListener('click', () => {
            if (win.element.style.display === 'none' || !win.element.classList.contains('active-window')) {
                bringToFront(win.element);
            } else {
                win.element.style.display = 'none';
                updateTaskbar();
            }
        });
        tabsContainer.appendChild(tab);
    });
}

let currentContextMenuRemoveHandler = null;

export function closeContextMenu() {
    if (currentContextMenuRemoveHandler) {
        document.removeEventListener('pointerdown', currentContextMenuRemoveHandler, true);
        currentContextMenuRemoveHandler = null;
    }
    document.querySelectorAll('.retro-context-menu').forEach(m => m.remove());
}

// Context Menu System with Submenus
export function showContextMenu(x, y, items) {
    closeContextMenu();

    const menu = document.createElement('div');
    menu.className = 'retro-context-menu';
    menu.style.left = `${Math.min(window.innerWidth - 190, x)}px`;
    menu.style.top = `${Math.min(window.innerHeight - 240, y)}px`;

    items.forEach(item => {
        if (item.type === 'separator') {
            const sep = document.createElement('div');
            sep.className = 'context-menu-separator';
            menu.appendChild(sep);
        } else {
            const el = document.createElement('div');
            el.className = 'context-menu-item';
            
            if (item.submenu) {
                el.innerHTML = `<span>${item.label}</span>${getIcon('chevronRight', 'submenu-arrow')}`;
                let activeSubmenu = null;
                el.addEventListener('mouseenter', () => {
                    if (activeSubmenu) activeSubmenu.remove();
                    const rect = el.getBoundingClientRect();
                    activeSubmenu = createSubmenu(rect.right + 4, rect.top - 4, item.submenu);
                });
                el.addEventListener('mouseleave', (e) => {
                    if (activeSubmenu && !activeSubmenu.contains(e.relatedTarget)) {
                        setTimeout(() => {
                            if (activeSubmenu && !activeSubmenu.matches(':hover')) {
                                activeSubmenu.remove();
                                activeSubmenu = null;
                            }
                        }, 80);
                    }
                });
            } else {
                el.innerHTML = `<span>${item.label}</span>`;
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeContextMenu();
                    if (typeof item.action === 'function') item.action();
                });
            }
            menu.appendChild(el);
        }
    });

    document.body.appendChild(menu);

    currentContextMenuRemoveHandler = (e) => {
        if (!e.target.closest('.retro-context-menu')) {
            closeContextMenu();
        }
    };

    setTimeout(() => {
        if (currentContextMenuRemoveHandler) {
            document.addEventListener('pointerdown', currentContextMenuRemoveHandler, true);
        }
    }, 0);
}

function createSubmenu(x, y, items) {
    const sub = document.createElement('div');
    sub.className = 'retro-context-menu';
    sub.style.left = `${Math.min(window.innerWidth - 180, x)}px`;
    sub.style.top = `${Math.min(window.innerHeight - 180, y)}px`;

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'context-menu-item';
        el.innerHTML = `<span>${item.label}</span>`;
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            closeContextMenu();
            if (typeof item.action === 'function') item.action();
        });
        sub.appendChild(el);
    });

    document.body.appendChild(sub);
    return sub;
}

// OS Aero Dialog & Prompt Engine (Replaces native browser alert/confirm/prompt)
export function showSystemAlert(title, message, iconType = 'info') {
    return new Promise((resolve) => {
        closeSystemDialog();

        const overlay = document.createElement('div');
        overlay.id = 'system-dialog-overlay';

        const iconSvg = getIcon(iconType);

        overlay.innerHTML = `
            <div class="aero-dialog">
                <div class="aero-dialog-header">
                    ${getIcon('zLogo')}
                    <span>${title}</span>
                </div>
                <div class="aero-dialog-body">
                    <div class="aero-dialog-body-content">
                        ${iconSvg}
                        <div>${message.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
                <div class="aero-dialog-footer">
                    <button class="aero-btn aero-btn-primary dialog-ok-btn" autofocus>OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const okBtn = overlay.querySelector('.dialog-ok-btn');
        const handleClose = () => {
            overlay.remove();
            resolve();
        };

        okBtn.addEventListener('click', handleClose);
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'Escape') handleClose();
        });
    });
}

export function showSystemConfirm(title, message, options = { okText: 'OK', cancelText: 'Cancel', iconType: 'warning' }) {
    return new Promise((resolve) => {
        closeSystemDialog();

        const overlay = document.createElement('div');
        overlay.id = 'system-dialog-overlay';

        const iconSvg = getIcon(options.iconType || 'warning');

        overlay.innerHTML = `
            <div class="aero-dialog">
                <div class="aero-dialog-header">
                    ${getIcon('zLogo')}
                    <span>${title}</span>
                </div>
                <div class="aero-dialog-body">
                    <div class="aero-dialog-body-content">
                        ${iconSvg}
                        <div>${message.replace(/\n/g, '<br>')}</div>
                    </div>
                </div>
                <div class="aero-dialog-footer">
                    <button class="aero-btn aero-btn-primary dialog-ok-btn" autofocus>${options.okText || 'OK'}</button>
                    <button class="aero-btn dialog-cancel-btn">${options.cancelText || 'Cancel'}</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const okBtn = overlay.querySelector('.dialog-ok-btn');
        const cancelBtn = overlay.querySelector('.dialog-cancel-btn');

        const finish = (result) => {
            overlay.remove();
            resolve(result);
        };

        okBtn.addEventListener('click', () => finish(true));
        cancelBtn.addEventListener('click', () => finish(false));
        overlay.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finish(true);
            if (e.key === 'Escape') finish(false);
        });
    });
}

export function showSystemPrompt(title, message, defaultValue = '', iconType = 'info') {
    return new Promise((resolve) => {
        closeSystemDialog();

        const overlay = document.createElement('div');
        overlay.id = 'system-dialog-overlay';

        const iconSvg = getIcon(iconType);

        overlay.innerHTML = `
            <div class="aero-dialog">
                <div class="aero-dialog-header">
                    ${getIcon('zLogo')}
                    <span>${title}</span>
                </div>
                <div class="aero-dialog-body">
                    <div class="aero-dialog-body-content">
                        ${iconSvg}
                        <div style="flex-grow:1;">
                            <div style="margin-bottom:8px;">${message.replace(/\n/g, '<br>')}</div>
                            <input type="text" class="aero-input dialog-prompt-input" value="${defaultValue}" style="width:100%;">
                        </div>
                    </div>
                </div>
                <div class="aero-dialog-footer">
                    <button class="aero-btn aero-btn-primary dialog-ok-btn">OK</button>
                    <button class="aero-btn dialog-cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const inputEl = overlay.querySelector('.dialog-prompt-input');
        const okBtn = overlay.querySelector('.dialog-ok-btn');
        const cancelBtn = overlay.querySelector('.dialog-cancel-btn');

        setTimeout(() => {
            inputEl.focus();
            inputEl.select();
        }, 50);

        const submit = () => {
            const val = inputEl.value;
            overlay.remove();
            resolve(val);
        };

        const cancel = () => {
            overlay.remove();
            resolve(null);
        };

        okBtn.addEventListener('click', submit);
        cancelBtn.addEventListener('click', cancel);
        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') cancel();
        });
    });
}

function closeSystemDialog() {
    const existing = document.getElementById('system-dialog-overlay');
    if (existing) existing.remove();
}

// Icon View Sizing Helper
function setDesktopIconSize(size) {
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach(icon => {
        const svg = icon.querySelector('.sys-icon');
        if (size === 'large') {
            icon.style.width = '96px';
            if (svg) { svg.style.width = '56px'; svg.style.height = '56px'; }
        } else if (size === 'small') {
            icon.style.width = '64px';
            if (svg) { svg.style.width = '32px'; svg.style.height = '32px'; }
        } else {
            icon.style.width = '80px';
            if (svg) { svg.style.width = '44px'; svg.style.height = '44px'; }
        }
    });
}

// Icon Sorting Helper
function sortDesktopIcons(by) {
    const container = document.getElementById('desktop-icons-zone');
    if (!container) return;
    const icons = Array.from(container.querySelectorAll('.desktop-icon'));
    icons.sort((a, b) => {
        const nameA = a.querySelector('.desktop-icon-label')?.textContent.trim() || '';
        const nameB = b.querySelector('.desktop-icon-label')?.textContent.trim() || '';
        if (by === 'name') return nameA.localeCompare(nameB);
        return a.id.localeCompare(b.id);
    });
    icons.forEach(icon => container.appendChild(icon));
}

// Refresh Desktop Helper
function refreshDesktop() {
    playSystemSound('click');
    document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    const container = document.getElementById('desktop-icons-zone');
    if (container) {
        container.style.opacity = '0.5';
        setTimeout(() => { container.style.opacity = '1'; }, 100);
    }
}

// Live Clock
// Live Clock & Date Helper
function startClock() {
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    const update = () => {
        const now = new Date();
        if (clockEl) clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (dateEl) dateEl.textContent = now.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' });
    };
    update();
    setInterval(update, 1000);

    const peekBar = document.getElementById('show-desktop-bar');
    if (peekBar) {
        peekBar.addEventListener('click', () => {
            activeWindows.forEach(w => w.element.style.display = 'none');
            updateTaskbar();
        });
    }
}

// Start Menu Toggle
function setupStartMenu() {
    const startBtn = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');

    if (startBtn && startMenu) {
        startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playSystemSound('click');
            startMenu.classList.toggle('hidden-view');
        });

        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
                startMenu.classList.add('hidden-view');
            }
        });
    }
}

// Context Menu Event Listeners
function setupContextMenuListeners() {
    const desktop = document.getElementById('desktop-canvas');
    const taskbar = document.getElementById('system-taskbar');

    if (desktop) {
        desktop.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.window-frame') || e.target.closest('#start-menu')) return;
            e.preventDefault();
            showContextMenu(e.clientX, e.clientY, [
                {
                    label: 'View',
                    submenu: [
                        { label: 'Large Icons', action: () => setDesktopIconSize('large') },
                        { label: 'Medium Icons', action: () => setDesktopIconSize('medium') },
                        { label: 'Small Icons', action: () => setDesktopIconSize('small') }
                    ]
                },
                {
                    label: 'Sort By',
                    submenu: [
                        { label: 'Name', action: () => sortDesktopIcons('name') },
                        { label: 'Item Type', action: () => sortDesktopIcons('type') }
                    ]
                },
                { type: 'separator' },
                { label: 'Refresh', action: () => refreshDesktop() }
            ]);
        });
    }

    if (taskbar) {
        taskbar.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showContextMenu(e.clientX, e.clientY, [
                { label: 'Show Desktop', action: () => {
                    activeWindows.forEach(w => w.element.style.display = 'none');
                    updateTaskbar();
                }}
            ]);
        });
    }
}

// Desktop Marquee Drag Selection Box
function setupDesktopSelectionBox() {
    const desktop = document.getElementById('desktop-canvas');
    if (!desktop) return;

    let isDragging = false;
    let startX = 0, startY = 0;
    let marqueeBox = null;

    desktop.addEventListener('mousedown', (e) => {
        // Safety check: Never trigger drag box if click starts on window, start menu, taskbar, or context menu
        if (e.button !== 0 || e.target.closest('.window-frame') || e.target.closest('#start-menu') || e.target.closest('#system-taskbar') || e.target.closest('.retro-context-menu')) {
            return;
        }

        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        // Create selection box element
        marqueeBox = document.createElement('div');
        marqueeBox.className = 'desktop-selection-box';
        marqueeBox.style.left = `${startX}px`;
        marqueeBox.style.top = `${startY}px`;
        marqueeBox.style.width = '0px';
        marqueeBox.style.height = '0px';
        document.body.appendChild(marqueeBox);

        // Deselect desktop icons unless Ctrl/Shift key pressed
        if (!e.ctrlKey && !e.shiftKey) {
            document.querySelectorAll('.desktop-icon').forEach(icon => icon.classList.remove('selected'));
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !marqueeBox) return;

        const currentX = e.clientX;
        const currentY = e.clientY;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);

        marqueeBox.style.left = `${left}px`;
        marqueeBox.style.top = `${top}px`;
        marqueeBox.style.width = `${width}px`;
        marqueeBox.style.height = `${height}px`;

        // Intersect check with desktop icons
        const boxRect = marqueeBox.getBoundingClientRect();
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            const iconRect = icon.getBoundingClientRect();
            const isIntersecting = !(
                boxRect.right < iconRect.left ||
                boxRect.left > iconRect.right ||
                boxRect.bottom < iconRect.top ||
                boxRect.top > iconRect.bottom
            );

            if (isIntersecting) {
                icon.classList.add('selected');
            } else if (!e.ctrlKey && !e.shiftKey) {
                icon.classList.remove('selected');
            }
        });
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            if (marqueeBox) {
                marqueeBox.remove();
                marqueeBox = null;
            }
        }
    });
}

// BIOS + Boot Sequence Init
export function initZebOS3() {
    startClock();
    setupStartMenu();
    setupContextMenuListeners();
    setupDesktopSelectionBox();

    const biosScreen = document.getElementById('bios-screen');
    const bootScreen = document.getElementById('boot-screen');

    const biosLines = [
        "ZEB OS Modular BIOS v3.02 (C) 2026 Zeb Core Systems",
        "CPU: Zeb x86_64 Dual-Core Processor @ 3.40 GHz",
        "Memory Test: 8192 MB OK",
        "Detecting Storage Devices... Primary Disk Z:\\ (VFS Storage) [OK]",
        "Booting OS Kernel v0.0.5..."
    ];

    // Phase 1: BIOS Text Print
    let lineIdx = 0;
    const biosInterval = setInterval(() => {
        if (lineIdx < biosLines.length) {
            if (biosScreen) {
                const line = document.createElement('div');
                line.className = 'bios-line';
                line.textContent = biosLines[lineIdx];
                biosScreen.appendChild(line);
            }
            lineIdx++;
        } else {
            clearInterval(biosInterval);
            // Fade out BIOS screen after 1.4s
            setTimeout(() => {
                if (biosScreen) {
                    biosScreen.style.opacity = '0';
                    setTimeout(() => biosScreen.remove(), 400);
                }
                // Phase 2: Loading Splash Screen displays for 2.0s then fades out
                setTimeout(() => {
                    if (bootScreen) {
                        bootScreen.style.opacity = '0';
                        setTimeout(() => bootScreen.remove(), 600);
                    }
                }, 2000);
            }, 1400);
        }
    }, 200);
}

window.addEventListener('DOMContentLoaded', initZebOS3);
