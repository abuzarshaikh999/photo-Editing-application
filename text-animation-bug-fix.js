// Text Animation Bug Fix
document.addEventListener('DOMContentLoaded', function() {
    // Fix animation preview functionality
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const textManager = window.textManager;
            if (textManager && textManager.selectedText) {
                const animationType = document.getElementById('animationType')?.value || 'fadeIn';
                const duration = document.getElementById('animationDuration')?.value || '2';
                const delay = document.getElementById('animationDelay')?.value || '0';
                
                // Clear previous animation
                textManager.selectedText.style.animation = '';
                
                // Force reflow
                textManager.selectedText.offsetHeight;
                
                // Apply new animation
                textManager.selectedText.style.animation = `${animationType} ${duration}s ease-in-out ${delay}ms`;
                
                // Show notification
                if (window.uiAnimations) {
                    window.uiAnimations.showNotification(`Playing ${animationType} animation`, 'info');
                }
            } else {
                if (window.uiAnimations) {
                    window.uiAnimations.showNotification('Please add text first', 'warning');
                }
            }
        });
    }
    
    // Fix typewriter animation
    function applyTypewriterEffect(element) {
        element.classList.add('typewriter');
        element.style.borderRight = '2px solid #00ff88';
        element.style.whiteSpace = 'nowrap';
        element.style.overflow = 'hidden';
        element.style.animation = 'typewriter 3s steps(40, end), blink-caret 0.75s step-end infinite';
    }
    
    // Override animation application for special cases
    const originalPreviewAnimation = window.textManager?.previewAnimation;
    if (window.textManager) {
        window.textManager.previewAnimation = function() {
            if (!this.selectedText) {
                this.addTextToCanvas();
            }
            
            const animationType = document.getElementById('animationType').value;
            const duration = document.getElementById('animationDuration').value;
            const delay = document.getElementById('animationDelay').value;
            const loop = document.getElementById('loopToggle')?.classList.contains('active');
            
            if (animationType === 'none') return;
            
            // Clear previous animations
            this.selectedText.style.animation = '';
            this.selectedText.classList.remove('typewriter');
            this.selectedText.style.borderRight = '';
            
            // Force reflow
            this.selectedText.offsetHeight;
            
            // Apply special animations
            if (animationType === 'typewriter') {
                applyTypewriterEffect(this.selectedText);
            } else {
                const animationName = loop ? `${animationType} infinite` : animationType;
                this.selectedText.style.animation = `${animationName} ${duration}s ease-in-out ${delay}ms`;
            }
            
            // Reset animation after completion if not looping
            if (!loop && animationType !== 'typewriter') {
                setTimeout(() => {
                    this.selectedText.style.animation = '';
                }, (parseFloat(duration) * 1000) + parseInt(delay));
            }
        };
    }
});