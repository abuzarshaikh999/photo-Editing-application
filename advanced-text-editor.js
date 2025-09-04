// Advanced Text Editor with Canvas Integration
class AdvancedTextEditor {
    constructor() {
        this.textElements = [];
        this.selectedElement = null;
        this.dragData = null;
        this.resizeData = null;
        this.rotateData = null;
        this.layerCounter = 1;
        this.init();
    }

    init() {
        this.enhanceTextPanel();
        this.setupEventListeners();
        this.createContextToolbar();
    }

    enhanceTextPanel() {
        const textPanel = document.getElementById('text-panel');
        if (!textPanel) return;

        // Replace existing content with advanced editor
        textPanel.innerHTML = `
            <h4>Text & Typography</h4>
            
            <!-- Add Text Button -->
            <div class="text-canvas-controls">
                <button class="add-text-btn" id="addTextBtn">+ Add Text</button>
            </div>
            
            <!-- Text Content -->
            <div class="control-group">
                <label>Text Content</label>
                <input type="text" id="textContent" placeholder="Double-click to edit" class="text-input" value="Sample Text">
            </div>
            
            <!-- Font Controls -->
            <div class="control-group">
                <label>Font Family</label>
                <select id="fontFamily" class="text-input">
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Impact">Impact</option>
                    <option value="Comic Sans MS">Comic Sans MS</option>
                </select>
            </div>
            
            <div class="control-group">
                <label>Font Size: <span id="fontSizeValue">32px</span></label>
                <input type="range" min="12" max="120" value="32" class="slider" id="fontSize">
            </div>
            
            <div class="control-group">
                <label>Text Color</label>
                <input type="color" id="textColor" value="#ffffff" class="color-picker">
            </div>
            
            <!-- Style Controls -->
            <div class="style-controls">
                <button class="style-btn" id="boldBtn" data-style="bold">B</button>
                <button class="style-btn" id="italicBtn" data-style="italic">I</button>
                <button class="style-btn" id="underlineBtn" data-style="underline">U</button>
                <button class="style-btn" id="strikeBtn" data-style="strike">S</button>
            </div>
            
            <!-- Alignment -->
            <div class="alignment-controls">
                <button class="align-btn active" data-align="left">⬅️</button>
                <button class="align-btn" data-align="center">↔️</button>
                <button class="align-btn" data-align="right">➡️</button>
            </div>
            
            <!-- Effects -->
            <div class="effect-controls">
                <div class="toggle-row">
                    <div class="toggle-switch" id="strokeToggle">Stroke</div>
                    <div class="toggle-switch" id="shadowToggle">Shadow</div>
                    <div class="toggle-switch" id="blurToggle">Blur</div>
                </div>
            </div>
            
            <!-- Opacity -->
            <div class="control-group">
                <label>Opacity: <span id="opacityValue">100%</span></label>
                <input type="range" min="0" max="100" value="100" class="slider" id="textOpacity">
            </div>
            
            <!-- Presets -->
            <div class="preset-controls">
                <button class="preset-btn" data-preset="shadow">Shadow</button>
                <button class="preset-btn" data-preset="glow">Glow</button>
                <button class="preset-btn" data-preset="outline">Outline</button>
                <button class="preset-btn" data-preset="gradient">Gradient</button>
            </div>
            
            <!-- Animation Tab -->
            <div class="animation-tab">
                <h5>Animation</h5>
                <div class="control-group">
                    <label>Animation Type</label>
                    <select id="animationType" class="text-input">
                        <option value="none">None</option>
                        <option value="fadeIn">Fade In</option>
                        <option value="slideUp">Slide Up</option>
                        <option value="bounce">Bounce</option>
                        <option value="typewriter">Typewriter</option>
                        <option value="pulse">Pulse</option>
                    </select>
                </div>
                <div class="animation-controls">
                    <button class="grid-btn" id="previewAnimation">▶️ Preview</button>
                    <button class="grid-btn" id="stopAnimation">⏹️ Stop</button>
                </div>
            </div>
            
            <!-- Layers Panel -->
            <div class="text-layers">
                <h5>Text Layers</h5>
                <div class="layers-list" id="textLayersList">
                    <div class="empty-layers">No text layers</div>
                </div>
            </div>
        `;

        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .add-text-btn {
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #00ff88, #00cc6a);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                margin-bottom: 15px;
                transition: all 0.3s ease;
            }
            
            .add-text-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,255,136,0.3);
            }
            
            .style-controls {
                display: flex;
                gap: 8px;
                margin: 10px 0;
            }
            
            .style-btn {
                width: 40px;
                height: 40px;
                border: 2px solid rgba(255,255,255,0.2);
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 6px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .style-btn.active {
                background: #00ff88;
                border-color: #00ff88;
            }
            
            .alignment-controls {
                display: flex;
                gap: 8px;
                margin: 10px 0;
            }
            
            .align-btn {
                flex: 1;
                padding: 8px;
                border: 2px solid rgba(255,255,255,0.2);
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .align-btn.active {
                background: #00ff88;
                border-color: #00ff88;
            }
            
            .effect-controls {
                margin: 15px 0;
            }
            
            .toggle-row {
                display: flex;
                gap: 8px;
            }
            
            .toggle-switch {
                flex: 1;
                padding: 8px 12px;
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 6px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
            }
            
            .toggle-switch.active {
                background: #00ff88;
                border-color: #00ff88;
            }
            
            .preset-controls {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin: 15px 0;
            }
            
            .preset-btn {
                padding: 8px 12px;
                background: rgba(255,255,255,0.1);
                border: 2px solid rgba(255,255,255,0.2);
                color: white;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
            }
            
            .preset-btn:hover {
                background: rgba(0,255,136,0.2);
                border-color: #00ff88;
            }
            
            .animation-controls {
                display: flex;
                gap: 8px;
                margin: 10px 0;
            }
            
            .text-layers {
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }
            
            .layers-list {
                max-height: 150px;
                overflow-y: auto;
            }
            
            .layer-item {
                display: flex;
                align-items: center;
                padding: 8px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 6px;
                margin-bottom: 5px;
                cursor: pointer;
            }
            
            .layer-item.selected {
                background: rgba(0,255,136,0.2);
                border-color: #00ff88;
            }
            
            .layer-controls {
                display: flex;
                gap: 5px;
                margin-left: auto;
            }
            
            .layer-btn {
                width: 24px;
                height: 24px;
                border: none;
                background: rgba(255,255,255,0.1);
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .text-element {
                position: absolute;
                cursor: move;
                user-select: none;
                border: 2px dashed transparent;
                padding: 5px;
                min-width: 50px;
                min-height: 20px;
                z-index: 100;
            }
            
            .text-element.selected {
                border-color: #00ff88;
            }
            
            .text-element .resize-handle {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #00ff88;
                border: 1px solid white;
                border-radius: 50%;
            }
            
            .text-element .resize-handle.nw { top: -4px; left: -4px; cursor: nw-resize; }
            .text-element .resize-handle.ne { top: -4px; right: -4px; cursor: ne-resize; }
            .text-element .resize-handle.sw { bottom: -4px; left: -4px; cursor: sw-resize; }
            .text-element .resize-handle.se { bottom: -4px; right: -4px; cursor: se-resize; }
            
            .text-element .rotate-handle {
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                width: 12px;
                height: 12px;
                background: #ff6b6b;
                border: 1px solid white;
                border-radius: 50%;
                cursor: grab;
            }
            
            .context-toolbar {
                position: absolute;
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 8px;
                padding: 8px;
                display: none;
                z-index: 1000;
                gap: 8px;
            }
            
            .context-toolbar button {
                padding: 6px 12px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Add text button
        const addBtn = document.getElementById('addTextBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.addTextElement());
        }

        // Style controls
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                this.updateSelectedText();
            });
        });

        // Alignment controls
        document.querySelectorAll('.align-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateSelectedText();
            });
        });

        // Toggle switches
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                this.updateSelectedText();
            });
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.applyPreset(btn.dataset.preset);
            });
        });

        // Input controls
        ['textContent', 'fontSize', 'fontFamily', 'textColor', 'textOpacity'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.updateSelectedText());
            }
        });

        // Animation controls
        const previewBtn = document.getElementById('previewAnimation');
        const stopBtn = document.getElementById('stopAnimation');
        
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewAnimation());
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopAnimation());
        }
    }

    addTextElement() {
        const canvasArea = document.querySelector('.canvas-area');
        if (!canvasArea) return;

        const textElement = document.createElement('div');
        textElement.className = 'text-element';
        textElement.contentEditable = true;
        textElement.textContent = 'Double-click to edit';
        textElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            font-family: Arial;
            color: #ffffff;
            z-index: 100;
        `;

        // Add resize handles
        ['nw', 'ne', 'sw', 'se'].forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${pos}`;
            textElement.appendChild(handle);
        });

        // Add rotation handle
        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'rotate-handle';
        textElement.appendChild(rotateHandle);

        canvasArea.appendChild(textElement);
        this.textElements.push(textElement);
        
        this.setupTextElementEvents(textElement);
        this.selectTextElement(textElement);
        this.addToLayersList(textElement);
    }

    setupTextElementEvents(element) {
        // Double-click to edit
        element.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            element.focus();
        });

        // Click to select
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectTextElement(element);
        });

        // Drag functionality
        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return;
            
            this.dragData = {
                element: element,
                startX: e.clientX,
                startY: e.clientY,
                initialX: element.offsetLeft,
                initialY: element.offsetTop
            };
        });

        // Resize functionality
        element.querySelectorAll('.resize-handle').forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.startResize(element, handle.className.split(' ')[1], e);
            });
        });

        // Rotation functionality
        const rotateHandle = element.querySelector('.rotate-handle');
        if (rotateHandle) {
            rotateHandle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.startRotation(element, e);
            });
        }
    }

    selectTextElement(element) {
        // Remove selection from all elements
        this.textElements.forEach(el => el.classList.remove('selected'));
        
        // Select current element
        element.classList.add('selected');
        this.selectedElement = element;
        
        // Update panel controls
        this.updatePanelFromElement(element);
        
        // Update layers list
        this.updateLayersSelection(element);
    }

    updatePanelFromElement(element) {
        const textContent = document.getElementById('textContent');
        const fontSize = document.getElementById('fontSize');
        const fontFamily = document.getElementById('fontFamily');
        const textColor = document.getElementById('textColor');
        
        if (textContent) textContent.value = element.textContent;
        if (fontSize) fontSize.value = parseInt(element.style.fontSize) || 32;
        if (fontFamily) fontFamily.value = element.style.fontFamily.replace(/['"]/g, '') || 'Arial';
        if (textColor) textColor.value = this.rgbToHex(element.style.color) || '#ffffff';
    }

    updateSelectedText() {
        if (!this.selectedElement) return;
        
        const textContent = document.getElementById('textContent')?.value || '';
        const fontSize = document.getElementById('fontSize')?.value || '32';
        const fontFamily = document.getElementById('fontFamily')?.value || 'Arial';
        const textColor = document.getElementById('textColor')?.value || '#ffffff';
        const opacity = document.getElementById('textOpacity')?.value || '100';
        
        this.selectedElement.textContent = textContent;
        this.selectedElement.style.fontSize = fontSize + 'px';
        this.selectedElement.style.fontFamily = fontFamily;
        this.selectedElement.style.color = textColor;
        this.selectedElement.style.opacity = opacity / 100;
        
        this.applyTextStyles();
        this.updateLayerName(this.selectedElement);
    }

    applyTextStyles() {
        if (!this.selectedElement) return;
        
        const bold = document.getElementById('boldBtn')?.classList.contains('active');
        const italic = document.getElementById('italicBtn')?.classList.contains('active');
        const underline = document.getElementById('underlineBtn')?.classList.contains('active');
        const strike = document.getElementById('strikeBtn')?.classList.contains('active');
        
        this.selectedElement.style.fontWeight = bold ? 'bold' : 'normal';
        this.selectedElement.style.fontStyle = italic ? 'italic' : 'normal';
        
        let textDecoration = '';
        if (underline) textDecoration += 'underline ';
        if (strike) textDecoration += 'line-through ';
        this.selectedElement.style.textDecoration = textDecoration.trim();
        
        // Apply effects
        this.applyEffects();
    }

    applyEffects() {
        if (!this.selectedElement) return;
        
        const stroke = document.getElementById('strokeToggle')?.classList.contains('active');
        const shadow = document.getElementById('shadowToggle')?.classList.contains('active');
        const blur = document.getElementById('blurToggle')?.classList.contains('active');
        
        this.selectedElement.style.webkitTextStroke = stroke ? '1px #00ff88' : '';
        this.selectedElement.style.textShadow = shadow ? '2px 2px 4px rgba(0,0,0,0.7)' : '';
        this.selectedElement.style.filter = blur ? 'blur(1px)' : '';
    }

    applyPreset(preset) {
        if (!this.selectedElement) return;
        
        switch (preset) {
            case 'shadow':
                this.selectedElement.style.textShadow = '3px 3px 6px rgba(0,0,0,0.8)';
                break;
            case 'glow':
                this.selectedElement.style.textShadow = '0 0 10px #00ff88, 0 0 20px #00ff88';
                break;
            case 'outline':
                this.selectedElement.style.webkitTextStroke = '2px #00ff88';
                this.selectedElement.style.webkitTextFillColor = 'transparent';
                break;
            case 'gradient':
                this.selectedElement.style.background = 'linear-gradient(45deg, #00ff88, #0099ff)';
                this.selectedElement.style.webkitBackgroundClip = 'text';
                this.selectedElement.style.webkitTextFillColor = 'transparent';
                break;
        }
    }

    addToLayersList(element) {
        const layersList = document.getElementById('textLayersList');
        if (!layersList) return;
        
        // Remove empty state
        const emptyState = layersList.querySelector('.empty-layers');
        if (emptyState) emptyState.remove();
        
        const layerItem = document.createElement('div');
        layerItem.className = 'layer-item';
        layerItem.innerHTML = `
            <span class="layer-name">Text Layer ${this.layerCounter++}</span>
            <div class="layer-controls">
                <button class="layer-btn" onclick="advancedTextEditor.toggleLayerVisibility(this)" title="Toggle Visibility">👁</button>
                <button class="layer-btn" onclick="advancedTextEditor.deleteLayer(this)" title="Delete">🗑</button>
            </div>
        `;
        
        layerItem.addEventListener('click', () => this.selectTextElement(element));
        layerItem.textElement = element;
        element.layerItem = layerItem;
        
        layersList.appendChild(layerItem);
    }

    createContextToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'context-toolbar';
        toolbar.innerHTML = `
            <button onclick="advancedTextEditor.bringToFront()">Bring to Front</button>
            <button onclick="advancedTextEditor.sendToBack()">Send to Back</button>
            <button onclick="advancedTextEditor.duplicateElement()">Duplicate</button>
            <button onclick="advancedTextEditor.deleteElement()">Delete</button>
        `;
        document.body.appendChild(toolbar);
        this.contextToolbar = toolbar;
    }

    previewAnimation() {
        if (!this.selectedElement) return;
        
        const animationType = document.getElementById('animationType')?.value;
        if (!animationType || animationType === 'none') return;
        
        this.selectedElement.style.animation = '';
        this.selectedElement.offsetHeight;
        this.selectedElement.style.animation = `${animationType} 2s ease-in-out`;
    }

    stopAnimation() {
        if (this.selectedElement) {
            this.selectedElement.style.animation = '';
        }
    }

    rgbToHex(rgb) {
        if (!rgb || rgb.startsWith('#')) return rgb || '#ffffff';
        const result = rgb.match(/\d+/g);
        if (!result) return '#ffffff';
        return '#' + result.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }
}

// Global mouse events for drag, resize, rotate
document.addEventListener('mousemove', (e) => {
    if (window.advancedTextEditor) {
        const editor = window.advancedTextEditor;
        
        if (editor.dragData) {
            const deltaX = e.clientX - editor.dragData.startX;
            const deltaY = e.clientY - editor.dragData.startY;
            
            editor.dragData.element.style.left = (editor.dragData.initialX + deltaX) + 'px';
            editor.dragData.element.style.top = (editor.dragData.initialY + deltaY) + 'px';
            editor.dragData.element.style.transform = 'none';
        }
    }
});

document.addEventListener('mouseup', () => {
    if (window.advancedTextEditor) {
        window.advancedTextEditor.dragData = null;
        window.advancedTextEditor.resizeData = null;
        window.advancedTextEditor.rotateData = null;
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.advancedTextEditor = new AdvancedTextEditor();
});