// GoTrip Administrator Dashboard JavaScript
// This file contains all interactive functionality for the admin dashboard

class AdminDashboard {
    constructor() {
        this.currentAdmin = {
            name: 'Admin User',
            avatar: 'AJ',
            permissions: ['bus-trips', 'flights', 'hotels']
        };
        
        this.services = {
            'bus-trips': {
                name: 'Bus Trips',
                path: '/admin/bus-trips',
                icon: 'fas fa-bus'
            },
            'flights': {
                name: 'Flights',
                path: '/admin/flights',
                icon: 'fas fa-plane'
            },
            'hotels': {
                name: 'Hotels',
                path: '/admin/hotels',
                icon: 'fas fa-hotel'
            }
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadAdminData();
        this.initializeServiceCards();
        console.log('GoTrip Admin Dashboard initialized');
    }

    bindEvents() {
        // Service card clicks
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.handleServiceClick(e.currentTarget);
            });
        });

        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Admin profile click
        const adminProfile = document.querySelector('.admin-profile');
        if (adminProfile) {
            adminProfile.addEventListener('click', (e) => {
                e.preventDefault();
                this.showAdminProfile();
            });
        }

        // Footer links
        document.querySelectorAll('.footer-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFooterLink(e.target);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    handleServiceClick(card) {
        const service = card.getAttribute('data-service');
        
        if (!this.currentAdmin.permissions.includes(service)) {
            this.showNotification(`You don't have permission to manage ${this.services[service].name}`, 'error');
            return;
        }

        // Add visual feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        this.showNotification(`Opening ${this.services[service].name} management...`, 'info');
        
        // In a real application, you would redirect to the service management page
        // window.location.href = this.services[service].path;
        
        // For demo purposes, we'll simulate a loading state
        this.simulateServiceLoading(service);
    }

    simulateServiceLoading(service) {
        const card = document.querySelector(`[data-service="${service}"]`);
        const originalContent = card.querySelector('.service-overlay').innerHTML;
        
        // Show loading state
        card.querySelector('.service-overlay').innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading ${this.services[service].name}...</p>
            </div>
        `;

        // Simulate API call delay
        setTimeout(() => {
            card.querySelector('.service-overlay').innerHTML = originalContent;
            this.showNotification(`${this.services[service].name} management loaded successfully!`, 'success');
        }, 1500);
    }

    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            this.showNotification('Logging out...', 'info');
            
            // In a real application, you would make an API call to logout
            setTimeout(() => {
                // Redirect to login page
                // window.location.href = '/login';
                this.showNotification('Successfully logged out', 'success');
            }, 1000);
        }
    }

    showAdminProfile() {
        // In a real application, this would open a profile modal
        this.showNotification('Opening admin profile settings...', 'info');
        
        // Simulate opening a modal
        setTimeout(() => {
            const modalContent = `
                <div class="profile-modal">
                    <h3>Admin Profile</h3>
                    <p><strong>Name:</strong> ${this.currentAdmin.name}</p>
                    <p><strong>Permissions:</strong> ${this.currentAdmin.permissions.join(', ')}</p>
                    <button class="btn close-modal">Close</button>
                </div>
            `;
            
            // For demo, we'll just show an alert
            alert(`Admin Profile:\nName: ${this.currentAdmin.name}\nPermissions: ${this.currentAdmin.permissions.join(', ')}`);
        }, 500);
    }

    handleFooterLink(link) {
        const linkText = link.textContent;
        this.showNotification(`Navigating to ${linkText}...`, 'info');
        
        // In a real application, you would navigate to the appropriate page
        // window.location.href = link.getAttribute('href');
    }

    handleKeyboardShortcuts(e) {
        // Add keyboard shortcuts for better UX
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.querySelector('[data-service="bus-trips"]').click();
                    break;
                case '2':
                    e.preventDefault();
                    document.querySelector('[data-service="flights"]').click();
                    break;
                case '3':
                    e.preventDefault();
                    document.querySelector('[data-service="hotels"]').click();
                    break;
                case 'l':
                    e.preventDefault();
                    this.handleLogout();
                    break;
            }
        }
    }

    loadAdminData() {
        // In a real application, you would fetch admin data from an API
        console.log('Loading admin data...');
        
        // Simulate API call
        setTimeout(() => {
            this.updateAdminUI();
        }, 500);
    }

    updateAdminUI() {
        // Update admin name and avatar in the UI
        const adminNameElement = document.querySelector('.admin-profile span');
        const adminAvatarElement = document.querySelector('.admin-avatar');
        
        if (adminNameElement) {
            adminNameElement.textContent = this.currentAdmin.name;
        }
        
        if (adminAvatarElement) {
            adminAvatarElement.textContent = this.currentAdmin.avatar;
        }
        
        console.log('Admin UI updated');
    }

    initializeServiceCards() {
        // Add any additional initialization for service cards
        document.querySelectorAll('.service-card').forEach(card => {
            // Add accessibility attributes
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            
            // Add keyboard support
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-icon">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles for notification
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 1000;
                    max-width: 400px;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid #1A73E8;
                }
                .notification-success { border-left-color: #28a745; }
                .notification-error { border-left-color: #dc3545; }
                .notification-warning { border-left-color: #ffc107; }
                .notification-info { border-left-color: #17a2b8; }
                .notification-icon { font-size: 18px; }
                .notification-success .notification-icon { color: #28a745; }
                .notification-error .notification-icon { color: #dc3545; }
                .notification-warning .notification-icon { color: #ffc107; }
                .notification-info .notification-icon { color: #17a2b8; }
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    margin-left: auto;
                    color: #666;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Add close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});

// Export for Node.js environment if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}