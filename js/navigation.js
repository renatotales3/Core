/**
 * Navigation System for Core Finance App
 * Handles page switching and navigation state
 */

class Navigation {
    constructor() {
        this.currentPage = 'dashboard';
        this.pages = ['dashboard', 'transactions', 'balance', 'categories', 'goals'];
        this.init();
    }

    init() {
        this.bindEvents();
        this.setActivePage(this.currentPage);
    }

    bindEvents() {
        // Bottom navigation click events
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });
    }

    navigateToPage(pageName) {
        if (!this.pages.includes(pageName)) {
            console.warn(`Page ${pageName} not found`);
            return;
        }

        // Hide current page
        this.hidePage(this.currentPage);
        
        // Show new page
        this.showPage(pageName);
        
        // Update navigation state
        this.currentPage = pageName;
        this.updateNavigationState();
    }

    showPage(pageName) {
        const pageElement = document.getElementById(pageName);
        if (pageElement) {
            pageElement.classList.add('active');
            pageElement.style.display = 'block';
        }
    }

    hidePage(pageName) {
        const pageElement = document.getElementById(pageName);
        if (pageElement) {
            pageElement.classList.remove('active');
            pageElement.style.display = 'none';
        }
    }

    setActivePage(pageName) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current nav item
        const activeNavItem = document.querySelector(`[data-page="${pageName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Show only the active page
        this.pages.forEach(page => {
            if (page === pageName) {
                this.showPage(page);
            } else {
                this.hidePage(page);
            }
        });
    }

    updateNavigationState() {
        // Update navigation history
        if (window.history && window.history.pushState) {
            const state = { page: this.currentPage };
            const url = `#${this.currentPage}`;
            window.history.pushState(state, '', url);
        }
    }

    // Public methods for external use
    getCurrentPage() {
        return this.currentPage;
    }

    goToPage(pageName) {
        this.navigateToPage(pageName);
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.appNavigation = new Navigation();
});