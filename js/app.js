/**
 * Core Finance App - Main Application File
 * "No centro das suas finanças"
 * 
 * @author Core Team
 * @version 1.0.0
 */

class CoreApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentTheme = 'dark';
        this.isInitialized = false;
        
        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize the Core Finance App
     */
    init() {
        try {
            console.log('🚀 Initializing Core Finance App...');
            
            // Load user preferences
            this.loadUserPreferences();
            
            // Initialize components
            this.initNavigation();
            this.initThemeToggle();
            this.initFocusToggle();
            
            // Show loading screen briefly
            this.showLoadingScreen();
            
            // Initialize data and render dashboard
            this.initializeData();
            
            this.isInitialized = true;
            console.log('✅ Core Finance App initialized successfully!');
            
        } catch (error) {
            console.error('❌ Error initializing Core Finance App:', error);
            this.showErrorMessage('Erro ao inicializar o aplicativo');
        }
    }

    /**
     * Show loading screen with smooth transition
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen && app) {
            // Hide app initially
            app.style.opacity = '0';
            
            // Show loading for 2 seconds
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                // Show app with fade in
                app.style.opacity = '1';
                app.style.transition = 'opacity 0.5s ease';
                
                // Remove loading screen after transition
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 2000);
        }
    }

    /**
     * Load user preferences from localStorage
     */
    loadUserPreferences() {
        try {
            // Load theme preference
            const savedTheme = localStorage.getItem('core_theme');
            if (savedTheme) {
                this.currentTheme = savedTheme;
                this.applyTheme(savedTheme);
            }
            
            // Load other preferences
            const savedName = localStorage.getItem('core_user_name');
            if (savedName) {
                const profileName = document.getElementById('profile-name');
                if (profileName) {
                    profileName.textContent = savedName;
                }
            }
            
            // Load currency preference
            const savedCurrency = localStorage.getItem('core_currency');
            if (savedCurrency) {
                const currencySelect = document.getElementById('currency-select');
                if (currencySelect) {
                    currencySelect.value = savedCurrency;
                }
            }
            
            // Load date format preference
            const savedDateFormat = localStorage.getItem('core_date_format');
            if (savedDateFormat) {
                const dateFormatSelect = document.getElementById('date-format-select');
                if (dateFormatSelect) {
                    dateFormatSelect.value = savedDateFormat;
                }
            }
            
        } catch (error) {
            console.warn('⚠️ Could not load user preferences:', error);
        }
    }

    /**
     * Save user preferences to localStorage
     */
    saveUserPreferences() {
        try {
            localStorage.setItem('core_theme', this.currentTheme);
            localStorage.setItem('core_user_name', document.getElementById('profile-name')?.textContent || 'Seu Nome');
            
            const currencySelect = document.getElementById('currency-select');
            if (currencySelect) {
                localStorage.setItem('core_currency', currencySelect.value);
            }
            
            const dateFormatSelect = document.getElementById('date-format-select');
            if (dateFormatSelect) {
                localStorage.setItem('core_date_format', dateFormatSelect.value);
            }
            
        } catch (error) {
            console.warn('⚠️ Could not save user preferences:', error);
        }
    }

    /**
     * Initialize navigation system
     */
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.navigateToSection(section);
            });
        });
    }

    /**
     * Navigate to a specific section
     */
    navigateToSection(sectionName) {
        try {
            // Update navigation state
            this.currentSection = sectionName;
            
            // Update active nav item
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.section === sectionName) {
                    item.classList.add('active');
                }
            });
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Trigger section-specific initialization
                this.initializeSection(sectionName);
            }
            
            // Update URL hash
            window.location.hash = sectionName;
            
            console.log(`📍 Navigated to section: ${sectionName}`);
            
        } catch (error) {
            console.error('❌ Navigation error:', error);
        }
    }

    /**
     * Initialize section-specific functionality
     */
    initializeSection(sectionName) {
        switch (sectionName) {
            case 'dashboard':
                if (window.DashboardManager) {
                    window.DashboardManager.refresh();
                }
                break;
                
            case 'transactions':
                if (window.TransactionManager) {
                    window.TransactionManager.refresh();
                }
                break;
                
            case 'charts':
                if (window.ChartManager) {
                    window.ChartManager.refresh();
                }
                break;
                
            case 'goals':
                if (window.GoalManager) {
                    window.GoalManager.refresh();
                }
                break;
                
            case 'settings':
                if (window.SettingsManager) {
                    window.SettingsManager.refresh();
                }
                break;
        }
    }

    /**
     * Initialize theme toggle functionality
     */
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.currentTheme = newTheme;
        this.saveUserPreferences();
        
        // Update theme toggle icon
        this.updateThemeToggleIcon();
        
        console.log(`🎨 Theme changed to: ${newTheme}`);
    }

    /**
     * Apply theme to the application
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    }

    /**
     * Update theme toggle icon based on current theme
     */
    updateThemeToggleIcon() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.icon');
            if (icon) {
                if (this.currentTheme === 'dark') {
                    // Moon icon for dark theme
                    icon.innerHTML = '<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/>';
                } else {
                    // Sun icon for light theme
                    icon.innerHTML = '<path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>';
                }
            }
        }
    }

    /**
     * Initialize focus toggle functionality
     */
    initFocusToggle() {
        const focusToggle = document.getElementById('focus-toggle');
        
        if (focusToggle) {
            focusToggle.addEventListener('click', () => {
                this.toggleBalanceFocus();
            });
        }
    }

    /**
     * Toggle balance visibility for privacy
     */
    toggleBalanceFocus() {
        const focusToggle = document.getElementById('focus-toggle');
        const balanceValue = document.getElementById('balance-value');
        
        if (focusToggle && balanceValue) {
            const isFocused = focusToggle.classList.contains('active');
            
            if (isFocused) {
                // Show balance
                focusToggle.classList.remove('active');
                balanceValue.style.filter = 'none';
                focusToggle.setAttribute('aria-label', 'Ocultar saldo');
                
                // Update icon to eye
                focusToggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>';
            } else {
                // Hide balance
                focusToggle.classList.add('active');
                balanceValue.style.filter = 'blur(8px)';
                focusToggle.setAttribute('aria-label', 'Mostrar saldo');
                
                // Update icon to eye-off
                focusToggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 01-4.24-4.24M1.38 13.63a15.28 15.28 0 014.24 4.24M20.73 20.73a1 1 0 11-1.41-1.41M4.24 9.9a3 3 0 014.24-4.24M20.73 3.27a1 1 0 11-1.41 1.41"/></svg>';
            }
        }
    }

    /**
     * Initialize application data
     */
    async initializeData() {
        try {
            // Initialize data manager
            if (window.DataManager) {
                await window.DataManager.initialize();
            }
            
            // Initialize dashboard
            if (window.DashboardManager) {
                await window.DashboardManager.initialize();
            }
            
        } catch (error) {
            console.error('❌ Error initializing data:', error);
            this.showErrorMessage('Erro ao carregar dados');
        }
    }

    /**
     * Show error message to user
     */
    showErrorMessage(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <svg viewBox="0 0 24 24" class="error-icon">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    /**
     * Show success message to user
     */
    showSuccessMessage(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <svg viewBox="0 0 24 24" class="success-icon">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Get current section
     */
    getCurrentSection() {
        return this.currentSection;
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if app is initialized
     */
    isAppInitialized() {
        return this.isInitialized;
    }
}

// Initialize the Core Finance App
const coreApp = new CoreApp();

// Make it globally available
window.CoreApp = coreApp;

// Handle browser back/forward
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.section) {
        coreApp.navigateToSection(event.state.section);
    }
});

// Handle hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash && hash !== coreApp.getCurrentSection()) {
        coreApp.navigateToSection(hash);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoreApp;
}