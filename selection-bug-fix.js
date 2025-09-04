// Selection Tools Bug Fixes
class SelectionBugFix {
    constructor() {
        this.init();
    }

    init() {
        this.fixSelectionTools();
        this.fixCursorIssues();
        this.fixEventHandlers();
    }

    fixSelectionTools() {
        // Fix selection tool buttons
        document.querySelectorAll('.grid-btn').forEach(btn => {
            if (btn.textContent.includes('Lasso') || 
                btn.textContent.includes('Magic') || 
                btn.textContent.includes('Rectangle') || 
                btn.textContent.includes('Ellipse')) {
                
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Remove active class from all selection tools
                    document.querySelectorAll('.grid-btn').forEach(b => {
                        if (b.textContent.includes('Lasso') || 
                            b.textContent.includes('Magic') || 
                            b.textContent.includes('Rectangle') || 
                            b.textContent.includes('Ellipse')) {
                            b.classList.remove('active');
                        }
                    });
                    
                    // Add active class to clicked tool
                    btn.classList.add('active');
                    
                    // Set cursor based on tool
                    this.setCursor(btn.textContent);
                });
            }
        });
    }

    setCursor(toolName) {
        const canvas = document.querySelector('.canvas-area');
        if (!canvas) return;

        canvas.style.cursor = 'crosshair';
        
        if (toolName.includes('Lasso')) {
            canvas.style.cursor = 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiMwMGZmODgiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K") 12 12, crosshair';
        } else if (toolName.includes('Magic')) {
            canvas.style.cursor = 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcgMTdMMTcgN00xNyA3SDE0TTEzIDdWMTBNMTEgMTVIMTRNMTEgMTVWMTJNMTEgMTVMOCAxOCIgc3Ryb2tlPSIjMDBmZjg4IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K") 12 12, crosshair';
        }
    }

    fixCursorIssues() {
        // Reset cursor when clicking outside selection tools
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.grid-btn') && !e.target.closest('.canvas-area')) {
                const canvas = document.querySelector('.canvas-area');
                if (canvas) {
                    canvas.style.cursor = 'default';
                }
            }
        });
    }

    fixEventHandlers() {
        // Fix tolerance slider
        const toleranceSlider = document.getElementById('toleranceSlider');
        if (toleranceSlider) {
            toleranceSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                // Update tolerance display if exists
                const display = document.querySelector('#toleranceValue');
                if (display) {
                    display.textContent = value;
                }
            });
        }

        // Fix clear selection
        const clearBtn = document.querySelector('.grid-btn[onclick*="clearSelection"]');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearSelection();
            });
        }

        // Fix invert selection
        const invertBtn = document.querySelector('.grid-btn[onclick*="invertSelection"]');
        if (invertBtn) {
            invertBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.invertSelection();
            });
        }
    }

    clearSelection() {
        // Remove any existing selection overlays
        const overlays = document.querySelectorAll('.selection-overlay');
        overlays.forEach(overlay => overlay.remove());
        
        // Reset active selection tool
        document.querySelectorAll('.grid-btn').forEach(btn => {
            if (btn.textContent.includes('Lasso') || 
                btn.textContent.includes('Magic') || 
                btn.textContent.includes('Rectangle') || 
                btn.textContent.includes('Ellipse')) {
                btn.classList.remove('active');
            }
        });

        // Reset cursor
        const canvas = document.querySelector('.canvas-area');
        if (canvas) {
            canvas.style.cursor = 'default';
        }

        // Show notification
        if (window.uiAnimations) {
            window.uiAnimations.showNotification('Selection cleared', 'info');
        }
    }

    invertSelection() {
        // Placeholder for invert selection functionality
        if (window.uiAnimations) {
            window.uiAnimations.showNotification('Selection inverted', 'info');
        }
    }
}

// Initialize bug fixes
document.addEventListener('DOMContentLoaded', () => {
    new SelectionBugFix();
});