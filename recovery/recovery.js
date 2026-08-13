// Welcome to Recovery! 
import { getIcon } from '../icons.js';

export function showRecoveryScreen(onExit) {
    const overlay = document.createElement('div');
    overlay.id = 'recovery-mode-overlay';
    overlay.style.cssText = `
        position:fixed; inset:0; z-index:99000;
        background:rgba(2, 6, 23, 0.82);
        backdrop-filter:blur(10px);
        -webkit-backdrop-filter:blur(10px);
        display:flex; align-items:center; justify-content:center;
        font-family:'Segoe UI', system-ui, -apple-system, sans-serif;
        color:#ffffff;
    `;
    document.body.appendChild(overlay);

    let confirming = false;

    function exit() {
        overlay.remove();
        if (typeof onExit === 'function') onExit();
    }

    function doReset() {
        try {
            localStorage.removeItem('ZEBOS3_DISK');
            localStorage.removeItem('ZEBOS3_SETTINGS');
        } catch (e) { /* localStorage unavailable */ }
        location.reload();
    }

    function mainView() {
        return `
            <div class="aero-dialog" style="width:480px; max-width:90vw;">
                <div class="aero-dialog-header">
                    ${getIcon('recovery')}
                    <span>Zeb OS 3 Recovery Mode</span>
                </div>
                <div class="aero-dialog-body">
                    <div class="aero-dialog-body-content" style="flex-direction:column; align-items:stretch; gap:14px;">
                        <div style="font-size:12px; color:var(--text-muted, #94a3b8); line-height:1.6;">
                            Zeb OS 3 was interrupted before reaching the desktop, or Recovery Mode was
                            entered manually. Choose a recovery option below, or continue booting normally.
                        </div>
                        <div style="border:1px solid var(--aero-border, rgba(255,255,255,0.25)); border-radius:6px; padding:12px; background:rgba(15,23,42,0.4);">
                            <div style="font-weight:700; font-size:13px; margin-bottom:4px;">Reset File System</div>
                            <div style="font-size:11px; color:var(--text-muted, #94a3b8); margin-bottom:10px; line-height:1.5;">
                                Erases the virtual disk (Z:\\) and every saved setting, then reloads Zeb OS 3
                                to a factory-fresh state. This cannot be undone.
                            </div>
                            <button class="aero-btn aero-btn-danger recovery-reset-btn">Reset File System...</button>
                        </div>
                    </div>
                </div>
                <div class="aero-dialog-footer">
                    <button class="aero-btn aero-btn-primary recovery-continue-btn" autofocus>Continue to Boot</button>
                </div>
            </div>
        `;
    }

    function confirmView() {
        return `
            <div class="aero-dialog" style="width:420px; max-width:90vw;">
                <div class="aero-dialog-header">
                    ${getIcon('warning')}
                    <span>Confirm Reset</span>
                </div>
                <div class="aero-dialog-body">
                    <div class="aero-dialog-body-content">
                        ${getIcon('warning')}
                        <div style="font-size:12px; line-height:1.6;">
                            This will permanently erase every file and reset every setting to factory
                            defaults. This cannot be undone. Continue?
                        </div>
                    </div>
                </div>
                <div class="aero-dialog-footer">
                    <button class="aero-btn aero-btn-danger recovery-confirm-yes">Erase &amp; Reset</button>
                    <button class="aero-btn recovery-confirm-no">Cancel</button>
                </div>
            </div>
        `;
    }

    function render() {
        overlay.innerHTML = confirming ? confirmView() : mainView();
        bind();
    }

    function bind() {
        overlay.querySelector('.recovery-reset-btn')?.addEventListener('click', () => {
            confirming = true;
            render();
        });
        overlay.querySelector('.recovery-continue-btn')?.addEventListener('click', exit);
        overlay.querySelector('.recovery-confirm-yes')?.addEventListener('click', doReset);
        overlay.querySelector('.recovery-confirm-no')?.addEventListener('click', () => {
            confirming = false;
            render();
        });
    }

    render();
}
