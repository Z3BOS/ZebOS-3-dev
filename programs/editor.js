// Zeb OS 3 Text Editor App
import { getIcon } from '../icons.js';
import { BaseApp } from '../UIKit3/framework/index.js';
import { saveFileToVFS, getVFSFileContent } from '../os3.js';

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
                <!-- Toolbar -->
                <div style="background:linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%); border-bottom:1px solid rgba(255, 255, 255, 0.15); padding:6px 10px; display:flex; align-items:center; gap:8px;">
                    <button class="aero-btn save-btn">${getIcon('save')} Save</button>
                    <button class="aero-btn new-btn">New</button>
                    <div style="font-size:11px; color:#94a3b8; margin-left:auto;" class="editor-status">Lines: 1 | Chars: 0</div>
                </div>

                <!-- Textarea Area -->
                <textarea class="editor-textarea" style="flex-grow:1; width:100%; border:none; outline:none; padding:12px; background:#0f172a; color:#f8fafc; font-family:'Consolas', monospace; font-size:13px; line-height:1.6; resize:none; caret-color:#60a5fa;">${initialContent}</textarea>
            </div>
        `);

        const textarea = this.body.querySelector('.editor-textarea');
        const status = this.body.querySelector('.editor-status');
        const saveBtn = this.body.querySelector('.save-btn');
        const newBtn = this.body.querySelector('.new-btn');

        const updateStatus = () => {
            const text = textarea.value;
            const lines = text.split('\n').length;
            const chars = text.length;
            status.textContent = `Lines: ${lines} | Chars: ${chars}`;
        };

        textarea.addEventListener('input', updateStatus);
        updateStatus();

        saveBtn.addEventListener('click', () => {
            saveFileToVFS(this.filePath, textarea.value);
            alert(`File saved to ${this.filePath}!`);
        });

        newBtn.addEventListener('click', () => {
            textarea.value = '';
            updateStatus();
        });
    }
}
