// Selection Tools Functionality

class SelectionManager {
    constructor() {
        this.currentTool = 'rectangle';
        this.selection = null;
        this.isSelecting = false;
        this.startX = 0;
        this.startY = 0;
        this.tolerance = 20;
        this.feather = 0;
        this.selectionCanvas = null;
        this.selectionCtx = null;
        this.initializeSelectionCanvas();
        this.bindEvents();
    }

    initializeSelectionCanvas() {
        this.selectionCanvas = document.createElement('canvas');
        this.selectionCanvas.style.position = 'absolute';
        this.selectionCanvas.style.top = '0';
        this.selectionCanvas.style.left = '0';
        this.selectionCanvas.style.pointerEvents = 'none';
        this.selectionCanvas.style.zIndex = '10';
        this.selectionCtx = this.selectionCanvas.getContext('2d');
        
        const canvasArea = document.querySelector('.canvas-area');
        if (canvasArea) {
            canvasArea.style.position = 'relative';
            canvasArea.appendChild(this.selectionCanvas);
        }
    }

    bindEvents() {
        const mainCanvas = document.getElementById('mainCanvas');
        if (mainCanvas) {
            mainCanvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
            mainCanvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
            mainCanvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        }
    }

    onMouseDown(e) {
        if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) return;
        
        const rect = e.target.getBoundingClientRect();
        this.startX = e.clientX - rect.left;
        this.startY = e.clientY - rect.top;
        this.isSelecting = true;
        
        // Adjust for canvas scaling
        const canvas = photoEditor.canvas;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        this.startX *= scaleX;
        this.startY *= scaleY;
    }

    onMouseMove(e) {
        if (!this.isSelecting) return;
        
        const rect = e.target.getBoundingClientRect();
        let currentX = e.clientX - rect.left;
        let currentY = e.clientY - rect.top;
        
        // Adjust for canvas scaling
        const canvas = photoEditor.canvas;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        currentX *= scaleX;
        currentY *= scaleY;
        
        this.updateSelection(currentX, currentY);
    }

    onMouseUp(e) {
        if (!this.isSelecting) return;
        
        this.isSelecting = false;
        if (this.selection) {
            showNotification(`${this.currentTool} selection created`);
        }
    }

    updateSelection(currentX, currentY) {
        const width = Math.abs(currentX - this.startX);
        const height = Math.abs(currentY - this.startY);
        const x = Math.min(this.startX, currentX);
        const y = Math.min(this.startY, currentY);
        
        this.selection = { x, y, width, height };
        this.drawSelection();
    }

    drawSelection() {
        if (!this.selection || !this.selectionCanvas) return;
        
        const mainCanvas = document.getElementById('mainCanvas');
        if (!mainCanvas) return;
        
        // Match selection canvas size to main canvas
        const rect = mainCanvas.getBoundingClientRect();
        this.selectionCanvas.width = rect.width;
        this.selectionCanvas.height = rect.height;
        this.selectionCanvas.style.width = rect.width + 'px';
        this.selectionCanvas.style.height = rect.height + 'px';
        
        // Scale selection coordinates to display canvas
        const scaleX = rect.width / mainCanvas.width;
        const scaleY = rect.height / mainCanvas.height;
        
        const displayX = this.selection.x * scaleX;
        const displayY = this.selection.y * scaleY;
        const displayWidth = this.selection.width * scaleX;
        const displayHeight = this.selection.height * scaleY;
        
        this.selectionCtx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        
        // Draw marching ants
        this.selectionCtx.save();
        this.selectionCtx.strokeStyle = '#fff';
        this.selectionCtx.lineWidth = 2;
        this.selectionCtx.setLineDash([8, 8]);
        this.selectionCtx.lineDashOffset = Date.now() / 100;
        
        if (this.currentTool === 'rectangle') {
            this.selectionCtx.strokeRect(displayX, displayY, displayWidth, displayHeight);
        } else if (this.currentTool === 'ellipse') {
            this.selectionCtx.beginPath();
            this.selectionCtx.ellipse(
                displayX + displayWidth/2, 
                displayY + displayHeight/2,
                displayWidth/2, 
                displayHeight/2, 
                0, 0, 2 * Math.PI
            );
            this.selectionCtx.stroke();
        }
        
        this.selectionCtx.restore();
        
        // Animate marching ants
        requestAnimationFrame(() => this.drawSelection());
    }

    setTool(tool) {
        this.currentTool = tool;
        document.querySelectorAll('.selection-tool').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const toolBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (toolBtn) {
            toolBtn.classList.add('active');
        }
        
        showNotification(`${tool} selection tool activated`);
    }

    selectAll() {
        if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) {
            showNotification('Please load an image first');
            return;
        }
        
        this.selection = {
            x: 0,
            y: 0,
            width: photoEditor.canvas.width,
            height: photoEditor.canvas.height
        };
        
        this.drawSelection();
        showNotification('All selected');
    }

    clearSelection() {
        this.selection = null;
        if (this.selectionCtx) {
            this.selectionCtx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        }
        showNotification('Selection cleared');
    }

    invertSelection() {
        if (!this.selection) {
            this.selectAll();
            return;
        }
        
        // Simple invert - select everything except current selection
        const canvas = photoEditor.canvas;
        if (this.selection.x === 0 && this.selection.y === 0 && 
            this.selection.width === canvas.width && this.selection.height === canvas.height) {
            this.clearSelection();
        } else {
            this.selectAll();
        }
        
        showNotification('Selection inverted');
    }

    expandSelection() {
        if (!this.selection) {
            showNotification('No selection to expand');
            return;
        }
        
        const expandBy = 10;
        this.selection.x = Math.max(0, this.selection.x - expandBy);
        this.selection.y = Math.max(0, this.selection.y - expandBy);
        this.selection.width = Math.min(
            photoEditor.canvas.width - this.selection.x, 
            this.selection.width + expandBy * 2
        );
        this.selection.height = Math.min(
            photoEditor.canvas.height - this.selection.y, 
            this.selection.height + expandBy * 2
        );
        
        this.drawSelection();
        showNotification('Selection expanded');
    }

    contractSelection() {
        if (!this.selection) {
            showNotification('No selection to contract');
            return;
        }
        
        const contractBy = 10;
        this.selection.x += contractBy;
        this.selection.y += contractBy;
        this.selection.width = Math.max(20, this.selection.width - contractBy * 2);
        this.selection.height = Math.max(20, this.selection.height - contractBy * 2);
        
        this.drawSelection();
        showNotification('Selection contracted');
    }

    copySelection() {
        if (!this.selection || typeof photoEditor === 'undefined') {
            showNotification('No selection to copy');
            return;
        }
        
        try {
            const canvas = photoEditor.canvas;
            const ctx = photoEditor.ctx;
            const imageData = ctx.getImageData(
                this.selection.x, 
                this.selection.y, 
                this.selection.width, 
                this.selection.height
            );
            
            // Store in global clipboard
            window.selectionClipboard = {
                imageData: imageData,
                width: this.selection.width,
                height: this.selection.height
            };
            
            showNotification('Selection copied to clipboard');
        } catch (error) {
            console.error('Copy selection error:', error);
            showNotification('Error copying selection');
        }
    }

    pasteSelection() {
        if (!window.selectionClipboard || typeof photoEditor === 'undefined') {
            showNotification('No copied selection to paste');
            return;
        }
        
        try {
            const ctx = photoEditor.ctx;
            const clipboard = window.selectionClipboard;
            
            // Paste at center of canvas
            const x = (photoEditor.canvas.width - clipboard.width) / 2;
            const y = (photoEditor.canvas.height - clipboard.height) / 2;
            
            ctx.putImageData(clipboard.imageData, x, y);
            
            if (photoEditor.saveState) photoEditor.saveState();
            showNotification('Selection pasted');
        } catch (error) {
            console.error('Paste selection error:', error);
            showNotification('Error pasting selection');
        }
    }

    magicWandSelect(x, y) {
        if (typeof photoEditor === 'undefined' || !photoEditor.originalImage) return;
        
        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Get target color
        const index = (y * canvas.width + x) * 4;
        const targetR = data[index];
        const targetG = data[index + 1];
        const targetB = data[index + 2];
        
        // Simple flood fill selection
        const visited = new Set();
        const stack = [{x, y}];
        let minX = x, maxX = x, minY = y, maxY = y;
        
        while (stack.length > 0) {
            const {x: cx, y: cy} = stack.pop();
            const key = `${cx},${cy}`;
            
            if (visited.has(key) || cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) {
                continue;
            }
            
            const pixelIndex = (cy * canvas.width + cx) * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            
            // Check if color is within tolerance
            const colorDiff = Math.abs(r - targetR) + Math.abs(g - targetG) + Math.abs(b - targetB);
            if (colorDiff > this.tolerance * 3) continue;
            
            visited.add(key);
            minX = Math.min(minX, cx);
            maxX = Math.max(maxX, cx);
            minY = Math.min(minY, cy);
            maxY = Math.max(maxY, cy);
            
            // Add neighbors
            stack.push({x: cx + 1, y: cy});
            stack.push({x: cx - 1, y: cy});
            stack.push({x: cx, y: cy + 1});
            stack.push({x: cx, y: cy - 1});
        }
        
        if (visited.size > 0) {
            this.selection = {
                x: minX,
                y: minY,
                width: maxX - minX + 1,
                height: maxY - minY + 1
            };
            this.drawSelection();
            showNotification(`Magic wand selected ${visited.size} pixels`);
        }
    }
}

