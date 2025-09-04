// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
    } else {
        sidebar.classList.toggle('collapsed');
    }
});

// Sidebar navigation
document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all items
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        this.classList.add('active');
        
        // Handle tab switching for tools
        const tabName = this.getAttribute('data-tab');
        if (tabName) {
            switchTab(tabName);
        }
        
        // Close mobile panels
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
    });
});

// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel-section');

function switchTab(tabName) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('data-panel') === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Update panel content
    const panels = document.querySelectorAll('.panel-section');
    panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${tabName}-panel`) {
            panel.classList.add('active');
        }
    });
}

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const panelName = this.getAttribute('data-panel');
        switchTab(panelName);
    });
});

// Slider interactions with real-time feedback
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', function() {
        const value = this.value;
        const label = this.previousElementSibling;
        
        // Add visual feedback
        this.style.background = `linear-gradient(to right, #667eea 0%, #764ba2 ${Math.abs(value)}%, rgba(255,255,255,0.2) ${Math.abs(value)}%)`;
        
        // Update label if needed
        if (label && label.tagName === 'LABEL') {
            const originalText = label.textContent.split(':')[0];
            label.textContent = `${originalText}: ${value}`;
        }
    });
});

// Zoom functionality
let currentZoom = 100;

// Initialize zoom controls safely
document.addEventListener('DOMContentLoaded', () => {
    const zoomSlider = document.querySelector('.zoom-slider');
    const zoomDisplay = zoomSlider?.nextElementSibling;
    
    if (zoomSlider && zoomDisplay) {
        zoomSlider.addEventListener('input', function() {
            currentZoom = parseInt(this.value);
            zoomDisplay.textContent = `${currentZoom}%`;
            applyZoom(currentZoom / 100);
        });
        
        // Set initial values
        zoomSlider.value = currentZoom;
        zoomDisplay.textContent = `${currentZoom}%`;
    }
});

function zoomCanvas(factor) {
    if (!currentZoom) currentZoom = 100;
    
    const newZoom = currentZoom * factor;
    currentZoom = Math.max(10, Math.min(500, newZoom));
    
    const zoomSlider = document.querySelector('.zoom-slider');
    const zoomDisplay = zoomSlider?.nextElementSibling;
    
    if (zoomSlider) zoomSlider.value = currentZoom;
    if (zoomDisplay) zoomDisplay.textContent = `${Math.round(currentZoom)}%`;
    
    applyZoom(currentZoom / 100);
    showNotification(`Zoom: ${Math.round(currentZoom)}%`);
}

function applyZoom(scale) {
    const canvas = document.getElementById('mainCanvas');
    if (canvas && canvas.style.display !== 'none') {
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = 'center';
        
        // Adjust canvas container for proper scrolling
        const canvasArea = document.querySelector('.canvas-area');
        if (canvasArea) {
            if (scale > 1) {
                canvasArea.classList.add('zoomed');
                canvasArea.style.overflow = 'auto';
            } else {
                canvasArea.classList.remove('zoomed');
                canvasArea.style.overflow = 'hidden';
            }
        }
    }
}

// Add mouse wheel zoom support
document.addEventListener('DOMContentLoaded', () => {
    const canvasArea = document.querySelector('.canvas-area');
    if (canvasArea) {
        canvasArea.addEventListener('wheel', (e) => {
            const canvas = document.getElementById('mainCanvas');
            if (canvas && canvas.style.display !== 'none' && e.ctrlKey) {
                e.preventDefault();
                
                const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
                zoomCanvas(zoomFactor);
            }
        });
    }
});

// Reset zoom function
function resetZoom() {
    currentZoom = 100;
    const zoomSlider = document.querySelector('.zoom-slider');
    const zoomDisplay = zoomSlider?.nextElementSibling;
    
    if (zoomSlider) zoomSlider.value = 100;
    if (zoomDisplay) zoomDisplay.textContent = '100%';
    
    applyZoom(1);
    showNotification('Zoom reset to 100%');
}

// Tool button interactions
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-1px)';
        }, 100);
        
        const tool = this.getAttribute('data-tool');
        
        if (typeof photoEditor !== 'undefined' && photoEditor.originalImage) {
            switch(tool) {
                case 'undo':
                    photoEditor.undo();
                    showNotification('Undo applied');
                    break;
                case 'redo':
                    photoEditor.redo();
                    showNotification('Redo applied');
                    break;
                case 'rotate':
                    rotateImage(90);
                    break;
                case 'crop':
                    setTool('crop');
                    break;
                case 'resize':
                    switchTab('retouch');
                    showNotification('Use resize controls in Retouch panel');
                    break;
                case 'zoomIn':
                    if (typeof zoomCanvas === 'function') {
                        zoomCanvas(1.2);
                    } else {
                        showNotification('Zoom in');
                    }
                    break;
                case 'zoomOut':
                    if (typeof zoomCanvas === 'function') {
                        zoomCanvas(0.8);
                    } else {
                        showNotification('Zoom out');
                    }
                    break;
                default:
                    showNotification(`${tool} tool selected`);
            }
        } else {
            showNotification('Please load an image first');
        }
    });
});

