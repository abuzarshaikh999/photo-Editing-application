/**
 * Advanced Text Animation System
 */

class TextAnimator {
    constructor() {
        this.animations = {
            fadeIn: { name: 'Fade In', duration: 1000 },
            slideUp: { name: 'Slide Up', duration: 800 },
            slideDown: { name: 'Slide Down', duration: 800 },
            slideLeft: { name: 'Slide Left', duration: 800 },
            slideRight: { name: 'Slide Right', duration: 800 },
            bounce: { name: 'Bounce', duration: 1200 },
            pulse: { name: 'Pulse', duration: 1000 },
            shake: { name: 'Shake', duration: 600 },
            flip: { name: 'Flip', duration: 1000 },
            zoom: { name: 'Zoom In', duration: 800 },
            rotate: { name: 'Rotate', duration: 1000 },
            typewriter: { name: 'Typewriter', duration: 2000 },
            glow: { name: 'Glow', duration: 1500 },
            rainbow: { name: 'Rainbow', duration: 2000 },
            wave: { name: 'Wave', duration: 1500 }
        };
        this.activeTexts = new Map();
    }

    addAnimatedText(text, x, y, options = {}) {
        if (!photoEditor?.canvas) return;

        const textId = Date.now() + Math.random();
        const textObj = {
            id: textId,
            text: text,
            x: x,
            y: y,
            fontSize: options.fontSize || 30,
            fontFamily: options.fontFamily || 'Arial',
            color: options.color || '#ffffff',
            animation: options.animation || 'fadeIn',
            duration: this.animations[options.animation]?.duration || 1000,
            startTime: Date.now(),
            isAnimating: true,
            ...options
        };

        this.activeTexts.set(textId, textObj);
        this.animateText(textObj);
        return textId;
    }

    animateText(textObj) {
        const animate = () => {
            if (!textObj.isAnimating) return;

            const elapsed = Date.now() - textObj.startTime;
            const progress = Math.min(elapsed / textObj.duration, 1);

            this.drawAnimatedText(textObj, progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                textObj.isAnimating = false;
                this.drawFinalText(textObj);
            }
        };
        animate();
    }

