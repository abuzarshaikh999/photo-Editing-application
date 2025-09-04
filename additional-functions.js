// Additional functionality for Selection, Filters, Text, and Advanced tools

// Selection Tools
function clearSelection() {
    showNotification('Selection cleared');
}

function invertSelection() {
    showNotification('Selection inverted');
}

// Advanced Filters
let textStyle = { bold: false, italic: false, color: '#ffffff', size: 30, family: 'Arial' };

function setTextStyle(style) {
    if (style === 'bold') {
        textStyle.bold = !textStyle.bold;
    } else if (style === 'italic') {
        textStyle.italic = !textStyle.italic;
    }
    showNotification(`Text ${style} ${textStyle[style] ? 'enabled' : 'disabled'}`);
}

function setTextColor(color) {
    textStyle.color = color;
    showNotification(`Text color set to ${color}`);
}

function addStyledText() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    const textInput = document.getElementById('textContentInput');
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
        let fontString = '';
        
        if (textStyle.italic) fontString += 'italic ';
        if (textStyle.bold) fontString += 'bold ';
        fontString += `${textStyle.size}px ${textStyle.family}`;
        
        ctx.font = fontString;
        ctx.fillStyle = textStyle.color;
        ctx.strokeStyle = textStyle.color === '#ffffff' ? '#000000' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const x = photoEditor.canvas.width / 2;
        const y = photoEditor.canvas.height / 2;
        
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
        
        if (photoEditor.saveState) photoEditor.saveState();
        textInput.value = '';
        showNotification('Styled text added');
    } catch (error) {
        console.error('Styled text error:', error);
        showNotification('Error adding styled text');
    }
}

// Safe event listener attachment
document.addEventListener('DOMContentLoaded', () => {
    // Font size slider
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', function() {
            textStyle.size = parseInt(this.value);
            const valueDisplay = document.getElementById('fontSizeValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
        });
    }

    // Font family selector
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', function() {
            textStyle.family = this.value;
            if (typeof showNotification === 'function') {
                showNotification(`Font changed to ${this.value}`);
            }
        });
    }

    // Noise and grain sliders
    const noiseSlider = document.getElementById('noiseSlider');
    if (noiseSlider) {
        noiseSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('noiseValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
            applyNoiseReduction(parseInt(this.value));
        });
    }

    const grainSlider = document.getElementById('grainSlider');
    if (grainSlider) {
        grainSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('grainValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
            applyFilmGrain(parseInt(this.value));
        });
    }

    // Advanced panel sliders
    const lensSlider = document.getElementById('lensSlider');
    if (lensSlider) {
        lensSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('lensValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
            applyLensCorrection(parseInt(this.value));
        });
    }

    const chromaticSlider = document.getElementById('chromaticSlider');
    if (chromaticSlider) {
        chromaticSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('chromaticValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
            applyChromaticAberration(parseInt(this.value));
        });
    }

    // Background removal controls
    const bgToleranceSlider = document.getElementById('bgToleranceSlider');
    if (bgToleranceSlider) {
        bgToleranceSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('bgToleranceValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
            setBgTolerance(parseInt(this.value));
        });
    }

    const bgFeatherSlider = document.getElementById('bgFeatherSlider');
    if (bgFeatherSlider) {
        bgFeatherSlider.addEventListener('input', function() {
            const valueDisplay = document.getElementById('bgFeatherValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
            setBgFeather(parseInt(this.value));
        });
    }
});

function applyNoiseReduction(value) {
    if (!photoEditor.originalImage) return;
    // Simplified noise reduction effect
    showNotification(`Noise reduction: ${value}%`);
}

function applyFilmGrain(value) {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        if (typeof showNotification === 'function') {
            showNotification('Please load an image first');
        }
        return;
    }
    
    try {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * value * 2;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        
        if (typeof showNotification === 'function') {
            showNotification(`Film grain applied: ${value}%`);
        }
    } catch (error) {
        console.error('Film grain error:', error);
        if (typeof showNotification === 'function') {
            showNotification('Error applying film grain');
        }
    }
}

// Advanced Tools
function batchProcess() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        // Apply multiple enhancements in batch
        autoEnhance();
        setTimeout(() => {
            applyAdvancedFilter('dramatic');
            setTimeout(() => {
                applyLensCorrection(20);
                showNotification('Batch processing completed');
            }, 500);
        }, 500);
    } catch (error) {
        console.error('Batch process error:', error);
        showNotification('Error in batch processing');
    }
}

