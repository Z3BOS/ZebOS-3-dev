// Shared Aero Glass Component Builders for Zeb OS 3

export function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function aeroButton({ label, action = '', icon = '', cls = '' }) {
    return `<button class="app-toolbar-btn ${cls}" ${action ? `data-action="${escapeHtml(action)}"` : ''}>${icon}${escapeHtml(label)}</button>`;
}

export function w95Dropdown({ id = '', options = [], value = '', width = '100%', disabled = false }) {
    const selectedObj = options.find(o => String(o.value) === String(value)) || options[0];
    const selectedLabel = selectedObj ? selectedObj.label : '';
    const selectedVal = selectedObj ? selectedObj.value : '';

    return `
        <div class="w95-dropdown ${disabled ? 'disabled' : ''}" ${id ? `id="${escapeHtml(id)}"` : ''} data-value="${escapeHtml(selectedVal)}" style="width:${width};">
            <div class="w95-drop-display">
                <span class="w95-drop-label">${escapeHtml(selectedLabel)}</span>
                <span class="w95-drop-arrow">▼</span>
            </div>
            <div class="w95-drop-list">
                ${options.map(o => `
                    <div class="w95-drop-item ${String(o.value) === String(selectedVal) ? 'selected' : ''}" data-value="${escapeHtml(o.value)}">
                        ${escapeHtml(o.label)}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

export function bindW95Dropdown(container, selector, onChange) {
    const dropdown = typeof selector === 'string' ? container.querySelector(selector) : selector;
    if (!dropdown) return;

    const display = dropdown.querySelector('.w95-drop-display');
    const list = dropdown.querySelector('.w95-drop-list');
    const label = dropdown.querySelector('.w95-drop-label');

    if (!display || !list) return;

    const close = () => {
        list.classList.remove('open');
        dropdown.classList.remove('open');
    };

    display.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dropdown.classList.contains('disabled')) return;
        const isOpen = list.classList.contains('open');
        document.querySelectorAll('.w95-drop-list.open').forEach(l => l.classList.remove('open'));
        document.querySelectorAll('.w95-dropdown.open').forEach(d => d.classList.remove('open'));
        if (!isOpen) {
            list.classList.add('open');
            dropdown.classList.add('open');
        }
    });

    list.querySelectorAll('.w95-drop-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const newVal = item.dataset.value;
            const newLabel = item.textContent.trim();
            dropdown.dataset.value = newVal;
            if (label) label.textContent = newLabel;
            list.querySelectorAll('.w95-drop-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            close();
            if (typeof onChange === 'function') onChange(newVal, newLabel);
        });
    });

    document.addEventListener('click', close);
}
