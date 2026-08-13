// Zeb OS 3 File Explorer App — VFS Browser (Aero Glass)
import { BaseApp, escapeHtml } from '../UIKit3/framework/index.js';
import { getIcon } from '../icons.js';
import {
    getVfsNodeByPath,
    getActiveFolderContext,
    createVfsFolder,
    deleteVfsEntry,
    createWindow,
    closeWindow,
    registerWindowCleanup,
    playSystemSound,
    showContextMenu,
    showSystemAlert,
    showSystemConfirm,
    showSystemPrompt
} from '../os3.js';
import { EditorApp } from './editor.js';
import { ViewerApp } from './viewer.js';

const CODE_EXTS = new Set(['js', 'ts', 'json', 'css', 'html', 'htm', 'xml', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'php', 'sh', 'bat', 'ps1', 'yaml', 'yml']);
const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico']);

function getExtension(name) {
    const idx = name.lastIndexOf('.');
    return idx > 0 ? name.slice(idx + 1).toLowerCase() : '';
}

function getFolderIconName(name) {
    const lower = name.toLowerCase();
    if (lower === 'documents') return 'docFolder';
    if (lower === 'pictures') return 'picFolder';
    return 'folder';
}

function getFileIconName(name) {
    return CODE_EXTS.has(getExtension(name)) ? 'fileCode' : 'fileText';
}

function getItemTypeLabel(name, item) {
    if (item.type === 'dir') return 'File Folder';
    const ext = getExtension(name);
    return ext ? `${ext.toUpperCase()} File` : 'File';
}