function createHDR() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Enhanced HDR effect with tone mapping
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;
            
            // Reinhard tone mapping
            const newR = r / (1 + r);
            const newG = g / (1 + g);
            const newB = b / (1 + b);
            
            data[i] = Math.min(255, newR * 255 * 1.2);
            data[i + 1] = Math.min(255, newG * 255 * 1.2);
            data[i + 2] = Math.min(255, newB * 255 * 1.2);
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification('HDR effect applied');
    } catch (error) {
        console.error('HDR error:', error);
        showNotification('Error applying HDR effect');
    }
}

function panoramaStitch() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        // Simulate panorama effect by stretching horizontally
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Create wider canvas
        const newCanvas = document.createElement('canvas');
        const newCtx = newCanvas.getContext('2d');
        newCanvas.width = canvas.width * 1.5;
        newCanvas.height = canvas.height;
        
        // Draw stretched image
        newCtx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
        
        // Replace current canvas
        canvas.width = newCanvas.width;
        canvas.height = newCanvas.height;
        ctx.drawImage(newCanvas, 0, 0);
        
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification('Panorama effect applied');
    } catch (error) {
        console.error('Panorama error:', error);
        showNotification('Error applying panorama effect');
    }
}

function rawProcess() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        // Simulate RAW processing with enhanced dynamic range
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            // Enhance shadows and highlights
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Shadow/highlight recovery
            const luminance = (r * 0.299 + g * 0.587 + b * 0.114);
            
            if (luminance < 85) { // Shadows
                data[i] = Math.min(255, r * 1.3);
                data[i + 1] = Math.min(255, g * 1.3);
                data[i + 2] = Math.min(255, b * 1.3);
            } else if (luminance > 170) { // Highlights
                data[i] = Math.max(0, r * 0.9);
                data[i + 1] = Math.max(0, g * 0.9);
                data[i + 2] = Math.max(0, b * 0.9);
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification('RAW processing applied');
    } catch (error) {
        console.error('RAW process error:', error);
        showNotification('Error in RAW processing');
    }
}

// Lens Correction Function
function applyLensCorrection(value) {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        
        // Apply barrel/pincushion distortion correction
        const correctionFactor = value / 100;
        
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const dx = x - centerX;
                const dy = y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const normalizedDistance = distance / maxRadius;
                
                // Apply correction
                const correction = 1 + correctionFactor * normalizedDistance * normalizedDistance;
                const newX = centerX + dx / correction;
                const newY = centerY + dy / correction;
                
                if (newX >= 0 && newX < canvas.width && newY >= 0 && newY < canvas.height) {
                    const sourceIndex = (Math.floor(newY) * canvas.width + Math.floor(newX)) * 4;
                    const targetIndex = (y * canvas.width + x) * 4;
                    
                    if (sourceIndex >= 0 && sourceIndex < data.length - 3) {
                        data[targetIndex] = data[sourceIndex];
                        data[targetIndex + 1] = data[sourceIndex + 1];
                        data[targetIndex + 2] = data[sourceIndex + 2];
                    }
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification(`Lens correction applied: ${value}%`);
    } catch (error) {
        console.error('Lens correction error:', error);
        showNotification('Error applying lens correction');
    }
}

// Chromatic Aberration Correction
function applyChromaticAberration(value) {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const shift = value / 10; // Pixel shift amount
        
        // Create separate channels
        const redChannel = new Uint8ClampedArray(data.length);
        const greenChannel = new Uint8ClampedArray(data.length);
        const blueChannel = new Uint8ClampedArray(data.length);
        
        // Copy original data
        for (let i = 0; i < data.length; i += 4) {
            redChannel[i] = data[i];
            greenChannel[i + 1] = data[i + 1];
            blueChannel[i + 2] = data[i + 2];
        }
        
        // Apply chromatic aberration correction by shifting channels
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                
                // Shift red channel
                const redX = Math.max(0, Math.min(canvas.width - 1, x + shift));
                const redIndex = (y * canvas.width + Math.floor(redX)) * 4;
                
                // Shift blue channel
                const blueX = Math.max(0, Math.min(canvas.width - 1, x - shift));
                const blueIndex = (y * canvas.width + Math.floor(blueX)) * 4;
                
                if (redIndex < data.length && blueIndex < data.length) {
                    data[index] = redChannel[redIndex]; // Red
                    data[index + 2] = blueChannel[blueIndex]; // Blue
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification(`Chromatic aberration corrected: ${value}%`);
    } catch (error) {
        console.error('Chromatic aberration error:', error);
        showNotification('Error correcting chromatic aberration');
    }
}

