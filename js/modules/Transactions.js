// Transactions Module - Gerencia a aba de transações
class TransactionsModule {
    constructor(app) {
        this.app = app;
        this.currentSort = 'recent';
        this.currentFilters = {
            status: 'all',
            type: 'all',
            accountType: 'all',
            categories: [],
            dateRange: null
        };
        this.transactions = this.loadTransactions();
        this.categories = this.loadCategories();
        this.init();
    }

    init() {
        // Inicializa dados mock se não existirem
        if (!this.transactions || this.transactions.length === 0) {
            this.initializeMockData();
        }
    }

    loadTransactions() {
        return JSON.parse(localStorage.getItem('coreTransactions') || '[]');
    }

    saveTransactions() {
        localStorage.setItem('coreTransactions', JSON.stringify(this.transactions));
    }

    loadCategories() {
        return JSON.parse(localStorage.getItem('coreCategories') || JSON.stringify([
            { id: 1, name: 'Alimentação', icon: '🍽️', color: '#ef4444' },
            { id: 2, name: 'Transporte', icon: '🚗', color: '#3b82f6' },
            { id: 3, name: 'Lazer', icon: '🎬', color: '#8b5cf6' },
            { id: 4, name: 'Saúde', icon: '🏥', color: '#10b981' },
            { id: 5, name: 'Educação', icon: '📚', color: '#f59e0b' },
            { id: 6, name: 'Casa', icon: '🏠', color: '#6b7280' },
            { id: 7, name: 'Salário', icon: '💼', color: '#059669' },
            { id: 8, name: 'Freelance', icon: '💻', color: '#7c3aed' }
        ]));
    }

    initializeMockData() {
        const now = new Date();
        this.transactions = [
            {
                id: 1,
                description: 'Supermercado Extra',
                amount: -150.00,
                type: 'expense',
                category: 1,
                accountType: 'current',
                date: new Date(now.getTime() - 86400000).toISOString(), // ontem
                status: 'paid',
                isRecurring: false,
                isInstallment: false,
                isHidden: false
            },
            {
                id: 2,
                description: 'Salário Empresa XYZ',
                amount: 3500.00,
                type: 'income',
                category: 7,
                accountType: 'current',
                date: new Date(now.getTime() - 172800000).toISOString(), // 2 dias atrás
                status: 'paid',
                isRecurring: true,
                isInstallment: false,
                isHidden: false
            },
            {
                id: 3,
                description: 'Uber para trabalho',
                amount: -25.50,
                type: 'expense',
                category: 2,
                accountType: 'current',
                date: new Date(now.getTime() - 259200000).toISOString(), // 3 dias atrás
                status: 'paid',
                isRecurring: false,
                isInstallment: false,
                isHidden: false
            },
            {
                id: 4,
                description: 'Cinema com amigos',
                amount: -45.00,
                type: 'expense',
                category: 3,
                accountType: 'credit',
                date: new Date(now.getTime() - 345600000).toISOString(), // 4 dias atrás
                status: 'paid',
                isRecurring: false,
                isInstallment: false,
                isHidden: false
            },
            {
                id: 5,
                description: 'Consulta médica',
                amount: -120.00,
                type: 'expense',
                category: 4,
                accountType: 'current',
                date: new Date(now.getTime() - 432000000).toISOString(), // 5 dias atrás
                status: 'unpaid',
                isRecurring: false,
                isInstallment: false,
                isHidden: false
            }
        ];
        this.saveTransactions();
    }

