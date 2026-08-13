# 🎨 Zeb OS 3 — UIKit3 Complete CSS Class Reference Guide

Welcome to the **UIKit3 CSS Reference Manual**. This document provides an exhaustive, 100% comprehensive catalog of every single CSS class, selector, variable, and design token available in the **UIKit3 Design System** for **Zeb OS 3 Pre-Alpha 0.0.5**.

Other developers can reference this manual to style any UI element, window, form control, navigation bar, or OS shell extension using pure CSS.

---

## 📑 Master Index of CSS Modules

1. **[Design Tokens & Base CSS (`base.css`)](#1-design-tokens--base-css-basecss)**
2. **[Form Controls & Components (`forms/form-controls.css`)](#2-form-controls--components-formsform-controlscss)**
   - Buttons & Toolbar Actions
   - Inputs, Textareas & Custom Dropdowns
   - Checkboxes, Radios & Sliders
   - Window Title Options / Menu Bars
   - Tabs & Navigation Bars
   - Digital LCD Readout Panels
   - Status Bars & Footers
   - Data Tables & List Views
   - Progress Trackers
   - Badges & Tags
   - Modal Dialogs & Centered Prompts
3. **[Window Manager Chrome (`chrome/windows.css`)](#3-window-manager-chrome-chromewindowscss)**
4. **[Taskbar & System Tray (`chrome/taskbar.css`)](#4-taskbar--system-tray-chrometaskbarcss)**
5. **[Start Menu Layout (`chrome/startmenu.css`)](#5-start-menu-layout-chromestartmenucss)**
6. **[Context Menus & Submenus (`chrome/contextmenu.css`)](#6-context-menus--submenus-chromecontextmenucss)**
7. **[Desktop Canvas & Icons (`chrome/desktop.css`)](#7-desktop-canvas--icons-chromedesktopcss)**
8. **[Boot & Splash Screens (`screens/boot-screen.css`)](#8-boot--splash-screens-screensboot-screencss)**

---

## 1. Design Tokens & Base CSS (`base.css`)

### 🎨 CSS Custom Properties (`:root`)

```css
:root {
    --bg-dark: #0f172a;
    --aero-glass-bg: rgba(15, 23, 42, 0.78);
    --aero-border: rgba(255, 255, 255, 0.25);
    --accent-blue: #2563eb;
    --accent-cyan: #60a5fa;
    --text-main: #ffffff;
    --text-muted: #94a3b8;
    --main-font: 'Segoe UI', system-ui, -apple-system, sans-serif;
    --code-font: 'Consolas', 'Courier New', monospace;
    --glass-reflection: inset 0 1px 0 rgba(255, 255, 255, 0.3);
    --window-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
}
```

### 🛠️ Global Base Utility Classes

| Class Name | Target Element | Description |
| :--- | :--- | :--- |
| `.desktop-wallpaper` | `<body>` | Fits fullscreen background wallpaper (`background-size: cover; background-position: center;`) |
| `.hidden-view` | Any HTML Element | Force hides an element from DOM layout (`display: none !important;`) |
| `.sys-icon` | `<svg>` | Standard vector SVG icon styling (`width: 16px; height: 16px; flex-shrink: 0; fill: none; stroke: currentColor;`) |

---

## 2. Form Controls & Components (`forms/form-controls.css`)

### 🔘 Buttons & Action Controls

| Class Name | Description | Markup Example |
| :--- | :--- | :--- |
| `.aero-btn` | Standard dark slate Aero glass button | `<button class="aero-btn">Save</button>` |
| `.app-toolbar-btn` | Alias for toolbar buttons | `<button class="app-toolbar-btn">New</button>` |
| `.aero-btn-primary` | Call-to-action primary blue glass button | `<button class="aero-btn aero-btn-primary">Submit</button>` |
| `.aero-btn-danger` | Destructive red glass button | `<button class="aero-btn aero-btn-danger">Delete</button>` |

#### CSS Classes & States:
- `.aero-btn:hover`: Smooth background shift to `#2563eb` with top specular highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.4)`). Zero outer glow halos.
- `.aero-btn:active`: Pressed state (`background: rgba(15, 23, 42, 0.85)`).

---

### 📝 Text Inputs, Textareas & Custom Select Dropdowns

| Class Name | Element | Description |
| :--- | :--- | :--- |
| `.aero-input` | `<input type="text">` | Translucent dark glass single-line text input with `#60a5fa` focus border |
| `.aero-textarea` | `<textarea>` | Translucent dark glass multi-line text area with `#60a5fa` focus border |
| `.aero-select` | `<select>` | Emoji-free custom select dropdown with inline SVG chevron vector arrow |

```html
<!-- Text Input -->
<input type="text" class="aero-input" placeholder="Enter text...">

<!-- Multi-line Text Area -->
<textarea class="aero-textarea" rows="4" placeholder="Enter notes..."></textarea>

<!-- Custom Select Dropdown -->
<select class="aero-select">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
</select>
```

---

### ☑️ Checkboxes, Radios & Sliders

| Class Name | Element | Description |
| :--- | :--- | :--- |
| `.aero-checkbox` | `<input type="checkbox">` | Custom styled square glass checkbox |
| `.aero-radio` | `<input type="radio">` | Custom styled circular glass radio button |
| `.aero-slider` | `<input type="range">` | Custom styled range slider with glass thumb handle |

```html
<!-- Checkbox -->
<label><input type="checkbox" class="aero-checkbox"> Enable Feature</label>

<!-- Radio Group -->
<label><input type="radio" name="opt" class="aero-radio" checked> Option A</label>
<label><input type="radio" name="opt" class="aero-radio"> Option B</label>

<!-- Range Slider -->
<input type="range" class="aero-slider" min="0" max="100" value="50">
```

---

### 📋 Title Options / Window Menu Bars (`.aero-menu-bar`)

Top window menu bar component for desktop application title options.

| Class Name | Element | Description |
| :--- | :--- | :--- |
| `.aero-menu-bar` | `<div>` | Top window menu bar container (`background: rgba(15, 23, 42, 0.95);`) |
| `.aero-menu-item` | `<div>` | Individual menu option item (`File`, `Edit`, `Search`, `Help`) |
| `.aero-menu-item:hover` | `<div>` | Active hover highlight state (`background: rgba(59, 130, 246, 0.35);`) |

```html
<div class="aero-menu-bar">
    <div class="aero-menu-item" id="menu-file"><u>F</u>ile</div>
    <div class="aero-menu-item" id="menu-edit"><u>E</u>dit</div>
    <div class="aero-menu-item" id="menu-search"><u>S</u>earch</div>
    <div class="aero-menu-item" id="menu-help"><u>H</u>elp</div>
</div>
```

---

### 📑 Tabs & Navigation Bars (`.aero-tab-bar`)

| Class Name | Element | Description |
| :--- | :--- | :--- |
| `.aero-tab-bar` | `<div>` | Horizontal tab strip container |
| `.aero-tab` | `<button>` | Individual tab button |
| `.aero-tab.active` | `<button>` | Active highlighted tab (`background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);`) |

```html
<div class="aero-tab-bar">
    <button class="aero-tab active">Standard Mode</button>
    <button class="aero-tab">Scientific Mode</button>
</div>
```

---

### 🧮 Digital LCD Readout Panels (`.aero-lcd`)

| Class Name | Element | Description |
| :--- | :--- | :--- |
| `.aero-lcd` | `<div>` | Dark digital LCD screen container (`font-family: Consolas`) |
| `.aero-lcd-subtext` | `<div>` | Formula / history subtext line (`color: #94a3b8`) |
| `.aero-lcd-main` | `<div>` | Primary bold numeric readout (`color: #60a5fa`) |

```html
<div class="aero-lcd">
    <div class="aero-lcd-subtext">12.5 \times 4</div>
    <div class="aero-lcd-main">50</div>
</div>
```

---

### 📊 Status Bars & Footers (`.aero-status-bar`)

| Class Name | Element | Description |
| :--- | :--- | :--- |
| `.aero-status-bar` | `<div>` | Bottom window workspace status strip |
| `.aero-status-item` | `<span>` | Status indicator item |

```html
<div class="aero-status-bar">
    <span class="aero-status-item">Lines: 12 \| Chars: 450</span>
    <span class="aero-status-item">UTF-8</span>
</div>
```

---

### 📅 Data Tables & List Views (`.aero-table`)

| Class Name | Element | Description |
| :--- | :--- | :--- |
| `.aero-table` | `<table>` | Full-width glass data table |
| `.aero-table th` | `<th>` | Header cell with dark slate glass fill |
| `.aero-table td` | `<td>` | Data cell with subtle bottom border |
| `.aero-table tr:hover td` | `<tr>` | Row hover selection highlight (`background: rgba(59, 130, 246, 0.25);`) |

```html
<table class="aero-table">
    <thead>
        <tr><th>Name</th><th>PID</th><th>Status</th></tr>
    </thead>
    <tbody>
        <tr><td>os3_kernel.exe</td><td>0004</td><td>Running</td></tr>
    </tbody>
</table>
```

---

### 📈 Progress Trackers (`.aero-progress-track`)

| Class Name | Element | Description |
| :--- | :--- | :--- |
| `.aero-progress-track` | `<div>` | Inset dark progress bar track container |
| `.aero-progress-fill` | `<div>` | Glowing blue gradient progress fill bar |

```html
<div class="aero-progress-track">
    <div class="aero-progress-fill" style="width: 75%;"></div>
</div>
```

---

### 🏷️ Badges & Status Tags (`.aero-badge`)

| Class Name | Color Variant | Description |
| :--- | :--- | :--- |
| `.aero-badge` | Default Slate | Neutral pill status badge |
| `.aero-badge-info` | Blue | Information badge |
| `.aero-badge-success` | Green | Success / Connected badge |
| `.aero-badge-warning` | Yellow | Warning badge |
| `.aero-badge-danger` | Red | Danger / Error badge |

```html
<span class="aero-badge aero-badge-info">Active</span>
<span class="aero-badge aero-badge-success">OK</span>
<span class="aero-badge aero-badge-warning">Pending</span>
<span class="aero-badge aero-badge-danger">Failed</span>
```

---

### 💬 Modal Dialogs & Centered Prompts

| Selector / Class Name | Description |
| :--- | :--- |
| `#system-dialog-overlay` | Fixed fullscreen backdrop overlay (`background: rgba(2, 6, 23, 0.65); backdrop-filter: blur(8px);`) |
| `.aero-dialog` | Centered modal dialog box (`background: rgba(15, 23, 42, 0.96); backdrop-filter: blur(32px);`) |
| `.aero-dialog-header` | Header titlebar bar with vector icon and title |
| `.aero-dialog-body` | Dialog body message content zone |
| `.aero-dialog-body-content` | Flex wrapper for icon + text message |
| `.aero-dialog-footer` | Action button footer strip |

```html
<div id="system-dialog-overlay">
    <div class="aero-dialog">
        <div class="aero-dialog-header">
            <svg class="sys-icon" viewBox="0 0 24 24"><path d="..."/></svg>
            <span>System Alert</span>
        </div>
        <div class="aero-dialog-body">
            <div class="aero-dialog-body-content">
                <svg class="sys-icon" viewBox="0 0 24 24"><path d="..."/></svg>
                <div>File saved successfully.</div>
            </div>
        </div>
        <div class="aero-dialog-footer">
            <button class="aero-btn aero-btn-primary">OK</button>
        </div>
    </div>
</div>
```

---

## 3. Window Manager Chrome (`chrome/windows.css`)

Classes for floating OS app window frames and titlebars.

| Class Name | Element | Description |
| :--- | :--- | :--- |
| `#window-workspace` | `<div>` | Workspace layer holding all floating app windows |
| `.window-frame` | `<div>` | Floating Aero Glass window container |
| `.window-frame.active` | `<div>` | Active focused window (high z-index & bright border highlight) |
| `.window-titlebar` | `<div>` | Top draggable titlebar strip (`background: linear-gradient(180deg, rgba(30, 41, 59, 0.95)...)`) |
| `.window-title` | `<span>` | Window header title string |
| `.win-controls` | `<div>` | Window control buttons group (`_`, `□`, `X`) |
| `.win-btn` | `<button>` | Base window control button |
| `.win-btn:hover` | `<button>` | White hover state |
| `.win-btn.close-btn:hover` | `<button>` | Red close button hover state (`background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);`) |
| `.window-body` | `<div>` | Inner app container viewport (`flex-grow: 1`) |

```html
<div class="window-frame active" style="width: 600px; height: 420px; top: 100px; left: 200px;">
    <div class="window-titlebar">
        <svg class="sys-icon" viewBox="0 0 24 24"><path d="..."/></svg>
        <span class="window-title">App Title</span>
        <div class="win-controls">
            <button class="win-btn win-min">-</button>
            <button class="win-btn win-max">□</button>
            <button class="win-btn close-btn">✕</button>
        </div>
    </div>
    <div class="window-body">
        <!-- App HTML Content -->
    </div>
</div>
```

---

## 4. Taskbar & System Tray (`chrome/taskbar.css`)

Classes for the bottom Aero Glass taskbar, start button, app tabs, system tray, and Show Desktop bar.

| Selector / Class Name | Description |
| :--- | :--- |
| `#system-taskbar` | Fixed bottom taskbar bar (`height: 40px; bottom: 0; width: 100vw; backdrop-filter: blur(24px);`) |
| `#start-button` | Clean white **Z** logo Start button container |
| `#start-button:hover` | Start button hover highlight |
| `#taskbar-tabs-zone` | Open app tabs horizontal container |
| `.taskbar-tab` | Translucent glass open app tab button |
| `.taskbar-tab.active-tab` | Active window tab highlight (`background: rgba(59, 130, 246, 0.35); border-color: #60a5fa;`) |
| `#system-tray` | Far-right system tray status container |
| `.tray-icon-item` | Tray icon button (`Network`, `Volume`, `Expand`) |
| `.tray-clock-zone` | Live 2-line date & clock readout |
| `#show-desktop-bar` | Aero Glass peek bar on far right taskbar edge |

---

## 5. Start Menu Layout (`chrome/startmenu.css`)

Classes for the 3-Column Modern Aero Start Menu.

| Selector / Class Name | Description |
| :--- | :--- |
| `#start-menu` | 3-Column Start Menu container (`width: 640px; height: 520px; bottom: 40px; left: 0; backdrop-filter: blur(32px);`) |
| `#start-nav-rail` | **Column 1:** Far-left navigation rail strip (`width: 48px; background: rgba(10, 15, 30, 0.96);`) |
| `.start-rail-top`, `.start-rail-bottom` | Top & bottom rail button groups |
| `.start-rail-btn` | Standard rail button container (`36px` x `36px`) |
| `.start-rail-avatar` | User avatar button container (`36px` x `36px`) |
| `#start-app-list` | **Column 2:** Middle scrollable app list (`width: 220px; background: rgba(20, 30, 50, 0.85);`) |
| `.start-section-title` | Section title header (`Recently added`) |
| `.start-letter-group` | Alphabetical header (`C`, `T`, `Z`) |
| `.start-list-item` | App list item row card |
| `#start-tile-grid` | **Column 3:** Right 2-column Aero Glass tile grid area |
| `.start-tile-section` | Tile section container |
| `.start-tile-section-title` | Section title header string |
| `.start-tiles-container` | 2-Column CSS Grid container |
| `.aero-tile` | Aero Glass tile card (`height: 80px; backdrop-filter: blur(16px);`) |
| `.aero-tile:hover` | Tile hover state (`background: linear-gradient(180deg, rgba(37, 99, 235, 0.85)...); transform: translateY(-2px);`) |
| `.aero-tile-label` | Tile text label |

---

## 6. Context Menus & Submenus (`chrome/contextmenu.css`)

Classes for the context menu engine.

| Class Name | Description |
| :--- | :--- |
| `.retro-context-menu` | Translucent dark Aero Glass context menu popup (`background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(24px);`) |
| `.context-menu-item` | Context menu option row |
| `.context-menu-item:hover` | Row hover highlight (`background: #2563eb; color: #ffffff;`) |
| `.context-menu-separator` | 1px horizontal separator line |
| `.submenu-arrow` | Right chevron vector SVG indicator for submenus |

---

## 7. Desktop Canvas & Icons (`chrome/desktop.css`)

Classes for desktop icon grids, watermark, and drag selection.

| Selector / Class Name | Description |
| :--- | :--- |
| `#desktop-canvas` | Fullscreen desktop workspace canvas (`width: 100vw; height: calc(100vh - 40px);`) |
| `#desktop-icons-zone` | Grid container for desktop shortcuts |
| `.desktop-icon` | Desktop shortcut card (`width: 80px;`) |
| `.desktop-icon.selected` | Selected desktop shortcut highlight |
| `.desktop-icon-label` | Shortcut label string |
| `#desktop-watermark` | Bottom-right desktop build watermark |
| `.desktop-selection-box` | Marquee drag selection box rectangle (`background: rgba(59, 130, 246, 0.2); border: 1px stroke #60a5fa;`) |

---

## 8. Boot & Splash Screens (`screens/boot-screen.css`)

Classes for BIOS and boot splash screens.

| Selector / Class Name | Description |
| :--- | :--- |
| `#bios-screen` | Fullscreen retro BIOS boot screen (`background: #000000; font-family: Consolas;`) |
| `#boot-screen` | Fullscreen boot splash screen (`background: #020617;`) |
| `.boot-screen-content` | Centered boot logo, title, and progress bar container |
| `#boot-progress-track` | Progress bar track container |
| `#boot-progress-bar` | Progress bar fill line (`background: linear-gradient(90deg, #2563eb, #60a5fa);`) |
