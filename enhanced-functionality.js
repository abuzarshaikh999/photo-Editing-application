// Enhanced functionality for Basic, Color, Retouch, Layers, Selection, and Filters

// Basic Panel Enhancements
function applyBasicPreset(preset) {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    switch(preset) {
        case 'auto':
            photoEditor.filters.brightness = 15;
            photoEditor.filters.contrast = 20;
            photoEditor.filters.saturation = 10;
            updateSliderValues(['brightness', 'contrast', 'saturation'], [15, 20, 10]);
            break;
        case 'bright':
            photoEditor.filters.brightness = 40;
            photoEditor.filters.exposure = 20;
            updateSliderValues(['brightness', 'exposure'], [40, 20]);
            break;
        case 'dark':
            photoEditor.filters.brightness = -30;
            photoEditor.filters.shadows = -20;
            updateSliderValues(['brightness', 'shadows'], [-30, -20]);
            break;
    }
    
    photoEditor.applyFilters();
    showNotification(`${preset} preset applied`);
}

// Enhanced Color Controls
let colorFilters = {
    temperature: 0,
    tint: 0,
    vibrance: 0,
    exposure: 0,
    highlights: 0,
    shadows: 0
};

function initializeEnhancedControls() {
    const controls = [
        'temperature', 'tint', 'vibrance', 'exposure', 'highlights', 'shadows', 'filterIntensity'
    ];
    
    controls.forEach(control => {
        const slider = document.getElementById(`${control}Slider`);
        const value = document.getElementById(`${control}Value`);
        
        if (slider && value) {
            slider.addEventListener('input', function() {
                colorFilters[control] = parseInt(this.value);
                value.textContent = this.value;
                applyEnhancedFilters();
            });
        }
    });
}

function applyEnhancedFilters() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) return;
    
    try {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        
        // Apply temperature and tint
        if (colorFilters.temperature !== 0 || colorFilters.tint !== 0) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                // Temperature adjustment
                if (colorFilters.temperature > 0) {
                    data[i] = Math.min(255, data[i] + colorFilters.temperature * 0.5);
                    data[i + 2] = Math.max(0, data[i + 2] - colorFilters.temperature * 0.3);
                } else if (colorFilters.temperature < 0) {
                    data[i] = Math.max(0, data[i] + colorFilters.temperature * 0.5);
                    data[i + 2] = Math.min(255, data[i + 2] - colorFilters.temperature * 0.3);
                }
                
                // Tint adjustment
                if (colorFilters.tint !== 0) {
                    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + colorFilters.tint * 0.4));
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
        }
        
        photoEditor.applyFilters();
    } catch (error) {
        console.error('Enhanced filter error:', error);
    }
}

// Layer Management
let layers = [{ name: 'Background', opacity: 100, visible: true, blendMode: 'normal' }];
let activeLayer = 0;

function addLayer() {
    const newLayer = {
        name: `Layer ${layers.length}`,
        opacity: 100,
        visible: true,
        blendMode: 'normal'
    };
    layers.push(newLayer);
    updateLayerList();
    showNotification('New layer added');
}

function updateLayerList() {
    const layerList = document.getElementById('layerList');
    if (!layerList) return;
    
    layerList.innerHTML = '';
    layers.forEach((layer, index) => {
        const layerItem = document.createElement('div');
        layerItem.className = `layer-item ${index === activeLayer ? 'active' : ''}`;
        layerItem.innerHTML = `
            <span>${layer.name}</span>
            <div class="layer-controls">
                <input type="range" min="0" max="100" value="${layer.opacity}" 
                       class="opacity-slider" onchange="updateLayerOpacity(${index}, this.value)">
                <span class="opacity-value">${layer.opacity}%</span>
            </div>
        `;
        layerItem.onclick = () => setActiveLayer(index);
        layerList.appendChild(layerItem);
    });
}

function updateLayerOpacity(layerIndex, opacity) {
    if (layers[layerIndex]) {
        layers[layerIndex].opacity = parseInt(opacity);
        const opacityValue = document.querySelector(`#layerList .layer-item:nth-child(${layerIndex + 1}) .opacity-value`);
        if (opacityValue) opacityValue.textContent = `${opacity}%`;
        showNotification(`Layer opacity: ${opacity}%`);
    }
}

function setActiveLayer(index) {
    activeLayer = index;
    updateLayerList();
    showNotification(`Active layer: ${layers[index].name}`);
}

function deleteLayer() {
    if (layers.length > 1 && activeLayer > 0) {
        layers.splice(activeLayer, 1);
        activeLayer = Math.max(0, activeLayer - 1);
        updateLayerList();
        showNotification('Layer deleted');
    } else {
        showNotification('Cannot delete background layer');
    }
}

function setBlendMode(mode) {
    if (layers[activeLayer]) {
        layers[activeLayer].blendMode = mode;
        showNotification(`Blend mode: ${mode}`);
    }
}

// Selection Tools
let selectionTool = 'rectangle';
let selection = null;

function setSelectionTool(tool) {
    selectionTool = tool;
    document.querySelectorAll('.selection-tool').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
    showNotification(`${tool} selection tool active`);
}

