// Zeb OS 3 Paint Studio - ported from ZebOS 2 programs/paint.js
// Faithful port of the layered canvas drawing engine, rebuilt entirely on
// UIKit3's dark Aero Glass chrome (aero-btn / aero-range / aero-status-bar).
import { getIcon } from '../icons.js';
import { BaseApp } from '../UIKit3/framework/index.js';
import { saveFileToVfsPath, showSystemAlert, showSystemConfirm, showSystemPrompt } from '../os3.js';

const PALETTE = [
    '#000000', '#ffffff', '#7f7f7f', '#c3c3c8',
    '#ef4444', '#f97316', '#f59e0b', '#facc15',
    '#22c55e', '#10b981', '#06b6d4', '#60a5fa',
    '#2563eb', '#7c3aed', '#a855f7', '#ec4899'
];

const TOOLS = [
    { id: 'pencil', icon: 'pencil', title: 'Pencil (hard edge)' },
    { id: 'brush', icon: 'brush', title: 'Brush (soft edge)' },
    { id: 'eraser', icon: 'eraser', title: 'Eraser' },
    { id: 'fill', icon: 'fill', title: 'Fill (Paint Bucket)' },
    { id: 'line', icon: 'line', title: 'Line' },
    { id: 'rect', icon: 'rect', title: 'Rectangle' },
    { id: 'frect', icon: 'frect', title: 'Filled Rectangle' },
    { id: 'circle', icon: 'circle', title: 'Ellipse' },
    { id: 'fcircle', icon: 'fcircle', title: 'Filled Ellipse' }
];

export class PaintApp extends BaseApp {
    constructor(onCloseRequest) {
        super(onCloseRequest);

        this.width = 640;
        this.height = 420;
        this.activeFileName = 'artwork.png';

        // Multi-layer system
        this.layers = [];
        this.activeLayerIndex = 0;
        this.layerCounter = 1;

        // Tool settings
        this.currentTool = 'brush';
        this.currentColor = '#000000';
        this.currentSize = 6;
        this.currentOpacity = 100;

        // Drawing state
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.startX = 0;
        this.startY = 0;
        this.snapshotImageData = null;

        // Undo/redo history
        this.history = [];
        this.historyIndex = -1;

        this.mainCanvas = null;
        this.mainCtx = null;

        this.boundMouseDown = (e) => this.handleMouseDown(e);
        this.boundMouseMove = (e) => this.handleMouseMove(e);
        this.boundMouseUp = (e) => this.handleMouseUp(e);
        this.boundKeyDown = (e) => this.handleKeyDown(e);
    }

    mount() {
        this.renderApp();
    }

