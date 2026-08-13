// Zeb OS 3 Task Manager App
import { BaseApp } from '../UIKit3/framework/index.js';
import { getActiveWindowsList, closeWindow } from '../os3.js';

export class TaskMgrApp extends BaseApp {
    mount() {
        this.render(`
            <div style="display:flex; flex-direction:column; height:100%; background:#f0f3f7; font-family:'Segoe UI', sans-serif; padding:10px;">
                <div style="font-weight:700; font-size:13px; color:#0078d7; margin-bottom:8px;">Running Applications & Processes</div>
                <div class="task-list" style="flex-grow:1; background:#ffffff; border:1px solid #cbd5e1; border-radius:4px; padding:6px; overflow-y:auto; display:flex; flex-direction:column; gap:4px;"></div>
                <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
                    <button class="aero-btn refresh-btn">Refresh</button>
                    <button class="aero-btn end-btn" style="background:#ef4444; color:#fff; border-color:#dc2626;">End Task</button>
                </div>
            </div>
        `);

        const list = this.body.querySelector('.task-list');
        const endBtn = this.body.querySelector('.end-btn');
        const refreshBtn = this.body.querySelector('.refresh-btn');
        let selectedWinId = null;

        const updateList = () => {
            list.innerHTML = '';
            const windows = getActiveWindowsList();
            if (windows.length === 0) {
                list.innerHTML = '<div style="padding:10px; color:#64748b; font-size:12px;">No running applications.</div>';
                return;
            }
            windows.forEach(w => {
                const row = document.createElement('div');
                row.className = 'task-row';
                row.style.cssText = `padding:6px 10px; border-radius:3px; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:space-between; ${selectedWinId === w.id ? 'background:#0078d7; color:#ffffff;' : ''}`;
                row.innerHTML = `<span>${w.title}</span><span style="font-size:10px; opacity:0.8;">PID: ${w.id}</span>`;
                row.addEventListener('click', () => {
                    selectedWinId = w.id;
                    updateList();
                });
                list.appendChild(row);
            });
        };

        refreshBtn.addEventListener('click', updateList);
        endBtn.addEventListener('click', () => {
            if (selectedWinId) {
                closeWindow(selectedWinId);
                selectedWinId = null;
                updateList();
            }
        });

        updateList();
    }
}
