// Text Preview and Stop Buttons Fix
document.addEventListener('DOMContentLoaded', function() {
    // Add preview and stop buttons to text panel
    const textPanel = document.getElementById('text-panel');
    if (textPanel) {
        // Find existing button container or create one
        let buttonContainer = textPanel.querySelector('.animation-controls');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.className = 'animation-controls';
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
                margin: 15px 0;
                padding: 10px;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                border: 1px solid rgba(255,255,255,0.1);
            `;
            
            // Insert after text content input
            const textInput = textPanel.querySelector('#textContentInput');
            if (textInput && textInput.parentNode) {
                textInput.parentNode.insertBefore(buttonContainer, textInput.nextSibling);
            } else {
                textPanel.appendChild(buttonContainer);
            }
        }
        
        // Create preview button if it doesn't exist
        let previewBtn = document.getElementById('previewBtn');
        if (!previewBtn) {
            previewBtn = document.createElement('button');
            previewBtn.id = 'previewBtn';
            previewBtn.className = 'grid-btn preview-btn';
            previewBtn.textContent = '▶️ Preview';
            previewBtn.style.cssText = `
                flex: 1;
                background: linear-gradient(135deg, #00ff88, #00cc6a);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            `;
            buttonContainer.appendChild(previewBtn);
        }
        
        // Create stop button if it doesn't exist
        let stopBtn = document.getElementById('stopBtn');
        if (!stopBtn) {
            stopBtn = document.createElement('button');
            stopBtn.id = 'stopBtn';
            stopBtn.className = 'grid-btn stop-btn';
            stopBtn.textContent = '⏹️ Stop';
            stopBtn.style.cssText = `
                flex: 1;
                background: linear-gradient(135deg, #ff4757, #ff3742);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
                opacity: 0.6;
            `;
            buttonContainer.appendChild(stopBtn);
        }
        
        // Add animation dropdown if it doesn't exist
        let animationSelect = document.getElementById('animationType');
        if (!animationSelect) {
            const selectContainer = document.createElement('div');
            selectContainer.className = 'control-group';
            selectContainer.innerHTML = `
                <label>Animation Type</label>
                <select id="animationType" class="text-input">
                    <option value="none">None</option>
                    <option value="fadeIn">Fade In</option>
                    <option value="slideUp">Slide Up</option>
                    <option value="slideDown">Slide Down</option>
                    <option value="slideLeft">Slide Left</option>
                    <option value="slideRight">Slide Right</option>
                    <option value="bounce">Bounce</option>
                    <option value="pulse">Pulse</option>
                    <option value="shake">Shake</option>
                    <option value="rotate">Rotate</option>
                    <option value="scale">Scale</option>
                    <option value="flip">Flip</option>
                    <option value="typewriter">Typewriter</option>
                    <option value="glow">Glow</option>
                    <option value="rainbow">Rainbow</option>
                    <option value="wave">Wave</option>
                </select>
            `;
            buttonContainer.parentNode.insertBefore(selectContainer, buttonContainer);
        }
        
        // Add duration slider if it doesn't exist
        let durationSlider = document.getElementById('animationDuration');
        if (!durationSlider) {
            const durationContainer = document.createElement('div');
            durationContainer.className = 'control-group';
            durationContainer.innerHTML = `
                <label>Duration: <span id="durationValue">2.0s</span></label>
                <input type="range" min="0.5" max="5" value="2" step="0.1" class="slider" id="animationDuration">
            `;
            buttonContainer.parentNode.insertBefore(durationContainer, buttonContainer);
        }
        
        // Add delay slider if it doesn't exist
        let delaySlider = document.getElementById('animationDelay');
        if (!delaySlider) {
            const delayContainer = document.createElement('div');
            delayContainer.className = 'control-group';
            delayContainer.innerHTML = `
                <label>Delay: <span id="delayValue">0ms</span></label>
                <input type="range" min="0" max="2000" value="0" step="100" class="slider" id="animationDelay">
            `;
            buttonContainer.parentNode.insertBefore(delayContainer, buttonContainer);
        }
        
        // Setup event listeners
        setupPreviewButton();
        setupStopButton();
        setupAnimationControls();
    }
});

function setupPreviewButton() {
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const textManager = window.textManager;
            if (!textManager) {
                console.error('TextManager not found');
                return;
            }
            
            // Add text if none exists
            if (!textManager.selectedText) {
                textManager.addTextToCanvas();
            }
            
            if (textManager.selectedText) {
                const animationType = document.getElementById('animationType')?.value || 'fadeIn';
                const duration = document.getElementById('animationDuration')?.value || '2';
                const delay = document.getElementById('animationDelay')?.value || '0';
                
                // Clear previous animation
                textManager.selectedText.style.animation = '';
                
                // Force reflow
                textManager.selectedText.offsetHeight;
                
                // Apply animation
                if (animationType !== 'none') {
                    textManager.selectedText.style.animation = `${animationType} ${duration}s ease-in-out ${delay}ms`;
                    
                    // Enable stop button
                    const stopBtn = document.getElementById('stopBtn');
                    if (stopBtn) {
                        stopBtn.style.opacity = '1';
                        stopBtn.disabled = false;
                    }
                    
                    // Show notification
                    if (window.uiAnimations) {
                        window.uiAnimations.showNotification(`Playing ${animationType} animation`, 'info');
                    }
                    
                    // Auto-disable stop button after animation
                    setTimeout(() => {
                        if (stopBtn) {
                            stopBtn.style.opacity = '0.6';
                            stopBtn.disabled = true;
                        }
                    }, (parseFloat(duration) * 1000) + parseInt(delay));
                }
            } else {
                if (window.uiAnimations) {
                    window.uiAnimations.showNotification('Please add text first', 'warning');
                }
            }
        });
        
        // Add hover effects
        previewBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,255,136,0.3)';
        });
        
        previewBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    }
}

function setupStopButton() {
    const stopBtn = document.getElementById('stopBtn');
    if (stopBtn) {
        stopBtn.addEventListener('click', function() {
            const textManager = window.textManager;
            if (textManager && textManager.selectedText) {
                // Stop animation
                textManager.selectedText.style.animation = '';
                
                // Disable stop button
                this.style.opacity = '0.6';
                this.disabled = true;
                
                // Show notification
                if (window.uiAnimations) {
                    window.uiAnimations.showNotification('Animation stopped', 'info');
                }
            }
        });
        
        // Add hover effects
        stopBtn.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(255,71,87,0.3)';
            }
        });
        
        stopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        // Initially disable stop button
        stopBtn.style.opacity = '0.6';
        stopBtn.disabled = true;
    }
}

function setupAnimationControls() {
    // Duration slider
    const durationSlider = document.getElementById('animationDuration');
    const durationValue = document.getElementById('durationValue');
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', function() {
            durationValue.textContent = parseFloat(this.value).toFixed(1) + 's';
        });
    }
    
    // Delay slider
    const delaySlider = document.getElementById('animationDelay');
    const delayValue = document.getElementById('delayValue');
    if (delaySlider && delayValue) {
        delaySlider.addEventListener('input', function() {
            delayValue.textContent = this.value + 'ms';
        });
    }
    
    // Animation type dropdown
    const animationType = document.getElementById('animationType');
    if (animationType) {
        animationType.addEventListener('change', function() {
            const stopBtn = document.getElementById('stopBtn');
            if (this.value === 'none' && stopBtn) {
                stopBtn.style.opacity = '0.6';
                stopBtn.disabled = true;
            }
        });
    }
}