    renderApp() {
        this.render(`
            <div class="paint-app">
                <div class="paint-toolbar">
                    <button class="aero-btn aero-btn-sm" data-action="new">New</button>
                    <button class="aero-btn aero-btn-sm" data-action="undo">Undo</button>
                    <button class="aero-btn aero-btn-sm" data-action="redo">Redo</button>
                    <button class="aero-btn aero-btn-sm" data-action="clear-layer">${getIcon('clear')} Clear Layer</button>
                    <div class="paint-toolbar-spacer"></div>
                    <span class="paint-app-label">Paint Studio</span>
                    <button class="aero-btn aero-btn-primary aero-btn-sm" data-action="save">${getIcon('save')} Save</button>
                </div>

                <div class="paint-workspace">
                    <div class="paint-tools-col">
                        ${TOOLS.map(t => `
                            <button class="aero-btn paint-tool-btn ${this.currentTool === t.id ? 'active' : ''}" data-tool="${t.id}" title="${t.title}">${getIcon(t.icon)}</button>
                        `).join('')}
                    </div>

                    <div class="paint-center-col">
                        <div class="paint-props-bar">
                            <label class="paint-prop">
                                <span>Size</span>
                                <input type="range" class="aero-range paint-size-range" min="1" max="60" value="${this.currentSize}">
                                <span class="paint-prop-val paint-size-val">${this.currentSize}px</span>
                            </label>
                            <label class="paint-prop">
                                <span>Opacity</span>
                                <input type="range" class="aero-range paint-opacity-range" min="1" max="100" value="${this.currentOpacity}">
                                <span class="paint-prop-val paint-opacity-val">${this.currentOpacity}%</span>
                            </label>
                            <div class="paint-color-group">
                                <span>Color</span>
                                <div class="paint-color-input-wrap">
                                    <div class="paint-color-preview" style="background:${this.currentColor};"></div>
                                    <input type="color" class="paint-color-input" value="${this.currentColor}">
                                </div>
                                <div class="paint-swatches">
                                    ${PALETTE.map(c => `<div class="paint-swatch ${c === this.currentColor ? 'selected' : ''}" data-color="${c}" style="background:${c};" title="${c}"></div>`).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="paint-canvas-wrap">
                            <canvas class="paint-main-canvas" width="${this.width}" height="${this.height}"></canvas>
                        </div>

                        <div class="aero-status-bar">
                            <span class="aero-status-item paint-cursor-pos">Pos: 0, 0px</span>
                            <span class="aero-status-item">Canvas: ${this.width} x ${this.height}px</span>
                        </div>
                    </div>

                    <div class="paint-layers-col">
                        <div class="paint-layers-header">
                            <span>Layers</span>
                            <div class="paint-layers-actions">
                                <button class="aero-btn aero-btn-sm" data-action="layer-add" title="Add New Layer">${getIcon('layerAdd')}</button>
                                <button class="aero-btn aero-btn-sm" data-action="layer-del" title="Delete Active Layer">${getIcon('layerDel')}</button>
                            </div>
                        </div>

                        <div class="paint-layers-list"></div>

                        <div class="paint-layer-opacity-row">
                            <span>Opacity</span>
                            <input type="range" class="aero-range paint-layer-opacity-range" min="0" max="100" value="100">
                            <span class="paint-prop-val paint-layer-opacity-val">100%</span>
                        </div>

                        <div class="paint-layer-order-row">
                            <button class="aero-btn aero-btn-sm" data-action="layer-up" title="Move Layer Up">&#9650; Up</button>
                            <button class="aero-btn aero-btn-sm" data-action="layer-down" title="Move Layer Down">&#9660; Down</button>
                            <button class="aero-btn aero-btn-sm" data-action="layer-merge" title="Merge Down">Merge</button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.mainCanvas = this.body.querySelector('.paint-main-canvas');
        this.mainCtx = this.mainCanvas.getContext('2d');

        // Default background layer
        this.addLayer('Background Layer');

        this.bindEvents();
    }

    bindEvents() {
        // Top toolbar & layer action buttons
        this.body.querySelectorAll('[data-action]').forEach(btn => {
            this.listen(btn, 'click', () => this.handleAction(btn.dataset.action));
        });

        // Tool palette
        this.body.querySelectorAll('.paint-tool-btn').forEach(btn => {
            this.listen(btn, 'click', () => {
                this.currentTool = btn.dataset.tool;
                this.body.querySelectorAll('.paint-tool-btn').forEach(b => b.classList.toggle('active', b === btn));
            });
        });

        // Size slider
        const sizeRange = this.body.querySelector('.paint-size-range');
        const sizeVal = this.body.querySelector('.paint-size-val');
        this.listen(sizeRange, 'input', (e) => {
            this.currentSize = parseInt(e.target.value, 10);
            sizeVal.textContent = `${this.currentSize}px`;
        });

        // Opacity slider
        const opacityRange = this.body.querySelector('.paint-opacity-range');
        const opacityVal = this.body.querySelector('.paint-opacity-val');
        this.listen(opacityRange, 'input', (e) => {
            this.currentOpacity = parseInt(e.target.value, 10);
            opacityVal.textContent = `${this.currentOpacity}%`;
        });

        // Color swatches + custom picker
        const preview = this.body.querySelector('.paint-color-preview');
        const colorInput = this.body.querySelector('.paint-color-input');
        const swatches = this.body.querySelectorAll('.paint-swatch');
        const syncColor = (hex) => {
            this.currentColor = hex;
            if (preview) preview.style.background = hex;
            swatches.forEach(sw => sw.classList.toggle('selected', sw.dataset.color === hex));
        };
        swatches.forEach(sw => {
            this.listen(sw, 'click', () => {
                syncColor(sw.dataset.color);
                if (colorInput) colorInput.value = sw.dataset.color;
            });
        });
        if (colorInput) this.listen(colorInput, 'input', (e) => syncColor(e.target.value));

        // Active layer opacity slider
        const layerOpacityRange = this.body.querySelector('.paint-layer-opacity-range');
        const layerOpacityVal = this.body.querySelector('.paint-layer-opacity-val');
        this.listen(layerOpacityRange, 'input', (e) => {
            const active = this.getActiveLayer();
            if (active) {
                active.opacity = parseInt(e.target.value, 10) / 100;
                layerOpacityVal.textContent = `${e.target.value}%`;
                this.renderComposite();
                this.renderLayersUI();
            }
        });

        // Canvas + global draw events
        this.listen(this.mainCanvas, 'mousedown', this.boundMouseDown);
        this.listen(window, 'mousemove', this.boundMouseMove);
        this.listen(window, 'mouseup', this.boundMouseUp);
        this.listen(window, 'keydown', this.boundKeyDown);
    }

    handleAction(action) {
        switch (action) {
            case 'new': this.createNewCanvas(); break;
            case 'undo': this.undo(); break;
            case 'redo': this.redo(); break;
            case 'clear-layer': this.clearActiveLayer(); break;
            case 'save': this.openSaveDialog(); break;
            case 'layer-add': this.addLayer(); break;
            case 'layer-del': this.deleteActiveLayer(); break;
            case 'layer-up': this.moveLayer(1); break;
            case 'layer-down': this.moveLayer(-1); break;
            case 'layer-merge': this.mergeActiveLayerDown(); break;
        }
    }

    // ---------------------------------------------------------------------
    // File operations
    // ---------------------------------------------------------------------
    async openSaveDialog() {
        this.renderComposite();
        const name = await showSystemPrompt('Save Artwork', 'Enter a file name to save into Pictures:', this.activeFileName, 'save');
        if (name === null || name.trim() === '') return;
        const dataUrl = this.mainCanvas.toDataURL('image/png');
        const savedName = saveFileToVfsPath('Users/Guest/Pictures', name.trim(), dataUrl);
        if (savedName) {
            this.activeFileName = savedName;
            await showSystemAlert('Artwork Saved', `'${savedName}' has been saved to Pictures.`, 'check');
        } else {
            await showSystemAlert('Save Failed', 'Could not save the artwork to the Pictures folder.', 'error');
        }
    }

    async createNewCanvas() {
        const ok = await showSystemConfirm('New Canvas', 'Create a new blank canvas? All unsaved layers will be cleared.', { okText: 'New Canvas', cancelText: 'Cancel', iconType: 'warning' });
        if (!ok) return;
        this.layers = [];
        this.layerCounter = 1;
        this.history = [];
        this.historyIndex = -1;
        this.addLayer('Background Layer');
    }

    clearActiveLayer() {
        const layer = this.getActiveLayer();
        if (!layer) return;
        layer.ctx.clearRect(0, 0, this.width, this.height);
        if (this.activeLayerIndex === 0) {
            layer.ctx.fillStyle = '#ffffff';
            layer.ctx.fillRect(0, 0, this.width, this.height);
        }
        this.renderComposite();
        this.saveHistoryState();
    }

    // ---------------------------------------------------------------------
    // Layers
    // ---------------------------------------------------------------------
    addLayer(name = null) {
        const layerCanvas = document.createElement('canvas');
        layerCanvas.width = this.width;
        layerCanvas.height = this.height;
        const layerCtx = layerCanvas.getContext('2d');

        const layerName = name || `Layer ${this.layerCounter++}`;
        const newLayer = {
            id: `layer_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: layerName,
            canvas: layerCanvas,
            ctx: layerCtx,
            visible: true,
            opacity: 1.0
        };

        if (this.layers.length === 0) {
            layerCtx.fillStyle = '#ffffff';
            layerCtx.fillRect(0, 0, this.width, this.height);
        }

        const insertIndex = this.layers.length > 0 ? this.activeLayerIndex + 1 : 0;
        this.layers.splice(insertIndex, 0, newLayer);
        this.activeLayerIndex = insertIndex;

        this.renderComposite();
        this.renderLayersUI();
        this.saveHistoryState();
    }

