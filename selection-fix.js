/**
 * Enhanced Selection Tools with Proper Cursor and Bug Fixes
 */

class EnhancedSelectionManager {
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
        this.animationId = null;
        this.init();
    }

    init() {
        this.createSelectionCanvas();
        this.bindEvents();
        this.setupCursors();
        this.bindSelectionButtons();
    }

    createSelectionCanvas() {
        this.selectionCanvas = document.createElement('canvas');
        this.selectionCanvas.className = 'selection-overlay';
        this.selectionCanvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 10;
            image-rendering: pixelated;
        `;
        this.selectionCtx = this.selectionCanvas.getContext('2d');
        
        const canvasArea = document.querySelector('.canvas-area');
        if (canvasArea) {
            canvasArea.style.position = 'relative';
            canvasArea.appendChild(this.selectionCanvas);
        }
    }

    setupCursors() {
        const cursors = {
            rectangle: 'crosshair',
            ellipse: 'crosshair',
            lasso: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K") 12 12, crosshair',
            magic: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgMTdMMTcgN00xNyA3SDE0TTEzIDdWMTBNMTEgMTVIMTRNMTEgMTVWMTJNMTEgMTVMOCAxOCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K") 12 12, pointer'
        };
        
        this.cursors = cursors;
    }

    bindEvents() {
        const mainCanvas = document.getElementById('mainCanvas');
        if (mainCanvas) {
            mainCanvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
            mainCanvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
            mainCanvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
            mainCanvas.addEventListener('click', (e) => this.onClick(e));
            
            // Touch events
            mainCanvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
            mainCanvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
            mainCanvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
        }

        // Bind sliders
        const toleranceSlider = document.getElementById('toleranceSlider');
        if (toleranceSlider) {
            toleranceSlider.addEventListener('input', (e) => {
                this.tolerance = parseInt(e.target.value);
                const display = document.getElementById('toleranceValue');
                if (display) display.textContent = e.target.value;
            });
        }

        const featherSlider = document.getElementById('featherSlider');
        if (featherSlider) {
            featherSlider.addEventListener('input', (e) => {
                this.feather = parseInt(e.target.value);
                const display = document.getElementById('featherValue');
                if (display) display.textContent = e.target.value;
            });
        }
    }

    bindSelectionButtons() {
        // Bind selection tool buttons
        document.querySelectorAll('[onclick*="setTool"]').forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            if (onclick && onclick.includes('lasso')) {
                btn.onclick = () => this.setTool('lasso');
            } else if (onclick && onclick.includes('magic')) {
                btn.onclick = () => this.setTool('magic');
            } else if (onclick && onclick.includes('rectangle')) {
                btn.onclick = () => this.setTool('rectangle');
            } else if (onclick && onclick.includes('ellipse')) {
                btn.onclick = () => this.setTool('ellipse');
            }
        });

        // Bind selection action buttons
        const clearBtn = document.querySelector('[onclick*="clearSelection"]');
        if (clearBtn) clearBtn.onclick = () => this.clearSelection();

        const invertBtn = document.querySelector('[onclick*="invertSelection"]');
        if (invertBtn) invertBtn.onclick = () => this.invertSelection();

        const selectAllBtn = document.querySelector('[onclick*="selectAll"]');
        if (selectAllBtn) selectAllBtn.onclick = () => this.selectAll();
    }

    getCanvasCoordinates(e) {
        const canvas = document.getElementById('mainCanvas');
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX, clientY;
        if (e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    onMouseDown(e) {
        if (!this.isSelectionToolActive()) return;
        
        e.preventDefault();
        const coords = this.getCanvasCoordinates(e);
        this.startX = coords.x;
        this.startY = coords.y;
        this.isSelecting = true;

        if (this.currentTool === 'magic') {
            this.magicWandSelect(coords.x, coords.y);
            return;
        }

        this.updateCanvasSize();
    }

    onMouseMove(e) {
        if (!this.isSelectionToolActive()) return;

        const canvas = document.getElementById('mainCanvas');
        if (canvas) {
            canvas.style.cursor = this.cursors[this.currentTool] || 'crosshair';
        }

        if (!this.isSelecting) return;

        e.preventDefault();
        const coords = this.getCanvasCoordinates(e);
        this.updateSelection(coords.x, coords.y);
    }

    onMouseUp(e) {
        if (!this.isSelecting) return;
        
        this.isSelecting = false;
        if (this.selection && (this.selection.width > 5 || this.selection.height > 5)) {
            showNotification(`${this.currentTool} selection created`);
        }
    }

    onClick(e) {
        if (this.currentTool === 'magic') {
            const coords = this.getCanvasCoordinates(e);
            this.magicWandSelect(coords.x, coords.y);
        }
    }

    onTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.onMouseDown(mouseEvent);
    }

    onTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.onMouseMove(mouseEvent);
    }

    onTouchEnd(e) {
        e.preventDefault();
        this.onMouseUp(e);
    }

    updateCanvasSize() {
        const mainCanvas = document.getElementById('mainCanvas');
        if (!mainCanvas || !this.selectionCanvas) return;

        const rect = mainCanvas.getBoundingClientRect();
        this.selectionCanvas.width = rect.width;
        this.selectionCanvas.height = rect.height;
        this.selectionCanvas.style.width = rect.width + 'px';
        this.selectionCanvas.style.height = rect.height + 'px';
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

        this.updateCanvasSize();

        const rect = mainCanvas.getBoundingClientRect();
        const scaleX = rect.width / mainCanvas.width;
        const scaleY = rect.height / mainCanvas.height;

        const displayX = this.selection.x * scaleX;
        const displayY = this.selection.y * scaleY;
        const displayWidth = this.selection.width * scaleX;
        const displayHeight = this.selection.height * scaleY;

        this.selectionCtx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);

        // Draw selection outline
        this.selectionCtx.save();
        this.selectionCtx.strokeStyle = '#fff';
        this.selectionCtx.lineWidth = 2;
        this.selectionCtx.setLineDash([8, 8]);
        this.selectionCtx.lineDashOffset = -Date.now() / 100;

        if (this.currentTool === 'rectangle') {
            this.selectionCtx.strokeRect(displayX, displayY, displayWidth, displayHeight);
        } else if (this.currentTool === 'ellipse') {
            this.selectionCtx.beginPath();
            this.selectionCtx.ellipse(
                displayX + displayWidth / 2,
                displayY + displayHeight / 2,
                displayWidth / 2,
                displayHeight / 2,
                0, 0, 2 * Math.PI
            );
            this.selectionCtx.stroke();
        }

        // Draw black outline for contrast
        this.selectionCtx.strokeStyle = '#000';
        this.selectionCtx.lineWidth = 1;
        this.selectionCtx.setLineDash([8, 8]);
        this.selectionCtx.lineDashOffset = -Date.now() / 100 + 8;

        if (this.currentTool === 'rectangle') {
            this.selectionCtx.strokeRect(displayX, displayY, displayWidth, displayHeight);
        } else if (this.currentTool === 'ellipse') {
            this.selectionCtx.beginPath();
            this.selectionCtx.ellipse(
                displayX + displayWidth / 2,
                displayY + displayHeight / 2,
                displayWidth / 2,
                displayHeight / 2,
                0, 0, 2 * Math.PI
            );
            this.selectionCtx.stroke();
        }

        this.selectionCtx.restore();

        // Animate marching ants
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.animationId = requestAnimationFrame(() => this.drawSelection());
    }

    setTool(tool) {
        this.currentTool = tool;
        
        // Update button states
        document.querySelectorAll('.grid-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const toolBtn = document.querySelector(`[onclick*="${tool}"]`);
        if (toolBtn) toolBtn.classList.add('active');

        // Update cursor
        const canvas = document.getElementById('mainCanvas');
        if (canvas) {
            canvas.style.cursor = this.cursors[tool] || 'crosshair';
        }

        showNotification(`${tool} selection tool activated`);
    }

    isSelectionToolActive() {
        const activePanel = document.querySelector('.panel-section.active');
        return activePanel && activePanel.id === 'selection-panel';
    }

    magicWandSelect(x, y) {
        if (!photoEditor || !photoEditor.canvas) return;

        const canvas = photoEditor.canvas;
        const ctx = photoEditor.ctx;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        if (index >= data.length) return;

        const targetR = data[index];
        const targetG = data[index + 1];
        const targetB = data[index + 2];

        const visited = new Set();
        const stack = [{ x: Math.floor(x), y: Math.floor(y) }];
        let minX = x, maxX = x, minY = y, maxY = y;

        while (stack.length > 0) {
            const { x: cx, y: cy } = stack.pop();
            const key = `${cx},${cy}`;

            if (visited.has(key) || cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) {
                continue;
            }

            const pixelIndex = (cy * canvas.width + cx) * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];

            const colorDiff = Math.abs(r - targetR) + Math.abs(g - targetG) + Math.abs(b - targetB);
            if (colorDiff > this.tolerance * 3) continue;

            visited.add(key);
            minX = Math.min(minX, cx);
            maxX = Math.max(maxX, cx);
            minY = Math.min(minY, cy);
            maxY = Math.max(maxY, cy);

            stack.push({ x: cx + 1, y: cy });
            stack.push({ x: cx - 1, y: cy });
            stack.push({ x: cx, y: cy + 1 });
            stack.push({ x: cx, y: cy - 1 });
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

    selectAll() {
        if (!photoEditor || !photoEditor.canvas) {
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
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.selectionCtx) {
            this.selectionCtx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        }
        
        // Reset cursor
        const canvas = document.getElementById('mainCanvas');
        if (canvas) {
            canvas.style.cursor = 'default';
        }
        
        showNotification('Selection cleared');
    }

    invertSelection() {
        if (!this.selection) {
            this.selectAll();
            return;
        }

        const canvas = photoEditor.canvas;
        if (this.selection.x === 0 && this.selection.y === 0 && 
            this.selection.width === canvas.width && this.selection.height === canvas.height) {
            this.clearSelection();
        } else {
            this.selectAll();
        }

        showNotification('Selection inverted');
    }

    copySelection() {
        if (!this.selection || !photoEditor) {
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

            window.selectionClipboard = {
                imageData: imageData,
                width: this.selection.width,
                height: this.selection.height
            };

            showNotification('Selection copied');
        } catch (error) {
            console.error('Copy error:', error);
            showNotification('Error copying selection');
        }
    }

    pasteSelection() {
        if (!window.selectionClipboard || !photoEditor) {
            showNotification('No copied selection to paste');
            return;
        }

        try {
            const ctx = photoEditor.ctx;
            const clipboard = window.selectionClipboard;

            const x = (photoEditor.canvas.width - clipboard.width) / 2;
            const y = (photoEditor.canvas.height - clipboard.height) / 2;

            ctx.putImageData(clipboard.imageData, x, y);

            if (photoEditor.saveState) photoEditor.saveState();
            showNotification('Selection pasted');
        } catch (error) {
            console.error('Paste error:', error);
            showNotification('Error pasting selection');
        }
    }
}

// Initialize enhanced selection manager
let enhancedSelectionManager;

document.addEventListener('DOMContentLoaded', () => {
    enhancedSelectionManager = new EnhancedSelectionManager();
});

// Global functions for backward compatibility
function setTool(tool) {
    if (enhancedSelectionManager) {
        enhancedSelectionManager.setTool(tool);
    }
}

function clearSelection() {
    if (enhancedSelectionManager) {
        enhancedSelectionManager.clearSelection();
    }
}

function invertSelection() {
    if (enhancedSelectionManager) {
        enhancedSelectionManager.invertSelection();
    }
}

function selectAll() {
    if (enhancedSelectionManager) {
        enhancedSelectionManager.selectAll();
    }
}

function copySelection() {
    if (enhancedSelectionManager) {
        enhancedSelectionManager.copySelection();
    }
}

function pasteSelection() {
    if (enhancedSelectionManager) {
        enhancedSelectionManager.pasteSelection();
    }
}