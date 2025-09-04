// Text Notes System - Movable and Editable Text Annotations
class TextNotesManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.notes = [];
        this.selectedNote = null;
        this.isDragging = false;
        this.isEditing = false;
        this.dragOffset = { x: 0, y: 0 };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    addNote(x, y, text = 'New Note') {
        const note = {
            id: Date.now(),
            x: x,
            y: y,
            text: text,
            fontSize: 16,
            color: '#ffffff',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 8,
            width: 120,
            height: 30,
            isVisible: true
        };
        
        this.notes.push(note);
        this.selectedNote = note;
        this.redrawNotes();
        return note;
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check if clicking on a note
        const clickedNote = this.getNoteAtPosition(x, y);
        
        if (clickedNote) {
            this.selectedNote = clickedNote;
            this.isDragging = true;
            this.dragOffset.x = x - clickedNote.x;
            this.dragOffset.y = y - clickedNote.y;
            this.canvas.style.cursor = 'move';
        } else {
            this.selectedNote = null;
        }
        
        this.redrawNotes();
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.isDragging && this.selectedNote) {
            this.selectedNote.x = x - this.dragOffset.x;
            this.selectedNote.y = y - this.dragOffset.y;
            this.redrawNotes();
        } else {
            // Change cursor when hovering over notes
            const hoverNote = this.getNoteAtPosition(x, y);
            this.canvas.style.cursor = hoverNote ? 'pointer' : 'default';
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;
        this.canvas.style.cursor = 'default';
    }

    handleDoubleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const clickedNote = this.getNoteAtPosition(x, y);
        
        if (clickedNote) {
            this.editNote(clickedNote);
        } else {
            // Add new note at click position
            this.addNote(x, y);
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Delete' && this.selectedNote) {
            this.deleteNote(this.selectedNote.id);
        }
    }

    getNoteAtPosition(x, y) {
        for (let i = this.notes.length - 1; i >= 0; i--) {
            const note = this.notes[i];
            if (x >= note.x && x <= note.x + note.width &&
                y >= note.y && y <= note.y + note.height) {
                return note;
            }
        }
        return null;
    }

    editNote(note) {
        const newText = prompt('Edit note:', note.text);
        if (newText !== null) {
            note.text = newText;
            this.updateNoteSize(note);
            this.redrawNotes();
        }
    }

    updateNoteSize(note) {
        this.ctx.font = `${note.fontSize}px Arial`;
        const textWidth = this.ctx.measureText(note.text).width;
        note.width = Math.max(textWidth + note.padding * 2, 80);
        note.height = note.fontSize + note.padding * 2;
    }

    deleteNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.selectedNote = null;
        this.redrawNotes();
    }

    redrawNotes() {
        // Clear previous notes (this should be called after main image is drawn)
        this.drawAllNotes();
    }

    drawAllNotes() {
        this.notes.forEach(note => {
            if (note.isVisible) {
                this.drawNote(note);
            }
        });
    }

    drawNote(note) {
        const ctx = this.ctx;
        
        // Draw background
        ctx.fillStyle = note.backgroundColor;
        ctx.fillRect(note.x, note.y, note.width, note.height);
        
        // Draw border for selected note
        if (note === this.selectedNote) {
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.strokeRect(note.x, note.y, note.width, note.height);
        }
        
        // Draw text
        ctx.fillStyle = note.color;
        ctx.font = `${note.fontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        const textX = note.x + note.padding;
        const textY = note.y + note.height / 2;
        
        ctx.fillText(note.text, textX, textY);
    }

    // Update note properties
    updateNoteStyle(noteId, properties) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            Object.assign(note, properties);
            if (properties.fontSize || properties.text) {
                this.updateNoteSize(note);
            }
            this.redrawNotes();
        }
    }

    // Get all notes data
    getNotesData() {
        return this.notes.map(note => ({ ...note }));
    }

    // Load notes data
    loadNotesData(notesData) {
        this.notes = notesData.map(note => ({ ...note }));
        this.selectedNote = null;
        this.redrawNotes();
    }

    // Clear all notes
    clearAllNotes() {
        this.notes = [];
        this.selectedNote = null;
        this.redrawNotes();
    }

    // Show/hide notes
    toggleNotesVisibility() {
        this.notes.forEach(note => {
            note.isVisible = !note.isVisible;
        });
        this.redrawNotes();
    }
}

// Initialize text notes when photo editor loads
let textNotesManager = null;

// Function to initialize text notes
function initializeTextNotes() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    if (canvas && ctx) {
        textNotesManager = new TextNotesManager(canvas, ctx);
        console.log('Text Notes Manager initialized');
    }
}

// Add text note button functionality
function addTextNote() {
    if (textNotesManager) {
        const canvas = document.getElementById('canvas');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        textNotesManager.addNote(centerX, centerY, 'Click to edit');
    }
}

// Text note controls
function updateSelectedNoteColor(color) {
    if (textNotesManager && textNotesManager.selectedNote) {
        textNotesManager.updateNoteStyle(textNotesManager.selectedNote.id, { color: color });
    }
}

function updateSelectedNoteFontSize(size) {
    if (textNotesManager && textNotesManager.selectedNote) {
        textNotesManager.updateNoteStyle(textNotesManager.selectedNote.id, { fontSize: parseInt(size) });
    }
}

function updateSelectedNoteBackground(color) {
    if (textNotesManager && textNotesManager.selectedNote) {
        textNotesManager.updateNoteStyle(textNotesManager.selectedNote.id, { backgroundColor: color });
    }
}

function deleteSelectedNote() {
    if (textNotesManager && textNotesManager.selectedNote) {
        textNotesManager.deleteNote(textNotesManager.selectedNote.id);
    }
}

function clearAllTextNotes() {
    if (textNotesManager) {
        textNotesManager.clearAllNotes();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for canvas to be ready
    setTimeout(initializeTextNotes, 500);
});