    async deleteActiveLayer() {
        if (this.layers.length <= 1) {
            await showSystemAlert('Cannot Delete Layer', 'At least one layer must remain in the project.', 'warning');
            return;
        }
        this.layers.splice(this.activeLayerIndex, 1);
        this.activeLayerIndex = Math.max(0, this.activeLayerIndex - 1);
        this.renderComposite();
        this.renderLayersUI();
        this.saveHistoryState();
    }

    async mergeActiveLayerDown() {
        if (this.activeLayerIndex <= 0) {
            await showSystemAlert('Cannot Merge Down', 'There is no layer below the active layer.', 'warning');
            return;
        }
        const upperLayer = this.layers[this.activeLayerIndex];
        const lowerLayer = this.layers[this.activeLayerIndex - 1];

        lowerLayer.ctx.save();
        lowerLayer.ctx.globalAlpha = upperLayer.opacity;
        lowerLayer.ctx.drawImage(upperLayer.canvas, 0, 0);
        lowerLayer.ctx.restore();

        this.layers.splice(this.activeLayerIndex, 1);
        this.activeLayerIndex--;
        this.renderComposite();
        this.renderLayersUI();
        this.saveHistoryState();
    }

    moveLayer(direction) {
        const newIndex = this.activeLayerIndex + direction;
        if (newIndex < 0 || newIndex >= this.layers.length) return;
        const temp = this.layers[this.activeLayerIndex];
        this.layers[this.activeLayerIndex] = this.layers[newIndex];
        this.layers[newIndex] = temp;
        this.activeLayerIndex = newIndex;
        this.renderComposite();
        this.renderLayersUI();
        this.saveHistoryState();
    }

