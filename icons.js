// Vector SVG Icons for Zeb OS 3 Pre-Alpha 0.0.5

const SVGS = {
    // System Logos
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

    // Folders & System Directories
    folder: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6C3 4.89543 3.89543 4 5 4H10L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" fill="#ffca28" stroke="#f57f17" stroke-width="1.5"/>
            <path d="M3 9H21V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V9Z" fill="#ffe082"/>
        </svg>
    `,
    docFolder: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6C3 4.89543 3.89543 4 5 4H10L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" fill="#2563eb" stroke="#1d4ed8" stroke-width="1.5"/>
            <rect x="7" y="10" width="10" height="7" rx="1" fill="#ffffff"/>
            <path d="M9 12H15M9 14H13" stroke="#2563eb" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
    `,
    picFolder: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6C3 4.89543 3.89543 4 5 4H10L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" fill="#ffca28" stroke="#f57f17" stroke-width="1.5"/>
            <rect x="7" y="10" width="10" height="7" rx="1" fill="#ffffff"/>
            <circle cx="10" cy="12" r="1" fill="#ff9800"/>
            <path d="M8 16L11 13L13 15L15 13L16 16H8Z" fill="#4caf50"/>
        </svg>
    `,

    // Files
    fileText: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2H14L18 6V20C18 21.1 17.1 22 16 22H8C6.9 22 6 21.1 6 20V2Z" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
            <path d="M14 2V6H18" stroke="#94a3b8" stroke-width="1.5"/>
            <path d="M9 10H15M9 14H15M9 18H13" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    fileCode: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2H14L18 6V20C18 21.1 17.1 22 16 22H8C6.9 22 6 21.1 6 20V2Z" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
            <path d="M9 13L7 15L9 17M15 13L17 15L15 17" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,

    // Hardware & Devices
    computer: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="12" rx="2" fill="#0f172a" stroke="#60a5fa" stroke-width="1.5"/>
            <path d="M5 5H19V13H5V5Z" fill="#1e293b"/>
            <path d="M8 18H16M12 15V18" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
            <rect x="7" y="19" width="10" height="2" rx="1" fill="#475569"/>
        </svg>
    `,
    controlPanel: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <path d="M7 8H17M7 12H17M7 16H17" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="10" cy="8" r="2" fill="#3b82f6"/>
            <circle cx="14" cy="12" r="2" fill="#10b981"/>
            <circle cx="9" cy="16" r="2" fill="#f59e0b"/>
        </svg>
    `,

    // Core Applications
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
    calc: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="16" height="20" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="6" y="4" width="12" height="4" rx="1" fill="#0f172a" stroke="#334155"/>
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
    taskmgr: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
            <path d="M5 14L8 10L11 14L15 8L19 12" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="15" cy="8" r="1.5" fill="#60a5fa"/>
        </svg>
    `,

    // User & Identity
    user: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" fill="#ffffff"/>
            <path d="M5 20C5 16.134 8.13401 13 12 13C15.866 13 19 16.134 19 20" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,

    // Essential Arrow Set
    arrowUp: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    arrowDown: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    arrowLeft: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    arrowRight: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,

    // Chevrons & Dropdown Controls
    chevronUp: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 15L12 9L6 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    chevronDown: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    chevronLeft: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    chevronRight: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    dropdown: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
        </svg>
    `,
    caretDown: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
        </svg>
    `,

    // Actions & Controls
    power: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V12M18.36 6.64A9 9 0 1 1 5.64 6.64" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    `,
    lock: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="11" width="14" height="10" rx="2" fill="#1e293b" stroke="#60a5fa" stroke-width="1.5"/>
            <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    unlock: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="11" width="14" height="10" rx="2" fill="#1e293b" stroke="#60a5fa" stroke-width="1.5"/>
            <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    trash: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6" stroke="#ef4444" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `,
    search: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
            <path d="M20 20L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    refresh: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 12C4 7.58172 7.58172 4 12 4C15.5 4 18.5 6.2 19.5 9.5M20 12C20 16.4183 16.4183 20 12 20C8.5 20 5.5 17.8 4.5 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 9.5H20V5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 14.5H4V18.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    settings: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M19.4 15A1.65 1.65 0 0 0 20 12A1.65 1.65 0 0 0 19.4 9L21 7.4L19 4L16.8 4.8A1.65 1.65 0 0 0 14.4 3.4L14 1H10L9.6 3.4A1.65 1.65 0 0 0 7.2 4.8L5 4L3 7.4L4.6 9A1.65 1.65 0 0 0 4 12A1.65 1.65 0 0 0 4.6 15L3 16.6L5 20L7.2 19.2A1.65 1.65 0 0 0 9.6 20.6L10 23H14L14.4 20.6A1.65 1.65 0 0 0 16.8 19.2L19 20L21 16.6L19.4 15Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
    `,

    // Window Controls
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

    // Status & Dialog Indicators
    check: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `,
    info: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="#60a5fa" stroke-width="2"/>
            <path d="M12 8H12.01M12 11V16" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    warning: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3L2 21H22L12 3Z" stroke="#f59e0b" stroke-width="2" stroke-linejoin="round"/>
            <path d="M12 9V13M12 17H12.01" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    error: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="#ef4444" stroke-width="2"/>
            <path d="M15 9L9 15M9 9L15 15" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `
};

export function getIcon(name, customClass = "") {
    const rawSvg = SVGS[name] || SVGS.zLogo;
    if (!customClass) return rawSvg.trim();
    return rawSvg.replace('class="sys-icon"', `class="sys-icon ${customClass}"`).trim();
}
