// Zeb OS 3 Aero Explorer
import { getIcon } from '../icons.js';
import { BaseApp } from '../UIKit3/framework/index.js';

export class ExplorerApp extends BaseApp {
    mount() {
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:#f0f3f7; font-family:'Segoe UI', sans-serif; user-select:none;">

                <!-- Address Bar Strip -->
                <div style="background:#e0e5ec; padding:6px 12px; border-bottom:1px solid #d0d7de; display:flex; align-items:center; gap:8px;">
                    <button class="aero-btn" style="padding:3px 8px;">←</button>
                    <button class="aero-btn" style="padding:3px 8px;">→</button>
                    <div style="flex-grow:1; background:#ffffff; border:1px solid #a0a0a0; border-radius:3px; padding:3px 8px; font-size:12px; display:flex; align-items:center; gap:6px;">
                        ${getIcon('explorer')} <span style="font-weight:600; color:#0078d7;">Computer</span> › <span>Users</span> › <span>Guest</span> › <span>Desktop</span>
                    </div>
                </div>

                <!-- Main Split Layout -->
                <div style="flex-grow:1; display:flex; overflow:hidden;">
                    <!-- Glass Navigation Sidebar -->
                    <div style="width:170px; background:rgba(230,235,245,0.7); border-right:1px solid #d0d7de; padding:10px 6px; display:flex; flex-direction:column; gap:4px; font-size:12px;">
                        <div style="font-weight:700; font-size:10px; color:#0078d7; letter-spacing:0.5px; text-transform:uppercase; padding:4px 6px;">Favorite Links</div>
                        <div style="padding:5px 8px; border-radius:3px; cursor:pointer; background:rgba(0,120,215,0.15); color:#0078d7; font-weight:600; display:flex; align-items:center; gap:6px;">${getIcon('explorer')} Desktop</div>
                        <div style="padding:5px 8px; border-radius:3px; cursor:pointer; display:flex; align-items:center; gap:6px;">${getIcon('editor')} Documents</div>
                        <div style="padding:5px 8px; border-radius:3px; cursor:pointer; display:flex; align-items:center; gap:6px;">${getIcon('picture')} Pictures</div>
                    </div>

                    <!-- File Content Grid -->
                    <div style="flex-grow:1; padding:16px; background:#ffffff; display:flex; flex-wrap:wrap; gap:16px; align-content:flex-start;">
                        <div style="width:80px; display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:4px; cursor:pointer;">
                            ${getIcon('editor')}
                            <span style="font-size:11px; text-align:center;">welcome.txt</span>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
}
