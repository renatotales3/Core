// Core App - Módulo Principal
class CoreApp {
    constructor() {
        this.currentTab = 'home';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.focusMode = false;
        this.selectedPeriod = {
            month: this.currentMonth,
            year: this.currentYear
        };
        this.modules = {};
        this.init();
    }

    async init() {
        await this.initializeModules();
        this.setupEventListeners();
        
        // Cria o FAB imediatamente na inicialização
        this.createFAB();
        
        // Salva o conteúdo original da home antes de qualquer navegação
        if (!this.modules.settings.originalContent) {
            const mainContent = document.querySelector('.app-container');
            if (mainContent) {
                this.modules.settings.originalContent = mainContent.innerHTML;
                console.log('Conteúdo original salvo na inicialização');
            }
        }
        
        await this.loadUserData();
        await this.loadCurrentTab();
        this.initFabBehaviors();
        this.updatePeriodCarousel();
        this.updateFinancialData();
        this.applyInitialAnimations();
    }

    async initializeModules() {
        // Inicializa todos os módulos
        this.modules.dashboard = new DashboardModule(this);
        this.modules.router = new RouterModule(this);
        this.modules.utils = new UtilsModule();
        this.modules.settings = new SettingsModule(this);
        this.modules.transactions = new TransactionsModule(this);
    }

