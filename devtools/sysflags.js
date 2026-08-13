
import { BaseApp } from '../UIKit3/framework/index.js';
import { getRegistrySnapshot, setRegistryValue, playSystemSound } from '../os3.js';

const LOCAL_KEY_PREFIX = 'zebos3_flag_';

// backend: 'registry'  -> lives in os3.js systemState via getRegistrySnapshot/setRegistryValue
// backend: 'local'     -> ZebOS 3 has no equivalent field yet; stored under zebos3_flag_<field>
const BOOL_FLAGS = [
    { field: 'autoDevMode', label: 'Auto-enter Dev Mode on boot', backend: 'local', default: false },
    { field: 'skipBootAnimation', label: 'Skip boot animation', backend: 'local', default: false },
    { field: 'alwaysShowSetup', label: 'Show setup screen on boot every time', backend: 'registry', default: false },
    { field: 'disableKernelLogs', label: 'Disable kernel logs on startup', backend: 'local', default: false },
    { field: 'autoArrange', label: 'Auto-arrange desktop icons', backend: 'local', default: false },
    { field: 'taskbarAutoHide', label: 'Auto-hide taskbar', backend: 'local', default: false },
    { field: 'roundedCorners', label: 'Rounded window corners', backend: 'registry', default: false },
];

const ENUM_FLAGS = [
    {
        field: 'desktopSortBy', label: 'Desktop sort', backend: 'local', default: 'type',
        options: [
            { value: 'type', label: 'Type' },
            { value: 'name', label: 'Name' },
        ],
    },
    {
        field: 'soundScheme', label: 'Sound scheme', backend: 'registry', default: 'classic',
        options: [
            { value: 'classic', label: 'Classic Zeb OS Synthesizer' },
            { value: 'muted', label: 'Muted (No Audio)' },
        ],
    },
    {
        field: 'desktopScheme', label: 'Color scheme', backend: 'local', default: 'standard',
        options: [
            { value: 'standard', label: 'Standard' },
            { value: 'high-contrast', label: 'High Contrast Dark' },
            { value: 'rose', label: 'Rose Retro' },
            { value: 'emerald', label: 'Emerald Desktop' },
            { value: 'midnight', label: 'Midnight Blue' },
        ],
    },
];

export class SysFlagsApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
    }

    mount() {
        this.renderUI();
    }

    getFlagValue(f) {
        if (f.backend === 'registry') {
            const snap = getRegistrySnapshot();
            const v = snap[f.field];
            return v !== undefined && v !== null ? v : f.default;
        }
        try {
            const raw = localStorage.getItem(LOCAL_KEY_PREFIX + f.field);
            if (raw === null) return f.default;
            return JSON.parse(raw);
        } catch (e) {
            return f.default;
        }
    }

    setFlagValue(f, value) {
        if (f.backend === 'registry') {
            setRegistryValue(f.field, value);
        } else {
            try {
                localStorage.setItem(LOCAL_KEY_PREFIX + f.field, JSON.stringify(value));
            } catch (e) { /* localStorage unavailable */ }
        }
    }

    renderUI() {
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; box-sizing:border-box; padding:16px; gap:16px; overflow-y:auto; color:var(--text-main); font-size:12px;">
                <div>
                    <div class="sf-section-title" style="font-size:11px; font-weight:700; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid var(--aero-border); padding-bottom:6px; margin-bottom:10px;">
                        Startup &amp; Behavior
                    </div>
                    <div style="display:flex; flex-direction:column; gap:9px;">
                        ${BOOL_FLAGS.map(f => `
                            <label style="display:flex; align-items:center; gap:9px; cursor:pointer; user-select:none;">
                                <input type="checkbox" class="aero-checkbox sf-flag-checkbox" data-field="${f.field}" ${this.getFlagValue(f) ? 'checked' : ''}>
                                <span>${f.label}${f.backend === 'local' ? ' <span style="color:var(--text-muted); font-size:10px;">(local)</span>' : ''}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div>
                    <div class="sf-section-title" style="font-size:11px; font-weight:700; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.5px; border-bottom:1px solid var(--aero-border); padding-bottom:6px; margin-bottom:10px;">
                        Appearance Defaults
                    </div>
                    <div style="display:flex; flex-direction:column; gap:10px;">
                        ${ENUM_FLAGS.map(f => `
                            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
                                <label>${f.label}${f.backend === 'local' ? ' <span style="color:var(--text-muted); font-size:10px;">(local)</span>' : ''}</label>
                                <select class="aero-select sf-flag-select" data-field="${f.field}" style="width:200px;">
                                    ${f.options.map(o => `<option value="${o.value}" ${this.getFlagValue(f) === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
                                </select>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div style="flex-grow:1;"></div>
                <div style="font-size:10px; color:var(--text-muted); border-top:1px solid var(--aero-border); padding-top:10px;">
                    Changes apply immediately and are saved automatically. Flags marked <em>(local)</em> aren't
                    part of Zeb OS 3's registry yet, so they're stored separately and won't appear in Registry Editor.
                </div>
            </div>
        `);

        this.bindEvents();
    }

    bindEvents() {
        this.body.querySelectorAll('.sf-flag-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                const f = BOOL_FLAGS.find(x => x.field === cb.dataset.field);
                if (!f) return;
                this.setFlagValue(f, cb.checked);
                playSystemSound('click');
            });
        });

        this.body.querySelectorAll('.sf-flag-select').forEach(sel => {
            sel.addEventListener('change', () => {
                const f = ENUM_FLAGS.find(x => x.field === sel.dataset.field);
                if (!f) return;
                this.setFlagValue(f, sel.value);
                playSystemSound('click');
            });
        });
    }
}
