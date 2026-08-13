# 🌌 Zeb OS 3 — UIKit3 Design System Documentation

Welcome to **UIKit3**, the official Aero Glass design system and component UI library for **Zeb OS 3 Pre-Alpha 0.0.5**.

This documentation serves as a complete reference guide for developers building applications, system dialogs, and OS shell extensions.

---

## 🎨 Core Design Tokens & Aesthetic Standards

Zeb OS 3 uses rich Aero Glass translucency with specular top highlights and subtle border contrast.

- **Theme Palette:**
  - Background Translucency: `rgba(15, 23, 42, 0.94)` to `rgba(15, 23, 42, 0.78)`
  - Glass Blur: `backdrop-filter: blur(24px)` to `blur(32px)`
  - Specular Inset Highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.3)`
  - Accent Primary: `#2563eb` / `#60a5fa`
  - Accent Success: `#10b981` / `#34d399`
  - Accent Danger: `#dc2626` / `#f87171`
- **Typography:** Segoe UI, system-ui, sans-serif (`Consolas` for Terminal & Code)
- **Outer Glow Rule:** Never use outer glow halos (`0 0 10px rgba(...)`) on button hover states or window frames. Keep hover highlights clean using background shifts and inset top specular highlights.

---

## 📁 File Structure Architecture

```text
UIKit3/
├── index.css                 # Master importer file
├── base.css                  # Core CSS tokens & wallpaper background
├── README.md                 # Developer UI Kit documentation
├── framework/
│   ├── base-app.js           # BaseApp abstract class for apps
│   └── index.js              # Framework exports
├── forms/
│   └── form-controls.css     # Buttons, inputs, dropdowns, tabs, dialogs, tables
├── chrome/
│   ├── windows.css           # Glass window frames & control buttons
│   ├── taskbar.css           # Taskbar, start button, open app tabs, tray
│   ├── startmenu.css         # 3-Column Modern Start Menu
│   ├── contextmenu.css       # Translucent Aero Glass context menus
│   └── desktop.css           # Desktop icon grid & marquee selection box
└── screens/
    └── boot-screen.css       # BIOS & boot splash screen
```

---

## 🧰 Component Reference & Code Examples

### 1. Aero Glass Buttons (`.aero-btn`)

High-contrast dark slate glass buttons with specular highlights.

```html
<!-- Standard Aero Button -->
<button class="aero-btn">Save File</button>

<!-- Primary Action Button (Blue Glass) -->
<button class="aero-btn aero-btn-primary">Confirm</button>

<!-- Danger Action Button (Red Glass) -->
<button class="aero-btn aero-btn-danger">Delete</button>
```

---

### 2. Form Inputs & Textareas (`.aero-input`, `.aero-textarea`)

Dark glass text fields with blue focus borders.

```html
<input type="text" class="aero-input" placeholder="Enter username...">

<textarea class="aero-textarea" rows="4" placeholder="Enter document content..."></textarea>
```

---

### 3. Custom Select Dropdowns (`.aero-select`)

Emoji-free custom dropdown menu with inline SVG chevron vector icons.

```html
<select class="aero-select">
    <option value="standard">Standard Mode</option>
    <option value="scientific">Scientific Mode</option>
</select>
```

---

### 4. Title Options / Window Menu Bars (`.aero-menu-bar`)

Standard desktop OS window menu bar for app title option menus.

```html
<div class="aero-menu-bar">
    <div class="aero-menu-item" id="menu-file"><u>F</u>ile</div>
    <div class="aero-menu-item" id="menu-edit"><u>E</u>dit</div>
    <div class="aero-menu-item" id="menu-search"><u>S</u>earch</div>
    <div class="aero-menu-item" id="menu-help"><u>H</u>elp</div>
</div>
```

---

### 5. Tabs & Navigation Bars (`.aero-tab-bar`, `.aero-tab`)

Horizontal mode / section switcher tabs.

```html
<div class="aero-tab-bar">
    <button class="aero-tab active">Standard</button>
    <button class="aero-tab">Scientific</button>
</div>
```

---

### 6. Digital LCD Display Panels (`.aero-lcd`)

Digital readout screen for calculators, statistics, and live telemetry.

```html
<div class="aero-lcd">
    <div class="aero-lcd-subtext">\sin(30^\circ) = 0.5</div>
    <div class="aero-lcd-main">0.5</div>
</div>
```

---

### 7. Status Bars (`.aero-status-bar`)

Bottom status strip for window workspaces.

```html
<div class="aero-status-bar">
    <span class="aero-status-item">Lines: 42 | Chars: 1,024</span>
    <span class="aero-status-item">UTF-8</span>
</div>
```

---

### 8. Data Tables & List Views (`.aero-table`)

Translucent glass table rows with hover highlights.

```html
<table class="aero-table">
    <thead>
        <tr>
            <th>Process Name</th>
            <th>PID</th>
            <th>Memory</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>os3_kernel.exe</td>
            <td>0004</td>
            <td>42 MB</td>
        </tr>
    </tbody>
</table>
```

---

### 9. Progress Bars (`.aero-progress-track`)

```html
<div class="aero-progress-track">
    <div class="aero-progress-fill" style="width: 65%;"></div>
</div>
```

---

### 10. Status Badges & Tags (`.aero-badge`)

```html
<span class="aero-badge aero-badge-info">Information</span>
<span class="aero-badge aero-badge-success">Connected</span>
<span class="aero-badge aero-badge-warning">Pending</span>
<span class="aero-badge aero-badge-danger">Error</span>
```

---

### 11. Custom System Aero Dialogs & Prompts (JavaScript API)

Replaces native browser `alert()` and `prompt()` dialogs with centered OS Aero Glass modals.

```javascript
import { showSystemAlert, showSystemConfirm, showSystemPrompt } from './os3.js';

// 1. Alert Dialog
await showSystemAlert('Document Saved', 'Your file was saved to VFS storage.', 'check');

// 2. Confirmation Dialog (Returns true / false)
const confirmed = await showSystemConfirm('Delete File', 'Are you sure you want to delete this file?', {
    okText: 'Yes, Delete',
    cancelText: 'Cancel',
    iconType: 'warning'
});

// 3. Prompt Input Dialog (Returns string or null)
const path = await showSystemPrompt('Save As', 'Enter VFS file path:', 'Users/Guest/Documents/notes.txt', 'fileText');
if (path) {
    console.log('User entered:', path);
}
```

---

## ⚡ Best Practices

1. **Import via Master UIKit:** Always include `<link rel="stylesheet" href="UIKit3/index.css">` in your main document head.
2. **Never Hardcode Fixed Colors:** Use predefined `var(--main-font)` and system class utilities.
3. **Always Use Vector SVG Icons:** Retrieve system vector SVG icons via `getIcon(name)` from `icons.js`. Do NOT use raw emojis in production UI code.
