// Zeb OS 3 Zeb Viewer App (ported from ZebOS 2 programs/viewer.js)
import { getIcon } from '../icons.js';
import { BaseApp, aeroButton } from '../UIKit3/framework/index.js';
import { getVFSFileContent, saveFileToVFS, showContextMenu, showSystemAlert, showSystemPrompt } from '../os3.js';

export class ViewerApp extends BaseApp {
    constructor(onCloseRequest, filePath = null) {
        super(onCloseRequest);
        this.filePath = filePath;
        this.imageName = filePath ? String(filePath).split('/').filter(Boolean).pop() : null;
        this.imageDataUrl = null;

        this.viewportEl = null;
        this.emptyStateEl = null;
        this.canvas = null;
        this.ctx = null;
        this.statusNameEl = null;
        this.statusDimensionsEl = null;
        this.statusZoomEl = null;

        this.zoomLevel = 1.0;
        this.rotation = 0; // 0, 90, 180, 270
        this.flipH = false;
        this.flipV = false;

        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;

        this.img = new Image();
        this.imgLoaded = false;

        this.boundKeyDown = (e) => this.handleKeyDown(e);
        this.boundResize = () => this.handleResize();
    }

    mount() {
        this.body.style.height = '100%';

        this.renderUI();
        this.initCanvas();

        if (this.filePath) {
            this.loadImage(this.filePath);
        } else {
            this.showEmptyState();
        }

        this.listen(window, 'keydown', this.boundKeyDown);
        this.listen(window, 'resize', this.boundResize);
    }

