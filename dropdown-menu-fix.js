// Dropdown Menu UI Bug Fix
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // Fix dropdown styling and functionality
        const textAnimationSelect = document.getElementById('textAnimationSelect');
        
        if (textAnimationSelect) {
            // Ensure proper styling
            textAnimationSelect.style.cssText = `
                width: 100%;
                padding: 8px 32px 8px 12px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                color: #ffffff;
                font-size: 14px;
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
                background-repeat: no-repeat;
                background-position: right 8px center;
                background-size: 16px;
            `;
            
            // Fix option styling
            const options = textAnimationSelect.querySelectorAll('option');
            options.forEach(option => {
                option.style.backgroundColor = '#1a1a2e';
                option.style.color = '#ffffff';
            });
            
            // Add hover effects
            textAnimationSelect.addEventListener('mouseenter', function() {
                this.style.borderColor = '#00ff88';
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            });
            
            textAnimationSelect.addEventListener('mouseleave', function() {
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
            
            textAnimationSelect.addEventListener('focus', function() {
                this.style.outline = 'none';
                this.style.borderColor = '#00ff88';
                this.style.boxShadow = '0 0 0 2px rgba(0, 255, 136, 0.2)';
            });
            
            textAnimationSelect.addEventListener('blur', function() {
                this.style.boxShadow = 'none';
                this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            });
        }
        
        // Fix button styling
        const previewBtn = document.getElementById('previewTextAnim');
        const stopBtn = document.getElementById('stopTextAnim');
        
        if (previewBtn) {
            previewBtn.style.cssText = `
                flex: 1;
                padding: 8px 12px;
                border: none;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                background: linear-gradient(135deg, #00ff88, #00cc6a);
                color: #000000;
                transition: all 0.3s ease;
            `;
        }
        
        if (stopBtn) {
            stopBtn.style.cssText = `
                flex: 1;
                padding: 8px 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
                transition: all 0.3s ease;
            `;
        }
        
        // Fix container styling
        const animationControls = document.querySelector('.animation-controls');
        if (animationControls) {
            animationControls.style.cssText = `
                margin-top: 12px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;
        }
        
    }, 1500);
});