function selectAll() {
    if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
        showNotification('Please load an image first');
        return;
    }
    
    selection = {
        x: 0, y: 0,
        width: photoEditor.canvas.width,
        height: photoEditor.canvas.height
    };
    drawSelection();
    showNotification('All selected');
}

function drawSelection() {
    if (!selection) return;
    
    const canvas = photoEditor.canvas;
    const ctx = photoEditor.ctx;
    
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);
    ctx.restore();
}

function expandSelection() {
    if (selection) {
        selection.x = Math.max(0, selection.x - 10);
        selection.y = Math.max(0, selection.y - 10);
        selection.width = Math.min(photoEditor.canvas.width - selection.x, selection.width + 20);
        selection.height = Math.min(photoEditor.canvas.height - selection.y, selection.height + 20);
        drawSelection();
        showNotification('Selection expanded');
    }
}

function contractSelection() {
    if (selection) {
        selection.x += 5;
        selection.y += 5;
        selection.width = Math.max(10, selection.width - 10);
        selection.height = Math.max(10, selection.height - 10);
        drawSelection();
        showNotification('Selection contracted');
    }
}

function copySelection() {
    if (selection && typeof photoEditor !== 'undefined') {
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(selection.x, selection.y, selection.width, selection.height);
        
        // Store in clipboard simulation
        window.clipboardData = imageData;
        showNotification('Selection copied');
    }
}

// Filter Categories
function showFilterCategory(category) {
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.filter-category').forEach(cat => cat.classList.remove('active'));
    
    document.querySelector(`[onclick="showFilterCategory('${category}')"]`).classList.add('active');
    document.getElementById(`${category}-filters`).classList.add('active');
}

// Enhanced Filters
function applyEnhancedFilter(filterType) {
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
            case 'oil-painting':
                applyOilPaintingEffect(data, canvas.width, canvas.height);
                break;
            case 'watercolor':
                applyWatercolorEffect(data);
                break;
            case 'sketch':
                applySketchEffect(data);
                break;
            case 'fisheye':
                applyFisheyeEffect(data, canvas.width, canvas.height);
                break;
            case 'solarize':
                applySolarizeEffect(data);
                break;
            case 'posterize':
                applyPosterizeEffect(data);
                break;
        }
        
        ctx.putImageData(imageData, 0, 0);
        if (photoEditor.saveState) photoEditor.saveState();
        showNotification(`${filterType} filter applied`);
    } catch (error) {
        console.error('Enhanced filter error:', error);
        showNotification('Error applying filter');
    }
}

function applyOilPaintingEffect(data) {
    for (let i = 0; i < data.length; i += 4) {
        const factor = 0.8;
        data[i] = Math.min(255, data[i] * factor + 30);
        data[i + 1] = Math.min(255, data[i + 1] * factor + 20);
        data[i + 2] = Math.min(255, data[i + 2] * factor + 10);
    }
}

function applyWatercolorEffect(data) {
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 20;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
}

function applySketchEffect(data) {
    for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        const sketch = gray > 128 ? 255 : gray < 64 ? 0 : gray * 2;
        data[i] = sketch;
        data[i + 1] = sketch;
        data[i + 2] = sketch;
    }
}

function applySolarizeEffect(data) {
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i] > 128 ? 255 - data[i] : data[i];
        data[i + 1] = data[i + 1] > 128 ? 255 - data[i + 1] : data[i + 1];
        data[i + 2] = data[i + 2] > 128 ? 255 - data[i + 2] : data[i + 2];
    }
}

function applyPosterizeEffect(data) {
    const levels = 8;
    const step = 255 / levels;
    
    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.floor(data[i] / step) * step;
        data[i + 1] = Math.floor(data[i + 1] / step) * step;
        data[i + 2] = Math.floor(data[i + 2] / step) * step;
    }
}

// Utility function
function updateSliderValues(sliders, values) {
    sliders.forEach((slider, index) => {
        const element = document.getElementById(`${slider}Slider`);
        const valueElement = document.getElementById(`${slider}Value`);
        if (element) element.value = values[index];
        if (valueElement) valueElement.textContent = values[index];
    });
}

// Initialize enhanced functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeEnhancedControls();
    updateLayerList();
    
    // Tolerance and feather sliders
    const toleranceSlider = document.getElementById('toleranceSlider');
    if (toleranceSlider) {
        toleranceSlider.addEventListener('input', function() {
            const value = document.getElementById('toleranceValue');
            if (value) value.textContent = this.value;
        });
    }
    
    const featherSlider = document.getElementById('featherSlider');
    if (featherSlider) {
        featherSlider.addEventListener('input', function() {
            const value = document.getElementById('featherValue');
            if (value) value.textContent = this.value;
        });
    }
});

// Override applyFilter for enhanced filters
const originalApplyFilter = window.applyFilter;
window.applyFilter = function(filterType) {
    const enhancedFilters = ['oil-painting', 'watercolor', 'sketch', 'fisheye', 'solarize', 'posterize'];
    
    if (enhancedFilters.includes(filterType)) {
        applyEnhancedFilter(filterType);
    } else if (typeof originalApplyFilter === 'function') {
        originalApplyFilter(filterType);
    }
};