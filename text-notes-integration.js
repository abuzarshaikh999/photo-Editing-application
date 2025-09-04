// Text Notes Integration with Photo Editor
// This file integrates text notes with the existing photo editor functionality

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Update note opacity
function updateNoteOpacity(opacity) {
    if (textNotesManager && textNotesManager.selectedNote) {
        const colorInput = document.getElementById('noteBackgroundColor');
        const rgb = hexToRgb(colorInput.value);
        const alpha = opacity / 100;
        const backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        textNotesManager.updateNoteStyle(textNotesManager.selectedNote.id, { backgroundColor: backgroundColor });
    }
}

// Integration with existing photo editor redraw function
const originalRedrawCanvas = window.redrawCanvas;
window.redrawCanvas = function() {
    // Call original redraw function
    if (originalRedrawCanvas) {
        originalRedrawCanvas();
    }
    
    // Redraw text notes on top
    if (textNotesManager) {
        textNotesManager.drawAllNotes();
    }
};

// Integration with PhotoEditor class if it exists
if (typeof PhotoEditor !== 'undefined') {
    const originalApplyFilter = PhotoEditor.prototype.applyFilter;
    PhotoEditor.prototype.applyFilter = function(filterName, value) {
        const result = originalApplyFilter.call(this, filterName, value);
        
        // Redraw notes after filter application
        setTimeout(() => {
            if (textNotesManager) {
                textNotesManager.drawAllNotes();
            }
        }, 50);
        
        return result;
    };
}

// Add text notes to toolbar
function addTextNotesToToolbar() {
    const toolbar = document.querySelector('.toolbar-left');
    if (toolbar) {
        const notesBtn = document.createElement('button');
        notesBtn.className = 'tool-btn';
        notesBtn.innerHTML = '<i class="icon">📝</i>';
        notesBtn.title = 'Add Text Note';
        notesBtn.onclick = addTextNote;
        toolbar.appendChild(notesBtn);
    }
}

// Initialize text notes integration
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addTextNotesToToolbar();
        
        // Add text notes panel to right panel if it exists
        const rightPanel = document.querySelector('.right-panel .panel-content');
        if (rightPanel) {
            fetch('text-notes-panel.html')
                .then(response => response.text())
                .then(html => {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = html;
                    rightPanel.appendChild(tempDiv.firstElementChild);
                })
                .catch(() => {
                    // Fallback: create panel directly
                    const panel = document.createElement('div');
                    panel.className = 'panel-section';
                    panel.id = 'textNotesPanel';
                    panel.innerHTML = `
                        <div class="panel-header">
                            <h3>Text Notes</h3>
                            <button class="panel-toggle">−</button>
                        </div>
                        <div class="panel-content">
                            <div class="control-group">
                                <button class="control-btn primary" onclick="addTextNote()">
                                    📝 Add Note
                                </button>
                            </div>
                            <div class="control-group">
                                <label>Text Color</label>
                                <input type="color" id="noteTextColor" value="#ffffff" onchange="updateSelectedNoteColor(this.value)">
                            </div>
                            <div class="control-group">
                                <label>Font Size</label>
                                <input type="range" id="noteFontSize" min="10" max="48" value="16" 
                                       oninput="updateSelectedNoteFontSize(this.value)">
                            </div>
                            <div class="control-group">
                                <button class="control-btn secondary" onclick="deleteSelectedNote()">
                                    🗑️ Delete
                                </button>
                                <button class="control-btn secondary" onclick="clearAllTextNotes()">
                                    🧹 Clear All
                                </button>
                            </div>
                        </div>
                    `;
                    rightPanel.appendChild(panel);
                });
        }
    }, 1000);
});