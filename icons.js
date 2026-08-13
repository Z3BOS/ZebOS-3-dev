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
    `,

    // ==== Ported ZebOS 2 App Icons (re-skinned to the UIKit3 Aero Glass palette) ====

    explorer: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 6C2 4.9 2.9 4 4 4H10L12 6H20C21.1 6 22 6.9 22 8V17C22 18.1 21.1 19 20 19H4C2.9 19 2 18.1 2 17V6Z" fill="#ffca28" stroke="#f57f17" stroke-width="1.5"/>
            <rect x="7" y="10" width="10" height="6" rx="1" fill="#0f172a" stroke="#60a5fa" stroke-width="1"/>
            <circle cx="10" cy="13" r="1.3" fill="#60a5fa"/>
        </svg>
    `,
    personalize: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="13" rx="1.5" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="4" y="5" width="16" height="9" fill="#0f172a"/>
            <path d="M14 8L18 4C18.5 3.5 19.5 3.5 20 4C20.5 4.5 20.5 5.5 20 6L16 10L14 8Z" fill="#60a5fa" stroke="#1d4ed8" stroke-width="0.8"/>
            <circle cx="13" cy="10.5" r="1.5" fill="#f59e0b"/>
            <rect x="8" y="18" width="8" height="2" rx="1" fill="#475569"/>
        </svg>
    `,
    regedit: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="18" height="14" rx="1.5" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="3" y="6" width="18" height="4" rx="1.5" fill="#334155"/>
            <line x1="6" y1="13" x2="15" y2="13" stroke="#60a5fa" stroke-width="1.2"/>
            <line x1="6" y1="16" x2="13" y2="16" stroke="#60a5fa" stroke-width="1.2"/>
            <circle cx="17.5" cy="16" r="3" fill="#0f172a" stroke="#60a5fa" stroke-width="1"/>
            <circle cx="17.5" cy="15.2" r="0.8" fill="#60a5fa"/>
        </svg>
    `,
    run: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="4" y="6" width="16" height="4" fill="#0f172a"/>
            <path d="M7 13V19H12" stroke="#94a3b8" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="8" y1="16" x2="14" y2="16" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
            <polygon points="15,13.3 20,16 15,18.7" fill="#10b981"/>
        </svg>
    `,
    reinstall: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="20" height="12" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <line x1="2" y1="14" x2="22" y2="14" stroke="#475569" stroke-width="1"/>
            <rect x="5" y="9" width="8" height="2" fill="#60a5fa"/>
            <path d="M15 15.5C15 13.6 16.6 12 18.5 12C19.6 12 20.6 12.5 21.2 13.4" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round" fill="none"/>
            <polygon points="21.2,11.2 21.6,13.7 19.1,13.3" fill="#ef4444"/>
            <path d="M22 17.5C22 19.4 20.4 21 18.5 21C17.4 21 16.4 20.5 15.8 19.6" stroke="#ef4444" stroke-width="1.6" stroke-linecap="round" fill="none"/>
            <polygon points="15.8,21.8 15.4,19.3 17.9,19.7" fill="#ef4444"/>
        </svg>
    `,
    sysflags: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
            <line x1="7" y1="4" x2="7" y2="14" stroke="#60a5fa" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M7 5H15L12 8L15 11H7" fill="#f59e0b" stroke="#f59e0b" stroke-width="0.8" stroke-linejoin="round"/>
            <line x1="5" y1="17" x2="19" y2="17" stroke="#475569" stroke-width="1.4" stroke-linecap="round"/>
            <line x1="5" y1="20" x2="14" y2="20" stroke="#475569" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
    `,
    recovery: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" fill="#0f172a" stroke="#f59e0b" stroke-width="1.6"/>
            <path d="M8 9C8.7 7.8 10.2 7 12 7C14.8 7 17 9.2 17 12C17 14.8 14.8 17 12 17C9.7 17 7.8 15.4 7.2 13.3" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round" fill="none"/>
            <polygon points="7.2,17.2 6.6,13.1 10.5,13.9" fill="#f59e0b"/>
        </svg>
    `,
    vm: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="2" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="5" y="5" width="14" height="7" fill="#0f172a" stroke="#475569" stroke-width="1"/>
            <line x1="7" y1="8" x2="14" y2="8" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="8" cy="16" r="1.4" fill="#10b981"/>
            <circle cx="12" cy="16" r="1.4" fill="#f59e0b"/>
            <circle cx="16" cy="16" r="1.4" fill="#60a5fa"/>
        </svg>
    `,
    activitycenter: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
            <rect x="4" y="9" width="7" height="6" rx="1" fill="#1e293b" stroke="#60a5fa" stroke-width="1"/>
            <path d="M7.5 10.5L6 12.5H8L6.5 14.5" stroke="#60a5fa" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="13" y="9" width="7" height="6" rx="1" fill="#1e293b" stroke="#a78bfa" stroke-width="1"/>
            <circle cx="16.5" cy="12" r="2" fill="none" stroke="#a78bfa" stroke-width="1.2"/>
            <rect x="4" y="17" width="16" height="3" rx="1" fill="#1e293b" stroke="#334155" stroke-width="0.8"/>
            <rect x="5.5" y="18" width="8" height="1" fill="#10b981"/>
        </svg>
    `,
    courgette: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 19C4 16 3 11 5 7C7 3 12 2 16 4C19 6 21 11 19 16C17 20 11 21 7 19Z" fill="#10b981" stroke="#047857" stroke-width="1.5"/>
            <path d="M8 7C10 5.5 14 5.5 17 8" stroke="#6ee7b7" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="10" cy="12" r="1" fill="#d1fae5"/>
            <circle cx="14" cy="15" r="1" fill="#d1fae5"/>
        </svg>
    `,
    media: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="4" y="6" width="16" height="10" fill="#0f172a"/>
            <polygon points="10,8 15,11 10,14" fill="#60a5fa"/>
            <rect x="4" y="17" width="16" height="2" rx="1" fill="#334155"/>
            <rect x="4" y="17" width="7" height="2" rx="1" fill="#60a5fa"/>
        </svg>
    `,
    viewer: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="18" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="4" y="5" width="16" height="11" fill="#0f172a" stroke="#334155" stroke-width="1"/>
            <circle cx="8" cy="8.5" r="1.5" fill="#fbbf24"/>
            <path d="M4 15L9 10L14 15L16 13L20 16V16H4V15Z" fill="#10b981"/>
            <rect x="5" y="18" width="14" height="1.5" fill="#3b82f6"/>
        </svg>
    `,
    picture: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="3" width="20" height="18" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="4" y="5" width="16" height="14" fill="#0f172a"/>
            <circle cx="8" cy="9" r="1.8" fill="#fbbf24"/>
            <path d="M4 17L9 11L14 16L16 14L20 18H4V17Z" fill="#10b981"/>
        </svg>
    `,
    camera: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="7" width="20" height="14" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="8" y="4" width="8" height="4" rx="1" fill="#334155" stroke="#475569" stroke-width="1"/>
            <circle cx="12" cy="14" r="5" fill="#0f172a" stroke="#60a5fa" stroke-width="1.5"/>
            <circle cx="12" cy="14" r="2.4" fill="#60a5fa"/>
            <circle cx="18" cy="10.5" r="1" fill="#ef4444"/>
        </svg>
    `,
    grid: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <path d="M9 3V21M15 3V21M3 9H21M3 15H21" stroke="currentColor" stroke-width="1.1"/>
        </svg>
    `,
    paint: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C13.1 22 14 21.1 14 20C14 19.5 13.8 19.04 13.48 18.7C13.16 18.36 13 17.9 13 17.4C13 16.3 13.9 15.4 15 15.4H17C19.76 15.4 22 13.16 22 10.4C22 5.76 17.52 2 12 2Z" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5"/>
            <circle cx="6.5" cy="11.5" r="1.5" fill="#ef4444"/>
            <circle cx="9.5" cy="6.5" r="1.5" fill="#3b82f6"/>
            <circle cx="14.5" cy="6.5" r="1.5" fill="#10b981"/>
            <circle cx="17.5" cy="10.5" r="1.5" fill="#fbbf24"/>
        </svg>
    `,
    mines: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="13" r="7" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
            <line x1="12" y1="3" x2="12" y2="6" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
            <line x1="5" y1="6" x2="7" y2="8" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
            <line x1="19" y1="6" x2="17" y2="8" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
            <line x1="2" y1="13" x2="5" y2="13" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
            <line x1="19" y1="13" x2="22" y2="13" stroke="#475569" stroke-width="2" stroke-linecap="round"/>
            <circle cx="10" cy="11" r="1.5" fill="#ffffff"/>
            <path d="M12 2C13.5 2 14.5 1 16 1.5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    flag: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="6" y1="4" x2="6" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <polygon points="6,4 18,8 6,12" fill="#ef4444"/>
        </svg>
    `,
    smileyNormal: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#0f172a" stroke-width="1.5"/>
            <circle cx="8.5" cy="9.5" r="1.5" fill="#0f172a"/>
            <circle cx="15.5" cy="9.5" r="1.5" fill="#0f172a"/>
            <path d="M7 14.5C8.5 17 15.5 17 17 14.5" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    smileyDead: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#0f172a" stroke-width="1.5"/>
            <path d="M7 7L10 10M10 7L7 10" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M14 7L17 10M17 7L14 10" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 16C10 14 14 14 16 16" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    smileyCool: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#0f172a" stroke-width="1.5"/>
            <path d="M5 8.5H19V11.5C19 11.5 16 13 14 11.5C12 10 12 10 10 11.5C8 13 5 11.5 5 11.5V8.5Z" fill="#0f172a"/>
            <path d="M7 15C9 17 15 17 17 15" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    snake: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
            <rect x="5" y="5" width="4" height="4" fill="#10b981"/>
            <rect x="9" y="5" width="4" height="4" fill="#10b981"/>
            <rect x="13" y="5" width="4" height="4" fill="#6ee7b7"/>
            <rect x="13" y="9" width="4" height="4" fill="#10b981"/>
            <rect x="13" y="13" width="4" height="4" fill="#10b981"/>
            <rect x="9" y="13" width="4" height="4" fill="#10b981"/>
            <rect x="5" y="15" width="3" height="3" fill="#ef4444"/>
        </svg>
    `,
    solitaire: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="12" height="17" rx="1.5" fill="#f8fafc" stroke="#0f172a" stroke-width="1.2" transform="rotate(-8 8 12)"/>
            <path d="M13 9L14 7L15 9L17 9.5L15 10.5L14 12.5L13 10.5L11 9.5Z" fill="#ef4444" transform="rotate(-8 14 9)"/>
            <rect x="9" y="3" width="12" height="17" rx="1.5" fill="#f8fafc" stroke="#0f172a" stroke-width="1.2"/>
            <path d="M15 7C15 7 12 9.5 12 12C12 13.5 13.2 14.5 15 14.5C16.8 14.5 18 13.5 18 12C18 9.5 15 7 15 7Z" fill="#0f172a"/>
            <rect x="13.5" y="14" width="3" height="4" fill="#0f172a"/>
        </svg>
    `,
    chess: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <rect x="2" y="2" width="5" height="5" fill="#0f172a"/>
            <rect x="12" y="2" width="5" height="5" fill="#0f172a"/>
            <rect x="7" y="7" width="5" height="5" fill="#0f172a"/>
            <rect x="17" y="7" width="5" height="5" fill="#0f172a"/>
            <rect x="2" y="12" width="5" height="5" fill="#0f172a"/>
            <rect x="12" y="12" width="5" height="5" fill="#0f172a"/>
            <rect x="7" y="17" width="5" height="5" fill="#0f172a"/>
            <rect x="17" y="17" width="5" height="5" fill="#0f172a"/>
            <path d="M12 6C10.9 6 10 6.9 10 8C10 8.6 10.3 9.1 10.7 9.5L9.5 16H14.5L13.3 9.5C13.7 9.1 14 8.6 14 8C14 6.9 13.1 6 12 6Z" fill="#60a5fa" stroke="#1d4ed8" stroke-width="0.8"/>
            <rect x="9" y="16" width="6" height="2" fill="#60a5fa" stroke="#1d4ed8" stroke-width="0.8"/>
        </svg>
    `,
    play: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="6,4 19,12 6,20" fill="currentColor"/>
        </svg>
    `,
    pause: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
        </svg>
    `,
    stop: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="5" width="14" height="14" fill="currentColor"/>
        </svg>
    `,
    volume: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="3,9 7,9 12,5 12,19 7,15 3,15" fill="currentColor"/>
            <path d="M15 9C16.5 10.5 16.5 13.5 15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M18 6C21 9 21 15 18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    pencil: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
        </svg>
    `,
    brush: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 14C5.5 14 4 15.5 4 17C4 18.5 5 20 7 20C8.5 20 10 19 10 17.5C10 16 8.5 14 7 14ZM20.7 4.3C20.3 3.9 19.7 3.9 19.3 4.3L11 12.6L12.4 14L20.7 5.7C21.1 5.3 21.1 4.7 20.7 4.3Z" fill="currentColor"/>
        </svg>
    `,
    eraser: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.14 3C14.63 3 14.12 3.2 13.73 3.59L2.59 14.73C1.81 15.51 1.81 16.78 2.59 17.56L6.44 21.41C6.83 21.8 7.34 22 7.85 22H21V20H11.41L18.97 12.44C19.75 11.66 19.75 10.39 18.97 9.61L15.12 5.76C14.73 5.37 14.22 5.18 13.71 5.18" fill="#fca5a5" stroke="currentColor" stroke-width="1.3"/>
        </svg>
    `,
    line: `<svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    rect: `<svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    circle: `<svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
    frect: `<svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" fill="currentColor"/></svg>`,
    fcircle: `<svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>`,
    fill: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 11L13 5L5 13L11 19L19 11Z" fill="#60a5fa" stroke="currentColor" stroke-width="1.4"/>
            <path d="M19 11C20.5 12.5 21 14.5 19.5 16C18 17.5 16 17 14.5 15.5" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    clear: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#ef4444"/>
        </svg>
    `,
    save: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z" fill="#60a5fa"/>
        </svg>
    `,
    layerAdd: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#334155" stroke="currentColor" stroke-width="1.3"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.3"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="1.3"/>
            <circle cx="18" cy="18" r="4" fill="#10b981"/>
            <line x1="18" y1="16" x2="18" y2="20" stroke="#ffffff" stroke-width="1.5"/>
            <line x1="16" y1="18" x2="20" y2="18" stroke="#ffffff" stroke-width="1.5"/>
        </svg>
    `,
    layerDel: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#334155" stroke="currentColor" stroke-width="1.3"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="1.3"/>
            <circle cx="18" cy="18" r="4" fill="#ef4444"/>
            <line x1="16" y1="18" x2="20" y2="18" stroke="#ffffff" stroke-width="1.5"/>
        </svg>
    `,
    layerVis: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="4" fill="#60a5fa"/>
        </svg>
    `,
    layerHide: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" fill="none" stroke="#475569" stroke-width="1.5"/>
            <line x1="3" y1="3" x2="21" y2="21" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
    `,
    home: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V10.5Z" fill="#1e293b" stroke="#60a5fa" stroke-width="1.5"/>
            <rect x="10" y="15" width="4" height="6" fill="#60a5fa"/>
        </svg>
    `,
    drive: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="20" height="12" rx="2" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
            <line x1="2" y1="14" x2="22" y2="14" stroke="#475569" stroke-width="1"/>
            <circle cx="18" cy="10" r="1" fill="#10b981"/>
            <rect x="5" y="9" width="8" height="2" fill="#60a5fa"/>
        </svg>
    `,
    newFolder: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6C3 4.89543 3.89543 4 5 4H10L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" fill="#ffca28" stroke="#f57f17" stroke-width="1.5"/>
            <circle cx="16" cy="14" r="5" fill="#10b981"/>
            <line x1="16" y1="11" x2="16" y2="17" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="13" y1="14" x2="19" y2="14" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    up: `<svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L4 14H9V20H15V14H20L12 4Z" fill="currentColor"/></svg>`,
    back: `<svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    timer: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="13" r="8" fill="#0f172a" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 9V13L15 15" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M10 2H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
    `,
    delete: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 7H18M9 7V5C9 4.4 9.4 4 10 4H14C14.6 4 15 4.4 15 5V7M17 7V19C17 19.6 16.6 20 16 20H8C7.4 20 7 19.6 7 19V7" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M10 11V16M14 11V16" stroke="#ef4444" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
    `,
    zoomIn: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="10" y1="7" x2="10" y2="13" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
            <line x1="7" y1="10" x2="13" y2="10" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    zoomOut: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
            <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="7" y1="10" x2="13" y2="10" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `,
    zoomFit: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" stroke-width="1.6" fill="none"/>
            <path d="M7 10V7H10" stroke="#60a5fa" stroke-width="1.8"/>
            <path d="M17 10V7H14" stroke="#60a5fa" stroke-width="1.8"/>
            <path d="M7 14V17H10" stroke="#60a5fa" stroke-width="1.8"/>
            <path d="M17 14V17H14" stroke="#60a5fa" stroke-width="1.8"/>
        </svg>
    `,
    rotCw: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C16.4 4 20 7.6 20 12C20 16.4 16.4 20 12 20C8.5 20 5.5 17.8 4.4 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
            <polygon points="12,1 12,7 17,4" fill="currentColor"/>
        </svg>
    `,
    rotCcw: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4C7.6 4 4 7.6 4 12C4 16.4 7.6 20 12 20C15.5 20 18.5 17.8 19.6 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
            <polygon points="12,1 12,7 7,4" fill="currentColor"/>
        </svg>
    `,
    flipH: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="12" y1="3" x2="12" y2="21" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3"/>
            <polygon points="4,12 8,8 8,16" fill="currentColor"/>
            <polygon points="20,12 16,8 16,16" fill="currentColor"/>
        </svg>
    `,
    flipV: `
        <svg class="sys-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="3" y1="12" x2="21" y2="12" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3"/>
            <polygon points="12,4 8,8 16,8" fill="currentColor"/>
            <polygon points="12,20 8,16 16,16" fill="currentColor"/>
        </svg>
    `
};

export function getIcon(name, customClass = "") {
    const rawSvg = SVGS[name] || SVGS.zLogo;
    if (!customClass) return rawSvg.trim();
    return rawSvg.replace('class="sys-icon"', `class="sys-icon ${customClass}"`).trim();
}
