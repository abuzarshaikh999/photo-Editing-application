/**
 * Text Controls and Style Management
 */

// Style toggle functions
function toggleStyle(style) {
    const toggle = document.getElementById(style + 'Toggle');
    const strokeControls = document.getElementById('strokeControls');
    
    if (toggle) {
        toggle.classList.toggle('active');
        
        if (style === 'stroke' && strokeControls) {
            strokeControls.classList.toggle('active', toggle.classList.contains('active'));
        }
    }
}

// Slider event handlers
document.addEventListener('DOMContentLoaded', () => {
    // Font size slider
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('fontSizeValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
        });
    }

    // Stroke width slider
    const strokeWidthSlider = document.getElementById('strokeWidthSlider');
    if (strokeWidthSlider) {
        strokeWidthSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('strokeWidthValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
        });
    }
});

// Global functions
window.toggleStyle = toggleStyle;