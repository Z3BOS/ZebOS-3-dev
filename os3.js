// Zeb OS 3 Pre-Alpha 0.0.1 Core Kernel & Window Manager
import { getIcon } from './icons.js';

let systemState = {
    version: "3.0.1 Pre-Alpha 0.0.1",
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
                        "Desktop": { type: "dir", content: { "welcome.txt": { type: "file", content: "Welcome to Zeb OS 3 Pre-Alpha 0.0.1!\nEnjoy the next generation Aero Glass operating system." } } },
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
export function createWindow(title, iconName, winId) {
    playSystemSound('open');
    let existingWin = document.getElementById(winId);
    if (existingWin) {
        bringToFront(existingWin);
        return existingWin.querySelector('.window-body');
    }

    const frame = document.createElement('div');
    frame.id = winId;
    frame.className = 'window-frame active-window';
    frame.style.width = '640px';
    frame.style.height = '440px';
    frame.style.left = `${Math.min(window.innerWidth - 660, 120 + activeWindows.size * 24)}px`;
    frame.style.top = `${Math.min(window.innerHeight - 480, 60 + activeWindows.size * 24)}px`;
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

// Live Clock
function startClock() {
    const clockEl = document.getElementById('live-clock');
    const update = () => {
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };
    update();
    setInterval(update, 1000);
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

// Boot Screen Init
export function initZebOS3() {
    startClock();
    setupStartMenu();

    const bootScreen = document.getElementById('boot-screen');
    const logConsole = document.getElementById('boot-log-console');

    const bootLogs = [
        "ZEB OS 3 PRE-ALPHA [Kernel v0.0.1.build8f31]",
        "Initializing Aero Glass Compositor Engine...",
        "Loading Aero Glass Shell Controllers...",
        "Mounting VFS Persistent Storage Device...",
        "Ready. Welcome to Zeb OS 3!"
    ];

    let logIdx = 0;
    const interval = setInterval(() => {
        if (logIdx < bootLogs.length) {
            if (logConsole) {
                const line = document.createElement('div');
                line.textContent = `> ${bootLogs[logIdx]}`;
                logConsole.appendChild(line);
            }
            logIdx++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                if (bootScreen) {
                    bootScreen.style.opacity = '0';
                    setTimeout(() => bootScreen.remove(), 800);
                }
            }, 2500);
        }
    }, 400);
}

window.addEventListener('DOMContentLoaded', initZebOS3);