function formatSize(item) {
    if (item.type === 'dir') return '';
    const bytes = new Blob([item.content || '']).size;
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

// Self-injects UIKit3/apps/explorer.css since there is no central per-app CSS
// loader wired into index.html/index.css yet — safe, idempotent, and keeps
// this file the sole owner of its own styling.
function injectExplorerStyles() {
    if (document.getElementById('explorer-app-styles')) return;
    const link = document.createElement('link');
    link.id = 'explorer-app-styles';
    link.rel = 'stylesheet';
    link.href = new URL('../UIKit3/apps/explorer.css', import.meta.url).href;
    document.head.appendChild(link);
}

export class ExplorerApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
        this.currentPath = '';
        this.history = [''];
        this.historyIndex = 0;
        this.viewMode = 'grid';
        this.selectedItem = null;
        this.username = 'Guest';
    }

    mount() {
        injectExplorerStyles();
        this.username = this.detectUsername();

        this.render(`
            <div class="explorer-app">
                <div class="explorer-toolbar">
                    <button class="aero-btn" id="exp-back" title="Back">${getIcon('back')}</button>
                    <button class="aero-btn" id="exp-up" title="Up One Level">${getIcon('up')}</button>
                    <button class="aero-btn" id="exp-home" title="Home">${getIcon('home')}</button>
                    <div class="explorer-toolbar-sep"></div>
                    <button class="aero-btn" id="exp-newfolder" title="New Folder">${getIcon('newFolder')} New Folder</button>
                    <button class="aero-btn aero-btn-danger" id="exp-delete" title="Delete Selected">${getIcon('delete')} Delete</button>
                    <button class="aero-btn" id="exp-refresh" title="Refresh">${getIcon('refresh')}</button>
                    <div class="aero-tab-bar" id="exp-view-tabs" style="margin-left:auto;">
                        <button class="aero-tab active" data-view="grid">Icons</button>
                        <button class="aero-tab" data-view="details">Details</button>
                    </div>
                </div>
                <div class="explorer-addressbar">
                    <span class="explorer-address-icon" id="exp-address-icon">${getIcon('drive')}</span>
                    <input type="text" class="aero-input" id="exp-address-input" style="flex-grow:1;" value="Z:\\">
                </div>
                <div class="explorer-body">
                    <div class="explorer-sidebar" id="exp-sidebar"></div>
                    <div class="explorer-main" id="exp-main"></div>
                </div>
                <div class="aero-status-bar">
                    <span class="aero-status-item" id="exp-status-count">0 object(s)</span>
                    <span class="aero-status-item" id="exp-status-path" style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">Z:\\</span>
                </div>
            </div>
        `);

        this.bindStaticEvents();
        this.refreshView();
    }

    detectUsername() {
        const usersNode = getVfsNodeByPath('Users');
        if (usersNode && typeof usersNode === 'object') {
            const keys = Object.keys(usersNode);
            if (keys.length) return keys[0];
        }
        return 'Guest';
    }

    bindStaticEvents() {
        const backBtn = this.body.querySelector('#exp-back');
        const upBtn = this.body.querySelector('#exp-up');
        const homeBtn = this.body.querySelector('#exp-home');
        const newFolderBtn = this.body.querySelector('#exp-newfolder');
        const deleteBtn = this.body.querySelector('#exp-delete');
        const refreshBtn = this.body.querySelector('#exp-refresh');
        const addressInput = this.body.querySelector('#exp-address-input');
        const sidebarEl = this.body.querySelector('#exp-sidebar');
        const mainEl = this.body.querySelector('#exp-main');

        this.listen(backBtn, 'click', () => this.goBack());
        this.listen(upBtn, 'click', () => this.goUp());
        this.listen(homeBtn, 'click', () => this.goHome());
        this.listen(newFolderBtn, 'click', () => this.handleNewFolder());
        this.listen(deleteBtn, 'click', () => this.handleDelete());
        this.listen(refreshBtn, 'click', () => { playSystemSound('click'); this.refreshView(); });

        this.listen(addressInput, 'keydown', (e) => {
            if (e.key === 'Enter') {
                const clean = addressInput.value.trim().replace(/^Z:\\?/i, '').replace(/\\/g, '/');
                this.navigateTo(clean);
            }
        });

        this.body.querySelectorAll('#exp-view-tabs .aero-tab').forEach(tab => {
            this.listen(tab, 'click', () => {
                this.body.querySelectorAll('#exp-view-tabs .aero-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.viewMode = tab.dataset.view;
                this.refreshView();
            });
        });

        this.listen(sidebarEl, 'click', (e) => {
            const el = e.target.closest('[data-loc-path]');
            if (el) this.navigateTo(el.dataset.locPath);
        });

        this.listen(mainEl, 'click', (e) => {
            const itemEl = e.target.closest('[data-item-name]');
            this.selectedItem = itemEl ? itemEl.dataset.itemName : null;
            this.refreshView();
        });

        this.listen(mainEl, 'dblclick', (e) => {
            const itemEl = e.target.closest('[data-item-name]');
            if (itemEl) {
                playSystemSound('open');
                this.openItem(itemEl.dataset.itemName);
            }
        });

        this.listen(mainEl, 'contextmenu', (e) => {
            e.preventDefault();
            const itemEl = e.target.closest('[data-item-name]');
            if (itemEl) {
                this.selectedItem = itemEl.dataset.itemName;
                this.refreshView();
                showContextMenu(e.clientX, e.clientY, [
                    { label: 'Open', action: () => this.openItem(itemEl.dataset.itemName) },
                    { type: 'separator' },
                    { label: 'Delete', action: () => this.handleDelete() }
                ]);
            } else {
                showContextMenu(e.clientX, e.clientY, [
                    { label: 'New Folder', action: () => this.handleNewFolder() },
                    { label: 'Refresh', action: () => { playSystemSound('click'); this.refreshView(); } }
                ]);
            }
        });
    }

    // ---- Navigation ----

    navigateTo(path) {
        this.currentPath = path;
        if (this.history[this.historyIndex] !== path) {
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(path);
            this.historyIndex = this.history.length - 1;
        }
        this.selectedItem = null;
        this.refreshView();
    }

    goBack() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.currentPath = this.history[this.historyIndex];
            this.selectedItem = null;
            this.refreshView();
        }
    }

    goUp() {
        if (!this.currentPath) return;
        const parts = this.currentPath.split('/').filter(Boolean);
        parts.pop();
        this.navigateTo(parts.join('/'));
    }

    goHome() {
        this.navigateTo('');
    }

    // ---- File/Folder actions ----

    async handleNewFolder() {
        const name = await showSystemPrompt('New Folder', 'Enter a name for the new folder:', 'New Folder', 'newFolder');
        const trimmed = name ? name.trim() : '';
        if (!trimmed) return;
        const finalName = createVfsFolder(this.currentPath, trimmed);
        if (finalName) {
            playSystemSound('click');
            this.refreshView();
        } else {
            await showSystemAlert('New Folder', 'Unable to create a folder at this location.', 'error');
        }
    }

    async handleDelete() {
        if (!this.selectedItem) return;
        const name = this.selectedItem;
        const confirmed = await showSystemConfirm(
            'Confirm Delete',
            `Are you sure you want to permanently delete '${name}'?`,
            { okText: 'Delete', cancelText: 'Cancel', iconType: 'warning' }
        );
        if (confirmed) {
            deleteVfsEntry(this.currentPath, name);
            this.selectedItem = null;
            playSystemSound('click');
            this.refreshView();
        }
    }

    openItem(name) {
        const dirNode = getActiveFolderContext(this.currentPath);
        const item = dirNode && dirNode[name];
        if (!item) return;

        if (item.type === 'dir') {
            this.navigateTo(this.currentPath ? `${this.currentPath}/${name}` : name);
            return;
        }

        const filePath = this.currentPath ? `${this.currentPath}/${name}` : name;
        if (IMAGE_EXTS.has(getExtension(name))) {
            this.launchExternalApp('viewer', ViewerApp, filePath, name);
        } else {
            this.launchExternalApp('editor', EditorApp, filePath, name);
        }
    }

    launchExternalApp(kind, AppClass, filePath, fileName) {
        const safeId = filePath.replace(/[^a-zA-Z0-9]/g, '_');
        const winId = `app-${kind}-${safeId}`;
        const iconName = kind === 'viewer' ? 'viewer' : 'editor';
        const w = kind === 'viewer' ? 640 : 620;
        const h = kind === 'viewer' ? 480 : 440;

        const winBody = createWindow(fileName, iconName, winId, w, h);
        if (winBody) {
            const instance = new AppClass(() => closeWindow(winId), filePath);
            registerWindowCleanup(winId, () => {
                if (typeof instance.cleanup === 'function') instance.cleanup();
            });
            instance.open(winBody);
        }
    }

    // ---- Rendering ----

    refreshView() {
        this.renderSidebar();
        this.renderMain();
        this.updateToolbarState();
    }

    renderSidebar() {
        const sidebar = this.body.querySelector('#exp-sidebar');
        if (!sidebar) return;

        const locations = [
            { label: 'This PC (Z:)', path: '', icon: 'drive' },
            { label: 'Desktop', path: `Users/${this.username}/Desktop`, icon: 'folder' },
            { label: 'Documents', path: `Users/${this.username}/Documents`, icon: 'docFolder' },
            { label: 'Pictures', path: `Users/${this.username}/Pictures`, icon: 'picFolder' },
            { label: 'Downloads', path: `Users/${this.username}/Downloads`, icon: 'folder' }
        ];

        sidebar.innerHTML = `
            <div class="explorer-sidebar-title">Quick Access</div>
            ${locations.map(loc => `
                <div class="explorer-sidebar-item ${this.currentPath === loc.path ? 'active' : ''}" data-loc-path="${escapeHtml(loc.path)}">
                    <span class="explorer-item-icon">${getIcon(loc.icon)}</span>
                    <span>${escapeHtml(loc.label)}</span>
                </div>
            `).join('')}
        `;
    }

    renderMain() {
        const mainEl = this.body.querySelector('#exp-main');
        if (!mainEl) return;

        const dirNode = getActiveFolderContext(this.currentPath) || {};
        const names = Object.keys(dirNode).sort((a, b) => {
            const ai = dirNode[a], bi = dirNode[b];
            if (ai.type !== bi.type) return ai.type === 'dir' ? -1 : 1;
            return a.localeCompare(b);
        });

        if (names.length === 0) {
            mainEl.innerHTML = `<div class="explorer-empty">This folder is empty.</div>`;
        } else if (this.viewMode === 'details') {
            mainEl.innerHTML = `
                <table class="aero-table">
                    <thead><tr><th>Name</th><th>Type</th><th>Size</th></tr></thead>
                    <tbody>${names.map(name => this.renderDetailsRow(name, dirNode[name])).join('')}</tbody>
                </table>
            `;
        } else {
            mainEl.innerHTML = `<div class="explorer-grid">${names.map(name => this.renderGridItem(name, dirNode[name])).join('')}</div>`;
        }

        const addressInput = this.body.querySelector('#exp-address-input');
        const addressIcon = this.body.querySelector('#exp-address-icon');
        const pathDisplay = this.currentPath ? `Z:\\${this.currentPath.replace(/\//g, '\\')}` : 'Z:\\';
        if (addressInput) addressInput.value = pathDisplay;
        if (addressIcon) addressIcon.innerHTML = getIcon(this.currentPath ? 'folder' : 'drive');

        const statusCount = this.body.querySelector('#exp-status-count');
        const statusPath = this.body.querySelector('#exp-status-path');
        if (statusCount) statusCount.textContent = `${names.length} object(s)`;
        if (statusPath) statusPath.textContent = pathDisplay;
    }

    renderGridItem(name, item) {
        const isDir = item.type === 'dir';
        const iconName = isDir ? getFolderIconName(name) : getFileIconName(name);
        const selected = this.selectedItem === name ? 'selected' : '';
        return `
            <div class="explorer-grid-item ${selected}" data-item-name="${escapeHtml(name)}" data-item-type="${item.type}">
                <span class="explorer-item-icon">${getIcon(iconName)}</span>
                <span class="explorer-item-label">${escapeHtml(name)}</span>
            </div>
        `;
    }

    renderDetailsRow(name, item) {
        const isDir = item.type === 'dir';
        const iconName = isDir ? getFolderIconName(name) : getFileIconName(name);
        const selected = this.selectedItem === name ? 'selected' : '';
        return `
            <tr class="${selected}" data-item-name="${escapeHtml(name)}" data-item-type="${item.type}">
                <td>
                    <span class="explorer-name-cell">
                        <span class="explorer-item-icon">${getIcon(iconName)}</span>
                        <span>${escapeHtml(name)}</span>
                    </span>
                </td>
                <td>${getItemTypeLabel(name, item)}</td>
                <td>${formatSize(item)}</td>
            </tr>
        `;
    }

    updateToolbarState() {
        const deleteBtn = this.body.querySelector('#exp-delete');
        const upBtn = this.body.querySelector('#exp-up');
        const backBtn = this.body.querySelector('#exp-back');
        if (deleteBtn) deleteBtn.disabled = !this.selectedItem;
        if (upBtn) upBtn.disabled = !this.currentPath;
        if (backBtn) backBtn.disabled = this.historyIndex <= 0;
    }
}
