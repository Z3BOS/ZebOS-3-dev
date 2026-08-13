// BaseApp class for Zeb OS 3 Pre-Alpha 0.0.1
export class BaseApp {
    constructor(onCloseRequest) {
        this.onCloseRequest = onCloseRequest;
        this.body = null;
        this.windowId = null;
        this.listeners = [];
    }

    open(bodyElement) {
        this.body = bodyElement;
        this.mount();
    }

    mount() {}

    render(htmlString) {
        if (this.body) {
            this.body.innerHTML = htmlString;
        }
    }

    listen(target, type, handler) {
        if (!target) return;
        target.addEventListener(type, handler);
        this.listeners.push({ target, type, handler });
    }

    close() {
        if (typeof this.onCloseRequest === 'function') {
            this.onCloseRequest();
        }
    }

    cleanup() {
        this.listeners.forEach(({ target, type, handler }) => {
            if (target && target.removeEventListener) {
                target.removeEventListener(type, handler);
            }
        });
        this.listeners = [];
        this.onCleanup();
    }

    onCleanup() {}
}