// Initialize selection manager
let selectionManager;

document.addEventListener('DOMContentLoaded', () => {
    selectionManager = new SelectionManager();
    
    // Bind tolerance and feather sliders
    const toleranceSlider = document.getElementById('toleranceSlider');
    if (toleranceSlider) {
        toleranceSlider.addEventListener('input', function() {
            selectionManager.tolerance = parseInt(this.value);
            const valueDisplay = document.getElementById('toleranceValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
        });
    }
    
    const featherSlider = document.getElementById('featherSlider');
    if (featherSlider) {
        featherSlider.addEventListener('input', function() {
            selectionManager.feather = parseInt(this.value);
            const valueDisplay = document.getElementById('featherValue');
            if (valueDisplay) valueDisplay.textContent = this.value;
        });
    }
});

// Global functions for UI
function setSelectionTool(tool) {
    if (selectionManager) {
        selectionManager.setTool(tool);
    }
}

function selectAll() {
    if (selectionManager) {
        selectionManager.selectAll();
    }
}

function clearSelection() {
    if (selectionManager) {
        selectionManager.clearSelection();
    }
}

function invertSelection() {
    if (selectionManager) {
        selectionManager.invertSelection();
    }
}

function expandSelection() {
    if (selectionManager) {
        selectionManager.expandSelection();
    }
}

function contractSelection() {
    if (selectionManager) {
        selectionManager.contractSelection();
    }
}

function copySelection() {
    if (selectionManager) {
        selectionManager.copySelection();
    }
}

function pasteSelection() {
    if (selectionManager) {
        selectionManager.pasteSelection();
    }
}