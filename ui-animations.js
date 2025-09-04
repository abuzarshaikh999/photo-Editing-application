// UI Animation Controller
class UIAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.addLoadingAnimations();
        this.addButtonAnimations();
        this.addPanelAnimations();
        this.addNotificationSystem();
    }

    // Loading animations
    addLoadingAnimations() {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
    }

    // Button hover effects
    addButtonAnimations() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tool-btn, .action-btn, .control-btn')) {
                this.createRippleEffect(e.target, e);
            }
        });
    }

    // Panel toggle animations
    addPanelAnimations() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.panel-toggle')) {
                const panel = e.target.closest('.panel-section');
                this.togglePanel(panel);
            }
        });
    }

    // Notification system
    addNotificationSystem() {
        this.createNotificationContainer();
    }

    // Create ripple effect on button click
    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Panel toggle with animation
    togglePanel(panel) {
        const content = panel.querySelector('.panel-content');
        const toggle = panel.querySelector('.panel-toggle');
        
        if (panel.classList.contains('collapsed')) {
            panel.classList.remove('collapsed');
            content.style.maxHeight = content.scrollHeight + 'px';
            toggle.textContent = '−';
        } else {
            panel.classList.add('collapsed');
            content.style.maxHeight = '0';
            toggle.textContent = '+';
        }
    }

    // Show notification
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        const container = document.getElementById('notificationContainer');
        container.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, duration);

        // Manual close
        notification.querySelector('.notification-close').onclick = () => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        };
    }

    // Create notification container
    createNotificationContainer() {
        if (!document.getElementById('notificationContainer')) {
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }

    // Animate element entrance
    animateIn(element, animation = 'fadeIn') {
        element.style.animation = `${animation} 0.5s ease-out`;
    }

    // Animate element exit
    animateOut(element, animation = 'fadeOut') {
        element.style.animation = `${animation} 0.3s ease-out`;
        setTimeout(() => element.remove(), 300);
    }

    // Loading spinner
    showLoading(target) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '⟳';
        spinner.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            color: #00ff88;
        `;
        target.style.position = 'relative';
        target.appendChild(spinner);
        return spinner;
    }

    hideLoading(spinner) {
        if (spinner) spinner.remove();
    }
}

// Initialize animations
const uiAnimations = new UIAnimations();

// Add CSS for ripple effect
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

.notification {
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 10px;
    pointer-events: auto;
    border-left: 4px solid #00ff88;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.notification.error {
    border-left-color: #ff4757;
}

.notification.warning {
    border-left-color: #ffa502;
}

.notification.success {
    border-left-color: #2ed573;
}

.notification-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    margin-left: 10px;
}
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Export for use in other files
window.uiAnimations = uiAnimations;