    renderTransactionsTab() {
        console.log('Iniciando renderTransactionsTab');
        const mainContent = document.querySelector('.app-container');
        if (!mainContent) {
            console.log('app-container não encontrado');
            return;
        }

        // Salva o conteúdo original se ainda não foi salvo
        if (!this.app.modules.settings.originalContent) {
            this.app.modules.settings.originalContent = mainContent.innerHTML;
            console.log('Conteúdo original salvo');
        }

        const summary = this.calculateFinancialSummary();

        const transactionsHTML = `
            <!-- Header simples para Transações -->
            <header class="app-header">
                <div class="greeting">
                    <h1 class="greeting-text">Transações</h1>
                </div>
            </header>

            <!-- Filtro de Período - Carrossel -->
            <div class="period-filter">
                <div class="period-carousel" id="transactionsPeriodCarousel">
                    <div class="period-item" data-month="7" data-year="2025">
                        <span class="period-text">Agosto/25</span>
                    </div>
                    <div class="period-item active" data-month="8" data-year="2025">
                        <span class="period-text">Setembro/25</span>
                    </div>
                    <div class="period-item" data-month="9" data-year="2025">
                        <span class="period-text">Outubro/25</span>
                    </div>
                </div>
            </div>

            <!-- Barra de Pesquisa e Ações -->
            <div class="transactions-toolbar">
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Buscar transações..." id="transactionSearch">
                    <div class="search-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"/>
                        </svg>
                    </div>
                </div>
                <div class="toolbar-actions">
                    <button class="action-button sort-button" id="sortButton">
                        <div class="button-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16V4m0 0L3 8m4-4 4 4m6 0v12m0 0 4-4m-4 4-4-4"/>
                            </svg>
                        </div>
                        <span class="button-text">Ordenar</span>
                    </button>
                    <button class="action-button filter-button" id="filterButton">
                        <div class="button-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"/>
                            </svg>
                        </div>
                        <span class="button-text">Filtrar</span>
                    </button>
                </div>
            </div>

            <!-- Card de Resumo Financeiro -->
            <div class="transactions-summary-card">
                <div class="summary-section income-section">
                    <div class="summary-content">
                        <h4 class="summary-title">Receitas</h4>
                        <p class="summary-amount income-amount">${this.formatCurrency(summary.income)}</p>
                    </div>
                </div>
                
                <div class="summary-section expense-section">
                    <div class="summary-content">
                        <h4 class="summary-title">Despesas</h4>
                        <p class="summary-amount expense-amount">${this.formatCurrency(summary.expenses)}</p>
                    </div>
                </div>
                
                <div class="summary-section balance-section">
                    <div class="summary-content">
                        <h4 class="summary-title">Resultado</h4>
                        <p class="summary-amount balance-amount ${summary.balance >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(summary.balance)}</p>
                    </div>
                </div>
            </div>

            <!-- Mensagem simples -->
            <div class="transactions-message">
                <p>A funcionalidade de transações será implementada em breve.</p>
            </div>
        `;

        // Substitui apenas a área acima da navbar mantendo o nó da navbar intacto
        const navbar = mainContent.querySelector('.navbar');
        const fabButton = mainContent.querySelector('.fab-button');
        
        if (navbar && fabButton) {
            const transactionsWrapper = document.createElement('div');
            transactionsWrapper.innerHTML = transactionsHTML;

            // Insere o conteúdo de transações antes da navbar sem recriá-la
            mainContent.insertBefore(transactionsWrapper, navbar);

            // Remove quaisquer seções antigas (anteriores à navbar) mantendo a navbar e FAB intactos
            const siblings = Array.from(mainContent.children);
            for (const child of siblings) {
                if (child !== navbar && child !== transactionsWrapper && child !== fabButton) {
                    mainContent.removeChild(child);
                }
            }
        } else {
            // Fallback: Preserva o FAB ao substituir o conteúdo
            const fabHTML = fabButton ? fabButton.outerHTML : '';
            mainContent.innerHTML = transactionsHTML + fabHTML;
        }

        // Anexa event listeners
        this.attachEventListeners();

        // Reanexa os event listeners da navbar
        this.reattachNavbarEvents();

        // Aplica animações
        this.applyTransactionsAnimations();
    }

