// Settings functionality
const Settings = {
    defaults: {
        theme: 'dark',
        autoSave: true,
        showGrid: false,
        showRulers: false,
        hwAccel: true,
        memoryUsage: 'medium'
    },

    init() {
        this.loadSettings();
        this.bindEvents();
    },

    bindEvents() {
        // Settings icon click
        document.querySelector('.settings-icon').addEventListener('click', () => {
            this.openSettings();
        });

        // Close modal on outside click
        document.getElementById('settingsModal').addEventListener('click', (e) => {
            if (e.target.id === 'settingsModal') {
                this.closeSettings();
            }
        });

        // Setting change listeners
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.applyTheme(e.target.value);
        });

        document.getElementById('showGrid').addEventListener('change', (e) => {
            this.toggleGrid(e.target.checked);
        });

        document.getElementById('showRulers').addEventListener('change', (e) => {
            this.toggleRulers(e.target.checked);
        });
    },

    openSettings() {
        document.getElementById('settingsModal').classList.add('show');
        this.populateSettings();
    },

    closeSettings() {
        document.getElementById('settingsModal').classList.remove('show');
    },

    populateSettings() {
        const settings = this.getSettings();
        document.getElementById('themeSelect').value = settings.theme;
        document.getElementById('autoSave').checked = settings.autoSave;
        document.getElementById('showGrid').checked = settings.showGrid;
        document.getElementById('showRulers').checked = settings.showRulers;
        document.getElementById('hwAccel').checked = settings.hwAccel;
        document.getElementById('memoryUsage').value = settings.memoryUsage;
    },

    saveSettings() {
        const settings = {
            theme: document.getElementById('themeSelect').value,
            autoSave: document.getElementById('autoSave').checked,
            showGrid: document.getElementById('showGrid').checked,
            showRulers: document.getElementById('showRulers').checked,
            hwAccel: document.getElementById('hwAccel').checked,
            memoryUsage: document.getElementById('memoryUsage').value
        };

        localStorage.setItem('photoEditorSettings', JSON.stringify(settings));
        this.applySettings(settings);
        this.closeSettings();
        this.showNotification('Settings saved successfully!');
    },

    loadSettings() {
        const saved = localStorage.getItem('photoEditorSettings');
        const settings = saved ? JSON.parse(saved) : this.defaults;
        this.applySettings(settings);
    },

    getSettings() {
        const saved = localStorage.getItem('photoEditorSettings');
        return saved ? JSON.parse(saved) : this.defaults;
    },

    applySettings(settings) {
        this.applyTheme(settings.theme);
        this.toggleGrid(settings.showGrid);
        this.toggleRulers(settings.showRulers);
        this.setHardwareAcceleration(settings.hwAccel);
    },

    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
    },

    toggleGrid(show) {
        const canvas = document.getElementById('mainCanvas');
        if (show && canvas) {
            canvas.style.backgroundImage = 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)';
            canvas.style.backgroundSize = '20px 20px';
        } else if (canvas) {
            canvas.style.backgroundImage = 'none';
        }
    },

    toggleRulers(show) {
        // Add ruler elements if they don't exist
        if (show) {
            this.createRulers();
        } else {
            this.removeRulers();
        }
    },

    createRulers() {
        if (document.querySelector('.ruler-horizontal')) return;

        const canvasArea = document.querySelector('.canvas-area');
        
        const hRuler = document.createElement('div');
        hRuler.className = 'ruler-horizontal';
        hRuler.style.cssText = `
            position: absolute;
            top: 0;
            left: 30px;
            right: 0;
            height: 30px;
            background: rgba(20, 20, 40, 0.9);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 10;
        `;

        const vRuler = document.createElement('div');
        vRuler.className = 'ruler-vertical';
        vRuler.style.cssText = `
            position: absolute;
            top: 30px;
            left: 0;
            bottom: 0;
            width: 30px;
            background: rgba(20, 20, 40, 0.9);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 10;
        `;

        canvasArea.appendChild(hRuler);
        canvasArea.appendChild(vRuler);
    },

    removeRulers() {
        const hRuler = document.querySelector('.ruler-horizontal');
        const vRuler = document.querySelector('.ruler-vertical');
        if (hRuler) hRuler.remove();
        if (vRuler) vRuler.remove();
    },

    setHardwareAcceleration(enabled) {
        const canvas = document.getElementById('mainCanvas');
        if (canvas) {
            canvas.style.willChange = enabled ? 'transform' : 'auto';
        }
    },

    resetSettings() {
        if (confirm('Reset all settings to default?')) {
            localStorage.removeItem('photoEditorSettings');
            this.applySettings(this.defaults);
            this.populateSettings();
            this.showNotification('Settings reset to default');
        }
    },

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

// Global functions for HTML onclick handlers
function openSettings() {
    Settings.openSettings();
}

function closeSettings() {
    Settings.closeSettings();
}

function saveSettings() {
    Settings.saveSettings();
}

function resetSettings() {
    Settings.resetSettings();
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Settings.init();
});