// Grid button interactions
document.querySelectorAll('.grid-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Toggle active state
        document.querySelectorAll('.grid-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        console.log('Tool selected:', this.textContent);
    });
});

// Action button functionality
const saveBtn = document.querySelector('.action-btn.save');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        console.log('Save clicked');
        showNotification('Project saved successfully!');
    });
}

const exportBtn = document.querySelector('.action-btn.export');
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        console.log('Export clicked');
        if (typeof exportImage === 'function') {
            exportImage();
        } else {
            showNotification('Exporting image...');
        }
    });
}

const shareBtn = document.querySelector('.action-btn.share');
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        console.log('Share clicked');
        if (typeof shareImage === 'function') {
            shareImage();
        } else {
            showNotification('Share options opened');
        }
    });
}

// Canvas drag and drop functionality
const canvasArea = document.querySelector('.canvas-area');
if (canvasArea) {
    const canvasPlaceholder = document.querySelector('.canvas-placeholder');
    
    canvasArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (canvasPlaceholder) {
            canvasPlaceholder.style.borderColor = '#667eea';
            canvasPlaceholder.style.background = 'rgba(102, 126, 234, 0.2)';
        }
    });

    canvasArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        if (canvasPlaceholder) {
            canvasPlaceholder.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            canvasPlaceholder.style.background = 'rgba(40, 40, 60, 0.3)';
        }
    });

    canvasArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            handleImageUpload(files[0]);
        }
        
        // Reset placeholder style
        if (canvasPlaceholder) {
            canvasPlaceholder.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            canvasPlaceholder.style.background = 'rgba(40, 40, 60, 0.3)';
        }
    });
}

const canvasPlaceholder = document.querySelector('.canvas-placeholder');
if (canvasPlaceholder) {
    canvasPlaceholder.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleImageUpload(e.target.files[0]);
            }
        };
        input.click();
    });
}

// Handle image upload
function handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
        showNotification('Please select a valid image file');
        return;
    }
    
    if (typeof photoEditor !== 'undefined' && photoEditor.loadImage) {
        photoEditor.loadImage(file);
    } else {
        // Fallback for basic display
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.borderRadius = '12px';
            
            const placeholder = document.getElementById('canvasPlaceholder');
            if (placeholder) {
                placeholder.innerHTML = '';
                placeholder.appendChild(img);
                placeholder.style.border = 'none';
            }
            
            showNotification('Image loaded successfully!');
        };
        reader.readAsDataURL(file);
    }
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    
    sidebarItems.forEach(item => {
        const label = item.querySelector('.label');
        if (label) {
            const text = label.textContent.toLowerCase();
            if (text.includes(query) || query === '') {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        }
    });
});

// Notification system
function showNotification(message) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        background: rgba(102, 126, 234, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        backdrop-filter: blur(10px);
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .grid-btn.active {
        background: rgba(102, 126, 234, 0.5) !important;
        border-color: #667eea !important;
    }
`;
document.head.appendChild(style);

// Mobile responsive functionality
const mobilePanelToggle = document.getElementById('mobilePanelToggle');
const rightPanel = document.querySelector('.right-panel');

mobilePanelToggle.addEventListener('click', () => {
    rightPanel.classList.toggle('open');
});

// Close panels when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!rightPanel.contains(e.target) && !mobilePanelToggle.contains(e.target)) {
            rightPanel.classList.remove('open');
        }
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        rightPanel.classList.remove('open');
        sidebar.classList.remove('open');
    }
});

// Touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100;
    const swipeDistance = touchEndX - touchStartX;
    
    if (window.innerWidth <= 768) {
        // Swipe right to open sidebar
        if (swipeDistance > swipeThreshold && touchStartX < 50) {
            sidebar.classList.add('open');
        }
        // Swipe left to close sidebar
        if (swipeDistance < -swipeThreshold && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
        // Swipe left to open right panel
        if (swipeDistance < -swipeThreshold && touchStartX > window.innerWidth - 50) {
            rightPanel.classList.add('open');
        }
        // Swipe right to close right panel
        if (swipeDistance > swipeThreshold && rightPanel.classList.contains('open')) {
            rightPanel.classList.remove('open');
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('PhotoPro Editor initialized');
    
    // Initialize missing elements safely
    const elements = {
        sidebar: document.getElementById('sidebar'),
        sidebarToggle: document.getElementById('sidebarToggle'),
        mobilePanelToggle: document.getElementById('mobilePanelToggle'),
        rightPanel: document.querySelector('.right-panel'),
        canvasArea: document.querySelector('.canvas-area'),
        canvasPlaceholder: document.getElementById('canvasPlaceholder')
    };
    
    // Check if all required elements exist
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);
    
    if (missingElements.length > 0) {
        console.warn('Missing elements:', missingElements);
    }
    
    // Safe initialization
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification('Welcome to PhotoPro!');
        }
    }, 100);
});