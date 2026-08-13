// Zeb OS 3 Personalize App
// Ported from ZebOS 2's programs/personalize.js, deliberately simplified to
// match ZebOS 3's flat registry-lite API (os3.js: getRegistrySnapshot /
// setRegistryValue). ZebOS 2's tabbed Display Properties applet had a deep
// tree of per-window-part color schemes, taskbar position settings, and a
// draft/Apply/Cancel working-state model backed by a callback into the OS.
// None of that backing store exists in ZebOS 3 — every control here reads
// straight from getRegistrySnapshot() and writes straight through
// setRegistryValue(), which applies + persists + live-updates the desktop
// immediately. There is no Apply/Cancel step because there is no draft state
// to discard.
import { BaseApp } from '../UIKit3/framework/index.js';
import { getRegistrySnapshot, setRegistryValue, showSystemAlert } from '../os3.js';

export class PersonalizeApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
        this.snapshot = getRegistrySnapshot();
    }

    mount() {
        this.renderUI();
    }

    renderUI() {
        const s = this.snapshot;
        const bg = s.desktopBackground || '#0f172a';
        const pattern = s.desktopPattern || 'solid';
        const soundsOn = s.soundScheme !== 'muted';
        const rounded = !!s.roundedCorners;

        this.render(`
            <style>
                .personalize-app {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 14px;
                    gap: 14px;
                    overflow-y: auto;
                    font-family: var(--main-font, 'Segoe UI', sans-serif);
                    color: var(--text-main, #fff);
                }
                .p-section {
                    background: rgba(15, 23, 42, 0.55);
                    border: 1px solid var(--aero-border, rgba(255,255,255,0.25));
                    border-radius: 8px;
                    padding: 12px 14px;
                    box-shadow: var(--glass-reflection);
                }
                .p-section-title {
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    color: var(--accent-cyan, #60a5fa);
                    margin-bottom: 10px;
                }
                .p-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                    padding: 6px 0;
                }
                .p-row + .p-row {
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }
                .p-row-label {
                    font-size: 12px;
                    color: var(--text-main, #fff);
                }
                .p-row-sub {
                    font-size: 11px;
                    color: var(--text-muted, #94a3b8);
                    margin-top: 2px;
                }
                .p-color-input {
                    width: 44px;
                    height: 26px;
                    padding: 2px;
                    border-radius: 4px;
                    border: 1px solid var(--aero-border, rgba(255,255,255,0.25));
                    background: rgba(2, 6, 23, 0.6);
                    cursor: pointer;
                }
                .p-preview {
                    width: 100%;
                    height: 70px;
                    border-radius: 6px;
                    border: 1px solid var(--aero-border, rgba(255,255,255,0.25));
                    margin-top: 10px;
                    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.3);
                }
                .p-check-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    font-size: 12px;
                }
                .p-forget-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }
            </style>

            <div class="personalize-app">
                <div class="p-section">
                    <div class="p-section-title">Desktop Background</div>
                    <div class="p-row">
                        <div>
                            <div class="p-row-label">Background Color</div>
                            <div class="p-row-sub">Sets the desktop canvas base color.</div>
                        </div>
                        <input type="color" id="p-color" class="p-color-input" value="${bg}">
                    </div>
                    <div class="p-row">
                        <div>
                            <div class="p-row-label">Pattern</div>
                            <div class="p-row-sub">Solid fill or a gradient toward slate.</div>
                        </div>
                        <select id="p-pattern" class="aero-select" style="width:160px;">
                            <option value="solid" ${pattern === 'solid' ? 'selected' : ''}>Solid Color</option>
                            <option value="gradient" ${pattern === 'gradient' ? 'selected' : ''}>Gradient</option>
                        </select>
                    </div>
                    <div class="p-preview" id="p-preview"></div>
                </div>

                <div class="p-section">
                    <div class="p-section-title">Sound</div>
                    <label class="p-check-label">
                        <input type="checkbox" id="p-sound" class="aero-checkbox" ${soundsOn ? 'checked' : ''}>
                        <span>Enable system sounds</span>
                    </label>
                    <div class="p-row-sub" style="margin-top:6px;">When off, the OS click/open synthesizer stays muted.</div>
                </div>

                <div class="p-section">
                    <div class="p-section-title">Appearance</div>
                    <label class="p-check-label">
                        <input type="checkbox" id="p-rounded" class="aero-checkbox" ${rounded ? 'checked' : ''}>
                        <span>Rounded window corners</span>
                    </label>
                </div>

                <div class="p-section">
                    <div class="p-section-title">Account</div>
                    <div class="p-forget-row">
                        <div>
                            <div class="p-row-label">Forget Me</div>
                            <div class="p-row-sub">Clears saved sign-in state and shows the setup screen again on next boot.</div>
                        </div>
                        <button class="aero-btn aero-btn-danger" id="p-forget">Forget Me</button>
                    </div>
                </div>
            </div>
        `);

        this.bindEvents();
        this.updatePreview();
    }

    bindEvents() {
        const colorInput = this.body.querySelector('#p-color');
        const patternSelect = this.body.querySelector('#p-pattern');
        const soundCheck = this.body.querySelector('#p-sound');
        const roundedCheck = this.body.querySelector('#p-rounded');
        const forgetBtn = this.body.querySelector('#p-forget');

        this.listen(colorInput, 'input', () => {
            this.snapshot.desktopBackground = colorInput.value;
            setRegistryValue('desktopBackground', colorInput.value);
            this.updatePreview();
        });

        this.listen(patternSelect, 'change', () => {
            this.snapshot.desktopPattern = patternSelect.value;
            setRegistryValue('desktopPattern', patternSelect.value);
            this.updatePreview();
        });

        this.listen(soundCheck, 'change', () => {
            const scheme = soundCheck.checked ? 'classic' : 'muted';
            this.snapshot.soundScheme = scheme;
            setRegistryValue('soundScheme', scheme);
        });

        this.listen(roundedCheck, 'change', () => {
            this.snapshot.roundedCorners = roundedCheck.checked;
            setRegistryValue('roundedCorners', roundedCheck.checked);
        });

        this.listen(forgetBtn, 'click', async () => {
            setRegistryValue('hasLoggedInBefore', false);
            this.snapshot.hasLoggedInBefore = false;
            await showSystemAlert('Personalize', 'Saved sign-in has been forgotten. The setup / sign-in screen will show again next time Zeb OS 3 starts.', 'info');
        });
    }

    updatePreview() {
        const preview = this.body.querySelector('#p-preview');
        if (!preview) return;
        const color = this.snapshot.desktopBackground || '#0f172a';
        const pattern = this.snapshot.desktopPattern || 'solid';
        if (pattern === 'gradient') {
            preview.style.background = `linear-gradient(135deg, ${color} 0%, #0f172a 100%)`;
        } else {
            preview.style.background = color;
        }
    }
}