    setupEventListeners() {
        // Botão de foco
        const focusButton = document.getElementById('focusButton');
        if (focusButton) {
            focusButton.addEventListener('click', () => this.toggleFocusMode());
        }

        // Filtro de período
        const periodItems = document.querySelectorAll('.period-item');
        periodItems.forEach(item => {
            item.addEventListener('click', () => this.selectPeriod(item));
        });

        // Navbar
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => this.navigateToTab(item));
        });

        // Navegação por teclado
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    createFAB() {
        // Remove FAB existente se houver
        const existingFAB = document.getElementById('fabButton');
        if (existingFAB) {
            existingFAB.remove();
        }

        // Cria o FAB
        const fabHTML = `
            <button class="fab-button" id="fabButton" title="Adicionar Transação">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                </svg>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', fabHTML);
        
        // Anexa o event listener
        const fab = document.getElementById('fabButton');
        if (fab) {
            fab.addEventListener('click', () => this.showAddTransactionModal());
        }
        
        console.log('FAB criado e anexado ao body');
    }

    initFabBehaviors() {
        // Auto-hide on scroll - versão simplificada
        let lastY = window.scrollY;
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const fab = document.getElementById('fabButton');
                const current = window.scrollY;
                if (fab) {
                    if (current > lastY + 10) {
                        fab.classList.add('fab-hidden');
                    } else if (current < lastY - 10) {
                        fab.classList.remove('fab-hidden');
                    }
                }
                lastY = current;
                ticking = false;
            });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        console.log('FAB behaviors initialized');
    }

    async toggleFocusMode() {
        this.focusMode = !this.focusMode;
        const appContainer = document.querySelector('.app-container');
        const focusButton = document.getElementById('focusButton');
        
        if (appContainer) {
            if (this.focusMode) {
                appContainer.classList.add('focus-mode');
            } else {
                appContainer.classList.remove('focus-mode');
            }
        }
        if (focusButton) {
            if (this.focusMode) {
                focusButton.classList.add('focused');
            } else {
                focusButton.classList.remove('focused');
            }
        }

        // Salvar preferência
        localStorage.setItem('coreFocusMode', JSON.stringify(this.focusMode));
    }

    updateFocusButtonState() {
        const focusButton = document.getElementById('focusButton');
        if (focusButton) {
            if (this.focusMode) {
                focusButton.classList.add('focused');
            } else {
                focusButton.classList.remove('focused');
            }
        }
    }

    showAddTransactionModal() {
        // Cria o modal de adicionar transação
        const modalHTML = `
            <div class="add-transaction-modal" id="addTransactionModal">
                <div class="add-transaction-sheet">
                    <div class="add-transaction-header">
                        <h2 class="add-transaction-title">Adicionar Transação</h2>
                        <button class="add-transaction-close" id="closeTransactionModal">×</button>
                    </div>
                    <div class="add-transaction-body">
                        <form class="transaction-form" id="transactionForm">
                            <div class="form-group">
                                <label class="form-label" for="transactionDescription">Descrição</label>
                                <input type="text" id="transactionDescription" class="form-input" placeholder="Ex: Café da manhã" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="transactionAmount">Valor</label>
                                <input type="number" id="transactionAmount" class="form-input amount-input" placeholder="0,00" step="0.01" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Tipo</label>
                                <div class="transaction-type-selector">
                                    <div class="type-option active" data-type="expense">Despesa</div>
                                    <div class="type-option" data-type="income">Receita</div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Categoria</label>
                                <div class="category-selector">
                                    <button type="button" class="category-button" id="categoryButton">
                                        <span id="selectedCategory">Selecione uma categoria</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </button>
                                    <div class="category-dropdown" id="categoryDropdown">
                                        ${this.renderCategoryOptions()}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="transactionDate">Data</label>
                                <input type="date" id="transactionDate" class="form-input" value="${new Date().toISOString().split('T')[0]}" required>
                            </div>
                        </form>
                    </div>
                    <div class="add-transaction-footer">
                        <button type="button" class="btn-secondary" id="cancelTransaction">Cancelar</button>
                        <button type="submit" form="transactionForm" class="btn-primary" id="saveTransaction">Salvar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        document.body.classList.add('modal-open');

        // Configura os event listeners do modal
        this.setupTransactionModalEvents();
    }

    renderCategoryOptions() {
        const categories = this.modules.transactions ? this.modules.transactions.categories : [
            { id: 1, name: 'Alimentação', icon: '🍽️' },
            { id: 2, name: 'Transporte', icon: '🚗' },
            { id: 3, name: 'Lazer', icon: '🎬' },
            { id: 4, name: 'Saúde', icon: '🏥' },
            { id: 5, name: 'Educação', icon: '📚' }
        ];

        return categories.map(category => `
            <div class="category-item" data-id="${category.id}">
                <span class="category-icon">${category.icon}</span>
                ${category.name}
            </div>
        `).join('');
    }

    setupTransactionModalEvents() {
        const modal = document.getElementById('addTransactionModal');
        const closeBtn = document.getElementById('closeTransactionModal');
        const cancelBtn = document.getElementById('cancelTransaction');
        const form = document.getElementById('transactionForm');
        const categoryButton = document.getElementById('categoryButton');
        const categoryDropdown = document.getElementById('categoryDropdown');
        const typeOptions = document.querySelectorAll('.type-option');
        const categoryItems = document.querySelectorAll('.category-item');

        // Fechar modal
        const closeModal = () => {
            if (modal) {
                modal.remove();
                document.body.classList.remove('modal-open');
            }
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Seleção de tipo
        typeOptions.forEach(option => {
            option.addEventListener('click', () => {
                typeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });

        // Dropdown de categoria
        categoryButton.addEventListener('click', () => {
            categoryDropdown.classList.toggle('show');
        });

        // Seleção de categoria
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                const categoryName = item.textContent.trim();
                document.getElementById('selectedCategory').textContent = categoryName;
                categoryDropdown.classList.remove('show');
                
                // Remove seleção anterior
                categoryItems.forEach(cat => cat.classList.remove('selected'));
                item.classList.add('selected');
            });
        });

        // Submissão do formulário
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
            closeModal();
        });
    }

    saveTransaction() {
        const description = document.getElementById('transactionDescription').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const type = document.querySelector('.type-option.active').dataset.type;
        const date = document.getElementById('transactionDate').value;
        const selectedCategory = document.querySelector('.category-item.selected');
        
        if (!description || !amount || !selectedCategory) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const categoryId = parseInt(selectedCategory.dataset.id);
        
        // Cria a transação
        const transaction = {
            id: Date.now(),
            description,
            amount: type === 'expense' ? -amount : amount,
            type,
            category: categoryId,
            date: new Date(date).toISOString(),
            status: 'paid'
        };

        // Salva no módulo de transações
        if (this.modules.transactions) {
            this.modules.transactions.transactions.push(transaction);
            this.modules.transactions.saveTransactions();
            
            // Atualiza a aba de transações se estiver aberta
            if (this.currentTab === 'transactions') {
                this.modules.transactions.renderTransactionsTab();
            }
            
            // Atualiza os dados financeiros na tela inicial
            this.updateFinancialData();
        }

        console.log('Transação salva:', transaction);
    }

    // Resto dos métodos (copiando do arquivo original)...
    async navigateToTab(navItem) {
        // Remove seleção anterior
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona seleção ao item clicado
        navItem.classList.add('active');

        // Obtém o tipo de aba
        const tabType = navItem.dataset.tab;

        // Atualiza classe do container baseada na aba
        const appContainer = document.querySelector('.app-container');
        if (appContainer) {
            appContainer.classList.remove('home-view', 'transactions-view', 'settings-view', 'reports-view');
            if (tabType === 'home') {
                appContainer.classList.add('home-view');
            } else if (tabType === 'transactions') {
                appContainer.classList.add('transactions-view');
            } else if (tabType === 'settings') {
                appContainer.classList.add('settings-view');
            } else if (tabType === 'reports') {
                appContainer.classList.add('reports-view');
            }
        }

        // Navega para a aba correspondente
        this.modules.router.showTab(tabType);

        // Atualiza o estado do botão de foco
        this.updateFocusButtonState();

        // Persiste aba atual
        this.currentTab = tabType;
        localStorage.setItem('coreCurrentTab', tabType);
    }

    // Métodos básicos necessários
    applyInitialAnimations() {}
    updatePeriodCarousel() {}
    updateFinancialData() {}
    selectPeriod() {}
    handleKeyboardNavigation() {}
    
    async loadUserData() {
        // Carrega modo de foco
        const savedFocusMode = JSON.parse(localStorage.getItem('coreFocusMode') || 'false');
        if (savedFocusMode) {
            this.focusMode = true;
            const appContainer = document.querySelector('.app-container');
            const focusButton = document.getElementById('focusButton');
            if (appContainer) {
                appContainer.classList.add('focus-mode');
            }
            if (focusButton) {
                focusButton.classList.add('focused');
            }
        }
    }

    async loadCurrentTab() {
        const savedTab = localStorage.getItem('coreCurrentTab');
        if (savedTab && savedTab !== 'home') {
            this.currentTab = savedTab;
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                appContainer.classList.remove('home-view', 'transactions-view', 'settings-view', 'reports-view');
                if (savedTab === 'transactions') {
                    appContainer.classList.add('transactions-view');
                } else if (savedTab === 'settings') {
                    appContainer.classList.add('settings-view');
                } else if (savedTab === 'reports') {
                    appContainer.classList.add('reports-view');
                }
            }
            if (savedTab === 'transactions') {
                this.modules.router.showTab('transactions');
            } else if (savedTab === 'settings') {
                this.modules.router.showTab('settings');
            }
        } else {
            this.currentTab = 'home';
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                appContainer.classList.add('home-view');
            }
        }
    }
}

// Exporta a classe para uso global
window.CoreApp = CoreApp;
