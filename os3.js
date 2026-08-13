// Zeb OS 3 Pre-Alpha 0.0.3 Core Kernel & Window Manager
import { getIcon } from './icons.js';

let systemState = {
    version: "3.0.1 Pre-Alpha 0.0.3",
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
                        "Desktop": { type: "dir", content: { "welcome.txt": { type: "file", content: "Welcome to Zeb OS 3 Pre-Alpha 0.0.3!\nEnjoy the next generation Aero Glass operating system." } } },
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
    return "Welcome to Zeb OS 3 Pre-Alpha 0.0.3!\nEnjoy the next generation Aero Glass operating system.";
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
                el.innerHTML = `<span>${item.label}</span><span class="submenu-arrow">►</span>`;
                let activeSubmenu = null;
                el.addEventListener('mouseenter', () => {
                    if (activeSubmenu) activeSubmenu.remove();
                    const rect = el.getBoundingClientRect();
                    activeSubmenu = createSubmenu(rect.right - 4, rect.top, item.submenu);
                });
                el.addEventListener('mouseleave', (e) => {
                    if (activeSubmenu && !activeSubmenu.contains(e.relatedTarget)) {
                        setTimeout(() => {
                            if (activeSubmenu && !activeSubmenu.matches(':hover')) {
                                activeSubmenu.remove();
                                activeSubmenu = null;
                            }
                        }, 100);
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

    const removeHandler = (e) => {
        if (!e.target.closest('.retro-context-menu')) {
            closeContextMenu();
            document.removeEventListener('click', removeHandler);
            document.removeEventListener('contextmenu', removeHandler);
        }
    };

    setTimeout(() => {
        document.addEventListener('click', removeHandler);
        document.addEventListener('contextmenu', removeHandler);
    }, 50);
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

export function closeContextMenu() {
    document.querySelectorAll('.retro-context-menu').forEach(m => m.remove());
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

// BIOS + Boot Sequence Init
export function initZebOS3() {
    startClock();
    setupStartMenu();
    setupContextMenuListeners();

    const biosScreen = document.getElementById('bios-screen');
    const bootScreen = document.getElementById('boot-screen');

    const biosLines = [
        "ZEB OS Modular BIOS v3.02 (C) 2026 Zeb Core Systems",
        "CPU: Zeb x86_64 Dual-Core Processor @ 3.40 GHz",
        "Memory Test: 8192 MB OK",
        "Detecting Storage Devices... Primary Disk Z:\\ (VFS Storage) [OK]",
        "Booting OS Kernel v0.0.3..."
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