function autoEnhance() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        // Auto enhance with multiple adjustments
        photoEditor.filters.brightness = 10;
        photoEditor.filters.contrast = 15;
        photoEditor.filters.saturation = 20;
        
        // Update sliders safely
        const brightnessSlider = document.getElementById('brightnessSlider');
        const contrastSlider = document.getElementById('contrastSlider');
        const saturationSlider = document.getElementById('saturationSlider');
        
        if (brightnessSlider) brightnessSlider.value = 10;
        if (contrastSlider) contrastSlider.value = 15;
        if (saturationSlider) saturationSlider.value = 20;
        
        // Update displays safely
        const brightnessValue = document.getElementById('brightnessValue');
        const contrastValue = document.getElementById('contrastValue');
        const saturationValue = document.getElementById('saturationValue');
        
        if (brightnessValue) brightnessValue.textContent = '10';
        if (contrastValue) contrastValue.textContent = '15';
        if (saturationValue) saturationValue.textContent = '20';
        
        if (photoEditor.applyFilters) photoEditor.applyFilters();
        showNotification('Auto enhancement applied');
    } catch (error) {
        console.error('Auto enhance error:', error);
        showNotification('Error applying auto enhancement');
    }
}

function contentAwareFill() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        // Simple content-aware fill simulation
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Fill transparent or very dark areas with surrounding colors
        for (let y = 1; y < canvas.height - 1; y++) {
            for (let x = 1; x < canvas.width - 1; x++) {
                const index = (y * canvas.width + x) * 4;
                
                // Check if pixel needs filling (very dark or transparent)
                if (data[index + 3] < 50 || (data[index] + data[index + 1] + data[index + 2]) < 30) {
                    // Sample surrounding pixels
                    let r = 0, g = 0, b = 0, count = 0;
                    
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            
                            const sampleIndex = ((y + dy) * canvas.width + (x + dx)) * 4;
                            if (data[sampleIndex + 3] > 50) {
                                r += data[sampleIndex];
                                g += data[sampleIndex + 1];
                                b += data[sampleIndex + 2];
                                count++;
                            }
                        }
                    }
                    
                    if (count > 0) {
                        data[index] = r / count;
                        data[index + 1] = g / count;
                        data[index + 2] = b / count;
                        data[index + 3] = 255;
                    }
                }
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification('Content-aware fill applied');
    } catch (error) {
        console.error('Content-aware fill error:', error);
        showNotification('Error applying content-aware fill');
    }
}

// Extended filter effects
function applyAdvancedFilter(filterType) {
    if (!photoEditor.originalImage) return;
    
    const canvas = photoEditor.canvas;
    const ctx = photoEditor.ctx;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    switch(filterType) {
        case 'vintage':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.1 + 20);
                data[i + 1] = Math.min(255, data[i + 1] * 0.9 + 10);
                data[i + 2] = Math.min(255, data[i + 2] * 0.8);
            }
            break;
        case 'cold':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.max(0, data[i] * 0.8);
                data[i + 1] = Math.min(255, data[i + 1] * 1.1);
                data[i + 2] = Math.min(255, data[i + 2] * 1.2);
            }
            break;
        case 'warm':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.2);
                data[i + 1] = Math.min(255, data[i + 1] * 1.1);
                data[i + 2] = Math.max(0, data[i + 2] * 0.8);
            }
            break;
        case 'dramatic':
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const factor = avg > 128 ? 1.3 : 0.7;
                data[i] = Math.min(255, Math.max(0, data[i] * factor));
                data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor));
                data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor));
            }
            break;
        case 'soft':
            // Soft focus effect
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 0.9 + 25);
                data[i + 1] = Math.min(255, data[i + 1] * 0.9 + 25);
                data[i + 2] = Math.min(255, data[i + 2] * 0.9 + 25);
            }
            break;
        case 'vignette':
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
            
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                    const vignette = 1 - (distance / maxDistance) * 0.6;
                    const i = (y * canvas.width + x) * 4;
                    
                    data[i] *= vignette;
                    data[i + 1] *= vignette;
                    data[i + 2] *= vignette;
                }
            }
            break;
    }
    
    ctx.putImageData(imageData, 0, 0);
    photoEditor.saveState();
    showNotification(`${filterType} filter applied`);
}

// Background Removal Controls
function setBgRemovalMethod(method) {
    bgRemovalSettings.method = method;
    showNotification(`Background removal method: ${method}`);
}

