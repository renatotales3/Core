/**
 * Navigation System for Core Finance App
 * Handles page switching and navigation state
 */

class Navigation {
    constructor() {
        this.currentPage = 'dashboard';
        this.pages = ['dashboard', 'profits', 'balance', 'categories', 'goals'];
        this.init();
    }

    init() {
        this.bindEvents();
        this.setActivePage(this.currentPage);
        this.updateNavigationState();
    }

    bindEvents() {
        // Bottom navigation click events
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Touch gestures for mobile
        this.initTouchGestures();
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
        
        // Update URL hash (for PWA navigation)
        this.updateURL(pageName);
        
        // Trigger page change event
        this.triggerPageChangeEvent(pageName);
    }

    showPage(pageName) {
        const pageElement = document.getElementById(pageName);
        if (pageElement) {
            pageElement.classList.add('active');
            pageElement.style.display = 'block';
            
            // Add entrance animation
            pageElement.style.animation = 'slideInUp 0.3s ease-out';
            
            // Focus management for accessibility
            this.focusFirstInteractiveElement(pageElement);
        }
    }

    hidePage(pageName) {
        const pageElement = document.getElementById(pageName);
        if (pageElement) {
            pageElement.classList.remove('active');
            pageElement.style.display = 'none';
            pageElement.style.animation = '';
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

    updateURL(pageName) {
        // Update hash without triggering navigation
        if (window.location.hash !== `#${pageName}`) {
            window.location.hash = `#${pageName}`;
        }
    }

    triggerPageChangeEvent(pageName) {
        // Custom event for page changes
        const event = new CustomEvent('pagechange', {
            detail: {
                previousPage: this.currentPage,
                currentPage: pageName
            }
        });
        document.dispatchEvent(event);
    }

    focusFirstInteractiveElement(pageElement) {
        // Find first focusable element
        const focusableElements = pageElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    initTouchGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe();
        }, { passive: true });

        // Prevent default touch behaviors that might interfere
        document.addEventListener('touchmove', (e) => {
            // Allow scrolling but prevent default behaviors
        }, { passive: true });
    }

    handleSwipe() {
        const minSwipeDistance = 50;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // Check if swipe is horizontal and long enough
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - go to previous page
                this.navigateToPreviousPage();
            } else {
                // Swipe left - go to next page
                this.navigateToNextPage();
            }
        }
    }

    navigateToPreviousPage() {
        const currentIndex = this.pages.indexOf(this.currentPage);
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : this.pages.length - 1;
        this.navigateToPage(this.pages[previousIndex]);
    }

    navigateToNextPage() {
        const currentIndex = this.pages.indexOf(this.currentPage);
        const nextIndex = currentIndex < this.pages.length - 1 ? currentIndex + 1 : 0;
        this.navigateToPage(this.pages[nextIndex]);
    }

    closeAllModals() {
        // Close any open modals or dropdowns
        document.querySelectorAll('.modal, .dropdown-menu').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    // Public methods for external use
    getCurrentPage() {
        return this.currentPage;
    }

    goToPage(pageName) {
        this.navigateToPage(pageName);
    }

    goToDashboard() {
        this.navigateToPage('dashboard');
    }

    goToProfits() {
        this.navigateToPage('profits');
    }

    goToBalance() {
        this.navigateToPage('balance');
    }

    goToCategories() {
        this.navigateToPage('categories');
    }

    goToGoals() {
        this.navigateToPage('goals');
    }

    // Handle browser back/forward buttons
    handlePopState(event) {
        if (event.state && event.state.page) {
            this.navigateToPage(event.state.page);
        }
    }

    // Initialize browser history handling
    initHistoryHandling() {
        window.addEventListener('popstate', (e) => this.handlePopState(e));
        
        // Handle initial page load with hash
        if (window.location.hash) {
            const pageFromHash = window.location.hash.substring(1);
            if (this.pages.includes(pageFromHash)) {
                this.navigateToPage(pageFromHash);
            }
        }
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.appNavigation = new Navigation();
    window.appNavigation.initHistoryHandling();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}