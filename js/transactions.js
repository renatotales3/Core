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
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterTransactions();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
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
    }

    setActiveFilter(filter) {
        this.currentFilter = filter;
        
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
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
            if (this.currentFilter === 'recent') {
                const daysDiff = (Date.now() - transaction.date.getTime()) / (1000 * 60 * 60 * 24);
                if (daysDiff > 7) return false; // Only show transactions from last 7 days
            }
            
            // Apply search filter
            if (this.searchQuery) {
                const searchText = `${transaction.name} ${transaction.category} ${transaction.subcategory}`.toLowerCase();
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
        item.className = `transaction-item ${transaction.type}`;

        const icon = document.createElement('div');
        icon.className = 'transaction-icon';
        icon.textContent = transaction.icon;

        const info = document.createElement('div');
        info.className = 'transaction-info';
        
        const name = document.createElement('div');
        name.className = 'transaction-name';
        name.textContent = transaction.name;
        
        const category = document.createElement('div');
        category.className = 'transaction-category';
        category.textContent = transaction.category;
        
        const date = document.createElement('div');
        date.className = 'transaction-date';
        date.textContent = this.formatTransactionDate(transaction.date);
        
        info.appendChild(name);
        info.appendChild(category);
        info.appendChild(date);

        const amount = document.createElement('div');
        amount.className = `transaction-amount ${transaction.type === 'income' ? 'positive' : 'negative'}`;
        amount.textContent = `${transaction.type === 'income' ? '+' : '-'} $${Math.abs(transaction.amount).toLocaleString()}`;

        item.appendChild(icon);
        item.appendChild(info);
        item.appendChild(amount);

        return item;
    }

    formatTransactionDate(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Hoje, ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Ontem, ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            return `${diffDays} dias atrás`;
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
        }
    }

    updateUI() {
        this.updateFinancialSummary();
        this.updateInsights();
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

        // Update summary values
        const incomeValue = document.querySelector('.summary-card.income .summary-value');
        const expenseValue = document.querySelector('.summary-card.expense .summary-value');
        const balanceValue = document.querySelector('.summary-card.balance .summary-value');

        if (incomeValue) incomeValue.textContent = `$ ${totalIncome.toLocaleString()}`;
        if (expenseValue) expenseValue.textContent = `$ ${totalExpenses.toLocaleString()}`;
        if (balanceValue) balanceValue.textContent = `$ ${balance.toLocaleString()}`;

        // Update expense percentage in legend
        const expensePercentage = totalIncome > 0 ? Math.round((totalExpenses / totalIncome) * 100) : 0;
        const expenseLabel = document.querySelector('.legend-item:last-child .legend-label');
        if (expenseLabel) {
            expenseLabel.textContent = `Despesas: ${expensePercentage}%`;
        }
    }

    updateInsights() {
        const totalIncome = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const expensePercentage = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

        // Update insights based on expense percentage
        const insightsContainer = document.querySelector('.insights-container');
        if (!insightsContainer) return;

        insightsContainer.innerHTML = '';

        if (expensePercentage <= 70) {
            // Excellent control
            const insightCard = this.createInsightCard(
                'positive',
                '🎯',
                'Excelente Controle!',
                `Suas despesas representam apenas ${expensePercentage.toFixed(0)}% da receita. Você está economizando ${(100 - expensePercentage).toFixed(0)}%!`
            );
            insightsContainer.appendChild(insightCard);
        } else if (expensePercentage <= 90) {
            // Good control
            const insightCard = this.createInsightCard(
                'positive',
                '👍',
                'Bom Controle!',
                `Suas despesas representam ${expensePercentage.toFixed(0)}% da receita. Você está economizando ${(100 - expensePercentage).toFixed(0)}%.`
            );
            insightsContainer.appendChild(insightCard);
        } else {
            // Warning
            const insightCard = this.createInsightCard(
                'warning',
                '⚠️',
                'Atenção!',
                `Suas despesas representam ${expensePercentage.toFixed(0)}% da receita. Considere revisar seus gastos.`
            );
            insightsContainer.appendChild(insightCard);
        }

        // Add category-specific insights
        const categoryInsights = this.getCategoryInsights();
        categoryInsights.forEach(insight => {
            const insightCard = this.createInsightCard(
                insight.type,
                insight.icon,
                insight.title,
                insight.message
            );
            insightsContainer.appendChild(insightCard);
        });
    }

    createInsightCard(type, icon, title, message) {
        const card = document.createElement('div');
        card.className = `insight-card ${type}`;

        const iconDiv = document.createElement('div');
        iconDiv.className = 'insight-icon';
        iconDiv.textContent = icon;

        const content = document.createElement('div');
        content.className = 'insight-content';
        
        const titleH4 = document.createElement('h4');
        titleH4.textContent = title;
        
        const messageP = document.createElement('p');
        messageP.textContent = message;
        
        content.appendChild(titleH4);
        content.appendChild(messageP);

        card.appendChild(iconDiv);
        card.appendChild(content);

        return card;
    }

    getCategoryInsights() {
        const insights = [];
        
        // Analyze expenses by category
        const expensesByCategory = {};
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                if (!expensesByCategory[t.category]) {
                    expensesByCategory[t.category] = 0;
                }
                expensesByCategory[t.category] += Math.abs(t.amount);
            });

        // Find highest expense category
        let highestCategory = '';
        let highestAmount = 0;
        Object.entries(expensesByCategory).forEach(([category, amount]) => {
            if (amount > highestAmount) {
                highestAmount = amount;
                highestCategory = category;
            }
        });

        if (highestCategory && highestAmount > 200) {
            insights.push({
                type: 'warning',
                icon: '💡',
                title: 'Dica de Economia',
                message: `Considere reduzir gastos com ${highestCategory.toLowerCase()} para aumentar sua economia.`
            });
        }

        return insights;
    }

    showAddTransactionModal() {
        // Simple alert for now - can be expanded to a full modal
        alert('Funcionalidade de adicionar transação será implementada em breve!\n\nCampos obrigatórios:\n- Valor\n- Tipo (Entrada/Saída)\n- Categoria\n- Data');
    }

    // Public methods
    addTransaction(transaction) {
        transaction.id = Date.now();
        transaction.date = new Date(transaction.date);
        this.transactions.unshift(transaction);
        this.updateUI();
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