// Zeb OS 3 Reinstaller — ported from ZebOS 2 devtools/reinstaller.js
// A normal app window (no special launcher, reachable however the shell
// chooses to expose it) that wipes the VFS + settings back to factory
// defaults and restarts Zeb OS 3, the same way the boot-time Recovery Mode
// "Reset File System" option does — just triggered from inside a running
// session instead of before boot.
import { BaseApp } from '../UIKit3/framework/index.js';
import { showSystemConfirm } from '../os3.js';
import { getIcon } from '../icons.js';

export class ReinstallerApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
        this.busy = false;
    }

    mount() {
        this.renderUI();
    }

    renderUI() {
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; box-sizing:border-box; padding:20px; gap:16px; color:var(--text-main); font-size:12px;">
                <div style="display:flex; gap:14px; align-items:flex-start;">
                    <div style="flex-shrink:0; width:40px; height:40px; display:flex; align-items:center; justify-content:center;">
                        ${getIcon('warning', 'reinstaller-warn-icon')}
                    </div>
                    <div style="line-height:1.6;">
                        <div style="font-weight:700; font-size:14px; margin-bottom:6px;">Reinstall Zeb OS 3</div>
                        <div style="color:var(--text-muted);">
                            This permanently erases every file on the virtual disk (Z:\\) and resets
                            all settings — background, sound scheme, rounded corners, everything — back
                            to their factory defaults. This cannot be undone. Back up first from
                            Recovery Mode if you're not sure.
                        </div>
                    </div>
                </div>

                <div style="flex-grow:1;"></div>

                <div class="reinstaller-status" style="min-height:16px; font-size:12px; font-weight:600; color:var(--accent-cyan);"></div>

                <div style="display:flex; justify-content:flex-end; gap:8px;">
                    <button class="aero-btn reinstaller-cancel-btn">Close</button>
                    <button class="aero-btn aero-btn-danger reinstaller-go-btn" ${this.busy ? 'disabled' : ''}>Reinstall Zeb OS 3...</button>
                </div>
            </div>
        `);

        this.bindEvents();
    }

    bindEvents() {
        const goBtn = this.body.querySelector('.reinstaller-go-btn');
        const cancelBtn = this.body.querySelector('.reinstaller-cancel-btn');

        if (goBtn) {
            goBtn.addEventListener('click', async () => {
                if (this.busy) return;
                const confirmed = await showSystemConfirm(
                    'Reinstall Zeb OS 3',
                    'This will permanently erase all files and reset every setting, then restart Zeb OS 3. Continue?',
                    { okText: 'Reinstall', cancelText: 'Cancel', iconType: 'warning' }
                );
                if (!confirmed) return;

                this.busy = true;
                const status = this.body.querySelector('.reinstaller-status');
                if (status) status.textContent = 'Reinstalling... Zeb OS 3 will restart in a moment.';
                goBtn.disabled = true;
                if (cancelBtn) cancelBtn.disabled = true;

                setTimeout(() => {
                    try {
                        localStorage.removeItem('ZEBOS3_DISK');
                        localStorage.removeItem('ZEBOS3_SETTINGS');
                    } catch (e) { /* localStorage unavailable */ }
                    location.reload();
                }, 600);
            });
        }

        if (cancelBtn) cancelBtn.addEventListener('click', () => this.close());
    }
}