    renderUI() {
        const toolbarBtns = [
            aeroButton({ label: 'Zoom In', icon: getIcon('zoomIn'), action: 'zoom-in' }),
            aeroButton({ label: 'Zoom Out', icon: getIcon('zoomOut'), action: 'zoom-out' }),
            aeroButton({ label: '100%', action: 'zoom-100' }),
            aeroButton({ label: 'Fit', icon: getIcon('zoomFit'), action: 'zoom-fit' }),
            aeroButton({ label: '', icon: getIcon('rotCcw'), action: 'rot-ccw' }),
            aeroButton({ label: '', icon: getIcon('rotCw'), action: 'rot-cw' }),
            aeroButton({ label: '', icon: getIcon('flipH'), action: 'flip-h' }),
            aeroButton({ label: '', icon: getIcon('flipV'), action: 'flip-v' }),
            aeroButton({ label: 'Reset', action: 'reset' }),
        ].join('');

        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:var(--bg-dark,#0f172a); color:var(--text-main,#ffffff); font-family:'Segoe UI', sans-serif; box-sizing:border-box; user-select:none; overflow:hidden;">

                <!-- Title Options Menu Bar -->
                <div class="aero-menu-bar">
                    <div class="aero-menu-item viewer-menu-file"><u>F</u>ile</div>
                    <div class="aero-menu-item viewer-menu-view"><u>V</u>iew</div>
                    <div style="margin-left:auto; display:flex; align-items:center; gap:6px; font-size:11px; color:var(--text-muted,#94a3b8); padding-right:8px;">
                        Zeb Viewer
                    </div>
                </div>

                <!-- Toolbar -->
                <div style="background:rgba(255,255,255,0.05); border-bottom:1px solid rgba(255,255,255,0.12); padding:6px 8px; display:flex; align-items:center; gap:4px; flex-wrap:wrap; flex-shrink:0;" class="viewer-toolbar">
                    ${toolbarBtns}
                </div>

                <!-- Main Viewport with Canvas -->
                <div class="viewer-viewport" style="flex-grow:1; background:#1e293b; position:relative; overflow:hidden; cursor:grab;">
                    <canvas class="viewer-canvas" style="display:block; width:100%; height:100%;"></canvas>
                    <div class="viewer-empty-state" style="display:none; position:absolute; inset:0; flex-direction:column; align-items:center; justify-content:center; gap:14px; pointer-events:none;">
                        <div style="width:64px; height:64px; color:var(--text-muted,#94a3b8); display:flex;">${getIcon('picture')}</div>
                        <div style="color:var(--text-muted,#94a3b8); font-size:13px;">No Image Loaded</div>
                        <button class="aero-btn aero-btn-primary viewer-browse-btn" style="pointer-events:auto;">${getIcon('viewer')} Browse VFS...</button>
                    </div>
                </div>

                <!-- Bottom Status Bar -->
                <div class="aero-status-bar">
                    <span class="aero-status-item viewer-status-name" style="max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${this.imageName || 'No file open'}</span>
                    <span class="aero-status-item viewer-status-dims">-- &times; -- px</span>
                    <span class="aero-status-item viewer-status-zoom">100% | 0&deg;</span>
                </div>
            </div>
        `);

        this.viewportEl = this.body.querySelector('.viewer-viewport');
        this.emptyStateEl = this.body.querySelector('.viewer-empty-state');
        this.statusNameEl = this.body.querySelector('.viewer-status-name');
        this.statusDimensionsEl = this.body.querySelector('.viewer-status-dims');
        this.statusZoomEl = this.body.querySelector('.viewer-status-zoom');

        this.setupMenuHandlers();
        this.setupToolbarHandlers();
        this.setupViewportPanAndZoom();

        this.listen(this.body.querySelector('.viewer-browse-btn'), 'click', () => this.promptBrowse());
    }

    initCanvas() {
        this.canvas = this.body.querySelector('.viewer-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.handleResize();
    }

    handleResize() {
        if (!this.viewportEl || !this.canvas) return;
        const rect = this.viewportEl.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
            this.draw();
        }
    }

    showEmptyState() {
        this.imgLoaded = false;
        if (this.emptyStateEl) this.emptyStateEl.style.display = 'flex';
        this.draw();
    }

    hideEmptyState() {
        if (this.emptyStateEl) this.emptyStateEl.style.display = 'none';
    }

    async promptBrowse() {
        const path = await showSystemPrompt('Browse VFS', 'Enter the VFS path of an image to open:', this.filePath || 'Users/Guest/Pictures/', 'viewer');
        if (path) this.loadImage(path);
    }

    loadImage(path) {
        const content = getVFSFileContent(path);
        if (!content) {
            showSystemAlert('Zeb Viewer', `Could not locate image file:\n${path}`, 'warning');
            return;
        }

        this.filePath = path;
        this.imageName = String(path).split('/').filter(Boolean).pop() || path;
        this.imageDataUrl = content;
        if (this.statusNameEl) this.statusNameEl.textContent = this.imageName;
        this.hideEmptyState();

        this.img = new Image();
        this.img.onload = () => {
            this.imgLoaded = true;
            if (this.statusDimensionsEl) {
                this.statusDimensionsEl.textContent = `${this.img.width} × ${this.img.height} px`;
            }
            this.fitToWindow();
        };
        this.img.onerror = () => {
            this.imgLoaded = false;
            showSystemAlert('Zeb Viewer', `Failed to load image file:\n${path}`, 'error');
            this.drawPlaceholder('Failed to load image file');
        };
        this.img.src = this.imageDataUrl;
    }

    drawPlaceholder(msg = 'No Image Loaded') {
        if (!this.ctx || !this.canvas) return;
        const w = this.canvas.width;
        const h = this.canvas.height;
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(0, 0, w, h);

        this.ctx.fillStyle = '#94a3b8';
        this.ctx.font = '13px "Segoe UI", Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(msg, w / 2, h / 2);
    }

    fitToWindow() {
        if (!this.imgLoaded || !this.canvas) return;
        const vw = this.canvas.width - 40;
        const vh = this.canvas.height - 40;

        const isRotated90 = (this.rotation % 180 !== 0);
        const imgW = isRotated90 ? this.img.height : this.img.width;
        const imgH = isRotated90 ? this.img.width : this.img.height;

        const scaleW = vw / imgW;
        const scaleH = vh / imgH;
        let scale = Math.min(scaleW, scaleH);

        if (scale > 1) scale = 1; // Don't over-expand smaller images
        this.zoomLevel = Math.max(0.1, scale);
        this.panX = 0;
        this.panY = 0;
        this.draw();
    }

    draw() {
        if (!this.ctx || !this.canvas) return;
        const w = this.canvas.width;
        const h = this.canvas.height;

        // 1. Dark Aero Glass viewport backdrop with checkerboard for transparency
        this.ctx.fillStyle = '#1e293b';
        this.ctx.fillRect(0, 0, w, h);

        const checkSize = 16;
        for (let y = 0; y < h; y += checkSize) {
            for (let x = 0; x < w; x += checkSize) {
                if ((Math.floor(x / checkSize) + Math.floor(y / checkSize)) % 2 === 0) {
                    this.ctx.fillStyle = '#273449';
                    this.ctx.fillRect(x, y, checkSize, checkSize);
                }
            }
        }

        if (!this.imgLoaded) {
            if (!this.emptyStateEl || this.emptyStateEl.style.display === 'none') {
                this.drawPlaceholder('No Image Loaded');
            }
            return;
        }

        // 2. Transform and draw image centered with zoom, rotation, flip & pan
        this.ctx.save();
        this.ctx.translate(w / 2 + this.panX, h / 2 + this.panY);
        this.ctx.rotate((this.rotation * Math.PI) / 180);
        this.ctx.scale(this.zoomLevel * (this.flipH ? -1 : 1), this.zoomLevel * (this.flipV ? -1 : 1));

        this.ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);
        this.ctx.restore();

        // 3. Update status bar zoom text
        if (this.statusZoomEl) {
            const zoomPct = Math.round(this.zoomLevel * 100);
            this.statusZoomEl.textContent = `${zoomPct}% | ${this.rotation}°`;
        }
    }

    setupViewportPanAndZoom() {
        if (!this.viewportEl) return;

        this.listen(this.viewportEl, 'mousedown', (e) => {
            if (e.button !== 0) return;
            this.isDragging = true;
            this.dragStartX = e.clientX - this.panX;
            this.dragStartY = e.clientY - this.panY;
            this.viewportEl.style.cursor = 'grabbing';
        });

        this.listen(window, 'mousemove', (e) => {
            if (!this.isDragging) return;
            this.panX = e.clientX - this.dragStartX;
            this.panY = e.clientY - this.dragStartY;
            this.draw();
        });

        this.listen(window, 'mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                if (this.viewportEl) this.viewportEl.style.cursor = 'grab';
            }
        });

        this.listen(this.viewportEl, 'wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 1.15 : 0.85;
            this.zoomLevel = Math.min(Math.max(0.05, this.zoomLevel * delta), 8.0);
            this.draw();
        });
    }

    setupMenuHandlers() {
        const fileMenu = this.body.querySelector('.viewer-menu-file');
        const viewMenu = this.body.querySelector('.viewer-menu-view');

        this.listen(fileMenu, 'click', () => {
            const rect = fileMenu.getBoundingClientRect();
            showContextMenu(rect.left, rect.bottom, [
                { label: 'Open...', action: () => this.promptBrowse() },
                { label: 'Save As...', action: () => this.handleSaveAs() },
                { label: 'Export to PC', action: () => this.handleExportToPc() },
                { type: 'separator' },
                { label: 'Exit', action: () => this.close() }
            ]);
        });

        this.listen(viewMenu, 'click', () => {
            const rect = viewMenu.getBoundingClientRect();
            showContextMenu(rect.left, rect.bottom, [
                { label: 'Zoom In', action: () => this.adjustZoom(1.25) },
                { label: 'Zoom Out', action: () => this.adjustZoom(0.8) },
                { label: '100% Actual Size', action: () => { this.zoomLevel = 1.0; this.draw(); } },
                { label: 'Fit Window', action: () => this.fitToWindow() },
                { type: 'separator' },
                { label: 'Rotate 90° CW', action: () => this.rotate(90) },
                { label: 'Rotate 90° CCW', action: () => this.rotate(-90) },
                { label: 'Flip Horizontal', action: () => { this.flipH = !this.flipH; this.draw(); } },
                { label: 'Flip Vertical', action: () => { this.flipV = !this.flipV; this.draw(); } },
                { type: 'separator' },
                { label: 'Reset View', action: () => this.resetView() }
            ]);
        });
    }

    setupToolbarHandlers() {
        const toolbar = this.body.querySelector('.viewer-toolbar');
        if (!toolbar) return;
        this.listen(toolbar, 'click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            switch (btn.dataset.action) {
                case 'zoom-in': this.adjustZoom(1.25); break;
                case 'zoom-out': this.adjustZoom(0.8); break;
                case 'zoom-100': this.zoomLevel = 1.0; this.draw(); break;
                case 'zoom-fit': this.fitToWindow(); break;
                case 'rot-ccw': this.rotate(-90); break;
                case 'rot-cw': this.rotate(90); break;
                case 'flip-h': this.flipH = !this.flipH; this.draw(); break;
                case 'flip-v': this.flipV = !this.flipV; this.draw(); break;
                case 'reset': this.resetView(); break;
            }
        });
    }

    async handleSaveAs() {
        if (!this.imageDataUrl) {
            await showSystemAlert('Zeb Viewer', 'There is no image loaded to save.', 'warning');
            return;
        }
        const newPath = await showSystemPrompt('Save As', 'Enter target VFS storage path:', this.filePath || 'Users/Guest/Pictures/untitled.png', 'viewer');
        if (newPath) {
            saveFileToVFS(newPath, this.imageDataUrl);
            this.filePath = newPath;
            this.imageName = String(newPath).split('/').filter(Boolean).pop() || newPath;
            if (this.statusNameEl) this.statusNameEl.textContent = this.imageName;
            await showSystemAlert('Zeb Viewer', `Image successfully saved to:\n${newPath}`, 'check');
        }
    }

    handleExportToPc() {
        if (!this.imageDataUrl) return;
        const a = document.createElement('a');
        a.href = this.imageDataUrl;
        a.download = this.imageName || 'image.png';
        a.click();
    }

    adjustZoom(factor) {
        this.zoomLevel = Math.min(Math.max(0.05, this.zoomLevel * factor), 8.0);
        this.draw();
    }

    rotate(angle) {
        this.rotation = (this.rotation + angle + 360) % 360;
        this.draw();
    }

    resetView() {
        this.zoomLevel = 1.0;
        this.rotation = 0;
        this.flipH = false;
        this.flipV = false;
        this.panX = 0;
        this.panY = 0;
        this.draw();
    }

    handleKeyDown(e) {
        if (e.key === '+' || e.key === '=') this.adjustZoom(1.2);
        else if (e.key === '-') this.adjustZoom(0.8);
        else if (e.key === '0') this.resetView();
        else if (e.key === 'r' || e.key === 'R') this.rotate(90);
        else if (e.key === 'h' || e.key === 'H') { this.flipH = !this.flipH; this.draw(); }
        else if (e.key === 'v' || e.key === 'V') { this.flipV = !this.flipV; this.draw(); }
        else if (e.key === 'Escape') this.close();
    }
}
