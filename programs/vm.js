// Zeb OS 3 ZebVM — ported from ZebOS 2 programs/vm.js
// A self-contained virtual machine manager: a sidebar lists simulated VMs
// (each just an embedded web URL + fake specs), a toolbar power-cycles the
// selected VM through a simulated "booting" phase before showing its
// "screen" (an <iframe> of vm.url), and a "New VM" wizard prompts for a
// name + URL to add another entry. Nothing here is a real virtual machine —
// it's a themed iframe launcher with a boot-animation illusion, exactly like
// the ZebOS 2 original.
import { BaseApp } from '../UIKit3/framework/index.js';
import { getIcon } from '../icons.js';
import { showSystemPrompt } from '../os3.js';

export class ZebVMApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);

        this.vms = [
            {
                id: 'vm-zebos-162',
                name: 'ZebOS v1.6.2 SP1',
                url: 'https://z3bos.github.io/ZebOS/',
                os: 'ZebOS v1.6.2 SP1',
                ram: 512,
                cpus: 2,
                status: 'stopped',
                booting: false,
                desc: 'Classic ZebOS v1.6.2 Service Pack 1 Virtual Workstation'
            },
            {
                id: 'vm-zebos-legacy',
                name: 'ZebOS 1.0 Classic',
                url: 'https://z3bos.github.io/ZebOS/',
                os: 'ZebOS v1.0.0',
                ram: 256,
                cpus: 1,
                status: 'stopped',
                booting: false,
                desc: 'Legacy 16-Bit ZebOS v1.0 Architecture Virtual Instance'
            }
        ];

        this.selectedVmId = 'vm-zebos-162';
        this.bootTimers = {};
        this.boundKeyDown = (e) => this.handleKeyDown(e);
    }

    mount() {
        this.listen(window, 'keydown', this.boundKeyDown);
        this.renderUI();
    }

    onCleanup() {
        Object.values(this.bootTimers).forEach(t => clearTimeout(t));
        this.bootTimers = {};
    }

    renderUI() {
        const activeVm = this.vms.find(v => v.id === this.selectedVmId) || this.vms[0];

        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; box-sizing:border-box; overflow:hidden; color:var(--text-main); font-size:12px;">

                <!-- Toolbar -->
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px 10px; background:rgba(15, 23, 42, 0.95); border-bottom:1px solid var(--aero-border); flex-shrink:0;">
                    <div style="display:flex; gap:6px; align-items:center;">
                        <button class="aero-btn vm-tb-btn btn-new-vm">${getIcon('newFolder')} New VM</button>
                        <div style="width:1px; height:18px; background:var(--aero-border); margin:0 2px;"></div>
                        <button class="aero-btn aero-btn-primary vm-tb-btn btn-start-vm" ${activeVm.status === 'running' || activeVm.booting ? 'disabled' : ''}>${getIcon('play')} Power On</button>
                        <button class="aero-btn vm-tb-btn btn-restart-vm" ${activeVm.status !== 'running' ? 'disabled' : ''}>${getIcon('refresh')} Restart</button>
                        <button class="aero-btn aero-btn-danger vm-tb-btn btn-stop-vm" ${activeVm.status !== 'running' ? 'disabled' : ''}>${getIcon('stop')} Power Off</button>
                    </div>
                    <div style="font-weight:700; color:var(--accent-cyan); display:flex; align-items:center; gap:6px;">
                        ${getIcon('vm')} ZebVM Hypervisor v3.0
                    </div>
                </div>

                <!-- Workspace -->
                <div style="flex-grow:1; display:flex; overflow:hidden;">

                    <!-- VM Sidebar -->
                    <div style="width:230px; flex-shrink:0; background:rgba(15, 23, 42, 0.6); border-right:1px solid var(--aero-border); padding:8px; display:flex; flex-direction:column; gap:8px; overflow-y:auto;">
                        <div style="font-size:11px; font-weight:700; color:var(--accent-cyan); display:flex; align-items:center; justify-content:space-between;">
                            <span>VIRTUAL MACHINES</span>
                            <span style="font-weight:400; color:var(--text-muted);">(${this.vms.length})</span>
                        </div>
                        ${this.vms.map(vm => `
                            <div class="vm-card ${vm.id === this.selectedVmId ? 'selected-vm-card' : ''}" data-id="${vm.id}"
                                style="padding:9px; border-radius:6px; cursor:pointer; display:flex; flex-direction:column; gap:5px;
                                border:1px solid ${vm.id === this.selectedVmId ? 'var(--accent-cyan)' : 'var(--aero-border)'};
                                background:${vm.id === this.selectedVmId ? 'linear-gradient(180deg, rgba(37,99,235,0.45) 0%, rgba(29,78,216,0.35) 100%)' : 'rgba(255,255,255,0.03)'};">
                                <div style="display:flex; align-items:center; justify-content:space-between;">
                                    <div style="font-weight:700; display:flex; align-items:center; gap:6px;">
                                        ${getIcon('vm')}
                                        <span>${vm.name}</span>
                                    </div>
                                    <span class="aero-badge ${vm.status === 'running' ? 'aero-badge-success' : (vm.booting ? 'aero-badge-warning' : '')}">${vm.booting ? 'BOOTING' : vm.status.toUpperCase()}</span>
                                </div>
                                <div style="font-size:10px; color:var(--text-muted);">RAM: ${vm.ram}MB | CPU: ${vm.cpus} Cores</div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Virtual Screen -->
                    <div style="flex-grow:1; background:#000; display:flex; flex-direction:column; position:relative; overflow:hidden;">
                        ${this.renderVirtualViewport(activeVm)}
                    </div>
                </div>

                <!-- Status Bar -->
                <div class="aero-status-bar">
                    <span class="aero-status-item">Active Machine: <strong style="color:var(--accent-cyan);">${activeVm.name}</strong> (${activeVm.os})</span>
                    <span class="aero-status-item">Running VMs: ${this.vms.filter(v => v.status === 'running').length}/${this.vms.length}</span>
                </div>
            </div>
        `);

        this.bindEvents(activeVm);
    }

    renderVirtualViewport(vm) {
        if (vm.booting) {
            return `
                <div style="flex-grow:1; background:#0c0c0c; color:#60a5fa; font-family:var(--code-font, 'Consolas', monospace); padding:16px; font-size:12px; line-height:1.6; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
                    <div style="width:50px; height:50px; margin-bottom:12px;">${getIcon('vm')}</div>
                    <div style="font-weight:700; font-size:14px; color:#fff;">ZebVM BIOS v3.0 Post Diagnostic Check</div>
                    <div style="color:#60a5fa; margin-top:8px;">Initializing Virtual Hardware Layer...</div>
                    <div style="color:#94a3b8; margin-top:4px;">Probing ${vm.cpus} vCPU cores | Allocating ${vm.ram}MB Virtual RAM</div>
                    <div style="color:#60a5fa; margin-top:8px;">Booting Guest OS: [${vm.name}]...</div>
                </div>
            `;
        }

        if (vm.status === 'running') {
            return `
                <div style="width:100%; height:100%; display:flex; flex-direction:column; position:relative; background:#fff;">
                    <iframe src="${vm.url}" style="width:100%; height:100%; border:none; outline:none; display:block;" allow="fullscreen; autoplay; clipboard-write;"></iframe>
                </div>
            `;
        }

        // Stopped state
        return `
            <div style="flex-grow:1; background:var(--bg-dark); color:var(--text-main); padding:24px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
                <div style="width:64px; height:64px; margin-bottom:12px; filter:drop-shadow(0 0 12px rgba(96,165,250,0.5));">${getIcon('vm')}</div>
                <div style="font-size:20px; font-weight:700;">${vm.name}</div>
                <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">${vm.desc}</div>

                <div style="margin-top:18px; display:grid; grid-template-columns:1fr 1fr; gap:10px; background:rgba(255,255,255,0.05); padding:12px 18px; border-radius:6px; border:1px solid var(--aero-border); font-size:12px; text-align:left; min-width:280px;">
                    <div><strong style="color:var(--accent-cyan);">Guest OS:</strong> ${vm.os}</div>
                    <div><strong style="color:var(--accent-cyan);">Virtual RAM:</strong> ${vm.ram} MB</div>
                    <div><strong style="color:var(--accent-cyan);">vCPU Cores:</strong> ${vm.cpus} Cores</div>
                    <div><strong style="color:var(--accent-cyan);">Target URL:</strong> <a href="${vm.url}" target="_blank" style="color:var(--accent-cyan); text-decoration:none;">Link &#8599;</a></div>
                </div>

                <button class="aero-btn aero-btn-primary btn-power-on-center" style="margin-top:20px; padding:10px 24px; font-size:13px;">
                    ${getIcon('play')} Power On Virtual Machine
                </button>
            </div>
        `;
    }

    bindEvents(activeVm) {
        this.body.querySelectorAll('.vm-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectedVmId = card.dataset.id;
                this.renderUI();
            });
        });

        const startBtn = this.body.querySelector('.btn-start-vm');
        const startCenterBtn = this.body.querySelector('.btn-power-on-center');
        const doStart = () => this.startVm(activeVm);
        if (startBtn) startBtn.addEventListener('click', doStart);
        if (startCenterBtn) startCenterBtn.addEventListener('click', doStart);

        const stopBtn = this.body.querySelector('.btn-stop-vm');
        if (stopBtn) stopBtn.addEventListener('click', () => this.stopVm(activeVm));

        const restartBtn = this.body.querySelector('.btn-restart-vm');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.stopVm(activeVm);
                setTimeout(() => this.startVm(activeVm), 300);
            });
        }

        const newBtn = this.body.querySelector('.btn-new-vm');
        if (newBtn) {
            newBtn.addEventListener('click', async () => {
                const name = await showSystemPrompt('New Virtual Machine', 'Enter Virtual Machine Name:', 'Custom Web VM');
                if (name === null) return;
                const url = await showSystemPrompt('New Virtual Machine', 'Enter Target Embed Web URL:', 'https://example.com');
                if (url === null) return;

                const newId = `vm_${Date.now()}`;
                this.vms.push({
                    id: newId,
                    name: (name || 'Custom Web VM').trim(),
                    url: (url || 'https://example.com').trim(),
                    os: 'Web Application OS',
                    ram: 1024,
                    cpus: 2,
                    status: 'stopped',
                    booting: false,
                    desc: 'Custom Web Embed Virtual Machine Instance'
                });
                this.selectedVmId = newId;
                this.renderUI();
            });
        }
    }

    startVm(vm) {
        if (vm.status === 'running' || vm.booting) return;
        vm.booting = true;
        this.renderUI();

        if (this.bootTimers[vm.id]) clearTimeout(this.bootTimers[vm.id]);
        this.bootTimers[vm.id] = setTimeout(() => {
            vm.booting = false;
            vm.status = 'running';
            delete this.bootTimers[vm.id];
            this.renderUI();
        }, 1200);
    }

    stopVm(vm) {
        if (vm.status === 'stopped' && !vm.booting) return;
        vm.booting = false;
        vm.status = 'stopped';
        if (this.bootTimers[vm.id]) {
            clearTimeout(this.bootTimers[vm.id]);
            delete this.bootTimers[vm.id];
        }
        this.renderUI();
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
        }
    }
}