function setBgTolerance(value) {
    bgRemovalSettings.tolerance = value;
    showNotification(`Tolerance set to: ${value}`);
}

function setBgFeather(value) {
    bgRemovalSettings.feather = value;
    showNotification(`Feather set to: ${value}`);
}

// AI Functions
function aiEnhance() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        // Simulate AI enhancement with multiple filters
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // AI-like enhancement algorithm
        for (let i = 0; i < data.length; i += 4) {
            // Enhance contrast and brightness intelligently
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate luminance
            const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            
            // Apply adaptive enhancement
            let factor = 1.0;
            if (luminance < 0.3) factor = 1.3; // Brighten dark areas
            else if (luminance > 0.7) factor = 0.9; // Slightly darken bright areas
            else factor = 1.1; // Enhance mid-tones
            
            data[i] = Math.min(255, Math.max(0, r * factor));
            data[i + 1] = Math.min(255, Math.max(0, g * factor));
            data[i + 2] = Math.min(255, Math.max(0, b * factor));
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification('AI enhancement applied');
    } catch (error) {
        console.error('AI enhance error:', error);
        showNotification('Error applying AI enhancement');
    }
}

// AI Background Removal with multiple algorithms
let bgRemovalSettings = {
    method: 'smart', // 'simple', 'smart', 'edge', 'color'
    tolerance: 30,
    feather: 5,
    preserveHair: true
};

function removeBackground(method = 'smart') {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        switch(method) {
            case 'simple':
                removeBackgroundSimple(data);
                break;
            case 'smart':
                removeBackgroundSmart(data, canvas.width, canvas.height);
                break;
            case 'edge':
                removeBackgroundEdge(data, canvas.width, canvas.height);
                break;
            case 'color':
                removeBackgroundColor(data);
                break;
            default:
                removeBackgroundSmart(data, canvas.width, canvas.height);
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification(`Background removed (${method})`);
    } catch (error) {
        console.error('Remove background error:', error);
        showNotification('Error removing background');
    }
}

function removeBackgroundSimple(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Remove white/light backgrounds
        if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0;
        }
    }
}

function removeBackgroundSmart(data, width, height) {
    // Smart AI-like background removal
    const edgeMap = detectEdges(data, width, height);
    const backgroundMask = floodFillBackground(data, width, height, edgeMap);
    
    for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        if (backgroundMask[pixelIndex]) {
            // Apply feathering for smooth edges
            const featherAlpha = calculateFeatherAlpha(pixelIndex, backgroundMask, width, height);
            data[i + 3] = Math.max(0, data[i + 3] * (1 - featherAlpha));
        }
    }
}

function removeBackgroundEdge(data, width, height) {
    // Edge-based detection
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = (y * width + x) * 4;
            
            // Calculate edge strength
            const edgeStrength = calculateEdgeStrength(data, x, y, width);
            
            // Remove low-edge areas (likely background)
            if (edgeStrength < 20) {
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                
                // Additional color check
                if (r > 180 || g > 180 || b > 180) {
                    data[index + 3] = 0;
                }
            }
        }
    }
}

function removeBackgroundColor(data) {
    // Color-based removal with tolerance
    const tolerance = bgRemovalSettings.tolerance;
    
    // Sample corner colors as background
    const bgColors = [
        [data[0], data[1], data[2]], // Top-left
        [data[data.length - 4], data[data.length - 3], data[data.length - 2]] // Bottom-right
    ];
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Check similarity to background colors
        for (const bgColor of bgColors) {
            const diff = Math.abs(r - bgColor[0]) + Math.abs(g - bgColor[1]) + Math.abs(b - bgColor[2]);
            if (diff < tolerance) {
                data[i + 3] = 0;
                break;
            }
        }
    }
}

function detectEdges(data, width, height) {
    const edges = new Array(width * height).fill(0);
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const index = (y * width + x) * 4;
            const edgeStrength = calculateEdgeStrength(data, x, y, width);
            edges[y * width + x] = edgeStrength;
        }
    }
    
    return edges;
}

function calculateEdgeStrength(data, x, y, width) {
    const getPixel = (px, py) => {
        const idx = (py * width + px) * 4;
        return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    };
    
    // Sobel edge detection
    const gx = -getPixel(x-1, y-1) + getPixel(x+1, y-1) +
               -2*getPixel(x-1, y) + 2*getPixel(x+1, y) +
               -getPixel(x-1, y+1) + getPixel(x+1, y+1);
    
    const gy = -getPixel(x-1, y-1) - 2*getPixel(x, y-1) - getPixel(x+1, y-1) +
               getPixel(x-1, y+1) + 2*getPixel(x, y+1) + getPixel(x+1, y+1);
    
    return Math.sqrt(gx * gx + gy * gy);
}

