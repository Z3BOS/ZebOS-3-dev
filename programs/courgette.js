// Zeb OS 3 "Courgette" System Info panel — a small Neofetch-style about box.
// Ported from ZebOS 2's programs/courgette.js (CourgetteInfo), reskinned to
// UIKit3's dark Aero Glass look.
import { BaseApp } from '../UIKit3/framework/index.js';
import { getRegistrySnapshot, getVfsNodeByPath } from '../os3.js';

const ASCII_COURGETTE = `
       .::::.
     .::::::::.
    :::'    '::.
    ::        ::
    ::.      .::
     ':::::::::'
        '::::'
`;

// Walks the live VFS tree (from os3.js) and counts real files/folders so the
// "Files" stat reflects the actual disk image instead of a fabricated number.
function countVfsEntries(node) {
    let files = 0;
    let dirs = 0;
    if (!node || typeof node !== 'object') return [files, dirs];
    for (const key in node) {
        const entry = node[key];
        if (!entry || typeof entry !== 'object') continue;
        if (entry.type === 'dir') {
            dirs++;
            const [f, d] = countVfsEntries(entry.content);
            files += f;
            dirs += d;
        } else if (entry.type === 'file') {
            files++;
        }
    }
    return [files, dirs];
}

export class CourgetteApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
        this.statsEl = null;
        this.stats = [];
        this.tickHandle = null;
        // Real session uptime, measured from page navigation start rather
        // than faked — Zeb OS 3 has no kernel-exposed uptime counter, but
        // performance.now() gives us the genuine number for this session.
        this.startedAtMs = Date.now() - performance.now();
        this.boundKeyDown = (e) => this.handleKeyDown(e);
    }

    formatUptime(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }

    getUptimeSeconds() {
        return Math.floor((Date.now() - this.startedAtMs) / 1000);
    }

    mount() {
        const reg = getRegistrySnapshot();
        const vfsRoot = getVfsNodeByPath(null) || {};
        const [fileCount, dirCount] = countVfsEntries(vfsRoot);
        const diskBytes = JSON.stringify(vfsRoot).length;

        this.stats = [
            ['OS', `Zeb OS 3 (${reg.version || '3.0.1 Pre-Alpha 0.0.5'})`],
            ['Codename', `"Aurora Glass"`],
            ['Kernel', `Zeb Kernel v${reg.version || '3.0.1 Pre-Alpha 0.0.5'}`],
            ['User', reg.currentUser || 'Guest'],
            ['Uptime', this.formatUptime(this.getUptimeSeconds())],
            ['Resolution', `${window.innerWidth}x${window.innerHeight}`],
            ['Files', `${fileCount} file(s), ${dirCount} folder(s)`],
            ['Disk', `${this.formatBytes(diskBytes)} (ZEBOS3_DISK)`],
            ['Agent', navigator.userAgent.split(') ').pop().split(' ')[0] || navigator.userAgent]
        ];

        this.render(`
            <div class="courgette-app">
                <style>
                    .courgette-app {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        background: var(--bg-dark);
                        color: var(--text-main);
                        font-family: var(--code-font);
                        box-sizing: border-box;
                    }
                    .courgette-body {
                        flex-grow: 1;
                        display: flex;
                        gap: 22px;
                        padding: 20px;
                        overflow: auto;
                        align-items: flex-start;
                    }
                    .courgette-art {
                        margin: 0;
                        color: var(--accent-cyan);
                        font-size: 0.95em;
                        line-height: 1.15;
                        flex-shrink: 0;
                        text-shadow: 0 0 12px rgba(96, 165, 250, 0.35);
                    }
                    .courgette-stats {
                        font-size: 0.95em;
                        line-height: 1.9;
                        white-space: nowrap;
                    }
                    .courgette-stats .stat-label {
                        color: var(--accent-cyan);
                        font-weight: 700;
                    }
                </style>
                <div class="courgette-body">
                    <pre class="courgette-art">${ASCII_COURGETTE}</pre>
                    <div class="courgette-stats"></div>
                </div>
                <div class="aero-status-bar">
                    <span class="aero-status-item">Esc: Exit</span>
                </div>
            </div>
        `);

        this.statsEl = this.body.querySelector('.courgette-stats');
        this.renderStats();

        this.listen(window, 'keydown', this.boundKeyDown);

        this.tickHandle = setInterval(() => {
            const uptimeRow = this.stats.find(row => row[0] === 'Uptime');
            if (uptimeRow) uptimeRow[1] = this.formatUptime(this.getUptimeSeconds());
            this.renderStats();
        }, 1000);
    }

    renderStats() {
        if (!this.statsEl) return;
        this.statsEl.innerHTML = this.stats
            .map(([label, value]) => `<span class="stat-label">${label}:</span> ${value}`)
            .join('<br>');
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
        }
    }

    onCleanup() {
        if (this.tickHandle) clearInterval(this.tickHandle);
    }
}
