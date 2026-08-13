// Zeb OS 3 Aero Camera App
import { getIcon } from '../icons.js';
import { BaseApp, w95Dropdown, bindW95Dropdown } from '../UIKit3/framework/index.js';

export class CameraApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);
        this.stream = null;
        this.activeFilter = 'none';
        this.activeFilterLabel = 'Normal';
        this.timerSeconds = 0;
        this.showGrid = false;
        this.gallery = [];
    }

    mount() {
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:#0f172a; color:#ffffff; font-family:'Segoe UI', sans-serif; user-select:none;">

                <!-- Header Toolbar -->
                <div style="background:rgba(255,255,255,0.1); border-bottom:1px solid rgba(255,255,255,0.2); padding:6px 12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                    <div style="display:flex; align-items:center; gap:6px; font-weight:600; color:#00e5ff; font-size:13px;">
                        ${getIcon('camera')} Zeb OS 3 Aero Camera
                    </div>

                    <div style="display:flex; align-items:center; gap:8px;">
                        <div id="cam-filter-wrap">
                            ${w95Dropdown({
                                id: 'cam-filter-drop',
                                options: [
                                    { value: 'none', label: 'Normal' },
                                    { value: 'grayscale(100%)', label: 'B&W Mono' },
                                    { value: 'sepia(100%)', label: 'Sepia Vintage' },
                                    { value: 'invert(100%)', label: 'Inverted' },
                                    { value: 'contrast(160%) hue-rotate(180deg)', label: 'Vaporwave' }
                                ],
                                value: 'none',
                                width: '130px'
                            })}
                        </div>
                        <button class="aero-btn cam-grid-btn">${getIcon('grid')} Grid: OFF</button>
                    </div>
                </div>

                <!-- Live Viewport -->
                <div style="flex-grow:1; background:#000000; position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center;">
                    <video class="cam-video" autoplay playsinline muted style="width:100%; height:100%; object-fit:contain; background:#000;"></video>
                    <canvas class="cam-canvas" style="display:none;"></canvas>

                    <!-- HUD Badge -->
                    <div style="position:absolute; top:10px; left:10px; background:rgba(0,0,0,0.65); color:#00e5ff; font-family:monospace; font-size:11px; padding:4px 10px; border-radius:4px; border:1px solid rgba(0,229,255,0.4);">
                        LIVE 1080p | Aero Vision
                    </div>
                </div>

                <!-- Footer Bar -->
                <div style="background:rgba(15,23,42,0.8); border-top:1px solid rgba(255,255,255,0.15); padding:10px; display:flex; justify-content:center; gap:12px;">
                    <button class="aero-btn cam-capture-btn" style="padding:6px 24px; font-size:13px; font-weight:bold; background:linear-gradient(180deg, #00e5ff 0%, #0078d7 100%); color:#ffffff; border-color:#00e5ff;">
                        ${getIcon('picture')} Capture Photo
                    </button>
                </div>
            </div>
        `);

        this.initCamera();
    }

    async initCamera() {
        const video = this.body.querySelector('.cam-video');
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            video.srcObject = this.stream;
        } catch (e) {}
    }

    onCleanup() {
        if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
        }
    }
}
