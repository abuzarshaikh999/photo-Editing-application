// Comprehensive Bug Fixes and Functionality Improvements
const BugFixer = {
    init() {
        this.fixProfileDropdown();
        this.fixImageUpload();
        this.fixPanelSwitching();
        this.fixZoomControls();
        this.fixBottomToolbar();
        this.fixMobileResponsiveness();
        this.addMissingFunctions();
        this.improveErrorHandling();
        this.addLoadingStates();
        this.fixMemoryLeaks();
        console.log('Bug fixes and improvements loaded');
    },

    // Fix profile dropdown issues
    fixProfileDropdown() {
        const profileAvatar = document.getElementById('profileAvatar');
        if (profileAvatar) {
            // Remove existing onclick and add proper event listener
            profileAvatar.removeAttribute('onclick');
            profileAvatar.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = document.getElementById('profileDropdown');
                if (dropdown) {
                    dropdown.classList.toggle('show');
                }
            });
        }

        // Fix dropdown positioning
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown) {
            dropdown.style.position = 'absolute';
            dropdown.style.zIndex = '9999';
        }
    },

    // Fix image upload and canvas issues
    fixImageUpload() {
        const canvasPlaceholder = document.getElementById('canvasPlaceholder');
        if (canvasPlaceholder) {
            // Add click handler for file upload
            canvasPlaceholder.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => this.handleImageUpload(e.target.files[0]);
                input.click();
            });

            // Add drag and drop
            canvasPlaceholder.addEventListener('dragover', (e) => {
                e.preventDefault();
                canvasPlaceholder.style.borderColor = '#667eea';
                canvasPlaceholder.style.background = 'rgba(102, 126, 234, 0.1)';
            });

            canvasPlaceholder.addEventListener('dragleave', (e) => {
                e.preventDefault();
                canvasPlaceholder.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                canvasPlaceholder.style.background = 'rgba(40, 40, 60, 0.3)';
            });

            canvasPlaceholder.addEventListener('drop', (e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    this.handleImageUpload(file);
                }
                canvasPlaceholder.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                canvasPlaceholder.style.background = 'rgba(40, 40, 60, 0.3)';
            });
        }
    },

    // Handle image upload properly
    handleImageUpload(file) {
        if (!file) return;

        this.showLoading('Loading image...');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.initializeCanvas(img);
                this.hideLoading();
                showNotification('Image loaded successfully');
            };
            img.onerror = () => {
                this.hideLoading();
                showNotification('Error loading image');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    // Initialize canvas with image
    initializeCanvas(img) {
        const canvas = document.getElementById('mainCanvas');
        const placeholder = document.getElementById('canvasPlaceholder');
        
        if (!canvas || !placeholder) return;

        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image
        ctx.drawImage(img, 0, 0);
        
        // Show canvas, hide placeholder
        canvas.style.display = 'block';
        placeholder.style.display = 'none';
        
        // Initialize photo editor
        if (typeof photoEditor !== 'undefined') {
            photoEditor.canvas = canvas;
            photoEditor.ctx = ctx;
            photoEditor.originalImage = img;
            photoEditor.history = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
            photoEditor.historyIndex = 0;
        } else {
            // Create basic photo editor object
            window.photoEditor = {
                canvas: canvas,
                ctx: ctx,
                originalImage: img,
                history: [ctx.getImageData(0, 0, canvas.width, canvas.height)],
                historyIndex: 0,
                filters: {
                    brightness: 0,
                    contrast: 0,
                    saturation: 0,
                    blur: 0,
                    hue: 0,
                    sepia: 0,
                    invert: 0
                },
                saveState() {
                    this.history = this.history.slice(0, this.historyIndex + 1);
                    this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
                    this.historyIndex++;
                },
                applyFilters() {
                    // Apply CSS filters
                    const filters = [];
                    if (this.filters.brightness !== 0) filters.push(`brightness(${100 + this.filters.brightness}%)`);
                    if (this.filters.contrast !== 0) filters.push(`contrast(${100 + this.filters.contrast}%)`);
                    if (this.filters.saturation !== 0) filters.push(`saturate(${100 + this.filters.saturation}%)`);
                    if (this.filters.blur !== 0) filters.push(`blur(${this.filters.blur}px)`);
                    if (this.filters.hue !== 0) filters.push(`hue-rotate(${this.filters.hue}deg)`);
                    if (this.filters.sepia !== 0) filters.push(`sepia(${this.filters.sepia}%)`);
                    if (this.filters.invert !== 0) filters.push(`invert(${this.filters.invert}%)`);
                    
                    this.canvas.style.filter = filters.join(' ');
                }
            };
        }

        // Update image info
        this.updateImageInfo(img);
    },

    // Fix panel switching
    fixPanelSwitching() {
        const tabs = document.querySelectorAll('.tab');
        const panels = document.querySelectorAll('.panel-section');
        const sidebarItems = document.querySelectorAll('.sidebar-item[data-tab]');

        // Fix tab switching
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                const panelId = tab.getAttribute('data-panel') || tab.textContent.toLowerCase();
                const panel = document.getElementById(panelId + '-panel');
                if (panel) panel.classList.add('active');
            });
        });

        // Fix sidebar switching
        sidebarItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabName = item.getAttribute('data-tab');
                const tab = document.querySelector(`.tab[data-panel="${tabName}"]`);
                if (tab) tab.click();
                
                sidebarItems.forEach(s => s.classList.remove('active'));
                item.classList.add('active');
            });
        });
    },

    // Fix zoom controls
    fixZoomControls() {
        const zoomSlider = document.querySelector('.zoom-slider');
        const zoomButtons = document.querySelectorAll('[data-tool="zoomIn"], [data-tool="zoomOut"]');
        
        if (zoomSlider) {
            zoomSlider.addEventListener('input', (e) => {
                const zoom = e.target.value;
                this.applyZoom(zoom);
                const zoomDisplay = zoomSlider.nextElementSibling;
                if (zoomDisplay) zoomDisplay.textContent = zoom + '%';
            });
        }

        zoomButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.getAttribute('data-tool');
                const currentZoom = parseInt(zoomSlider?.value || 100);
                const newZoom = tool === 'zoomIn' ? 
                    Math.min(500, currentZoom + 25) : 
                    Math.max(10, currentZoom - 25);
                
                if (zoomSlider) {
                    zoomSlider.value = newZoom;
                    zoomSlider.dispatchEvent(new Event('input'));
                }
            });
        });
    },

    // Apply zoom to canvas
    applyZoom(zoom) {
        const canvas = document.getElementById('mainCanvas');
        const canvasArea = document.querySelector('.canvas-area');
        
        if (canvas && canvasArea) {
            const scale = zoom / 100;
            canvas.style.transform = `scale(${scale})`;
            
            if (scale > 1) {
                canvasArea.classList.add('zoomed');
            } else {
                canvasArea.classList.remove('zoomed');
            }
        }
    },

    // Fix bottom toolbar functionality
    fixBottomToolbar() {
        const saveBtn = document.querySelector('.action-btn.save');
        const exportBtn = document.querySelector('.action-btn.export');
        const shareBtn = document.querySelector('.action-btn.share');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveProject());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportImage());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareImage());
        }
    },

    // Save project
    saveProject() {
        if (typeof photoEditor === 'undefined' || !photoEditor.canvas) {
            showNotification('No image to save');
            return;
        }

        try {
            const canvas = photoEditor.canvas;
            const dataURL = canvas.toDataURL('image/png');
            
            // Save to localStorage
            const projectData = {
                image: dataURL,
                filters: photoEditor.filters,
                timestamp: Date.now(),
                name: `Project_${new Date().toISOString().slice(0, 10)}`
            };
            
            const projects = JSON.parse(localStorage.getItem('userProjects') || '[]');
            projects.push(projectData);
            localStorage.setItem('userProjects', JSON.stringify(projects));
            
            showNotification('Project saved successfully');
        } catch (error) {
            console.error('Save error:', error);
            showNotification('Error saving project');
        }
    },

    // Export image
    exportImage() {
        if (typeof photoEditor === 'undefined' || !photoEditor.canvas) {
            showNotification('No image to export');
            return;
        }

        try {
            const canvas = photoEditor.canvas;
            const format = document.getElementById('exportFormat')?.value || 'png';
            const quality = (document.getElementById('qualitySlider')?.value || 90) / 100;
            
            const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
            const dataURL = canvas.toDataURL(mimeType, quality);
            
            // Create download link
            const link = document.createElement('a');
            link.download = `edited_image.${format}`;
            link.href = dataURL;
            link.click();
            
            showNotification('Image exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            showNotification('Error exporting image');
        }
    },

    // Share image
    shareImage() {
        if (typeof photoEditor === 'undefined' || !photoEditor.canvas) {
            showNotification('No image to share');
            return;
        }

        try {
            const canvas = photoEditor.canvas;
            canvas.toBlob((blob) => {
                if (navigator.share) {
                    const file = new File([blob], 'edited_image.png', { type: 'image/png' });
                    navigator.share({
                        files: [file],
                        title: 'Edited Image',
                        text: 'Check out my edited image!'
                    });
                } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]).then(() => {
                        showNotification('Image copied to clipboard');
                    }).catch(() => {
                        showNotification('Sharing not supported');
                    });
                }
            });
        } catch (error) {
            console.error('Share error:', error);
            showNotification('Error sharing image');
        }
    },

    // Fix mobile responsiveness
    fixMobileResponsiveness() {
        const mobilePanelToggle = document.getElementById('mobilePanelToggle');
        const rightPanel = document.querySelector('.right-panel');
        const sidebar = document.getElementById('sidebar');

        if (mobilePanelToggle && rightPanel) {
            mobilePanelToggle.addEventListener('click', () => {
                rightPanel.classList.toggle('open');
            });
        }

        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Close panels when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (rightPanel && !rightPanel.contains(e.target) && !mobilePanelToggle?.contains(e.target)) {
                    rightPanel.classList.remove('open');
                }
                if (sidebar && !sidebar.contains(e.target) && !sidebarToggle?.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    },

    // Add missing functions
    addMissingFunctions() {
        // Global showNotification function
        if (typeof window.showNotification === 'undefined') {
            window.showNotification = function(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;
                notification.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: rgba(102, 126, 234, 0.9);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 3000;
                    animation: slideIn 0.3s ease;
                    max-width: 300px;
                    word-wrap: break-word;
                `;
                
                if (type === 'error') {
                    notification.style.background = 'rgba(239, 68, 68, 0.9)';
                } else if (type === 'success') {
                    notification.style.background = 'rgba(34, 197, 94, 0.9)';
                }
                
                document.body.appendChild(notification);
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 3000);
            };
        }

        // Add missing slider event handlers
        this.bindAllSliders();
    },

    // Bind all slider events
    bindAllSliders() {
        const sliders = document.querySelectorAll('.slider');
        sliders.forEach(slider => {
            if (!slider.hasAttribute('data-bound')) {
                slider.addEventListener('input', (e) => {
                    const sliderId = e.target.id;
                    const valueId = sliderId.replace('Slider', 'Value');
                    const valueDisplay = document.getElementById(valueId);
                    
                    if (valueDisplay) {
                        valueDisplay.textContent = e.target.value;
                    }
                    
                    // Apply filter if photoEditor exists
                    if (typeof photoEditor !== 'undefined' && photoEditor.filters) {
                        const filterName = sliderId.replace('Slider', '');
                        if (photoEditor.filters.hasOwnProperty(filterName)) {
                            photoEditor.filters[filterName] = parseInt(e.target.value);
                            if (photoEditor.applyFilters) {
                                photoEditor.applyFilters();
                            }
                        }
                    }
                });
                slider.setAttribute('data-bound', 'true');
            }
        });
    },

    // Improve error handling
    improveErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            showNotification('An error occurred. Please try again.', 'error');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            showNotification('Operation failed. Please try again.', 'error');
        });
    },

    // Add loading states
    showLoading(message = 'Loading...') {
        let loader = document.getElementById('globalLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'globalLoader';
            loader.innerHTML = `
                <div class="loader-backdrop">
                    <div class="loader-content">
                        <div class="spinner"></div>
                        <div class="loader-text">${message}</div>
                    </div>
                </div>
            `;
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            document.body.appendChild(loader);
        } else {
            loader.querySelector('.loader-text').textContent = message;
            loader.style.display = 'flex';
        }
    },

    hideLoading() {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.style.display = 'none';
        }
    },

    // Update image info
    updateImageInfo(img) {
        const imageInfo = document.querySelector('.image-info span');
        if (imageInfo && img) {
            const size = this.formatFileSize(img.src.length * 0.75); // Approximate size
            imageInfo.textContent = `${img.width}x${img.height} • ${size} • ${this.getImageFormat(img.src)}`;
        }
    },

    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Get image format
    getImageFormat(src) {
        if (src.includes('data:image/jpeg')) return 'JPG';
        if (src.includes('data:image/png')) return 'PNG';
        if (src.includes('data:image/webp')) return 'WebP';
        if (src.includes('data:image/gif')) return 'GIF';
        return 'IMG';
    },

    // Fix memory leaks
    fixMemoryLeaks() {
        // Clean up event listeners on page unload
        window.addEventListener('beforeunload', () => {
            // Clear any intervals or timeouts
            for (let i = 1; i < 99999; i++) {
                window.clearInterval(i);
                window.clearTimeout(i);
            }
            
            // Clear large objects
            if (typeof photoEditor !== 'undefined') {
                photoEditor.history = [];
            }
        });
    }
};

// Add CSS for loader
const loaderCSS = `
.loader-backdrop {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loader-content {
    background: rgba(20, 20, 40, 0.9);
    padding: 30px;
    border-radius: 16px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(102, 126, 234, 0.3);
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

.loader-text {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.notification {
    animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = loaderCSS;
document.head.appendChild(style);

// Initialize bug fixes when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    BugFixer.init();
});

// Export for global access
window.BugFixer = BugFixer;