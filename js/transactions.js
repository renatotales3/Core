/**
 * Transactions Management System
 * Handles transaction filtering, search, and insights
 */

class TransactionsManager {
    constructor() {
        this.transactions = [];
        this.filteredTransactions = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.loadSampleData();
        this.bindEvents();
        this.updateUI();
        this.setDefaultDate();
    }

    setDefaultDate() {
        const dateInput = document.getElementById('transaction-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    loadSampleData() {
        this.transactions = [
            {
                id: 1,
                name: 'Salário',
                amount: 3000,
                type: 'income',
                category: 'Trabalho',
                subcategory: 'Salário Fixo',
                date: new Date(),
                icon: '💰'
            },
            {
                id: 2,
                name: 'Supermercado',
                amount: -150,
                type: 'expense',
                category: 'Alimentação',
                subcategory: 'Supermercado',
                date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ontem
                icon: '🛒'
            },
            {
                id: 3,
                name: 'Freelance',
                amount: 500,
                type: 'income',
                category: 'Trabalho',
                subcategory: 'Freelance',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
                icon: '💼'
            },
            {
                id: 4,
                name: 'Combustível',
                amount: -80,
                type: 'expense',
                category: 'Transporte',
                subcategory: 'Combustível',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
                icon: '⛽'
            },
            {
                id: 5,
                name: 'Netflix',
                amount: -25,
                type: 'expense',
                category: 'Entretenimento',
                subcategory: 'Streaming',
                date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 dias atrás
                icon: '🎬'
            },
            {
                id: 6,
                name: 'Uber',
                amount: -35,
                type: 'expense',
                category: 'Transporte',
                subcategory: 'Táxi/App',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
                icon: '🚗'
            },
            {
                id: 7,
                name: 'Restaurante',
                amount: -120,
                type: 'expense',
                category: 'Alimentação',
                subcategory: 'Restaurante',
                date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 dias atrás
                icon: '🍽️'
            },
            {
                id: 8,
                name: 'Investimento',
                amount: 1000,
                type: 'income',
                category: 'Investimentos',
                subcategory: 'Renda Fixa',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 dias atrás
                icon: '📈'
            }
        ];
    }

    bindEvents() {
        // Search input
        const searchInput = document.querySelector('.search-field');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterTransactions();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target.dataset.filter);
            });
        });

        // Add transaction FAB
        const addTransactionFab = document.getElementById('add-transaction-fab');
        if (addTransactionFab) {
            addTransactionFab.addEventListener('click', () => {
                this.showAddTransactionModal();
            });
        }

        // Modal events
        this.bindModalEvents();
    }

    bindModalEvents() {
        const modal = document.getElementById('add-transaction-modal');
        const cancelBtn = document.getElementById('cancel-transaction');
        const form = document.getElementById('add-transaction-form');

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideAddTransactionModal();
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddTransaction();
            });
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideAddTransactionModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAddTransactionModal();
            }
        });
    }

    showAddTransactionModal() {
        const modal = document.getElementById('add-transaction-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on first input
            const firstInput = document.getElementById('transaction-name');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    hideAddTransactionModal() {
        const modal = document.getElementById('add-transaction-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form
            const form = document.getElementById('add-transaction-form');
            if (form) {
                form.reset();
                this.setDefaultDate();
            }
        }
    }

    handleAddTransaction() {
        const formData = new FormData(document.getElementById('add-transaction-form'));
        
        const transaction = {
            name: formData.get('transaction-name') || document.getElementById('transaction-name').value,
            amount: parseFloat(formData.get('transaction-amount') || document.getElementById('transaction-amount').value),
            type: formData.get('transaction-type') || document.getElementById('transaction-type').value,
            category: formData.get('transaction-category') || document.getElementById('transaction-category').value,
            date: formData.get('transaction-date') || document.getElementById('transaction-date').value
        };

        // Validate required fields
        if (!transaction.name || !transaction.amount || !transaction.type || !transaction.category || !transaction.date) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Convert amount to negative if expense
        if (transaction.type === 'expense') {
            transaction.amount = -Math.abs(transaction.amount);
        } else {
            transaction.amount = Math.abs(transaction.amount);
        }

        // Add transaction
        this.addTransaction(transaction);
        
        // Hide modal
        this.hideAddTransactionModal();
        
        // Show success message
        this.showSuccessMessage('Transação adicionada com sucesso!');
    }

    showSuccessMessage(message) {
        // Create temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        // Animate in
        setTimeout(() => {
            successDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }

    setActiveFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.filterTransactions();
    }

    filterTransactions() {
        this.filteredTransactions = this.transactions.filter(transaction => {
            // Apply type filter
            if (this.currentFilter === 'income' && transaction.type !== 'income') return false;
            if (this.currentFilter === 'expense' && transaction.type !== 'expense') return false;
            
            // Apply search filter
            if (this.searchQuery) {
                const searchText = `${transaction.name} ${transaction.category}`.toLowerCase();
                if (!searchText.includes(this.searchQuery)) return false;
            }
            
            return true;
        });
        
        this.updateTransactionsList();
    }

    updateTransactionsList() {
        const transactionsList = document.querySelector('.transactions-list');
        if (!transactionsList) return;

        // Clear existing transactions
        transactionsList.innerHTML = '';

        // Add filtered transactions
        this.filteredTransactions.forEach(transaction => {
            const transactionItem = this.createTransactionItem(transaction);
            transactionsList.appendChild(transactionItem);
        });

        // Update transaction count
        const transactionCount = document.querySelector('.transaction-count');
        if (transactionCount) {
            transactionCount.textContent = `${this.filteredTransactions.length} transações`;
        }
    }

    createTransactionItem(transaction) {
        const item = document.createElement('div');
        item.className = `transaction-card ${transaction.type}`;

        const main = document.createElement('div');
        main.className = 'transaction-main';
        
        const info = document.createElement('div');
        info.className = 'transaction-info';
        
        const title = document.createElement('div');
        title.className = 'transaction-title';
        title.textContent = transaction.name;
        
        const meta = document.createElement('div');
        meta.className = 'transaction-meta';
        meta.textContent = `${transaction.category} • ${this.formatTransactionDate(transaction.date)}`;
        
        info.appendChild(title);
        info.appendChild(meta);

        const amount = document.createElement('div');
        amount.className = 'transaction-amount';
        amount.textContent = `${transaction.type === 'income' ? '+' : '-'}$${Math.abs(transaction.amount).toLocaleString()}`;

        main.appendChild(info);
        main.appendChild(amount);
        item.appendChild(main);

        return item;
    }

    formatTransactionDate(date) {
        const now = new Date();
        const transactionDate = new Date(date);
        const diffMs = now - transactionDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Hoje';
        } else if (diffDays === 1) {
            return 'Ontem';
        } else if (diffDays < 7) {
            return `${diffDays} dias atrás`;
        } else {
            return transactionDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        }
    }

    updateUI() {
        this.updateFinancialSummary();
        this.filterTransactions();
    }

    updateFinancialSummary() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const balance = totalIncome - totalExpenses;
        const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

        // Update overview amount
        const overviewAmount = document.querySelector('.overview-amount');
        if (overviewAmount) {
            overviewAmount.textContent = `$${balance.toLocaleString()}`;
        }

        // Update overview trend
        const overviewTrend = document.querySelector('.overview-trend');
        if (overviewTrend) {
            const savingsPercentage = 100 - expensePercentage;
            if (savingsPercentage >= 20) {
                overviewTrend.textContent = `+${savingsPercentage.toFixed(0)}% este mês`;
                overviewTrend.className = 'overview-trend positive';
            } else if (savingsPercentage >= 10) {
                overviewTrend.textContent = `+${savingsPercentage.toFixed(0)}% este mês`;
                overviewTrend.className = 'overview-trend positive';
            } else {
                overviewTrend.textContent = `${savingsPercentage.toFixed(0)}% este mês`;
                overviewTrend.className = 'overview-trend';
            }
        }

        // Update metric values
        const incomeValue = document.querySelector('.metric-value.income');
        const expenseValue = document.querySelector('.metric-value.expense');

        if (incomeValue) incomeValue.textContent = `$${totalIncome.toLocaleString()}`;
        if (expenseValue) expenseValue.textContent = `$${totalExpenses.toLocaleString()}`;
    }

    // Public methods
    addTransaction(transaction) {
        transaction.id = Date.now();
        transaction.date = new Date(transaction.date);
        this.transactions.unshift(transaction);
        this.updateUI();
        
        // Save to localStorage
        this.saveTransactions();
    }

    saveTransactions() {
        try {
            localStorage.setItem('core-transactions', JSON.stringify(this.transactions));
        } catch (error) {
            console.error('Erro ao salvar transações:', error);
        }
    }

    loadTransactions() {
        try {
            const saved = localStorage.getItem('core-transactions');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.transactions = parsed.map(t => ({
                    ...t,
                    date: new Date(t.date)
                }));
            }
        } catch (error) {
            console.error('Erro ao carregar transações:', error);
        }
    }

    getTransactions() {
        return this.transactions;
    }

    getFilteredTransactions() {
        return this.filteredTransactions;
    }
}

// Initialize transactions manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.transactionsManager = new TransactionsManager();
});