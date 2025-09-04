// Photo Editor Core Functionality
class PhotoEditor {
    constructor() {
        this.canvas = document.getElementById('mainCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.originalImage = null;
        this.currentImage = null;
        this.filters = {
            brightness: 0,
            contrast: 0,
            saturation: 0,
            exposure: 0,
            highlights: 0,
            shadows: 0,
            hue: 0,
            temperature: 0,
            tint: 0,
            vibrance: 0,
            sepia: 0,
            invert: 0,
            blur: 0
        };
        this.history = [];
        this.historyStep = -1;
        this.initializeControls();
    }

    initializeControls() {
        // Basic editing controls
        this.addSliderControl('brightnessSlider', 'brightnessValue', 'brightness');
        this.addSliderControl('contrastSlider', 'contrastValue', 'contrast');
        this.addSliderControl('saturationSlider', 'saturationValue', 'saturation');
        this.addSliderControl('exposureSlider', 'exposureValue', 'exposure');
        this.addSliderControl('highlightsSlider', 'highlightsValue', 'highlights');
        this.addSliderControl('shadowsSlider', 'shadowsValue', 'shadows');
        this.addSliderControl('blurSlider', 'blurValue', 'blur', true);
        
        // Color controls
        this.addSliderControl('hueSlider', 'hueValue', 'hue');
        this.addSliderControl('temperatureSlider', 'temperatureValue', 'temperature');
        this.addSliderControl('tintSlider', 'tintValue', 'tint');
        this.addSliderControl('vibranceSlider', 'vibranceValue', 'vibrance');
        this.addSliderControl('sepiaSlider', 'sepiaValue', 'sepia');
        this.addSliderControl('invertSlider', 'invertValue', 'invert');
    }
    
    addSliderControl(sliderId, valueId, filterKey, isFloat = false) {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(valueId);
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', (e) => {
                const value = isFloat ? parseFloat(e.target.value) : parseInt(e.target.value);
                this.filters[filterKey] = value;
                valueDisplay.textContent = e.target.value;
                this.applyFilters();
            });
        }
    }

    loadImage(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                try {
                    this.originalImage = img;
                    this.currentImage = img;
                    
                    // Set reasonable canvas size limits
                    const maxSize = 2000;
                    let { width, height } = img;
                    
                    if (width > maxSize || height > maxSize) {
                        const ratio = Math.min(maxSize / width, maxSize / height);
                        width *= ratio;
                        height *= ratio;
                    }
                    
                    this.canvas.width = width;
                    this.canvas.height = height;
                    this.ctx.drawImage(img, 0, 0, width, height);
                    
                    // Show canvas, hide placeholder
                    this.canvas.style.display = 'block';
                    const placeholder = document.getElementById('canvasPlaceholder');
                    if (placeholder) {
                        placeholder.style.display = 'none';
                    }
                    
                    // Update image info
                    this.updateImageInfo(file);
                    this.saveState();
                    
                    if (typeof showNotification === 'function') {
                        showNotification('Image loaded successfully!');
                    }
                } catch (error) {
                    console.error('Image loading error:', error);
                    if (typeof showNotification === 'function') {
                        showNotification('Error loading image');
                    }
                }
            };
            img.onerror = () => {
                if (typeof showNotification === 'function') {
                    showNotification('Invalid image file');
                }
            };
            img.src = e.target.result;
        };
        reader.onerror = () => {
            if (typeof showNotification === 'function') {
                showNotification('Error reading file');
            }
        };
        reader.readAsDataURL(file);
    }

    updateImageInfo(file) {
        const info = document.querySelector('.image-info span');
        const size = (file.size / 1024 / 1024).toFixed(1);
        info.textContent = `${this.canvas.width}x${this.canvas.height} • ${size}MB • ${file.type.split('/')[1].toUpperCase()}`;
        
        document.getElementById('widthValue').textContent = this.canvas.width;
        document.getElementById('heightValue').textContent = this.canvas.height;
        document.getElementById('widthInput').value = this.canvas.width;
        document.getElementById('heightInput').value = this.canvas.height;
    }

    applyFilters() {
        if (!this.originalImage || !this.ctx) return;

        try {
            // Apply CSS filters first
            const filterString = `
                brightness(${100 + this.filters.brightness + this.filters.exposure * 0.5}%)
                contrast(${100 + this.filters.contrast}%)
                saturate(${100 + this.filters.saturation + this.filters.vibrance * 0.3}%)
                hue-rotate(${this.filters.hue}deg)
                sepia(${this.filters.sepia}%)
                invert(${this.filters.invert}%)
                blur(${this.filters.blur}px)
            `;

            this.ctx.filter = filterString;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.originalImage, 0, 0);
            this.ctx.filter = 'none';
            
            // Apply advanced color adjustments
            this.applyAdvancedColorAdjustments();
        } catch (error) {
            console.error('Filter application error:', error);
            if (typeof showNotification === 'function') {
                showNotification('Filter error - please try again');
            }
        }
    }
    
    applyAdvancedColorAdjustments() {
        if (this.filters.temperature === 0 && this.filters.tint === 0 && 
            this.filters.highlights === 0 && this.filters.shadows === 0) return;
            
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            
            // Temperature adjustment
            if (this.filters.temperature !== 0) {
                const temp = this.filters.temperature * 0.01;
                r = Math.min(255, Math.max(0, r + temp * 30));
                b = Math.min(255, Math.max(0, b - temp * 30));
            }
            
            // Tint adjustment
            if (this.filters.tint !== 0) {
                const tint = this.filters.tint * 0.01;
                g = Math.min(255, Math.max(0, g + tint * 20));
            }
            
            // Highlights and shadows
            const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            
            if (this.filters.highlights !== 0 && luminance > 0.7) {
                const factor = 1 + (this.filters.highlights * 0.002);
                r = Math.min(255, Math.max(0, r * factor));
                g = Math.min(255, Math.max(0, g * factor));
                b = Math.min(255, Math.max(0, b * factor));
            }
            
            if (this.filters.shadows !== 0 && luminance < 0.3) {
                const factor = 1 + (this.filters.shadows * 0.002);
                r = Math.min(255, Math.max(0, r * factor));
                g = Math.min(255, Math.max(0, g * factor));
                b = Math.min(255, Math.max(0, b * factor));
            }
            
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    saveState() {
        this.historyStep++;
        if (this.historyStep < this.history.length) {
            this.history.length = this.historyStep;
        }
        this.history.push(this.canvas.toDataURL());
    }

    undo() {
        if (this.historyStep > 0) {
            this.historyStep--;
            this.restoreState();
        }
    }

    redo() {
        if (this.historyStep < this.history.length - 1) {
            this.historyStep++;
            this.restoreState();
        }
    }

    restoreState() {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = this.history[this.historyStep];
    }
}

