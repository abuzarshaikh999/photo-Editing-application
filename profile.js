// Profile functionality
const Profile = {
    init() {
        this.bindEvents();
        this.loadProfile();
        this.loadProjects();
        this.loadHistory();
    },

    bindEvents() {
        const profileAvatar = document.getElementById('profileAvatar');
        const profileDropdown = document.getElementById('profileDropdown');

        // Toggle dropdown on avatar click
        profileAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!profileAvatar.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Prevent dropdown from closing when clicking inside
        profileDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Avatar upload handler
        document.getElementById('avatarInput').addEventListener('change', (e) => {
            this.handleAvatarUpload(e);
        });

        // Close modals on outside click
        document.querySelectorAll('.profile-modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });
    },

    toggleDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        dropdown.classList.toggle('show');
    },

    closeDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        dropdown.classList.remove('show');
    },

    loadProfile() {
        const profile = this.getProfile();
        document.querySelector('.profile-name').textContent = profile.name;
        document.querySelector('.profile-email').textContent = profile.email;
    },

    getProfile() {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : {
            name: 'John Doe',
            email: 'john@example.com',
            bio: 'Photo editing enthusiast',
            avatar: '👤'
        };
    },

    saveProfileData(profile) {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        this.loadProfile();
    },

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const profile = this.getProfile();
                profile.avatar = e.target.result;
                this.saveProfileData(profile);
                document.getElementById('currentAvatar').style.backgroundImage = `url(${e.target.result})`;
                document.getElementById('currentAvatar').textContent = '';
            };
            reader.readAsDataURL(file);
        }
    },

    openEditProfile() {
        this.closeDropdown();
        const profile = this.getProfile();
        document.getElementById('profileNameInput').value = profile.name;
        document.getElementById('profileEmailInput').value = profile.email;
        document.getElementById('profileBioInput').value = profile.bio || '';
        
        if (profile.avatar && profile.avatar !== '👤') {
            document.getElementById('currentAvatar').style.backgroundImage = `url(${profile.avatar})`;
            document.getElementById('currentAvatar').textContent = '';
        }
        
        document.getElementById('editProfileModal').classList.add('show');
    },

    closeAllModals() {
        document.querySelectorAll('.profile-modal').forEach(modal => {
            modal.classList.remove('show');
        });
    },

    loadProjects() {
        const projects = JSON.parse(localStorage.getItem('userProjects') || '[]');
        const projectsList = document.getElementById('projectsList');
        
        if (projects.length === 0) {
            projectsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📁</div>
                    <h4>No projects yet</h4>
                    <p>Start editing photos to create your first project</p>
                </div>
            `;
        } else {
            projectsList.innerHTML = projects.map(project => `
                <div class="project-item">
                    <div class="project-icon">📷</div>
                    <div class="project-info">
                        <div class="project-name">${project.name}</div>
                        <div class="project-date">${new Date(project.date).toLocaleDateString()}</div>
                    </div>
                </div>
            `).join('');
        }
    },

    loadHistory() {
        const history = JSON.parse(localStorage.getItem('editHistory') || '[]');
        const historyList = document.getElementById('historyList');
        
        if (history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <h4>No history yet</h4>
                    <p>Your editing history will appear here</p>
                </div>
            `;
        } else {
            historyList.innerHTML = history.slice(-10).reverse().map(item => `
                <div class="history-item">
                    <div class="history-icon">✏️</div>
                    <div class="history-info">
                        <div class="history-action">${item.action}</div>
                        <div class="history-time">${new Date(item.timestamp).toLocaleString()}</div>
                    </div>
                </div>
            `).join('');
        }
    },

    addToHistory(action) {
        const history = JSON.parse(localStorage.getItem('editHistory') || '[]');
        history.push({
            action,
            timestamp: Date.now()
        });
        localStorage.setItem('editHistory', JSON.stringify(history));
    },

    addProject(name) {
        const projects = JSON.parse(localStorage.getItem('userProjects') || '[]');
        projects.push({
            name,
            date: Date.now()
        });
        localStorage.setItem('userProjects', JSON.stringify(projects));
    },

    showNotification(message) {
        const notification = document.createElement('div');
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
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

// Global functions for dropdown menu items
function editProfile() {
    Profile.openEditProfile();
}

function viewProjects() {
    Profile.closeDropdown();
    Profile.loadProjects();
    document.getElementById('projectsModal').classList.add('show');
}

function viewHistory() {
    Profile.closeDropdown();
    Profile.loadHistory();
    document.getElementById('historyModal').classList.add('show');
}

function showHelp() {
    Profile.closeDropdown();
    document.getElementById('helpModal').classList.add('show');
}

function logout() {
    Profile.closeDropdown();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userProjects');
        localStorage.removeItem('editHistory');
        Profile.showNotification('Logged out successfully!');
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// Modal close functions
function closeEditProfile() {
    document.getElementById('editProfileModal').classList.remove('show');
}

function closeProjects() {
    document.getElementById('projectsModal').classList.remove('show');
}

function closeHistory() {
    document.getElementById('historyModal').classList.remove('show');
}

function closeHelp() {
    document.getElementById('helpModal').classList.remove('show');
}

// Save profile function
function saveProfile() {
    const name = document.getElementById('profileNameInput').value;
    const email = document.getElementById('profileEmailInput').value;
    const bio = document.getElementById('profileBioInput').value;
    
    if (name && email) {
        const currentProfile = Profile.getProfile();
        const updatedProfile = {
            ...currentProfile,
            name,
            email,
            bio
        };
        
        Profile.saveProfileData(updatedProfile);
        Profile.showNotification('Profile updated successfully!');
        closeEditProfile();
    } else {
        Profile.showNotification('Please fill in all required fields');
    }
}

// Initialize profile when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Profile.init();
});