    getActiveLayer() {
        return this.layers[this.activeLayerIndex] || this.layers[0];
    }

    renderComposite() {
        if (!this.mainCtx) return;
        this.mainCtx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            if (layer && layer.visible) {
                this.mainCtx.save();
                this.mainCtx.globalAlpha = layer.opacity;
                this.mainCtx.drawImage(layer.canvas, 0, 0);
                this.mainCtx.restore();
            }
        }
    }

    renderLayersUI() {
        const container = this.body.querySelector('.paint-layers-list');
        if (!container) return;
        container.innerHTML = '';

        for (let i = this.layers.length - 1; i >= 0; i--) {
            const layer = this.layers[i];
            const isSelected = i === this.activeLayerIndex;

            const item = document.createElement('div');
            item.className = `paint-layer-item ${isSelected ? 'selected' : ''}`;
            item.innerHTML = `
                <span class="paint-layer-vis-toggle" title="Toggle Visibility">${layer.visible ? getIcon('layerVis') : getIcon('layerHide')}</span>
                <span class="paint-layer-name">${layer.name}</span>
                <span class="paint-layer-pct">${Math.round(layer.opacity * 100)}%</span>
            `;

            item.querySelector('.paint-layer-vis-toggle').addEventListener('click', (e) => {
                e.stopPropagation();
                layer.visible = !layer.visible;
                this.renderComposite();
                this.renderLayersUI();
            });

            item.addEventListener('click', () => {
                this.activeLayerIndex = i;
                this.renderLayersUI();
                const opacityRange = this.body.querySelector('.paint-layer-opacity-range');
                const opacityVal = this.body.querySelector('.paint-layer-opacity-val');
                if (opacityRange) opacityRange.value = Math.round(layer.opacity * 100);
                if (opacityVal) opacityVal.textContent = `${Math.round(layer.opacity * 100)}%`;
            });

            container.appendChild(item);
        }
    }

    // ---------------------------------------------------------------------
    // Canvas drawing
    // ---------------------------------------------------------------------
    getCanvasCoords(e) {
        const rect = this.mainCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.width / rect.width),
            y: (e.clientY - rect.top) * (this.height / rect.height)
        };
    }

    handleMouseDown(e) {
        if (e.button !== 0) return;

        this.isDrawing = false;
        let activeLayer = this.getActiveLayer();
        if (!activeLayer) {
            this.addLayer('Layer 1');
            activeLayer = this.getActiveLayer();
        }

        if (!activeLayer.visible) {
            activeLayer.visible = true;
            this.renderComposite();
            this.renderLayersUI();
        }

        const coords = this.getCanvasCoords(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
        this.startX = coords.x;
        this.startY = coords.y;
        this.isDrawing = true;

        if (this.currentTool === 'fill') {
            this.floodFill(Math.floor(coords.x), Math.floor(coords.y), this.currentColor);
            this.saveHistoryState();
            this.isDrawing = false;
            return;
        }

        this.snapshotImageData = activeLayer.ctx.getImageData(0, 0, this.width, this.height);

        if (this.currentTool === 'pencil' || this.currentTool === 'brush' || this.currentTool === 'eraser') {
            this.drawStroke(activeLayer.ctx, coords.x, coords.y, coords.x, coords.y);
            this.renderComposite();
        }
    }

    handleMouseMove(e) {
        const coords = this.getCanvasCoords(e);
        const posEl = this.body?.querySelector('.paint-cursor-pos');
        if (posEl) posEl.textContent = `Pos: ${Math.round(coords.x)}, ${Math.round(coords.y)}px`;

        if (!this.isDrawing) return;
        const activeLayer = this.getActiveLayer();
        if (!activeLayer) return;

        if (this.currentTool === 'pencil' || this.currentTool === 'brush' || this.currentTool === 'eraser') {
            this.drawStroke(activeLayer.ctx, this.lastX, this.lastY, coords.x, coords.y);
            this.lastX = coords.x;
            this.lastY = coords.y;
            this.renderComposite();
        } else if (['line', 'rect', 'frect', 'circle', 'fcircle'].includes(this.currentTool)) {
            activeLayer.ctx.putImageData(this.snapshotImageData, 0, 0);
            this.drawShapePreview(activeLayer.ctx, this.startX, this.startY, coords.x, coords.y);
            this.renderComposite();
        }
    }

    handleMouseUp() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.saveHistoryState();
    }

    // Freehand stroke rendering for pencil (hard edge), brush (soft gradient) & eraser
    drawStroke(ctx, x1, y1, x2, y2) {
        if (!ctx) return;
        const tool = this.currentTool;
        const size = Math.max(1, isNaN(this.currentSize) ? 6 : Number(this.currentSize));
        const opacity = Math.max(0.01, Math.min(1.0, isNaN(this.currentOpacity) ? 1.0 : (Number(this.currentOpacity) / 100)));
        const color = this.currentColor || '#000000';

        ctx.save();
        ctx.globalCompositeOperation = 'source-over';

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = size * 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        } else if (tool === 'pencil') {
            ctx.globalAlpha = opacity;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        } else {
            // Brush: sub-pixel interpolated soft radial-gradient stamps (gapless)
            const dist = Math.hypot(x2 - x1, y2 - y1);
            const stepSize = Math.max(0.5, size * 0.15);
            const steps = Math.max(1, Math.ceil(dist / stepSize));
            const transparentColor = hexToTransparentRgba(color);

            for (let i = 0; i <= steps; i++) {
                const t = steps === 0 ? 0 : i / steps;
                const px = x1 + (x2 - x1) * t;
                const py = y1 + (y2 - y1) * t;
                const rad = Math.max(1, size / 2);

                ctx.globalAlpha = opacity;
                const grad = ctx.createRadialGradient(px, py, Math.max(0.2, rad * 0.35), px, py, rad);
                grad.addColorStop(0, color);
                grad.addColorStop(1, transparentColor);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(px, py, rad, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    drawShapePreview(ctx, x1, y1, x2, y2) {
        ctx.save();
        ctx.globalAlpha = this.currentOpacity / 100;
        ctx.strokeStyle = this.currentColor;
        ctx.fillStyle = this.currentColor;
        ctx.lineWidth = this.currentSize;

        if (this.currentTool === 'line') {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        } else if (this.currentTool === 'rect') {
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        } else if (this.currentTool === 'frect') {
            ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
        } else if (this.currentTool === 'circle' || this.currentTool === 'fcircle') {
            const rx = Math.abs(x2 - x1) / 2;
            const ry = Math.abs(y2 - y1) / 2;
            const cx = Math.min(x1, x2) + rx;
            const cy = Math.min(y1, y2) + ry;
            ctx.beginPath();
            ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            if (this.currentTool === 'fcircle') ctx.fill(); else ctx.stroke();
        }
        ctx.restore();
    }

    // Breadth-first flood fill (paint bucket), sampled from the composited view
    floodFill(startX, startY, fillColorHex) {
        const activeLayer = this.getActiveLayer();
        if (!activeLayer) return;

        const w = this.width;
        const h = this.height;

        if (startX < 0 || startX >= w || startY < 0 || startY >= h) return;

        const compImgData = this.mainCtx.getImageData(0, 0, w, h);
        const compData = compImgData.data;

        const startIdx = (startY * w + startX) * 4;
        const targetR = compData[startIdx];
        const targetG = compData[startIdx + 1];
        const targetB = compData[startIdx + 2];
        const targetA = compData[startIdx + 3];

        const fillRgba = hexToRgba(fillColorHex, Math.round((this.currentOpacity / 100) * 255));

        if (Math.abs(targetR - fillRgba[0]) < 5 && Math.abs(targetG - fillRgba[1]) < 5 && Math.abs(targetB - fillRgba[2]) < 5 && Math.abs(targetA - fillRgba[3]) < 5) {
            return;
        }

        const layerImgData = activeLayer.ctx.getImageData(0, 0, w, h);
        const layerData = layerImgData.data;

        const visited = new Uint8Array(w * h);
        const queue = [startX, startY];

        while (queue.length > 0) {
            const y = queue.pop();
            const x = queue.pop();
            const pos = y * w + x;

            if (x < 0 || x >= w || y < 0 || y >= h || visited[pos]) continue;
            visited[pos] = 1;

            const idx = pos * 4;
            const curR = compData[idx];
            const curG = compData[idx + 1];
            const curB = compData[idx + 2];
            const curA = compData[idx + 3];

            if (Math.abs(curR - targetR) < 35 && Math.abs(curG - targetG) < 35 && Math.abs(curB - targetB) < 35 && Math.abs(curA - targetA) < 35) {
                layerData[idx] = fillRgba[0];
                layerData[idx + 1] = fillRgba[1];
                layerData[idx + 2] = fillRgba[2];
                layerData[idx + 3] = fillRgba[3];

                if (x + 1 < w) queue.push(x + 1, y);
                if (x - 1 >= 0) queue.push(x - 1, y);
                if (y + 1 < h) queue.push(x, y + 1);
                if (y - 1 >= 0) queue.push(x, y - 1);
            }
        }

        activeLayer.ctx.putImageData(layerImgData, 0, 0);
        this.renderComposite();
    }

    // ---------------------------------------------------------------------
    // Undo / redo history
    // ---------------------------------------------------------------------
    saveHistoryState() {
        const state = this.layers.map(l => ({
            name: l.name,
            visible: l.visible,
            opacity: l.opacity,
            data: l.ctx.getImageData(0, 0, this.width, this.height)
        }));

        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(state);
        if (this.history.length > 20) this.history.shift();
        this.historyIndex = this.history.length - 1;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.applyHistoryState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.applyHistoryState(this.history[this.historyIndex]);
        }
    }

    applyHistoryState(state) {
        if (!state) return;
        this.layers = state.map((s, idx) => {
            const canv = document.createElement('canvas');
            canv.width = this.width;
            canv.height = this.height;
            const cCtx = canv.getContext('2d');
            cCtx.putImageData(s.data, 0, 0);
            return {
                id: `layer_hist_${idx}_${Date.now()}`,
                name: s.name,
                canvas: canv,
                ctx: cCtx,
                visible: s.visible,
                opacity: s.opacity
            };
        });
        this.activeLayerIndex = Math.min(this.activeLayerIndex, this.layers.length - 1);
        this.renderComposite();
        this.renderLayersUI();
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
        } else if (e.ctrlKey && (e.key === 'z' || e.key === 'Z')) {
            e.preventDefault();
            this.undo();
        } else if (e.ctrlKey && (e.key === 'y' || e.key === 'Y')) {
            e.preventDefault();
            this.redo();
        } else if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            this.openSaveDialog();
        } else if (e.ctrlKey && (e.key === 'n' || e.key === 'N')) {
            e.preventDefault();
            this.createNewCanvas();
        }
    }
}

function hexToTransparentRgba(hex) {
    if (!hex || typeof hex !== 'string') return 'rgba(0,0,0,0)';
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    if (isNaN(num)) return 'rgba(0,0,0,0)';
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, 0)`;
}

function hexToRgba(hex, alpha) {
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255, alpha];
}
