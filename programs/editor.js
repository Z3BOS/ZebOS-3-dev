// Zeb OS 3 Text Editor App with Title Options Menu Bar
import { BaseApp } from '../UIKit3/framework/index.js';
import { saveFileToVFS, getVFSFileContent, showContextMenu } from '../os3.js';

export class EditorApp extends BaseApp {
    constructor(onCloseRequest, filePath = 'Users/Guest/Documents/untitled.txt') {
        super(onCloseRequest);
        this.filePath = filePath;
        this.currentContent = '';
    }

    mount() {
        const initialContent = getVFSFileContent(this.filePath) || '';
        this.currentContent = initialContent;

        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:#0f172a; color:#ffffff; font-family:'Segoe UI', sans-serif;">
                <!-- Title Options Menu Bar -->
                <div class="aero-menu-bar">
                    <div class="aero-menu-item" id="editor-menu-file"><u>F</u>ile</div>
                    <div class="aero-menu-item" id="editor-menu-edit"><u>E</u>dit</div>
                    <div class="aero-menu-item" id="editor-menu-search"><u>S</u>earch</div>
                    <div class="aero-menu-item" id="editor-menu-help"><u>H</u>elp</div>
                </div>

                <!-- Textarea Workspace -->
                <textarea class="editor-textarea" style="flex-grow:1; width:100%; border:none; outline:none; padding:12px; background:#0f172a; color:#f8fafc; font-family:'Consolas', monospace; font-size:13px; line-height:1.6; resize:none; caret-color:#60a5fa;" placeholder="Type your text here...">${initialContent}</textarea>

                <!-- Bottom Status Bar -->
                <div style="background:rgba(2, 6, 23, 0.9); border-top:1px solid rgba(255, 255, 255, 0.12); padding:4px 12px; font-size:11px; color:#94a3b8; display:flex; justify-content:space-between; align-items:center;" class="editor-status-bar">
                    <span class="editor-status">Lines: 1 | Chars: 0</span>
                    <span style="color:#64748b;">UTF-8</span>
                </div>
            </div>
        `);

        const textarea = this.body.querySelector('.editor-textarea');
        const status = this.body.querySelector('.editor-status');

        const updateStatus = () => {
            const text = textarea.value;
            const lines = text.split('\n').length;
            const chars = text.length;
            status.textContent = `Lines: ${lines} | Chars: ${chars}`;
        };

        textarea.addEventListener('input', updateStatus);
        updateStatus();

        const handleSave = () => {
            saveFileToVFS(this.filePath, textarea.value);
            alert(`File saved to ${this.filePath}!`);
        };

        const handleSaveAs = () => {
            const newPath = prompt('Save As (path):', this.filePath);
            if (newPath) {
                this.filePath = newPath;
                saveFileToVFS(this.filePath, textarea.value);
                alert(`File saved to ${this.filePath}!`);
            }
        };

        const handleNew = () => {
            textarea.value = '';
            updateStatus();
        };

        // Title Options Menu Handlers
        const fileMenu = this.body.querySelector('#editor-menu-file');
        const editMenu = this.body.querySelector('#editor-menu-edit');
        const searchMenu = this.body.querySelector('#editor-menu-search');
        const helpMenu = this.body.querySelector('#editor-menu-help');

        fileMenu.addEventListener('click', (e) => {
            const rect = fileMenu.getBoundingClientRect();
            showContextMenu(rect.left, rect.bottom, [
                { label: 'New', action: handleNew },
                { label: 'Save', action: handleSave },
                { label: 'Save As...', action: handleSaveAs },
                { type: 'separator' },
                { label: 'Exit', action: () => { if (typeof this.onCloseRequest === 'function') this.onCloseRequest(); } }
            ]);
        });

        editMenu.addEventListener('click', (e) => {
            const rect = editMenu.getBoundingClientRect();
            showContextMenu(rect.left, rect.bottom, [
                { label: 'Select All', action: () => { textarea.focus(); textarea.select(); } },
                { label: 'Clear All', action: handleNew }
            ]);
        });

        searchMenu.addEventListener('click', (e) => {
            const rect = searchMenu.getBoundingClientRect();
            showContextMenu(rect.left, rect.bottom, [
                { label: 'Find...', action: () => {
                    const query = prompt('Find text:');
                    if (query && textarea.value.includes(query)) {
                        const idx = textarea.value.indexOf(query);
                        textarea.focus();
                        textarea.setSelectionRange(idx, idx + query.length);
                    } else if (query) {
                        alert(`'${query}' not found.`);
                    }
                }},
                { label: 'Replace...', action: () => {
                    const query = prompt('Find target text:');
                    if (query) {
                        const replaceWith = prompt(`Replace '${query}' with:`);
                        if (replaceWith !== null) {
                            textarea.value = textarea.value.replaceAll(query, replaceWith);
                            updateStatus();
                        }
                    }
                }}
            ]);
        });

        helpMenu.addEventListener('click', (e) => {
            const rect = helpMenu.getBoundingClientRect();
            showContextMenu(rect.left, rect.bottom, [
                { label: 'About Text Editor', action: () => alert('Zeb OS 3 Text Editor v0.0.5\nAero Glass Document Manager.') }
            ]);
        });
    }
}
