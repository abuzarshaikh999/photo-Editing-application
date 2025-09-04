// Text Functionality - Add Text to Canvas
class TextManager {
    constructor() {
        this.textElements = [];
        this.selectedText = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const addTextBtn = document.getElementById('addTextBtn');
        if (addTextBtn) {
            addTextBtn.addEventListener('click', () => this.addTextToCanvas());
        }

        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewAnimation());
        }

        // Font size slider
        const fontSizeSlider = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        if (fontSizeSlider && fontSizeValue) {
            fontSizeSlider.addEventListener('input', (e) => {
                fontSizeValue.textContent = e.target.value + 'px';
                this.updateSelectedText();
            });
        }

        // Duration slider
        const durationSlider = document.getElementById('animationDuration');
        const durationValue = document.getElementById('durationValue');
        if (durationSlider && durationValue) {
            durationSlider.addEventListener('input', (e) => {
                durationValue.textContent = parseFloat(e.target.value).toFixed(1) + 's';
            });
        }

        // Style buttons
        document.querySelectorAll('.style-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
                this.updateSelectedText();
            });
        });

        // Alignment buttons
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

        // Text input
        const textInput = document.getElementById('textContent');
        if (textInput) {
            textInput.addEventListener('input', () => this.updateSelectedText());
        }

        // Color picker
        const colorPicker = document.getElementById('textColor');
        if (colorPicker) {
            colorPicker.addEventListener('change', () => this.updateSelectedText());
        }

        // Font family
        const fontFamily = document.getElementById('fontFamily');
        if (fontFamily) {
            fontFamily.addEventListener('change', () => this.updateSelectedText());
        }
    }

    addTextToCanvas() {
        const canvasArea = document.querySelector('.canvas-area');
        if (!canvasArea) return;

        const textContent = document.getElementById('textContent').value || 'Sample Text';
        
        // Create text element
        const textElement = document.createElement('div');
        textElement.className = 'canvas-text-element';
        textElement.textContent = textContent;
        textElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: ${document.getElementById('fontSize').value}px;
            font-family: ${document.getElementById('fontFamily').value};
            color: ${document.getElementById('textColor').value};
            cursor: move;
            user-select: none;
            z-index: 100;
            padding: 10px;
            border: 2px dashed transparent;
            transition: all 0.3s ease;
        `;
        
        canvasArea.appendChild(textElement);
        this.textElements.push(textElement);
        this.selectedText = textElement;
        
        // Make draggable
        this.makeDraggable(textElement);
        
        // Apply current styles
        this.updateSelectedText();
        
        // Show selection border
        textElement.style.border = '2px dashed #00ff88';
        
        // Add click handler for selection
        textElement.addEventListener('click', () => {
            this.selectText(textElement);
        });
        
        // Show success notification
        if (window.uiAnimations) {
            window.uiAnimations.showNotification('Text added to canvas!', 'success');
        }
    }

    selectText(textElement) {
        // Remove selection from all text elements
        this.textElements.forEach(el => {
            el.style.border = '2px dashed transparent';
        });
        
        // Select current element
        textElement.style.border = '2px dashed #00ff88';
        this.selectedText = textElement;
        
        // Update panel with current text properties
        this.updatePanelFromText(textElement);
    }

    updatePanelFromText(textElement) {
        const textInput = document.getElementById('textContent');
        const fontSize = document.getElementById('fontSize');
        const fontFamily = document.getElementById('fontFamily');
        const textColor = document.getElementById('textColor');
        
        if (textInput) textInput.value = textElement.textContent;
        if (fontSize) fontSize.value = parseInt(textElement.style.fontSize);
        if (fontFamily) fontFamily.value = textElement.style.fontFamily.replace(/['"]/g, '');
        if (textColor) textColor.value = this.rgbToHex(textElement.style.color);
    }

    updateSelectedText() {
        if (!this.selectedText) return;
        
        const textContent = document.getElementById('textContent').value;
        const fontSize = document.getElementById('fontSize').value;
        const fontFamily = document.getElementById('fontFamily').value;
        const textColor = document.getElementById('textColor').value;
        
        // Update basic properties
        this.selectedText.textContent = textContent;
        this.selectedText.style.fontSize = fontSize + 'px';
        this.selectedText.style.fontFamily = fontFamily;
        this.selectedText.style.color = textColor;
        
        // Apply text styles
        this.applyTextStyles();
    }

    applyTextStyles() {
        if (!this.selectedText) return;
        
        const boldBtn = document.getElementById('boldBtn');
        const italicBtn = document.getElementById('italicBtn');
        const underlineBtn = document.getElementById('underlineBtn');
        const strikeBtn = document.getElementById('strikeBtn');
        
        this.selectedText.style.fontWeight = boldBtn?.classList.contains('active') ? 'bold' : 'normal';
        this.selectedText.style.fontStyle = italicBtn?.classList.contains('active') ? 'italic' : 'normal';
        
        let textDecoration = '';
        if (underlineBtn?.classList.contains('active')) textDecoration += 'underline ';
        if (strikeBtn?.classList.contains('active')) textDecoration += 'line-through ';
        this.selectedText.style.textDecoration = textDecoration.trim();
        
        // Apply alignment
        const activeAlign = document.querySelector('.align-btn.active');
        if (activeAlign) {
            this.selectedText.style.textAlign = activeAlign.dataset.align;
        }
        
        // Apply toggle effects
        this.applyToggleEffects();
    }

    applyToggleEffects() {
        if (!this.selectedText) return;
        
        const strokeToggle = document.getElementById('strokeToggle');
        const shadowToggle = document.getElementById('shadowToggle');
        const blurToggle = document.getElementById('blurToggle');
        
        // Reset effects
        this.selectedText.style.webkitTextStroke = '';
        this.selectedText.style.textShadow = '';
        this.selectedText.style.filter = '';
        
        if (strokeToggle?.classList.contains('active')) {
            this.selectedText.style.webkitTextStroke = '1px #00ff88';
        }
        
        if (shadowToggle?.classList.contains('active')) {
            this.selectedText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        }
        
        if (blurToggle?.classList.contains('active')) {
            this.selectedText.style.filter = 'blur(1px)';
        }
    }

    applyPreset(preset) {
        if (!this.selectedText) return;
        
        // Reset previous effects
        this.selectedText.style.textShadow = '';
        this.selectedText.style.webkitTextStroke = '';
        this.selectedText.style.background = '';
        this.selectedText.style.webkitBackgroundClip = '';
        this.selectedText.style.webkitTextFillColor = '';
        
        switch (preset) {
            case 'shadow':
                this.selectedText.style.textShadow = '3px 3px 6px rgba(0,0,0,0.7)';
                break;
            case 'glow':
                this.selectedText.style.textShadow = '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88';
                break;
            case 'outline':
                this.selectedText.style.webkitTextStroke = '2px #00ff88';
                this.selectedText.style.webkitTextFillColor = 'transparent';
                break;
            case 'gradient':
                this.selectedText.style.background = 'linear-gradient(45deg, #00ff88, #0099ff, #ff0099)';
                this.selectedText.style.webkitBackgroundClip = 'text';
                this.selectedText.style.webkitTextFillColor = 'transparent';
                break;
        }
    }

    previewAnimation() {
        if (!this.selectedText) {
            this.addTextToCanvas();
        }
        
        const animationType = document.getElementById('animationType').value;
        const duration = document.getElementById('animationDuration').value;
        const delay = document.getElementById('animationDelay').value;
        const loop = document.getElementById('loopToggle')?.classList.contains('active');
        
        if (animationType === 'none') return;
        
        // Apply animation
        const animationName = loop ? `${animationType} infinite` : animationType;
        this.selectedText.style.animation = `${animationName} ${duration}s ease-in-out ${delay}ms`;
        
        // Reset animation after completion if not looping
        if (!loop) {
            setTimeout(() => {
                this.selectedText.style.animation = '';
            }, (parseFloat(duration) * 1000) + parseInt(delay));
        }
    }

    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
            element.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            element.style.left = (initialX + deltaX) + 'px';
            element.style.top = (initialY + deltaY) + 'px';
            element.style.transform = 'none';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'move';
        });
    }

    rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;
        const result = rgb.match(/\d+/g);
        if (!result) return '#ffffff';
        return '#' + result.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.textManager = new TextManager();
});