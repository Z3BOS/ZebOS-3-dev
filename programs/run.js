// Zeb OS 3 "Run" dialog — ported from ZebOS 2's programs/run.js (RunDialog),
// reskinned to UIKit3's dark Aero Glass look.
//
// ZebOS 2's RunDialog called back into ZebOS 2's own switch-based
// launchApplication(appId) kernel function via an onExecute constructor
// callback. Zeb OS 3 has no such central launcher — apps are wired directly
// in index.html — so instead of calling a launcher function, recognized
// commands are announced with a 'zebos-run-launch' CustomEvent carrying a
// short app key, and index.html is expected to listen for it and dispatch to
// the real launch code.
import { getIcon } from '../icons.js';
import { BaseApp } from '../UIKit3/framework/index.js';
import { showSystemAlert, playSystemSound } from '../os3.js';

const HISTORY_KEY = 'ZEBOS3_RUN_HISTORY';
const HISTORY_MAX = 10;

// Maps a typed command to a short app key that the 'zebos-run-launch' event
// listener (wired up in index.html) understands. Lookups are case-insensitive
// and a trailing ".exe" is stripped. Mirrors ZebOS 2's COMMAND_MAP as closely
// as possible, just pointing at Zeb OS 3's short keys instead of ZebOS 2's
// "start-link-*" appIds.
const COMMAND_MAP = {
    'explorer':        'explorer',
    'files':           'explorer',
    'notepad':         'editor',
    'editor':          'editor',
    'write':           'editor',
    'cmd':             'terminal',
    'command':         'terminal',
    'terminal':        'terminal',
    'prompt':          'terminal',
    'mspaint':         'paint',
    'paint':           'paint',
    'winmine':         'mines',
    'mines':           'mines',
    'minesweeper':     'mines',
    'wmplayer':        'media',
    'media':           'media',
    'vm':              'vm',
    'zebvm':           'vm',
    'calc':            'calc',
    'calculator':      'calc',
    'snake':           'snake',
    'courgette':       'courgette',
    'winver':          'courgette',
    'about':           'courgette',
    'control':         'personalize',
    'desk.cpl':        'personalize',
    'personalize':     'personalize',
    'display':         'personalize',
    'taskmgr':         'taskmgr',
    'solitaire':       'solitaire',
    'sol':             'solitaire',
    'chess':           'chess',
    'regedit':         'regedit',
    'regedit32':       'regedit',
    'regedt32':        'regedit',
    'sysflags':        'sysflags',
    'flags':           'sysflags',
    'msconfig':        'sysflags',
    'reinstall':       'reinstall',
    'factoryreset':    'reinstall',
    'activitycenter':  'activitycenter',
    'activity':        'activitycenter',
    'ac':              'activitycenter',
    'run':             'run',
};

// Commands that accept a trailing argument as a target filename ("editor readme.txt").
const FILE_ARG_KEYS = new Set(['editor']);

export class RunApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
        this.history = this._loadHistory();
    }

    mount() {
        this.renderDialog();
        const input = this.body.querySelector('#run-input');
        if (input) {
            input.focus();
            input.select();
        }
    }

    _loadHistory() {
        try {
            const raw = localStorage.getItem(HISTORY_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed.filter(c => typeof c === 'string') : [];
        } catch (e) {
            return [];
        }
    }

    _saveHistory(command) {
        this.history = [command, ...this.history.filter(c => c !== command)].slice(0, HISTORY_MAX);
        try { localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history)); } catch (e) { /* ignore */ }
    }

    _esc(str) {
        return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Resolves raw typed text to { key, arg } or null when nothing matches.
    resolve(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return null;
        const spaceIdx = trimmed.indexOf(' ');
        const head = (spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx)).toLowerCase().replace(/\.exe$/, '');
        const arg = spaceIdx === -1 ? null : trimmed.slice(spaceIdx + 1).trim();
        const key = COMMAND_MAP[head];
        if (!key) return null;
        return { key, arg: (arg && FILE_ARG_KEYS.has(key)) ? arg : null };
    }

    renderDialog() {
        this.render(`
            <div class="run-app">
                <style>
                    .run-app {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        background: var(--bg-dark);
                        color: var(--text-main);
                        font-family: var(--main-font);
                        box-sizing: border-box;
                        padding: 16px 18px;
                        gap: 12px;
                        user-select: none;
                    }
                    .run-intro {
                        display: flex;
                        gap: 14px;
                        align-items: flex-start;
                    }
                    .run-intro-icon {
                        width: 38px;
                        height: 38px;
                        flex-shrink: 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .run-intro-icon svg { width: 34px; height: 34px; }
                    .run-intro-text {
                        line-height: 1.4;
                        font-size: 12.5px;
                        color: var(--text-muted);
                        padding-top: 2px;
                    }
                    .run-field-row {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .run-field-label {
                        flex-shrink: 0;
                        font-weight: 600;
                        width: 44px;
                        text-align: right;
                        font-size: 12.5px;
                        color: var(--text-main);
                    }
                    .run-field-row .aero-input { flex-grow: 1; }
                    .run-spacer { flex-grow: 1; }
                    .run-footer {
                        display: flex;
                        justify-content: flex-end;
                        gap: 8px;
                        border-top: 1px solid var(--aero-border);
                        padding-top: 12px;
                    }
                    .run-footer .aero-btn { min-width: 82px; }
                </style>

                <div class="run-intro">
                    <div class="run-intro-icon">${getIcon('run')}</div>
                    <div class="run-intro-text">Type the name of a program, and Zeb OS will open it for you.</div>
                </div>

                <div class="run-field-row">
                    <label for="run-input" class="run-field-label">Open:</label>
                    <input type="text" id="run-input" class="aero-input" list="run-history-list" autocomplete="off" spellcheck="false" value=""
                        placeholder="e.g. explorer, editor, terminal, calc, activitycenter">
                    <datalist id="run-history-list">
                        ${this.history.map(c => `<option value="${this._esc(c)}"></option>`).join('')}
                    </datalist>
                </div>

                <div class="run-spacer"></div>

                <div class="run-footer">
                    <button id="run-ok" class="aero-btn aero-btn-primary">OK</button>
                    <button id="run-cancel" class="aero-btn">Cancel</button>
                    <button id="run-browse" class="aero-btn">Browse...</button>
                </div>
            </div>
        `);
        this.bindEvents();
    }

    bindEvents() {
        const input = this.body.querySelector('#run-input');
        const okBtn = this.body.querySelector('#run-ok');
        const cancelBtn = this.body.querySelector('#run-cancel');
        const browseBtn = this.body.querySelector('#run-browse');

        const submit = () => {
            const raw = input.value;
            const resolved = this.resolve(raw);
            if (!resolved) {
                showSystemAlert('Run', `Cannot find '${raw.trim()}'. Make sure you typed the name correctly, and then try again.`, 'error')
                    .then(() => {
                        input.focus();
                        input.select();
                    });
                return;
            }
            this._saveHistory(raw.trim());
            playSystemSound('open');
            window.dispatchEvent(new CustomEvent('zebos-run-launch', { detail: { app: resolved.key, arg: resolved.arg } }));
            this.close();
        };

        this.listen(okBtn, 'click', submit);
        this.listen(cancelBtn, 'click', () => this.close());
        this.listen(browseBtn, 'click', () => {
            showSystemAlert('Run', 'Browse is not available in this build of Zeb OS 3.', 'info');
        });
        this.listen(input, 'keydown', (e) => {
            if (e.key === 'Enter') submit();
            if (e.key === 'Escape') this.close();
        });
    }
}