    drawAnimatedText(textObj, progress) {
        const ctx = photoEditor.ctx;
        ctx.save();

        // Set font properties
        let fontStyle = '';
        if (textObj.bold) fontStyle += 'bold ';
        if (textObj.italic) fontStyle += 'italic ';
        ctx.font = `${fontStyle}${textObj.fontSize}px ${textObj.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Apply animation
        this.applyAnimation(ctx, textObj, progress);

        // Draw text
        if (textObj.stroke) {
            ctx.strokeStyle = textObj.strokeColor || '#000';
            ctx.lineWidth = textObj.strokeWidth || 2;
            ctx.strokeText(textObj.text, textObj.x, textObj.y);
        }
        
        ctx.fillStyle = textObj.color;
        ctx.fillText(textObj.text, textObj.x, textObj.y);

        ctx.restore();
    }

    applyAnimation(ctx, textObj, progress) {
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const easeIn = progress * progress;
        const bounce = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        switch (textObj.animation) {
            case 'fadeIn':
                ctx.globalAlpha = progress;
                break;

            case 'slideUp':
                ctx.translate(0, (1 - easeOut) * 50);
                ctx.globalAlpha = progress;
                break;

            case 'slideDown':
                ctx.translate(0, -(1 - easeOut) * 50);
                ctx.globalAlpha = progress;
                break;

            case 'slideLeft':
                ctx.translate((1 - easeOut) * 50, 0);
                ctx.globalAlpha = progress;
                break;

            case 'slideRight':
                ctx.translate(-(1 - easeOut) * 50, 0);
                ctx.globalAlpha = progress;
                break;

            case 'bounce':
                const bounceY = Math.sin(bounce * Math.PI) * 30;
                ctx.translate(0, -bounceY);
                ctx.globalAlpha = progress;
                break;

            case 'pulse':
                const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.1;
                ctx.scale(scale, scale);
                break;

            case 'shake':
                const shakeX = Math.sin(progress * Math.PI * 20) * 5 * (1 - progress);
                ctx.translate(shakeX, 0);
                break;

            case 'flip':
                ctx.scale(Math.cos(progress * Math.PI), 1);
                break;

            case 'zoom':
                const zoomScale = easeOut;
                ctx.scale(zoomScale, zoomScale);
                ctx.globalAlpha = progress;
                break;

            case 'rotate':
                ctx.rotate(progress * Math.PI * 2);
                ctx.globalAlpha = progress;
                break;

            case 'typewriter':
                const chars = Math.floor(progress * textObj.text.length);
                textObj.displayText = textObj.text.substring(0, chars);
                break;

            case 'glow':
                ctx.shadowColor = textObj.color;
                ctx.shadowBlur = Math.sin(progress * Math.PI * 4) * 20;
                break;

            case 'rainbow':
                const hue = (progress * 360) % 360;
                textObj.color = `hsl(${hue}, 100%, 50%)`;
                break;

            case 'wave':
                const waveY = Math.sin(progress * Math.PI * 6) * 10;
                ctx.translate(0, waveY);
                break;
        }
    }

    drawFinalText(textObj) {
        const ctx = photoEditor.ctx;
        ctx.save();

        let fontStyle = '';
        if (textObj.bold) fontStyle += 'bold ';
        if (textObj.italic) fontStyle += 'italic ';
        ctx.font = `${fontStyle}${textObj.fontSize}px ${textObj.fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (textObj.stroke) {
            ctx.strokeStyle = textObj.strokeColor || '#000';
            ctx.lineWidth = textObj.strokeWidth || 2;
            ctx.strokeText(textObj.text, textObj.x, textObj.y);
        }

        ctx.fillStyle = textObj.color;
        ctx.fillText(textObj.text, textObj.x, textObj.y);

        ctx.restore();
        
        if (photoEditor.saveState) photoEditor.saveState();
    }

    removeText(textId) {
        this.activeTexts.delete(textId);
    }

    clearAllTexts() {
        this.activeTexts.clear();
    }
}

// Initialize text animator
const textAnimator = new TextAnimator();

// Enhanced text functions
function addAnimatedText() {
    const textInput = document.getElementById('textContentInput');
    const animationSelect = document.getElementById('textAnimationSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    const textColorInput = document.getElementById('textColorInput');

    if (!textInput?.value.trim()) {
        showNotification('Please enter text');
        return;
    }

    if (!photoEditor?.canvas) {
        showNotification('Please load an image first');
        return;
    }

    const options = {
        fontSize: parseInt(fontSizeSlider?.value || 30),
        fontFamily: fontFamilySelect?.value || 'Arial',
        color: textColorInput?.value || '#ffffff',
        animation: animationSelect?.value || 'fadeIn',
        bold: document.getElementById('boldToggle')?.classList.contains('active'),
        italic: document.getElementById('italicToggle')?.classList.contains('active'),
        stroke: document.getElementById('strokeToggle')?.classList.contains('active'),
        strokeColor: document.getElementById('strokeColorInput')?.value || '#000000',
        strokeWidth: parseInt(document.getElementById('strokeWidthSlider')?.value || 2)
    };

    const x = photoEditor.canvas.width / 2;
    const y = photoEditor.canvas.height / 2;

    textAnimator.addAnimatedText(textInput.value, x, y, options);
    textInput.value = '';
    showNotification(`${options.animation} text added`);
}

function previewAnimation() {
    const animationSelect = document.getElementById('textAnimationSelect');
    const previewText = document.getElementById('animationPreview');
    
    if (previewText && animationSelect) {
        const animation = animationSelect.value;
        previewText.className = `animation-preview ${animation}`;
        previewText.textContent = textAnimator.animations[animation]?.name || 'Preview';
        
        setTimeout(() => {
            previewText.className = 'animation-preview';
        }, 2000);
    }
}

// Global functions
window.textAnimator = textAnimator;
window.addAnimatedText = addAnimatedText;
window.previewAnimation = previewAnimation;