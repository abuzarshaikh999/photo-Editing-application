// Panel Improvements - Enhanced functionality for all panels
const PanelManager = {
    presets: {
        basic: {
            portrait: { brightness: 15, contrast: 20, saturation: 10, blur: 0 },
            landscape: { brightness: 10, contrast: 25, saturation: 15, blur: 0 },
            lowLight: { brightness: 30, contrast: 15, saturation: 5, blur: 0 },
            highKey: { brightness: 40, contrast: -10, saturation: 20, blur: 0 }
        },
        color: {
            warm: { hue: 15, sepia: 20, invert: 0 },
            cool: { hue: -15, sepia: 0, invert: 0 },
            vintage: { hue: 25, sepia: 40, invert: 0 },
            monochrome: { hue: 0, sepia: 0, invert: 0 }
        },
        filters: {
            instagram: ['vintage', 'warm', 'vignette'],
            professional: ['dramatic', 'cold', 'soft'],
            artistic: ['vintage', 'grain', 'vignette'],
            natural: ['warm', 'soft']
        }
    },

    init() {
        this.addPresetButtons();
        this.addAdvancedControls();
        this.addPanelEnhancements();
        this.bindEvents();
    },

    addPresetButtons() {
        // Basic panel presets
        const basicPanel = document.getElementById('basic-panel');
        if (basicPanel) {
            const presetsDiv = document.createElement('div');
            presetsDiv.className = 'presets-section';
            presetsDiv.innerHTML = `
                <h5>Quick Presets</h5>
                <div class="preset-grid">
                    <button class="preset-btn" onclick="PanelManager.applyBasicPreset('portrait')">Portrait</button>
                    <button class="preset-btn" onclick="PanelManager.applyBasicPreset('landscape')">Landscape</button>
                    <button class="preset-btn" onclick="PanelManager.applyBasicPreset('lowLight')">Low Light</button>
                    <button class="preset-btn" onclick="PanelManager.applyBasicPreset('highKey')">High Key</button>
                </div>
            `;
            basicPanel.insertBefore(presetsDiv, basicPanel.querySelector('.reset-btn'));
        }

        // Color panel presets
        const colorPanel = document.getElementById('color-panel');
        if (colorPanel) {
            const existingPresets = colorPanel.querySelector('.filter-presets');
            if (existingPresets) {
                existingPresets.innerHTML = `
                    <button class="preset-btn" onclick="PanelManager.applyColorPreset('warm')">Warm</button>
                    <button class="preset-btn" onclick="PanelManager.applyColorPreset('cool')">Cool</button>
                    <button class="preset-btn" onclick="PanelManager.applyColorPreset('vintage')">Vintage</button>
                    <button class="preset-btn" onclick="PanelManager.applyColorPreset('monochrome')">Mono</button>
                `;
            }
        }
    },

    addAdvancedControls() {
        // Add temperature and tint to color panel
        const colorPanel = document.getElementById('color-panel');
        if (colorPanel) {
            const advancedControls = document.createElement('div');
            advancedControls.innerHTML = `
                <div class="control-group">
                    <label>Temperature: <span id="temperatureValue">0</span></label>
                    <input type="range" min="-100" max="100" value="0" class="slider" id="temperatureSlider">
                </div>
                <div class="control-group">
                    <label>Tint: <span id="tintValue">0</span></label>
                    <input type="range" min="-100" max="100" value="0" class="slider" id="tintSlider">
                </div>
                <div class="control-group">
                    <label>Vibrance: <span id="vibranceValue">0</span></label>
                    <input type="range" min="-100" max="100" value="0" class="slider" id="vibranceSlider">
                </div>
            `;
            colorPanel.insertBefore(advancedControls, colorPanel.querySelector('.filter-presets'));
        }

        // Add shadow/highlight to basic panel
        const basicPanel = document.getElementById('basic-panel');
        if (basicPanel) {
            const shadowHighlight = document.createElement('div');
            shadowHighlight.innerHTML = `
                <div class="control-group">
                    <label>Shadows: <span id="shadowsValue">0</span></label>
                    <input type="range" min="-100" max="100" value="0" class="slider" id="shadowsSlider">
                </div>
                <div class="control-group">
                    <label>Highlights: <span id="highlightsValue">0</span></label>
                    <input type="range" min="-100" max="100" value="0" class="slider" id="highlightsSlider">
                </div>
            `;
            basicPanel.insertBefore(shadowHighlight, basicPanel.querySelector('.presets-section'));
        }
    },

    addPanelEnhancements() {
        // Add copy/paste functionality
        this.addCopyPasteButtons();
        
        // Add randomize buttons
        this.addRandomizeButtons();
        
        // Add before/after toggle
        this.addBeforeAfterToggle();
        
        // Add panel search
        this.addPanelSearch();
    },

    addCopyPasteButtons() {
        const panels = ['basic-panel', 'color-panel', 'filters-panel'];
        panels.forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (panel) {
                const copyPasteDiv = document.createElement('div');
                copyPasteDiv.className = 'copy-paste-controls';
                copyPasteDiv.innerHTML = `
                    <div class="tool-grid">
                        <button class="grid-btn" onclick="PanelManager.copySettings('${panelId}')">Copy</button>
                        <button class="grid-btn" onclick="PanelManager.pasteSettings('${panelId}')">Paste</button>
                        <button class="grid-btn" onclick="PanelManager.randomizeSettings('${panelId}')">Random</button>
                    </div>
                `;
                panel.appendChild(copyPasteDiv);
            }
        });
    },

    addRandomizeButtons() {
        // Already included in copy/paste section
    },

    addBeforeAfterToggle() {
        const toolbar = document.querySelector('.canvas-toolbar');
        if (toolbar) {
            const beforeAfterBtn = document.createElement('button');
            beforeAfterBtn.className = 'tool-btn';
            beforeAfterBtn.title = 'Before/After';
            beforeAfterBtn.innerHTML = '👁️';
            beforeAfterBtn.onclick = () => this.toggleBeforeAfter();
            
            const firstGroup = toolbar.querySelector('.toolbar-group');
            if (firstGroup) {
                firstGroup.appendChild(beforeAfterBtn);
            }
        }
    },

    addPanelSearch() {
        const rightPanel = document.querySelector('.right-panel');
        if (rightPanel) {
            const searchDiv = document.createElement('div');
            searchDiv.className = 'panel-search';
            searchDiv.innerHTML = `
                <input type="text" placeholder="Search tools..." class="search-input" id="panelSearch">
            `;
            rightPanel.insertBefore(searchDiv, rightPanel.querySelector('.panel-tabs'));
        }
    },

    bindEvents() {
        // Temperature and tint
        this.bindSlider('temperatureSlider', 'temperatureValue', this.applyTemperature);
        this.bindSlider('tintSlider', 'tintValue', this.applyTint);
        this.bindSlider('vibranceSlider', 'vibranceValue', this.applyVibrance);
        this.bindSlider('shadowsSlider', 'shadowsValue', this.applyShadows);
        this.bindSlider('highlightsSlider', 'highlightsValue', this.applyHighlights);

        // Panel search
        const searchInput = document.getElementById('panelSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchPanels(e.target.value));
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    },

    bindSlider(sliderId, valueId, callback) {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', function() {
                const valueDisplay = document.getElementById(valueId);
                if (valueDisplay) valueDisplay.textContent = this.value;
                callback.call(PanelManager, parseInt(this.value));
            });
        }
    },

    // Preset applications
    applyBasicPreset(presetName) {
        const preset = this.presets.basic[presetName];
        if (!preset) return;

        Object.keys(preset).forEach(key => {
            const slider = document.getElementById(key + 'Slider');
            const value = document.getElementById(key + 'Value');
            if (slider && value) {
                slider.value = preset[key];
                value.textContent = preset[key];
                slider.dispatchEvent(new Event('input'));
            }
        });
        
        showNotification(`Applied ${presetName} preset`);
    },

    applyColorPreset(presetName) {
        const preset = this.presets.color[presetName];
        if (!preset) return;

        Object.keys(preset).forEach(key => {
            const slider = document.getElementById(key + 'Slider');
            const value = document.getElementById(key + 'Value');
            if (slider && value) {
                slider.value = preset[key];
                value.textContent = preset[key];
                slider.dispatchEvent(new Event('input'));
            }
        });
        
        showNotification(`Applied ${presetName} color preset`);
    },

    // Advanced adjustments
    applyTemperature(value) {
        if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) return;
        
        try {
            const canvas = photoEditor.canvas;
            const ctx = photoEditor.ctx;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            const factor = value / 100;
            
            for (let i = 0; i < data.length; i += 4) {
                if (factor > 0) {
                    // Warm (more red/yellow)
                    data[i] = Math.min(255, data[i] * (1 + factor * 0.3));
                    data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.1));
                } else {
                    // Cool (more blue)
                    data[i + 2] = Math.min(255, data[i + 2] * (1 + Math.abs(factor) * 0.3));
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            if (photoEditor.saveState) photoEditor.saveState();
        } catch (error) {
            console.error('Temperature error:', error);
        }
    },

    applyTint(value) {
        if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) return;
        
        try {
            const canvas = photoEditor.canvas;
            const ctx = photoEditor.ctx;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            const factor = value / 100;
            
            for (let i = 0; i < data.length; i += 4) {
                if (factor > 0) {
                    // Magenta tint
                    data[i] = Math.min(255, data[i] * (1 + factor * 0.2));
                    data[i + 2] = Math.min(255, data[i + 2] * (1 + factor * 0.2));
                } else {
                    // Green tint
                    data[i + 1] = Math.min(255, data[i + 1] * (1 + Math.abs(factor) * 0.3));
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            if (photoEditor.saveState) photoEditor.saveState();
        } catch (error) {
            console.error('Tint error:', error);
        }
    },

    applyVibrance(value) {
        if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) return;
        
        try {
            const canvas = photoEditor.canvas;
            const ctx = photoEditor.ctx;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            const factor = value / 100;
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // Calculate saturation
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const saturation = max === 0 ? 0 : (max - min) / max;
                
                // Apply vibrance (affects less saturated colors more)
                const vibranceFactor = factor * (1 - saturation);
                
                data[i] = Math.min(255, Math.max(0, r + (r - (r + g + b) / 3) * vibranceFactor));
                data[i + 1] = Math.min(255, Math.max(0, g + (g - (r + g + b) / 3) * vibranceFactor));
                data[i + 2] = Math.min(255, Math.max(0, b + (b - (r + g + b) / 3) * vibranceFactor));
            }
            
            ctx.putImageData(imageData, 0, 0);
            if (photoEditor.saveState) photoEditor.saveState();
        } catch (error) {
            console.error('Vibrance error:', error);
        }
    },

    applyShadows(value) {
        if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) return;
        
        try {
            const canvas = photoEditor.canvas;
            const ctx = photoEditor.ctx;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            const factor = value / 100;
            
            for (let i = 0; i < data.length; i += 4) {
                const luminance = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
                
                // Only affect shadows (dark areas)
                if (luminance < 128) {
                    const shadowFactor = (128 - luminance) / 128;
                    const adjustment = factor * shadowFactor;
                    
                    data[i] = Math.min(255, Math.max(0, data[i] * (1 + adjustment)));
                    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * (1 + adjustment)));
                    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * (1 + adjustment)));
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            if (photoEditor.saveState) photoEditor.saveState();
        } catch (error) {
            console.error('Shadows error:', error);
        }
    },

    applyHighlights(value) {
        if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) return;
        
        try {
            const canvas = photoEditor.canvas;
            const ctx = photoEditor.ctx;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            const factor = value / 100;
            
            for (let i = 0; i < data.length; i += 4) {
                const luminance = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
                
                // Only affect highlights (bright areas)
                if (luminance > 128) {
                    const highlightFactor = (luminance - 128) / 127;
                    const adjustment = factor * highlightFactor;
                    
                    data[i] = Math.min(255, Math.max(0, data[i] * (1 + adjustment)));
                    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * (1 + adjustment)));
                    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * (1 + adjustment)));
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
            if (photoEditor.saveState) photoEditor.saveState();
        } catch (error) {
            console.error('Highlights error:', error);
        }
    },

    // Utility functions
    copySettings(panelId) {
        const settings = {};
        const panel = document.getElementById(panelId);
        const sliders = panel.querySelectorAll('.slider');
        
        sliders.forEach(slider => {
            settings[slider.id] = slider.value;
        });
        
        localStorage.setItem('copiedSettings_' + panelId, JSON.stringify(settings));
        showNotification('Settings copied');
    },

    pasteSettings(panelId) {
        const settings = JSON.parse(localStorage.getItem('copiedSettings_' + panelId) || '{}');
        
        Object.keys(settings).forEach(sliderId => {
            const slider = document.getElementById(sliderId);
            const valueId = sliderId.replace('Slider', 'Value');
            const value = document.getElementById(valueId);
            
            if (slider && value) {
                slider.value = settings[sliderId];
                value.textContent = settings[sliderId];
                slider.dispatchEvent(new Event('input'));
            }
        });
        
        showNotification('Settings pasted');
    },

    randomizeSettings(panelId) {
        const panel = document.getElementById(panelId);
        const sliders = panel.querySelectorAll('.slider');
        
        sliders.forEach(slider => {
            const min = parseInt(slider.min);
            const max = parseInt(slider.max);
            const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
            
            slider.value = randomValue;
            const valueId = slider.id.replace('Slider', 'Value');
            const valueDisplay = document.getElementById(valueId);
            if (valueDisplay) valueDisplay.textContent = randomValue;
            
            slider.dispatchEvent(new Event('input'));
        });
        
        showNotification('Settings randomized');
    },

    toggleBeforeAfter() {
        if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
            showNotification('Please load an image first');
            return;
        }
        
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        
        if (!this.beforeAfterState) {
            // Show original
            ctx.drawImage(photoEditor.originalImage, 0, 0, canvas.width, canvas.height);
            this.beforeAfterState = true;
            showNotification('Showing original');
        } else {
            // Show edited
            if (photoEditor.applyFilters) photoEditor.applyFilters();
            this.beforeAfterState = false;
            showNotification('Showing edited');
        }
    },

    searchPanels(query) {
        const tabs = document.querySelectorAll('.tab');
        const panels = document.querySelectorAll('.panel-section');
        
        if (!query) {
            tabs.forEach(tab => tab.style.display = 'block');
            return;
        }
        
        tabs.forEach((tab, index) => {
            const tabText = tab.textContent.toLowerCase();
            const panel = panels[index];
            const panelText = panel ? panel.textContent.toLowerCase() : '';
            
            if (tabText.includes(query.toLowerCase()) || panelText.includes(query.toLowerCase())) {
                tab.style.display = 'block';
            } else {
                tab.style.display = 'none';
            }
        });
    },

    handleKeyboard(e) {
        if (e.ctrlKey) {
            switch(e.key) {
                case 'c':
                    if (e.shiftKey) {
                        e.preventDefault();
                        const activePanel = document.querySelector('.panel-section.active');
                        if (activePanel) this.copySettings(activePanel.id);
                    }
                    break;
                case 'v':
                    if (e.shiftKey) {
                        e.preventDefault();
                        const activePanel = document.querySelector('.panel-section.active');
                        if (activePanel) this.pasteSettings(activePanel.id);
                    }
                    break;
                case 'r':
                    if (e.shiftKey) {
                        e.preventDefault();
                        const activePanel = document.querySelector('.panel-section.active');
                        if (activePanel) this.randomizeSettings(activePanel.id);
                    }
                    break;
            }
        }
        
        if (e.key === ' ' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            this.toggleBeforeAfter();
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PanelManager.init();
});