    calculateFinancialSummary() {
        let income = 0;
        let expenses = 0;

        this.transactions.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            } else {
                expenses += Math.abs(transaction.amount);
            }
        });

        const balance = income - expenses;

        return {
            income: income,
            expenses: expenses,
            balance: balance
        };
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    applyTransactionsAnimations() {
        // Aplica animações aos elementos da aba de transações
        const elements = document.querySelectorAll('.transactions-toolbar, .transactions-summary-card, .transactions-message');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    reattachNavbarEvents() {
        // Remove event listeners anteriores para evitar conflitos
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
        });

        // Reanexa os event listeners da navbar
        const newNavItems = document.querySelectorAll('.nav-item');
        newNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                if (item.dataset.tab === 'home') {
                    this.app.goBackToHome();
                } else {
                    this.app.navigateToTab(item);
                }
            });
        });
    }

    renderTransactionsList() {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                </div>
                <h3 class="empty-title">Em breve</h3>
                <p class="empty-description">A funcionalidade completa de transações será implementada em breve.</p>
            </div>
        `;
    }

    renderTransactionItem(transaction) {
        const category = this.categories.find(cat => cat.id === transaction.category);
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        });

        return `
            <div class="transaction-item" data-id="${transaction.id}">
                <div class="transaction-icon">
                    <div class="category-icon" style="background: ${category?.color || '#6b7280'}20; color: ${category?.color || '#6b7280'}">
                        ${category?.icon || '💰'}
                    </div>
                </div>
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-meta">
                        <span class="transaction-category">${category?.name || 'Sem categoria'}</span>
                        <span class="transaction-date">${formattedDate}</span>
                    </div>
                </div>
                <div class="transaction-amount">
                    <div class="amount-value ${transaction.amount >= 0 ? 'income' : 'expense'}">
                        ${transaction.amount >= 0 ? '+' : ''}R$ ${Math.abs(transaction.amount).toFixed(2).replace('.', ',')}
                    </div>
                    <div class="transaction-status ${transaction.status}">
                        ${transaction.status === 'paid' ? '✓' : '⏳'}
                    </div>
                </div>
            </div>
        `;
    }

    getFilteredTransactions() {
        return this.transactions.filter(transaction => {
            // Filtro por status
            if (this.currentFilters.status !== 'all' && transaction.status !== this.currentFilters.status) {
                return false;
            }

            // Filtro por tipo
            if (this.currentFilters.type !== 'all') {
                switch (this.currentFilters.type) {
                    case 'expense':
                        if (transaction.amount >= 0) return false;
                        break;
                    case 'income':
                        if (transaction.amount < 0) return false;
                        break;
                    case 'recurring':
                        if (!transaction.isRecurring) return false;
                        break;
                    case 'installment':
                        if (!transaction.isInstallment) return false;
                        break;
                    case 'hidden':
                        if (!transaction.isHidden) return false;
                        break;
                    case 'not_hidden':
                        if (transaction.isHidden) return false;
                        break;
                }
            }

            // Filtro por tipo de conta
            if (this.currentFilters.accountType !== 'all' && transaction.accountType !== this.currentFilters.accountType) {
                return false;
            }

            // Filtro por categorias
            if (this.currentFilters.categories.length > 0 && !this.currentFilters.categories.includes(transaction.category)) {
                return false;
            }

            return true;
        });
    }

    sortTransactions(transactions) {
        return transactions.sort((a, b) => {
            switch (this.currentSort) {
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'recent':
                    return new Date(b.date) - new Date(a.date);
                case 'a_z':
                    return a.description.localeCompare(b.description);
                case 'z_a':
                    return b.description.localeCompare(a.description);
                case 'lowest':
                    return a.amount - b.amount;
                case 'highest':
                    return b.amount - a.amount;
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });
    }

    attachEventListeners() {
        // Filtro de período
        const periodItems = document.querySelectorAll('#transactionsPeriodCarousel .period-item');
        periodItems.forEach(item => {
            item.addEventListener('click', () => this.selectPeriod(item));
        });

        // Barra de pesquisa
        const searchInput = document.getElementById('transactionSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Botões de ação
        const sortButton = document.getElementById('sortButton');
        if (sortButton) {
            sortButton.addEventListener('click', () => this.showSortModal());
        }

        const filterButton = document.getElementById('filterButton');
        if (filterButton) {
            filterButton.addEventListener('click', () => this.showFilterModal());
        }
    }

    showSortModal() {
        const modalHTML = `
            <div class="modal-overlay" id="sortModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Ordenar Transações</h3>
                        <button class="modal-close" id="closeSortModal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="sort-options">
                            <div class="sort-option ${this.currentSort === 'recent' ? 'active' : ''}" data-sort="recent">
                                <div class="option-content">
                                    <div class="option-icon">🕒</div>
                                    <div class="option-text">
                                        <div class="option-title">Mais recentes primeiro</div>
                                        <div class="option-description">Transações mais novas aparecem primeiro</div>
                                    </div>
                                </div>
                            </div>
                            <div class="sort-option ${this.currentSort === 'oldest' ? 'active' : ''}" data-sort="oldest">
                                <div class="option-content">
                                    <div class="option-icon">📅</div>
                                    <div class="option-text">
                                        <div class="option-title">Mais antigas primeiro</div>
                                        <div class="option-description">Transações mais antigas aparecem primeiro</div>
                                    </div>
                                </div>
                            </div>
                            <div class="sort-option ${this.currentSort === 'a_z' ? 'active' : ''}" data-sort="a_z">
                                <div class="option-content">
                                    <div class="option-icon">🔤</div>
                                    <div class="option-text">
                                        <div class="option-title">A → Z</div>
                                        <div class="option-description">Ordem alfabética crescente</div>
                                    </div>
                                </div>
                            </div>
                            <div class="sort-option ${this.currentSort === 'z_a' ? 'active' : ''}" data-sort="z_a">
                                <div class="option-content">
                                    <div class="option-icon">🔡</div>
                                    <div class="option-text">
                                        <div class="option-title">Z → A</div>
                                        <div class="option-description">Ordem alfabética decrescente</div>
                                    </div>
                                </div>
                            </div>
                            <div class="sort-option ${this.currentSort === 'lowest' ? 'active' : ''}" data-sort="lowest">
                                <div class="option-content">
                                    <div class="option-icon">📉</div>
                                    <div class="option-text">
                                        <div class="option-title">Do menor para o maior valor</div>
                                        <div class="option-description">Valores em ordem crescente</div>
                                    </div>
                                </div>
                            </div>
                            <div class="sort-option ${this.currentSort === 'highest' ? 'active' : ''}" data-sort="highest">
                                <div class="option-content">
                                    <div class="option-icon">📈</div>
                                    <div class="option-text">
                                        <div class="option-title">Do maior para o menor valor</div>
                                        <div class="option-description">Valores em ordem decrescente</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" id="cancelSort">Cancelar</button>
                        <button class="btn-primary" id="applySort">Aplicar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.classList.add('modal-open');

        // Event listeners
        document.getElementById('closeSortModal').addEventListener('click', () => this.closeSortModal());
        document.getElementById('cancelSort').addEventListener('click', () => this.closeSortModal());
        document.getElementById('applySort').addEventListener('click', () => this.applySort());

        // Seleção de opções
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.sort-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                this.currentSort = option.dataset.sort;
            });
        });
    }

    closeSortModal() {
        const modal = document.getElementById('sortModal');
        if (modal) {
            modal.remove();
            document.body.classList.remove('modal-open');
        }
    }

    applySort() {
        this.updateTransactionsList();
        this.closeSortModal();
    }

    showFilterModal() {
        const modalHTML = `
            <div class="modal-overlay" id="filterModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Filtrar Transações</h3>
                        <button class="modal-close" id="closeFilterModal">×</button>
                    </div>
                    <div class="modal-body">
                        <!-- Status -->
                        <div class="filter-section">
                            <h4 class="filter-title">Status</h4>
                            <div class="filter-options">
                                <div class="filter-option ${this.currentFilters.status === 'all' ? 'active' : ''}" data-filter="status" data-value="all">Todos</div>
                                <div class="filter-option ${this.currentFilters.status === 'paid' ? 'active' : ''}" data-filter="status" data-value="paid">Pago</div>
                                <div class="filter-option ${this.currentFilters.status === 'unpaid' ? 'active' : ''}" data-filter="status" data-value="unpaid">Não pago</div>
                            </div>
                        </div>

                        <!-- Tipo -->
                        <div class="filter-section">
                            <h4 class="filter-title">Tipo</h4>
                            <div class="filter-options">
                                <div class="filter-option ${this.currentFilters.type === 'all' ? 'active' : ''}" data-filter="type" data-value="all">Todos</div>
                                <div class="filter-option ${this.currentFilters.type === 'expense' ? 'active' : ''}" data-filter="type" data-value="expense">Despesa</div>
                                <div class="filter-option ${this.currentFilters.type === 'income' ? 'active' : ''}" data-filter="type" data-value="income">Receita</div>
                                <div class="filter-option ${this.currentFilters.type === 'recurring' ? 'active' : ''}" data-filter="type" data-value="recurring">Recorrente</div>
                                <div class="filter-option ${this.currentFilters.type === 'installment' ? 'active' : ''}" data-filter="type" data-value="installment">Parcelado</div>
                                <div class="filter-option ${this.currentFilters.type === 'hidden' ? 'active' : ''}" data-filter="type" data-value="hidden">Ocultadas</div>
                                <div class="filter-option ${this.currentFilters.type === 'not_hidden' ? 'active' : ''}" data-filter="type" data-value="not_hidden">Não ocultadas</div>
                            </div>
                        </div>

                        <!-- Tipo de Conta -->
                        <div class="filter-section">
                            <h4 class="filter-title">Tipo da Conta</h4>
                            <div class="filter-options">
                                <div class="filter-option ${this.currentFilters.accountType === 'all' ? 'active' : ''}" data-filter="accountType" data-value="all">Todos</div>
                                <div class="filter-option ${this.currentFilters.accountType === 'savings' ? 'active' : ''}" data-filter="accountType" data-value="savings">Poupança</div>
                                <div class="filter-option ${this.currentFilters.accountType === 'current' ? 'active' : ''}" data-filter="accountType" data-value="current">Corrente</div>
                                <div class="filter-option ${this.currentFilters.accountType === 'credit' ? 'active' : ''}" data-filter="accountType" data-value="credit">Cartão de Crédito</div>
                            </div>
                        </div>

                        <!-- Categorias -->
                        <div class="filter-section">
                            <h4 class="filter-title">Categorias</h4>
                            <div class="filter-options">
                                <div class="filter-option ${this.currentFilters.categories.length === 0 ? 'active' : ''}" data-filter="categories" data-value="all">Todas</div>
                                <div class="filter-option ${this.currentFilters.categories.includes(0) ? 'active' : ''}" data-filter="categories" data-value="no_category">Sem categoria</div>
                                <div class="filter-option" data-filter="categories" data-value="select" id="selectCategoriesBtn">
                                    Selecionar categorias
                                    ${this.currentFilters.categories.length > 0 ? ` (${this.currentFilters.categories.length})` : ''}
                                </div>
                            </div>
                        </div>

                        <!-- Datas -->
                        <div class="filter-section">
                            <h4 class="filter-title">Período</h4>
                            <div class="filter-options">
                                <div class="filter-option" data-filter="date" data-value="select" id="selectDateBtn">
                                    Selecionar período
                                    ${this.currentFilters.dateRange ? ' (Personalizado)' : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" id="resetFilters">Limpar</button>
                        <button class="btn-secondary" id="cancelFilter">Cancelar</button>
                        <button class="btn-primary" id="applyFilter">Aplicar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.classList.add('modal-open');

        // Event listeners
        document.getElementById('closeFilterModal').addEventListener('click', () => this.closeFilterModal());
        document.getElementById('cancelFilter').addEventListener('click', () => this.closeFilterModal());
        document.getElementById('applyFilter').addEventListener('click', () => this.applyFilters());
        document.getElementById('resetFilters').addEventListener('click', () => this.resetFilters());

        // Seleção de opções
        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', () => this.handleFilterSelection(option));
        });
    }

    handleFilterSelection(option) {
        const filter = option.dataset.filter;
        const value = option.dataset.value;

        if (filter === 'categories' && value === 'select') {
            this.showCategoriesModal();
            return;
        }

        if (filter === 'date' && value === 'select') {
            this.showDateModal();
            return;
        }

        // Remove seleção anterior do mesmo filtro
        document.querySelectorAll(`[data-filter="${filter}"]`).forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Atualiza filtros
        if (filter === 'categories') {
            if (value === 'all') {
                this.currentFilters.categories = [];
            } else if (value === 'no_category') {
                this.currentFilters.categories = [0];
            }
        } else {
            this.currentFilters[filter] = value;
        }
    }

    showCategoriesModal() {
        const modalHTML = `
            <div class="modal-overlay" id="categoriesModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Selecionar Categorias</h3>
                        <button class="modal-close" id="closeCategoriesModal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="search-container">
                            <input type="text" class="search-input" placeholder="Buscar categorias..." id="categorySearch">
                        </div>
                        <div class="categories-list" id="categoriesList">
                            ${this.renderCategoriesList()}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" id="cancelCategories">Cancelar</button>
                        <button class="btn-primary" id="applyCategories">Aplicar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Event listeners
        document.getElementById('closeCategoriesModal').addEventListener('click', () => this.closeCategoriesModal());
        document.getElementById('cancelCategories').addEventListener('click', () => this.closeCategoriesModal());
        document.getElementById('applyCategories').addEventListener('click', () => this.applyCategoriesSelection());

        // Busca de categorias
        document.getElementById('categorySearch').addEventListener('input', (e) => this.filterCategories(e.target.value));

        // Seleção de categorias
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
                const categoryId = parseInt(item.dataset.id);
                if (item.classList.contains('selected')) {
                    if (!this.currentFilters.categories.includes(categoryId)) {
                        this.currentFilters.categories.push(categoryId);
                    }
                } else {
                    this.currentFilters.categories = this.currentFilters.categories.filter(id => id !== categoryId);
                }
            });
        });
    }

    renderCategoriesList() {
        return this.categories.map(category => `
            <div class="category-item ${this.currentFilters.categories.includes(category.id) ? 'selected' : ''}" data-id="${category.id}">
                <div class="category-icon" style="background: ${category.color}20; color: ${category.color}">
                    ${category.icon}
                </div>
                <span class="category-name">${category.name}</span>
                ${this.currentFilters.categories.includes(category.id) ? '<div class="category-check">✓</div>' : ''}
            </div>
        `).join('');
    }

    filterCategories(searchTerm) {
        const items = document.querySelectorAll('.category-item');
        items.forEach(item => {
            const name = item.querySelector('.category-name').textContent.toLowerCase();
            if (name.includes(searchTerm.toLowerCase())) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    closeCategoriesModal() {
        const modal = document.getElementById('categoriesModal');
        if (modal) {
            modal.remove();
        }
    }

    applyCategoriesSelection() {
        this.closeCategoriesModal();
        // Atualiza o botão de filtro
        const selectBtn = document.querySelector('[data-filter="categories"][data-value="select"]');
        if (selectBtn) {
            const count = this.currentFilters.categories.length;
            selectBtn.innerHTML = `Selecionar categorias${count > 0 ? ` (${count})` : ''}`;
        }
    }

    showDateModal() {
        const modalHTML = `
            <div class="modal-overlay" id="dateModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Selecionar Período</h3>
                        <button class="modal-close" id="closeDateModal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="date-presets">
                            <button class="date-preset" data-preset="today">Hoje</button>
                            <button class="date-preset" data-preset="yesterday">Ontem</button>
                            <button class="date-preset" data-preset="last7days">Últimos 7 dias</button>
                            <button class="date-preset" data-preset="thisMonth">Este mês</button>
                            <button class="date-preset" data-preset="lastMonth">Mês passado</button>
                            <button class="date-preset" data-preset="thisYear">Este ano</button>
                            <button class="date-preset" data-preset="lastYear">Ano passado</button>
                        </div>
                        <div class="date-custom">
                            <div class="date-input-group">
                                <label>De:</label>
                                <input type="date" id="dateFrom" class="date-input">
                            </div>
                            <div class="date-input-group">
                                <label>Até:</label>
                                <input type="date" id="dateTo" class="date-input">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" id="cancelDate">Cancelar</button>
                        <button class="btn-primary" id="applyDate">Aplicar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Event listeners
        document.getElementById('closeDateModal').addEventListener('click', () => this.closeDateModal());
        document.getElementById('cancelDate').addEventListener('click', () => this.closeDateModal());
        document.getElementById('applyDate').addEventListener('click', () => this.applyDateSelection());

        // Presets
        document.querySelectorAll('.date-preset').forEach(preset => {
            preset.addEventListener('click', () => this.selectDatePreset(preset.dataset.preset));
        });
    }

    selectDatePreset(preset) {
        const now = new Date();
        let from, to;

        switch (preset) {
            case 'today':
                from = to = now;
                break;
            case 'yesterday':
                from = to = new Date(now.getTime() - 86400000);
                break;
            case 'last7days':
                to = now;
                from = new Date(now.getTime() - 7 * 86400000);
                break;
            case 'thisMonth':
                from = new Date(now.getFullYear(), now.getMonth(), 1);
                to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'lastMonth':
                from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                to = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'thisYear':
                from = new Date(now.getFullYear(), 0, 1);
                to = new Date(now.getFullYear(), 11, 31);
                break;
            case 'lastYear':
                from = new Date(now.getFullYear() - 1, 0, 1);
                to = new Date(now.getFullYear() - 1, 11, 31);
                break;
        }

        document.getElementById('dateFrom').value = from.toISOString().split('T')[0];
        document.getElementById('dateTo').value = to.toISOString().split('T')[0];
    }

    closeDateModal() {
        const modal = document.getElementById('dateModal');
        if (modal) {
            modal.remove();
        }
    }

    applyDateSelection() {
        const from = document.getElementById('dateFrom').value;
        const to = document.getElementById('dateTo').value;

        if (from && to) {
            this.currentFilters.dateRange = { from, to };
        } else {
            this.currentFilters.dateRange = null;
        }

        this.closeDateModal();
    }

    closeFilterModal() {
        const modal = document.getElementById('filterModal');
        if (modal) {
            modal.remove();
            document.body.classList.remove('modal-open');
        }
    }

    applyFilters() {
        this.updateTransactionsList();
        this.closeFilterModal();
    }

    resetFilters() {
        this.currentFilters = {
            status: 'all',
            type: 'all',
            accountType: 'all',
            categories: [],
            dateRange: null
        };
        this.updateTransactionsList();
        this.closeFilterModal();
    }

    handleSearch(searchTerm) {
        // Implementar busca por texto
        this.updateTransactionsList();
    }

    selectPeriod(element) {
        // Remove seleção anterior
        document.querySelectorAll('#transactionsPeriodCarousel .period-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona seleção ao item clicado
        element.classList.add('active');

        // Extrai dados do período
        const month = parseInt(element.dataset.month);
        const year = parseInt(element.dataset.year);

        this.selectedPeriod = { month, year };

        // Atualiza o carrossel
        this.updatePeriodCarousel();

        // Animação de seleção
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    }

    updatePeriodCarousel() {
        const carousel = document.getElementById('transactionsPeriodCarousel');
        const currentMonth = this.selectedPeriod.month;
        const currentYear = this.selectedPeriod.year;

        // Gera os 3 períodos (anterior, atual, próximo)
        const periods = [];

        for (let i = -1; i <= 1; i++) {
            let month = currentMonth + i;
            let year = currentYear;

            if (month < 0) {
                month = 11;
                year--;
            } else if (month > 11) {
                month = 0;
                year++;
            }

            periods.push({ month, year });
        }

        // Atualiza o HTML do carrossel
        carousel.innerHTML = periods.map((period, index) => {
            const monthNames = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];

            const monthName = monthNames[period.month];
            const yearDisplay = period.year.toString().slice(-2);
            const isCurrent = index === 1; // Meio sempre é o selecionado

            return `
                <div class="period-item ${isCurrent ? 'active' : ''}"
                     data-month="${period.month}"
                     data-year="${period.year}">
                    <span class="period-text">${monthName}/${yearDisplay}</span>
                </div>
            `;
        }).join('');

        // Reaplica event listeners
        this.attachPeriodEventListeners();
    }

    attachPeriodEventListeners() {
        const periodItems = document.querySelectorAll('#transactionsPeriodCarousel .period-item');
        periodItems.forEach(item => {
            item.addEventListener('click', () => this.selectPeriod(item));
        });
    }

    updateTransactionsList() {
        // Método placeholder para atualização da lista de transações
        // Será implementado quando a lista de transações for adicionada
        console.log('Lista de transações será atualizada');
    }
}

// Exporta a classe para uso global
window.TransactionsModule = TransactionsModule;
