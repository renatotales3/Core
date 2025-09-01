/**
 * Core Finance App - Main Application File
 * Handles app initialization, data management, and core functionality
 */

class CoreFinanceApp {
    constructor() {
        this.appData = {
            user: {
                name: 'Jameson Cole',
                balance: 62745,
                currency: 'USD'
            },
            transactions: [],
            categories: [],
            goals: [],
            settings: {
                theme: 'dark',
                language: 'pt-BR',
                currency: 'USD'
            }
        };
        
        this.init();
    }

    init() {
        this.loadAppData();
        this.initializeApp();
        this.bindGlobalEvents();
        this.setupServiceWorker();
    }

    loadAppData() {
        // Load data from localStorage if available
        const savedData = localStorage.getItem('coreFinanceData');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                this.appData = { ...this.appData, ...parsedData };
            } catch (error) {
                console.warn('Failed to parse saved data:', error);
            }
        }

        // Initialize with sample data if empty
        if (this.appData.transactions.length === 0) {
            this.initializeSampleData();
        }
    }

    initializeSampleData() {
        // Sample transactions
        this.appData.transactions = [
            {
                id: 1,
                name: 'Yulia Polishchuk',
                amount: 2351.00,
                type: 'income',
                category: 'Transfer',
                date: '2024-10-19T15:58:00',
                avatar: 'assets/avatars/user1.jpg'
            },
            {
                id: 2,
                name: 'Youtube Music',
                amount: -5.50,
                type: 'expense',
                category: 'Entertainment',
                date: '2024-10-21T19:20:00',
                icon: 'youtube'
            },
            {
                id: 3,
                name: 'Bogdan Nikitin',
                amount: 61.00,
                type: 'income',
                category: 'Transfer',
                date: '2024-10-21T20:00:00',
                avatar: 'assets/avatars/user3.jpg'
            },
            {
                id: 4,
                name: 'iTunes',
                amount: -3.50,
                type: 'expense',
                category: 'Entertainment',
                date: '2024-09-14T12:25:00',
                icon: 'itunes'
            },
            {
                id: 5,
                name: 'Easy Pay',
                amount: 15.00,
                type: 'income',
                category: 'Transfer',
                date: '2024-10-12T17:10:00',
                icon: 'easypay'
            }
        ];

        // Sample categories
        this.appData.categories = [
            { name: 'Alimentação', icon: '🍕', color: 'var(--color-primary)', budget: 1500, spent: 1250 },
            { name: 'Transporte', icon: '🚗', color: 'var(--color-secondary)', budget: 1000, spent: 800 },
            { name: 'Entretenimento', icon: '🎬', color: 'var(--color-accent)', budget: 800, spent: 600 },
            { name: 'Saúde', icon: '🏥', color: 'var(--color-danger)', budget: 500, spent: 400 },
            { name: 'Educação', icon: '📚', color: 'var(--color-success)', budget: 400, spent: 300 }
        ];

        // Sample goals
        this.appData.goals = [
            {
                id: 1,
                name: 'Entrada da Casa',
                target: 20000,
                current: 13000,
                icon: '🏠',
                deadline: '2025-12-31'
            },
            {
                id: 2,
                name: 'Viagem Europa',
                target: 10000,
                current: 3000,
                icon: '✈️',
                deadline: '2025-06-30'
            }
        ];

        this.saveAppData();
    }

    initializeApp() {
        // Update UI with loaded data
        this.updateDashboardData();
        this.updateBalanceDisplay();
        this.updateTransactionsList();
        this.updateCategoriesDisplay();
        this.updateGoalsDisplay();

        // Initialize charts after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (window.financeCharts) {
                window.financeCharts.refreshAllCharts();
            }
        }, 100);
    }

    updateDashboardData() {
        // Update sales card
        const salesValue = document.querySelector('.sales-value');
        if (salesValue) {
            const totalIncome = this.appData.transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            salesValue.textContent = `$ ${totalIncome.toLocaleString()}`;
        }

        // Update growth trend
        const growthValue = document.querySelector('.growth-value');
        if (growthValue) {
            const growth = this.calculateGrowthRate();
            growthValue.textContent = `+ ${growth.toFixed(1)}%`;
        }
    }

    updateBalanceDisplay() {
        const balanceValue = document.querySelector('.balance-value');
        if (balanceValue) {
            balanceValue.textContent = `$ ${this.appData.user.balance.toLocaleString()}`;
        }

        const balanceTrend = document.querySelector('.balance-trend');
        if (balanceTrend) {
            const weeklyProfit = this.calculateWeeklyProfit();
            balanceTrend.textContent = `Total Week Profit +${weeklyProfit.toFixed(2)}%`;
        }
    }

    updateTransactionsList() {
        const transactionsList = document.querySelector('.transactions-list');
        if (!transactionsList) return;

        // Clear existing transactions
        transactionsList.innerHTML = '';

        // Add transactions
        this.appData.transactions.slice(0, 5).forEach(transaction => {
            const transactionItem = this.createTransactionItem(transaction);
            transactionsList.appendChild(transactionItem);
        });
    }

    createTransactionItem(transaction) {
        const item = document.createElement('div');
        item.className = 'transaction-item';

        const avatar = document.createElement('div');
        avatar.className = 'transaction-avatar';
        
        if (transaction.avatar) {
            const img = document.createElement('img');
            img.src = transaction.avatar;
            img.alt = transaction.name;
            avatar.appendChild(img);
        } else if (transaction.icon) {
            avatar.classList.add(transaction.icon);
            const icon = document.createElement('span');
            icon.className = 'icon';
            icon.textContent = this.getIconSymbol(transaction.icon);
            avatar.appendChild(icon);
        }

        const info = document.createElement('div');
        info.className = 'transaction-info';
        
        const name = document.createElement('div');
        name.className = 'transaction-name';
        name.textContent = transaction.name;
        
        const time = document.createElement('div');
        time.className = 'transaction-time';
        time.textContent = this.formatTransactionTime(transaction.date);
        
        info.appendChild(name);
        info.appendChild(time);

        const amount = document.createElement('div');
        amount.className = `transaction-amount ${transaction.type === 'income' ? 'positive' : 'negative'}`;
        amount.textContent = `${transaction.type === 'income' ? '+' : '-'} $${Math.abs(transaction.amount).toFixed(2)}`;

        item.appendChild(avatar);
        item.appendChild(info);
        item.appendChild(amount);

        return item;
    }

    getIconSymbol(iconName) {
        const iconMap = {
            'youtube': '▶',
            'itunes': '♪',
            'easypay': '$'
        };
        return iconMap[iconName] || '•';
    }

    formatTransactionTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins} Minute${diffMins !== 1 ? 's' : ''} Ago`;
        } else if (diffHours < 24) {
            return `${diffHours} Hour${diffHours !== 1 ? 's' : ''} Ago`;
        } else if (diffDays < 7) {
            return `${diffDays} Day${diffDays !== 1 ? 's' : ''} Ago`;
        } else {
            return date.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric' 
            });
        }
    }

    updateCategoriesDisplay() {
        const categoriesOverview = document.querySelector('.categories-overview');
        if (!categoriesOverview) return;

        // Clear existing categories
        categoriesOverview.innerHTML = '';

        // Add category cards
        this.appData.categories.forEach(category => {
            const categoryCard = this.createCategoryCard(category);
            categoriesOverview.appendChild(categoryCard);
        });
    }

    createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card';

        const icon = document.createElement('div');
        icon.className = 'category-icon';
        icon.textContent = category.icon;

        const info = document.createElement('div');
        info.className = 'category-info';
        
        const name = document.createElement('h4');
        name.textContent = category.name;
        
        const amount = document.createElement('div');
        amount.className = 'category-amount';
        amount.textContent = `$ ${category.spent.toLocaleString()}`;
        
        const percentage = document.createElement('div');
        percentage.className = 'category-percentage';
        percentage.textContent = `${Math.round((category.spent / category.budget) * 100)}%`;

        info.appendChild(name);
        info.appendChild(amount);
        info.appendChild(percentage);

        card.appendChild(icon);
        card.appendChild(info);

        return card;
    }

    updateGoalsDisplay() {
        const goalsOverview = document.querySelector('.goals-overview');
        if (!goalsOverview) return;

        // Clear existing goals
        goalsOverview.innerHTML = '';

        // Add goal cards
        this.appData.goals.forEach(goal => {
            const goalCard = this.createGoalCard(goal);
            goalsOverview.appendChild(goalCard);
        });
    }

    createGoalCard(goal) {
        const card = document.createElement('div');
        card.className = 'goal-card';

        const icon = document.createElement('div');
        icon.className = 'goal-icon';
        icon.textContent = goal.icon;

        const info = document.createElement('div');
        info.className = 'goal-info';
        
        const name = document.createElement('h4');
        name.textContent = goal.name;
        
        const progress = document.createElement('div');
        progress.className = 'goal-progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        const percentage = (goal.current / goal.target) * 100;
        progressFill.style.width = `${percentage}%`;
        
        const progressText = document.createElement('span');
        progressText.className = 'progress-text';
        progressText.textContent = `${percentage.toFixed(0)}%`;
        
        progressBar.appendChild(progressFill);
        progress.appendChild(progressBar);
        progress.appendChild(progressText);
        
        const amount = document.createElement('div');
        amount.className = 'goal-amount';
        amount.textContent = `$ ${goal.current.toLocaleString()} / $ ${goal.target.toLocaleString()}`;

        info.appendChild(name);
        info.appendChild(progress);
        info.appendChild(amount);

        card.appendChild(icon);
        card.appendChild(info);

        return card;
    }

    calculateGrowthRate() {
        // Simple growth calculation based on transactions
        const recentTransactions = this.appData.transactions
            .filter(t => {
                const date = new Date(t.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return date > weekAgo;
            });

        const recentIncome = recentTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const previousWeekIncome = 2000; // Mock data
        return ((recentIncome - previousWeekIncome) / previousWeekIncome) * 100;
    }

    calculateWeeklyProfit() {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weeklyTransactions = this.appData.transactions
            .filter(t => new Date(t.date) > weekAgo);

        const income = weeklyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = weeklyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const profit = income - expenses;
        const profitRate = (profit / income) * 100;
        
        return isNaN(profitRate) ? 0 : profitRate;
    }

    bindGlobalEvents() {
        // Export data functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('export-btn')) {
                this.exportData();
            }
        });

        // Analytics button functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('analytics-btn')) {
                this.showAnalytics();
            }
        });

        // Menu button functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-btn')) {
                this.showMenu();
            }
        });

        // Add button functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-btn')) {
                this.showAddModal();
            }
        });
    }

    exportData() {
        const exportData = {
            appData: this.appData,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `core-finance-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
    }

    showAnalytics() {
        // Show analytics modal or navigate to analytics page
        console.log('Showing analytics...');
        // Implementation for analytics view
    }

    showMenu() {
        // Show menu options
        console.log('Showing menu...');
        // Implementation for menu
    }

    showAddModal() {
        // Show add transaction/modal
        console.log('Showing add modal...');
        // Implementation for add modal
    }

    saveAppData() {
        try {
            localStorage.setItem('coreFinanceData', JSON.stringify(this.appData));
        } catch (error) {
            console.error('Failed to save app data:', error);
        }
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    // Public methods
    addTransaction(transaction) {
        transaction.id = Date.now();
        transaction.date = new Date().toISOString();
        this.appData.transactions.unshift(transaction);
        this.saveAppData();
        this.updateTransactionsList();
        this.updateDashboardData();
        this.updateBalanceDisplay();
    }

    addCategory(category) {
        category.id = Date.now();
        this.appData.categories.push(category);
        this.saveAppData();
        this.updateCategoriesDisplay();
    }

    addGoal(goal) {
        goal.id = Date.now();
        this.appData.goals.push(goal);
        this.saveAppData();
        this.updateGoalsDisplay();
    }

    getAppData() {
        return this.appData;
    }

    refreshData() {
        this.loadAppData();
        this.updateDashboardData();
        this.updateBalanceDisplay();
        this.updateTransactionsList();
        this.updateCategoriesDisplay();
        this.updateGoalsDisplay();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.coreApp = new CoreFinanceApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CoreFinanceApp;
}