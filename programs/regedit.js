// Zeb OS 3 Registry Editor App
// Ported from ZebOS 2's programs/regedit.js, deliberately simplified to match
// ZebOS 3's flat registry-lite API. ZebOS 2's regedit rendered a real
// HKEY_CURRENT_USER / HKEY_LOCAL_MACHINE tree with hives, nested keys, and
// typed values (REG_SZ / REG_DWORD) editable via bespoke modal dialogs. That
// deep tree doesn't exist here — os3.js's getRegistrySnapshot() returns one
// flat object. So this app presents that object as a single flat aero-table
// (Key / Value / Edit) instead of a tree-pane browser, and edits go through
// the OS's own showSystemPrompt() + setRegistryValue() rather than a custom
// dword/string modal.
import { BaseApp } from '../UIKit3/framework/index.js';
import { getRegistrySnapshot, setRegistryValue, showSystemPrompt, showSystemAlert } from '../os3.js';

// Field metadata: which snapshot keys are shown, in what order, and how to
// parse/display them. 'bool' fields round-trip through true/false text;
// everything else is treated as a plain string.
const FIELDS = [
    { key: 'version', label: 'Version', type: 'string', readonly: true },
    { key: 'currentUser', label: 'CurrentUser', type: 'string', readonly: true },
    { key: 'savedUsername', label: 'SavedUsername', type: 'string' },
    { key: 'hasLoggedInBefore', label: 'HasLoggedInBefore', type: 'bool' },
    { key: 'alwaysShowSetup', label: 'AlwaysShowSetup', type: 'bool' },
    { key: 'desktopBackground', label: 'DesktopBackground', type: 'string' },
    { key: 'desktopPattern', label: 'DesktopPattern', type: 'string' },
    { key: 'soundScheme', label: 'SoundScheme', type: 'string' },
    { key: 'roundedCorners', label: 'RoundedCorners', type: 'bool' },
];

export class RegeditApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
        this.snapshot = getRegistrySnapshot();
    }

    mount() {
        this.renderUI();
    }

    _escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    _displayValue(field) {
        const raw = this.snapshot[field.key];
        if (field.type === 'bool') return raw ? 'true' : 'false';
        return raw === null || raw === undefined || raw === '' ? '(not set)' : String(raw);
    }

    renderUI() {
        this.render(`
            <style>
                .regedit-app {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    box-sizing: border-box;
                    font-family: var(--main-font, 'Segoe UI', sans-serif);
                    color: var(--text-main, #fff);
                }
                .regedit-toolbar {
                    padding: 8px 12px;
                    font-size: 11px;
                    color: var(--text-muted, #94a3b8);
                    border-bottom: 1px solid var(--aero-border, rgba(255,255,255,0.2));
                    flex-shrink: 0;
                }
                .regedit-table-wrap {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 10px 12px;
                }
                .regedit-app .aero-table td {
                    vertical-align: middle;
                }
                .regedit-key-cell {
                    font-family: var(--code-font, 'Consolas', monospace);
                    color: var(--accent-cyan, #60a5fa);
                    white-space: nowrap;
                }
                .regedit-val-cell {
                    font-family: var(--code-font, 'Consolas', monospace);
                    color: var(--text-main, #fff);
                    word-break: break-all;
                }
                .regedit-readonly-tag {
                    font-size: 10px;
                    color: var(--text-muted, #94a3b8);
                    margin-left: 6px;
                }
                .regedit-edit-btn {
                    padding: 3px 10px;
                    font-size: 11px;
                }
            </style>

            <div class="regedit-app">
                <div class="regedit-toolbar">Computer\\HKEY_CURRENT_USER\\ZebOS3\\Settings — ${FIELDS.length} values</div>
                <div class="regedit-table-wrap">
                    <table class="aero-table">
                        <thead>
                            <tr><th>Key</th><th>Value</th><th style="width:80px;">Action</th></tr>
                        </thead>
                        <tbody>
                            ${FIELDS.map(f => `
                                <tr data-key="${f.key}">
                                    <td class="regedit-key-cell">${this._escapeHtml(f.label)}${f.readonly ? '<span class="regedit-readonly-tag">(read-only)</span>' : ''}</td>
                                    <td class="regedit-val-cell">${this._escapeHtml(this._displayValue(f))}</td>
                                    <td>${f.readonly ? '' : `<button class="aero-btn regedit-edit-btn" data-edit="${f.key}">Edit</button>`}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `);

        this.bindEvents();
    }

    bindEvents() {
        this.body.querySelectorAll('[data-edit]').forEach(btn => {
            this.listen(btn, 'click', () => this.editField(btn.dataset.edit));
        });
    }

    async editField(key) {
        const field = FIELDS.find(f => f.key === key);
        if (!field || field.readonly) return;

        const currentDisplay = this._displayValue(field);
        const hint = field.type === 'bool' ? ' (enter true or false)' : '';
        const result = await showSystemPrompt(
            'Edit Registry Value',
            `Enter a new value for ${field.label}${hint}:`,
            currentDisplay === '(not set)' ? '' : currentDisplay,
            'info'
        );

        if (result === null) return; // cancelled

        let newValue = result;
        if (field.type === 'bool') {
            newValue = /^(true|1|yes|on)$/i.test(result.trim());
        }

        setRegistryValue(field.key, newValue);
        this.snapshot = getRegistrySnapshot();
        this.renderUI();
        await showSystemAlert('Registry Editor', `${field.label} has been updated.`, 'info');
    }
}
