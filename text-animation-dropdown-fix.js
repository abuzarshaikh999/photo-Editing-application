// Text Animation Dropdown Bug Fix
document.addEventListener('DOMContentLoaded', function() {
    // Wait for all elements to load
    setTimeout(() => {
        const textAnimationSelect = document.getElementById('textAnimationSelect');
        const animationType = document.getElementById('animationType');
        
        // Fix dropdown event handling
        if (textAnimationSelect) {
            textAnimationSelect.addEventListener('change', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const selectedAnimation = this.value;
                console.log('Animation selected:', selectedAnimation);
                
                // Sync with other animation dropdown if exists
                if (animationType) {
                    animationType.value = selectedAnimation;
                }
                
                // Auto-preview if text exists
                const textManager = window.textManager;
                if (textManager && textManager.selectedText && selectedAnimation !== 'none') {
                    previewTextAnimation();
                }
            });
        }
        
        // Fix preview button
        const previewBtn = document.getElementById('previewTextAnim');
        if (previewBtn) {
            previewBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                previewTextAnimation();
            };
        }
        
        // Fix stop button
        const stopBtn = document.getElementById('stopTextAnim');
        if (stopBtn) {
            stopBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                stopTextAnimation();
            };
        }
        
        // Fix duration slider
        const durationSlider = document.getElementById('animDurationSlider');
        const durationValue = document.getElementById('animDurationValue');
        if (durationSlider && durationValue) {
            durationSlider.oninput = function(e) {
                durationValue.textContent = parseFloat(e.target.value).toFixed(1);
            };
        }
    }, 1000);
});

// Enhanced preview function
function previewTextAnimation() {
    const textManager = window.textManager;
    
    // Create text if none exists
    if (!textManager || !textManager.selectedText) {
        if (textManager) {
            textManager.addTextToCanvas();
        } else {
            // Fallback text creation
            createFallbackText();
        }
        return;
    }
    
    const animationSelect = document.getElementById('textAnimationSelect');
    const durationSlider = document.getElementById('animDurationSlider');
    
    const animationType = animationSelect ? animationSelect.value : 'fadeIn';
    const duration = durationSlider ? durationSlider.value : '2';
    
    if (animationType === 'none') {
        if (window.uiAnimations) {
            window.uiAnimations.showNotification('Please select an animation', 'warning');
        }
        return;
    }
    
    // Clear previous animation
    textManager.selectedText.style.animation = '';
    textManager.selectedText.classList.remove('typewriter');
    
    // Force reflow
    textManager.selectedText.offsetHeight;
    
    // Apply animation
    if (animationType === 'typewriter') {
        textManager.selectedText.classList.add('typewriter');
        textManager.selectedText.style.animation = `typewriter ${duration}s steps(40, end), blink-caret 0.75s step-end infinite`;
    } else {
        textManager.selectedText.style.animation = `${animationType} ${duration}s ease-in-out`;
    }
    
    // Show notification
    if (window.uiAnimations) {
        window.uiAnimations.showNotification(`Playing ${animationType} animation`, 'success');
    }
    
    // Auto-stop after duration
    setTimeout(() => {
        if (textManager.selectedText && animationType !== 'typewriter') {
            textManager.selectedText.style.animation = '';
        }
    }, parseFloat(duration) * 1000);
}

// Enhanced stop function
function stopTextAnimation() {
    const textManager = window.textManager;
    
    if (textManager && textManager.selectedText) {
        textManager.selectedText.style.animation = '';
        textManager.selectedText.classList.remove('typewriter');
        
        if (window.uiAnimations) {
            window.uiAnimations.showNotification('Animation stopped', 'info');
        }
    } else {
        if (window.uiAnimations) {
            window.uiAnimations.showNotification('No text selected', 'warning');
        }
    }
}

// Fallback text creation
function createFallbackText() {
    const canvasArea = document.querySelector('.canvas-area');
    if (!canvasArea) return;
    
    const textElement = document.createElement('div');
    textElement.className = 'canvas-text-element';
    textElement.textContent = 'Sample Text';
    textElement.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 32px;
        font-family: Arial;
        color: #ffffff;
        cursor: move;
        user-select: none;
        z-index: 100;
        padding: 10px;
        border: 2px dashed #00ff88;
    `;
    
    canvasArea.appendChild(textElement);
    
    // Initialize text manager if not exists
    if (!window.textManager) {
        window.textManager = {
            selectedText: textElement,
            textElements: [textElement]
        };
    } else {
        window.textManager.selectedText = textElement;
        window.textManager.textElements = window.textManager.textElements || [];
        window.textManager.textElements.push(textElement);
    }
}