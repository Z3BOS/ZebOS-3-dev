// Vector SVG Icons for Zeb OS 3 Pre-Alpha 0.0.3

const SVGS = {
    zLogo: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5H20L7 19H20" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    orbLogo: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5H20L7 19H20" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    zeb3Logo: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5H20L7 19H20" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    explorer: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6C3 4.89543 3.89543 4 5 4H10L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" fill="#ffca28" stroke="#f57f17" stroke-width="1.5"/>
            <path d="M3 9H21V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V9Z" fill="#ffe082"/>
        </svg>
    `,
    editor: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="3" width="16" height="18" rx="2" fill="#ffffff" stroke="#0078d7" stroke-width="1.5"/>
            <path d="M8 7H16M8 11H16M8 15H12" stroke="#0078d7" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    terminal: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <path d="M6 9L10 12L6 15" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 15H17" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    paint: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C13.6569 22 15 20.6569 15 19C15 18.25 14.7 17.55 14.2 17.03C13.7 16.5 13.4 15.8 13.4 15C13.4 13.3431 14.7431 12 16.4 12H18C20.2091 12 22 10.2091 22 8C22 4.68629 17.5228 2 12 2Z" fill="#ffffff" stroke="#0078d7" stroke-width="1.5"/>
            <circle cx="6.5" cy="11.5" r="1.5" fill="#ff5252"/>
            <circle cx="9.5" cy="7.5" r="1.5" fill="#ffb74d"/>
            <circle cx="14.5" cy="7.5" r="1.5" fill="#81c784"/>
            <circle cx="17.5" cy="10.5" r="1.5" fill="#64b5f6"/>
        </svg>
    `,
    calc: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="16" height="20" rx="2" fill="#374151" stroke="#1f2937" stroke-width="1.5"/>
            <rect x="6" y="4" width="12" height="4" rx="1" fill="#9ca3af"/>
            <circle cx="8" cy="11" r="1" fill="#ffffff"/>
            <circle cx="12" cy="11" r="1" fill="#ffffff"/>
            <circle cx="16" cy="11" r="1" fill="#3b82f6"/>
            <circle cx="8" cy="15" r="1" fill="#ffffff"/>
            <circle cx="12" cy="15" r="1" fill="#ffffff"/>
            <circle cx="16" cy="15" r="1" fill="#3b82f6"/>
            <circle cx="8" cy="19" r="1" fill="#ffffff"/>
            <circle cx="12" cy="19" r="1" fill="#ffffff"/>
            <circle cx="16" cy="19" r="1" fill="#10b981"/>
        </svg>
    `,
    media: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="3" fill="#0f172a" stroke="#60a5fa" stroke-width="1.5"/>
            <path d="M10 8L16 12L10 16V8Z" fill="#60a5fa"/>
        </svg>
    `,
    taskmgr: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
            <path d="M5 14L9 10L13 14L19 7" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    user: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" fill="#ffffff"/>
            <path d="M5 20C5 16.134 8.13401 13 12 13C15.866 13 19 16.134 19 20" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    winClose: `
        <svg class="sys-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `,
    winMin: `
        <svg class="sys-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 9H10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    winMax: `
        <svg class="sys-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="8" height="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
        </svg>
    `,
    save: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3H17L20 6V20C20 20.6 19.6 21 19 21H5C4.4 21 4 20.6 4 20V4C4 3.4 4.4 3 5 3Z" fill="#0078d7" stroke="#002b66" stroke-width="1.5"/>
            <rect x="7" y="3" width="8" height="5" fill="#ffffff"/>
            <rect x="7" y="13" width="10" height="8" fill="#ffffff"/>
        </svg>
    `,
    grid: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" fill="none" stroke="#0078d7" stroke-width="1.5"/>
            <path d="M9 3V21M15 3V21M3 9H21M3 15H21" stroke="#60a5fa" stroke-width="1.2"/>
        </svg>
    `,
    picture: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="16" rx="2" fill="#ffffff" stroke="#0078d7" stroke-width="1.5"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="#ffb74d"/>
            <path d="M4 17L9 12L13 16L17 11L20 14V18H4V17Z" fill="#81c784"/>
        </svg>
    `
};

export function getIcon(name, customClass = "") {
    const rawSvg = SVGS[name] || SVGS.zLogo;
    if (!customClass) return rawSvg.trim();
    return rawSvg.replace('class="sys-icon"', `class="sys-icon ${customClass}"`).trim();
}