// Initialize photo editor
const photoEditor = new PhotoEditor();

// Global functions for UI interactions
function resetFilters() {
    if (typeof photoEditor === 'undefined' || !photoEditor.filters) {
        showNotification('Photo editor not initialized');
        return;
    }
    
    photoEditor.filters = {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        exposure: 0,
        highlights: 0,
        shadows: 0,
        hue: 0,
        temperature: 0,
        tint: 0,
        vibrance: 0,
        sepia: 0,
        invert: 0,
        blur: 0
    };
    
    // Reset all sliders and values
    const controls = [
        'brightness', 'contrast', 'saturation', 'exposure', 'highlights', 'shadows',
        'hue', 'temperature', 'tint', 'vibrance', 'sepia', 'invert', 'blur'
    ];
    
    controls.forEach(control => {
        const slider = document.getElementById(`${control}Slider`);
        const value = document.getElementById(`${control}Value`);
        if (slider) slider.value = 0;
        if (value) value.textContent = '0';
    });
    
    photoEditor.applyFilters();
    showNotification('All filters reset');
}

function applyPreset(preset) {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    resetFilters();
    
    switch(preset) {
        case 'vintage':
            setFilterValues({
                sepia: 60, contrast: -10, brightness: 10,
                temperature: 20, saturation: -20
            });
            break;
        case 'bw':
            setFilterValues({
                saturation: -100, contrast: 25, brightness: 5
            });
            break;
        case 'warm':
            setFilterValues({
                temperature: 40, tint: 10, vibrance: 15,
                brightness: 8, saturation: 10
            });
            break;
        case 'cool':
            setFilterValues({
                temperature: -35, tint: -8, vibrance: 12,
                brightness: -3, contrast: 15
            });
            break;
        case 'cinematic':
            setFilterValues({
                contrast: 30, saturation: -15, shadows: -20,
                highlights: -10, temperature: 15
            });
            break;
        case 'natural':
            setFilterValues({
                vibrance: 20, shadows: 10, highlights: -5,
                contrast: 10, saturation: 5
            });
            break;
    }
    
    photoEditor.applyFilters();
    showNotification(`${preset.charAt(0).toUpperCase() + preset.slice(1)} preset applied`);
}

