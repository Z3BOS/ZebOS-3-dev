// Zeb OS 3 — First-time Sign-In / Logon Screen (UIKit3 Aero-Glass)
//
// Ported from ZebOS 2's logon/logon.js. os3.js only calls this on a user's
// very first boot — once they've signed in, os3.js remembers the username
// and avatar and skips this screen on every later boot. Any username is
// accepted; this is a local single-user guest session, not real auth.
// Builds and tears down its own full-screen overlay (reusing the
// UIKit3/screens/logon-screen.css scaffold), so os3.js just calls
// showLogonScreen() and gets a username + avatar path back.

import { playSystemSound } from '../os3.js';
import { getIcon } from '../icons.js';
import { escapeHtml } from '../UIKit3/framework/ui.js';

const AVATARS = [
    { file: 'avatar-zebra.svg',  label: 'Zebra' },
    { file: 'avatar-robot.svg',  label: 'Robot' },
    { file: 'avatar-cat.svg',    label: 'Cat' },
    { file: 'avatar-ghost.svg',  label: 'Ghost' },
    { file: 'avatar-star.svg',   label: 'Star' },
    { file: 'avatar-rocket.svg', label: 'Rocket' }
];
const AVATAR_DIR = 'assets/avatars/';

export function showLogonScreen(onComplete, defaultUsername = 'Guest', defaultAvatarPath = null) {
    const screen = document.createElement('div');
    screen.id = 'logon-screen';

    // Fall back to the first avatar if the requested default isn't one of ours.
    let selectedAvatarPath = defaultAvatarPath && AVATARS.some(a => AVATAR_DIR + a.file === defaultAvatarPath)
        ? defaultAvatarPath
        : AVATAR_DIR + AVATARS[0].file;

    const avatarOptionsHtml = AVATARS.map(a => {
        const path = AVATAR_DIR + a.file;
        const selectedCls = path === selectedAvatarPath ? ' selected' : '';
        return `<button type="button" class="logon-avatar-option${selectedCls}" data-avatar-path="${escapeHtml(path)}" title="${escapeHtml(a.label)}">
            <img src="${escapeHtml(path)}" alt="${escapeHtml(a.label)}">
        </button>`;
    }).join('');

    screen.innerHTML = `
        <div class="logon-card">
            <div class="logon-header">
                ${getIcon('zLogo', 'logon-logo-icon')}
                <div class="logon-title">Zeb OS 3</div>
            </div>
            <div class="logon-subtitle">Welcome — let's get you set up</div>

            <img class="logon-avatar" id="logon-avatar-preview" src="${escapeHtml(selectedAvatarPath)}" alt="Selected avatar">

            <div class="logon-avatar-picker">${avatarOptionsHtml}</div>

            <div class="logon-username-field">
                <div class="logon-username">Username</div>
                <input type="text" class="aero-input" id="logon-username-input" value="${escapeHtml(defaultUsername)}" autocomplete="off" spellcheck="false">
            </div>

            <button type="button" class="aero-btn aero-btn-primary logon-signin-btn" id="logon-signin-btn">
                ${getIcon('unlock')}<span>Sign In</span>
            </button>

            <div class="logon-hint">Any username works — this account is remembered on this device from now on.</div>
        </div>
    `;

    document.body.appendChild(screen);

    const avatarPreview = screen.querySelector('#logon-avatar-preview');
    const avatarButtons = Array.from(screen.querySelectorAll('.logon-avatar-option'));
    const userInput = screen.querySelector('#logon-username-input');
    const signInBtn = screen.querySelector('#logon-signin-btn');

    function selectAvatar(path) {
        selectedAvatarPath = path;
        avatarPreview.src = path;
        avatarButtons.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.avatarPath === path);
        });
        playSystemSound('click');
    }

    avatarButtons.forEach(btn => {
        btn.addEventListener('click', () => selectAvatar(btn.dataset.avatarPath));
    });

    userInput.focus();
    userInput.select();

    function completeSignIn() {
        const username = userInput.value.trim() || 'Guest';
        playSystemSound('click');
        screen.remove();
        onComplete(username, selectedAvatarPath);
    }

    signInBtn.addEventListener('click', completeSignIn);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') completeSignIn();
    });
}
