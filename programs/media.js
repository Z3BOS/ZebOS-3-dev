// Zeb OS 3 Media Player App (ported from ZebOS 2 programs/media.js)
import { getIcon } from '../icons.js';
import { BaseApp } from '../UIKit3/framework/index.js';
import { getVFSFileContent, showSystemAlert } from '../os3.js';

const SAMPLE_SRC = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_TITLE = 'BigBuckBunny.mp4 (Sample Video)';

export class MediaApp extends BaseApp {
    constructor(onCloseRequest, filePath = null) {
        super(onCloseRequest);
        this.filePath = filePath;

        this.mediaEl = null;
        this.playBtn = null;
        this.seekBar = null;
        this.timeEl = null;
        this.titleEl = null;
        this.visualizerEl = null;

        this.isPlaying = false;
        this.boundKeyDown = (e) => this.handleKeyDown(e);
        this.boundTimeUpdate = () => this.updateProgress();
    }

    mount() {
        this.body.style.height = '100%';

        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:var(--bg-dark,#0f172a); color:var(--text-main,#ffffff); font-family:'Segoe UI', sans-serif; box-sizing:border-box; user-select:none;">

                <!-- Title Header Bar -->
                <div style="background:rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.15); padding:6px 10px; display:flex; justify-content:space-between; align-items:center; gap:10px; flex-shrink:0;">
                    <span class="media-track-title" style="color:var(--accent-cyan,#60a5fa); font-size:12px; font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">Zeb Media Player &mdash; Ready</span>
                    <button class="aero-btn media-open-btn">${getIcon('fileText')} Open...</button>
                </div>

                <!-- Media Viewport Screen -->
                <div style="flex-grow:1; background:#000000; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
                    <video class="media-video-element" style="width:100%; height:100%; max-height:100%; object-fit:contain; background:#000000;"></video>
                    <div class="media-audio-visualizer" style="display:none; flex-direction:column; align-items:center; justify-content:center; gap:10px; position:absolute; inset:0;">
                        <div style="width:64px; height:64px; color:var(--accent-cyan,#60a5fa); display:flex; align-items:center; justify-content:center;">${getIcon('media')}</div>
                        <div style="font-size:12px; color:#4ade80; font-family:'Consolas', monospace; letter-spacing:1px;">AUDIO PLAYBACK ACTIVE</div>
                    </div>
                </div>

                <!-- Media Controls Bar -->
                <div style="background:rgba(2, 6, 23, 0.9); border-top:1px solid rgba(255, 255, 255, 0.12); display:flex; flex-direction:column; gap:8px; padding:8px 10px; flex-shrink:0;">

                    <!-- Seek Slider -->
                    <div style="display:flex; align-items:center; gap:8px;">
                        <input type="range" class="aero-slider media-seek-bar" value="0" min="0" max="100" style="flex-grow:1;">
                        <span class="media-time-text aero-status-item" style="font-family:'Consolas', monospace; font-size:11px; color:var(--text-muted,#94a3b8); width:90px; justify-content:flex-end;">00:00 / 00:00</span>
                    </div>

                    <!-- Buttons: Play, Pause, Stop, Volume Slider -->
                    <div style="display:flex; align-items:center; justify-content:space-between;">
                        <div style="display:flex; gap:6px;">
                            <button class="aero-btn media-ctrl-btn btn-play" title="Play" style="width:34px; height:28px; display:flex; align-items:center; justify-content:center; padding:0;">${getIcon('play')}</button>
                            <button class="aero-btn media-ctrl-btn btn-pause" title="Pause" style="width:34px; height:28px; display:flex; align-items:center; justify-content:center; padding:0;">${getIcon('pause')}</button>
                            <button class="aero-btn media-ctrl-btn btn-stop" title="Stop" style="width:34px; height:28px; display:flex; align-items:center; justify-content:center; padding:0;">${getIcon('stop')}</button>
                        </div>

                        <div style="display:flex; align-items:center; gap:8px;">
                            <span style="width:16px; height:16px; color:var(--text-muted,#94a3b8); display:flex;">${getIcon('volume')}</span>
                            <input type="range" class="aero-slider media-volume-bar" value="80" min="0" max="100" style="width:90px;">
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.mediaEl = this.body.querySelector('.media-video-element');
        this.visualizerEl = this.body.querySelector('.media-audio-visualizer');
        this.titleEl = this.body.querySelector('.media-track-title');
        this.seekBar = this.body.querySelector('.media-seek-bar');
        this.timeEl = this.body.querySelector('.media-time-text');

        const btnPlay = this.body.querySelector('.btn-play');
        const btnPause = this.body.querySelector('.btn-pause');
        const btnStop = this.body.querySelector('.btn-stop');
        const btnOpen = this.body.querySelector('.media-open-btn');
        const volumeBar = this.body.querySelector('.media-volume-bar');

        this.listen(btnPlay, 'click', () => this.play());
        this.listen(btnPause, 'click', () => this.pause());
        this.listen(btnStop, 'click', () => this.stop());

        this.listen(volumeBar, 'input', (e) => {
            if (this.mediaEl) this.mediaEl.volume = e.target.value / 100;
        });
        if (this.mediaEl) this.mediaEl.volume = 0.8;

        this.listen(this.seekBar, 'input', (e) => {
            if (this.mediaEl && this.mediaEl.duration) {
                this.mediaEl.currentTime = (e.target.value / 100) * this.mediaEl.duration;
            }
        });

        this.listen(btnOpen, 'click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*,audio/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    this.filePath = null;
                    this.loadSource(reader.result, file.name);
                };
                reader.readAsDataURL(file);
            };
            input.click();
        });

        this.listen(this.mediaEl, 'timeupdate', this.boundTimeUpdate);
        this.listen(this.mediaEl, 'ended', () => this.stop());
        this.listen(this.mediaEl, 'loadedmetadata', () => this.updateVisualizerMode());
        this.listen(window, 'keydown', this.boundKeyDown);

        // Load a VFS-stored file if one was requested, otherwise the default sample.
        if (this.filePath) {
            this.loadFromVfs(this.filePath);
        } else {
            this.loadSource(SAMPLE_SRC, SAMPLE_TITLE);
        }
    }

    loadFromVfs(path) {
        const content = getVFSFileContent(path);
        if (content) {
            const name = String(path).split('/').filter(Boolean).pop() || path;
            this.loadSource(content, name);
        } else {
            showSystemAlert('Zeb Media Player', `Could not locate media file:\n${path}`, 'warning');
            this.loadSource(SAMPLE_SRC, SAMPLE_TITLE);
        }
    }

    loadSource(src, title) {
        if (!this.mediaEl) return;
        this.mediaEl.src = src;
        this.titleEl.textContent = title;
        this.isPlaying = false;
        this.mediaEl.load();
    }

    updateVisualizerMode() {
        if (!this.mediaEl || !this.visualizerEl) return;
        const isAudioOnly = this.mediaEl.videoWidth === 0 && this.mediaEl.videoHeight === 0;
        this.mediaEl.style.display = isAudioOnly ? 'none' : 'block';
        this.visualizerEl.style.display = isAudioOnly ? 'flex' : 'none';
    }

    play() {
        if (!this.mediaEl || !this.mediaEl.src) return;
        this.mediaEl.play().then(() => {
            this.isPlaying = true;
        }).catch(err => console.log('Playback error:', err));
    }

    pause() {
        if (!this.mediaEl) return;
        this.mediaEl.pause();
        this.isPlaying = false;
    }

    stop() {
        if (!this.mediaEl) return;
        this.mediaEl.pause();
        this.mediaEl.currentTime = 0;
        this.isPlaying = false;
        this.updateProgress();
    }

    updateProgress() {
        if (!this.mediaEl || !this.seekBar || !this.timeEl) return;
        const cur = this.mediaEl.currentTime || 0;
        const dur = this.mediaEl.duration || 0;

        if (dur > 0) {
            this.seekBar.value = (cur / dur) * 100;
        } else {
            this.seekBar.value = 0;
        }

        const formatTime = (sec) => {
            const m = Math.floor(sec / 60).toString().padStart(2, '0');
            const s = Math.floor(sec % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };

        this.timeEl.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            this.close();
        }
    }

    onCleanup() {
        if (this.mediaEl) {
            this.mediaEl.pause();
        }
    }
}