function setFilterValues(values) {
    Object.keys(values).forEach(key => {
        photoEditor.filters[key] = values[key];
        const slider = document.getElementById(`${key}Slider`);
        const valueDisplay = document.getElementById(`${key}Value`);
        if (slider) slider.value = values[key];
        if (valueDisplay) valueDisplay.textContent = values[key];
    });
}

function rotateImage(degrees) {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        
        // Create temporary canvas for rotation
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Get current canvas content
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);
        
        // Swap dimensions for 90/270 degree rotations
        if (degrees === 90 || degrees === 270) {
            canvas.width = tempCanvas.height;
            canvas.height = tempCanvas.width;
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(tempCanvas, -tempCanvas.width / 2, -tempCanvas.height / 2);
        ctx.restore();
        
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification(`Image rotated ${degrees}°`);
    } catch (error) {
        console.error('Rotation error:', error);
        showNotification('Error rotating image');
    }
}

function flipImage(direction) {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        
        // Create temporary canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        tempCtx.drawImage(canvas, 0, 0);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        if (direction === 'horizontal') {
            ctx.scale(-1, 1);
            ctx.drawImage(tempCanvas, -canvas.width, 0);
        } else {
            ctx.scale(1, -1);
            ctx.drawImage(tempCanvas, 0, -canvas.height);
        }
        
        ctx.restore();
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification(`Image flipped ${direction}ly`);
    } catch (error) {
        console.error('Flip error:', error);
        showNotification('Error flipping image');
    }
}

function resizeImage() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    
    if (!widthInput || !heightInput) {
        showNotification('Resize inputs not found');
        return;
    }
    
    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);
    
    if (!newWidth || !newHeight || newWidth < 1 || newHeight < 1) {
        showNotification('Please enter valid dimensions');
        return;
    }
    
    if (newWidth > 5000 || newHeight > 5000) {
        showNotification('Maximum size is 5000x5000 pixels');
        return;
    }
    
    try {
        // Create temporary canvas with current content
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = photoEditor.canvas.width;
        tempCanvas.height = photoEditor.canvas.height;
        tempCtx.drawImage(photoEditor.canvas, 0, 0);
        
        // Resize main canvas
        photoEditor.canvas.width = newWidth;
        photoEditor.canvas.height = newHeight;
        
        // Draw resized image
        photoEditor.ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
        
        if (photoEditor.saveState) photoEditor.saveState();
        
        // Update displays
        const widthValue = document.getElementById('widthValue');
        const heightValue = document.getElementById('heightValue');
        if (widthValue) widthValue.textContent = newWidth;
        if (heightValue) heightValue.textContent = newHeight;
        
        showNotification(`Image resized to ${newWidth}x${newHeight}`);
    } catch (error) {
        console.error('Resize error:', error);
        showNotification('Error resizing image');
    }
}

