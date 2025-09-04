// Add Animation Options to Text & Typography Panel
document.addEventListener('DOMContentLoaded', function() {
    const textPanel = document.getElementById('text-panel');
    if (textPanel) {
        // Add animation section to existing text panel
        const animationSection = document.createElement('div');
        animationSection.className = 'control-group';
        animationSection.innerHTML = `
            <label>Text Animation</label>
            <select id="textAnimationSelect" class="text-input">
                <option value="none">No Animation</option>
                <option value="fadeIn">Fade In</option>
                <option value="slideUp">Slide Up</option>
                <option value="slideDown">Slide Down</option>
                <option value="slideLeft">Slide Left</option>
                <option value="slideRight">Slide Right</option>
                <option value="bounce">Bounce</option>
                <option value="pulse">Pulse</option>
                <option value="shake">Shake</option>
                <option value="zoomIn">Zoom In</option>
                <option value="zoomOut">Zoom Out</option>
                <option value="rotate">Rotate</option>
                <option value="typewriter">Typewriter</option>
                <option value="glow">Glow</option>
                <option value="rainbow">Rainbow</option>
            </select>
            <div class="control-group">
                <label>Duration: <span id="animDurationValue">2.0</span>s</label>
                <input type="range" min="0.5" max="10" step="0.1" value="2" class="slider" id="animDurationSlider">
            </div>
            <div class="tool-grid">
                <button class="grid-btn" id="previewTextAnim">▶ Preview</button>
                <button class="grid-btn" id="stopTextAnim">⏹ Stop</button>
            </div>
        `;
        
        // Insert before the last button
        const lastButton = textPanel.querySelector('button[onclick*="addStyledText"]');
        if (lastButton) {
            lastButton.parentNode.insertBefore(animationSection, lastButton);
        } else {
            textPanel.appendChild(animationSection);
        }
        
        // Add event listeners
        const animSelect = document.getElementById('textAnimationSelect');
        const durationSlider = document.getElementById('animDurationSlider');
        const durationValue = document.getElementById('animDurationValue');
        const previewBtn = document.getElementById('previewTextAnim');
        const stopBtn = document.getElementById('stopTextAnim');
        
        if (durationSlider && durationValue) {
            durationSlider.addEventListener('input', (e) => {
                durationValue.textContent = parseFloat(e.target.value).toFixed(1);
            });
        }
        
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                previewTextAnimation();
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                stopTextAnimation();
            });
        }
    }
});

function previewTextAnimation() {
    const textManager = window.textManager;
    if (!textManager || !textManager.selectedText) {
        // Create sample text if none exists
        if (textManager) {
            textManager.addTextToCanvas();
        }
        return;
    }
    
    const animationType = document.getElementById('textAnimationSelect')?.value || 'fadeIn';
    const duration = document.getElementById('animDurationSlider')?.value || '2';
    
    if (animationType === 'none') return;
    
    // Clear previous animation
    textManager.selectedText.style.animation = '';
    textManager.selectedText.offsetHeight; // Force reflow
    
    // Apply animation
    textManager.selectedText.style.animation = `${animationType} ${duration}s ease-in-out`;
    
    // Show notification
    if (window.uiAnimations) {
        window.uiAnimations.showNotification(`Playing ${animationType} animation`, 'info');
    }
}

function stopTextAnimation() {
    const textManager = window.textManager;
    if (textManager && textManager.selectedText) {
        textManager.selectedText.style.animation = '';
        
        if (window.uiAnimations) {
            window.uiAnimations.showNotification('Animation stopped', 'info');
        }
    }
}