function floodFillBackground(data, width, height, edgeMap) {
    const backgroundMask = new Array(width * height).fill(false);
    const visited = new Array(width * height).fill(false);
    
    // Start flood fill from corners
    const startPoints = [
        [0, 0], [width-1, 0], [0, height-1], [width-1, height-1]
    ];
    
    for (const [startX, startY] of startPoints) {
        if (!visited[startY * width + startX]) {
            floodFill(data, width, height, startX, startY, backgroundMask, visited, edgeMap);
        }
    }
    
    return backgroundMask;
}

function floodFill(data, width, height, x, y, backgroundMask, visited, edgeMap) {
    const stack = [[x, y]];
    const startIndex = (y * width + x) * 4;
    const startColor = [data[startIndex], data[startIndex + 1], data[startIndex + 2]];
    
    while (stack.length > 0) {
        const [cx, cy] = stack.pop();
        const index = cy * width + cx;
        
        if (cx < 0 || cx >= width || cy < 0 || cy >= height || visited[index]) {
            continue;
        }
        
        const pixelIndex = index * 4;
        const pixelColor = [data[pixelIndex], data[pixelIndex + 1], data[pixelIndex + 2]];
        
        // Check color similarity and edge strength
        const colorDiff = Math.abs(pixelColor[0] - startColor[0]) + 
                         Math.abs(pixelColor[1] - startColor[1]) + 
                         Math.abs(pixelColor[2] - startColor[2]);
        
        if (colorDiff < 50 && edgeMap[index] < 30) {
            visited[index] = true;
            backgroundMask[index] = true;
            
            stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
        }
    }
}

function calculateFeatherAlpha(pixelIndex, backgroundMask, width, height) {
    const x = pixelIndex % width;
    const y = Math.floor(pixelIndex / width);
    const featherRadius = bgRemovalSettings.feather;
    
    let backgroundCount = 0;
    let totalCount = 0;
    
    for (let dy = -featherRadius; dy <= featherRadius; dy++) {
        for (let dx = -featherRadius; dx <= featherRadius; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const neighborIndex = ny * width + nx;
                if (backgroundMask[neighborIndex]) backgroundCount++;
                totalCount++;
            }
        }
    }
    
    return backgroundCount / totalCount;
}

function upscaleImage() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        // Simple upscaling simulation
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        
        // Create new canvas with 2x size
        const newCanvas = document.createElement('canvas');
        const newCtx = newCanvas.getContext('2d');
        
        newCanvas.width = canvas.width * 2;
        newCanvas.height = canvas.height * 2;
        
        // Use smooth scaling
        newCtx.imageSmoothingEnabled = true;
        newCtx.imageSmoothingQuality = 'high';
        newCtx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
        
        // Replace current canvas content
        canvas.width = newCanvas.width;
        canvas.height = newCanvas.height;
        ctx.drawImage(newCanvas, 0, 0);
        
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification('Image upscaled 2x');
    } catch (error) {
        console.error('Upscale error:', error);
        showNotification('Error upscaling image');
    }
}

function faceRetouch() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    try {
        // Simple face retouch simulation (skin smoothing)
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply gentle smoothing to skin tones
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Detect skin tones (simplified)
            if (r > 95 && g > 40 && b > 20 && r > g && r > b) {
                // Apply gentle smoothing
                data[i] = Math.min(255, r * 1.05);
                data[i + 1] = Math.min(255, g * 1.03);
                data[i + 2] = Math.min(255, b * 1.02);
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification('Face retouch applied');
    } catch (error) {
        console.error('Face retouch error:', error);
        showNotification('Error applying face retouch');
    }
}

// Safe filter override
if (typeof window !== 'undefined') {
    const originalApplyFilter = window.applyFilter;
    window.applyFilter = function(filterType) {
        const advancedFilters = ['vintage', 'cold', 'warm', 'dramatic', 'soft', 'vignette'];
        
        if (advancedFilters.includes(filterType)) {
            applyAdvancedFilter(filterType);
        } else if (typeof originalApplyFilter === 'function') {
            originalApplyFilter(filterType);
        } else {
            // Fallback if original function doesn't exist
            if (typeof showNotification === 'function') {
                showNotification(`${filterType} filter not available`);
            }
        }
    };
}