function applyFilter(filterType) {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        switch(filterType) {
            case 'grayscale':
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    data[i] = gray;
                    data[i + 1] = gray;
                    data[i + 2] = gray;
                }
                break;
            case 'negative':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
                break;
            case 'emboss':
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    const emboss = Math.min(255, Math.max(0, gray + 128));
                    data[i] = emboss;
                    data[i + 1] = emboss;
                    data[i + 2] = emboss;
                }
                break;
            case 'sharpen':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, data[i] * 1.2);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.2);
                    data[i + 2] = Math.min(255, data[i + 2] * 1.2);
                }
                break;
            case 'edge':
                // Simple edge detection
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    const edge = gray > 128 ? 255 : 0;
                    data[i] = edge;
                    data[i + 1] = edge;
                    data[i + 2] = edge;
                }
                break;
            case 'pixelate':
                const pixelSize = 8;
                for (let y = 0; y < canvas.height; y += pixelSize) {
                    for (let x = 0; x < canvas.width; x += pixelSize) {
                        const i = (y * canvas.width + x) * 4;
                        if (i < data.length) {
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];
                            
                            for (let py = 0; py < pixelSize && y + py < canvas.height; py++) {
                                for (let px = 0; px < pixelSize && x + px < canvas.width; px++) {
                                    const pi = ((y + py) * canvas.width + (x + px)) * 4;
                                    if (pi < data.length) {
                                        data[pi] = r;
                                        data[pi + 1] = g;
                                        data[pi + 2] = b;
                                    }
                                }
                            }
                        }
                    }
                }
                break;
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification(`${filterType} filter applied`);
    } catch (error) {
        console.error('Filter error:', error);
        showNotification('Error applying filter');
    }
}

function addText() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    const textInput = document.getElementById('textInput');
    if (!textInput) {
        showNotification('Text input not found');
        return;
    }
    
    const text = textInput.value.trim();
    if (!text) {
        showNotification('Please enter some text');
        return;
    }
    
    try {
        const ctx = photoEditor.ctx;
        ctx.font = '30px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const x = photoEditor.canvas.width / 2;
        const y = photoEditor.canvas.height / 2;
        
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
        
        if (photoEditor.saveState) photoEditor.saveState();
        textInput.value = '';
        showNotification('Text added to image');
    } catch (error) {
        console.error('Text error:', error);
        showNotification('Error adding text');
    }
}

function setTool(tool) {
    if (typeof showNotification === 'function') {
        showNotification(`${tool} tool selected`);
    }
    console.log(`Tool selected: ${tool}`);
}

// Export functionality
function exportImage() {
    if (!photoEditor.canvas) return;
    
    const format = document.getElementById('exportFormat')?.value || 'png';
    const quality = document.getElementById('qualitySlider')?.value / 100 || 0.9;
    
    const link = document.createElement('a');
    link.download = `edited-photo.${format}`;
    
    if (format === 'jpg') {
        link.href = photoEditor.canvas.toDataURL('image/jpeg', quality);
    } else if (format === 'webp') {
        link.href = photoEditor.canvas.toDataURL('image/webp', quality);
    } else {
        link.href = photoEditor.canvas.toDataURL('image/png');
    }
    
    link.click();
    showNotification('Image exported successfully!');
}

function shareImage() {
    showNotification('Share functionality - Coming soon!');
}

function aiEnhance() {
    showNotification('AI Enhancement - Pro feature');
}

function removeBackground() {
    showNotification('AI Background Removal - Pro feature');
}

function upscaleImage() {
    showNotification('AI Upscaling - Pro feature');
}

function faceRetouch() {
    showNotification('AI Face Retouching - Pro feature');
}

// Quality slider
document.addEventListener('DOMContentLoaded', () => {
    const qualitySlider = document.getElementById('qualitySlider');
    if (qualitySlider) {
        qualitySlider.addEventListener('input', function() {
            document.getElementById('qualityValue').textContent = this.value;
        });
    }
});

// Update existing event listeners
document.querySelector('.action-btn.export').addEventListener('click', exportImage);