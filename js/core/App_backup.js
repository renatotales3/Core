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
        // Inicializa comportamentos do FAB (auto-hide e evitar overlap) DEPOIS de loadCurrentTab
        this.initFabBehaviors();
        this.updatePeriodCarousel();
        this.updateFinancialData();
        this.applyInitialAnimations();
    }    applyInitialAnimations() {
        // Aplica animações staggered aos elementos da página
        const elements = document.querySelectorAll('.financial-cards .card, .period-filter, .app-header, .month-balance-card, .bank-accounts-card, .credit-cards-card');
        
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
    // Garantir visibilidade do FAB após reanexar listeners
    if (typeof this.updateFabVisibilityByView === 'function') this.updateFabVisibilityByView();
    }

    initFabBehaviors() {
        // Ensure FAB exists (create if needed) before attaching behaviors
        if (typeof this.updateFabVisibilityByView === 'function') this.updateFabVisibilityByView();

        // Remove previous handlers if existent
        if (this._fabHandlers) {
            window.removeEventListener('scroll', this._fabHandlers.onScroll, { passive: true });
            window.removeEventListener('resize', this._fabHandlers.onResize);
            window.removeEventListener('scroll', this._fabHandlers.onCheckOverlap, { passive: true });
        }

        // Handlers that query the FAB dynamically to avoid stale references
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

        const selectorsToAvoid = ['.transactions-summary-card', '.financial-cards', '.transactions-toolbar', '.month-balance-card'];
        const checkOverlap = () => {
            const fab = document.getElementById('fabButton');
            if (!fab) return;
            const fabRect = fab.getBoundingClientRect();
            let overlap = false;
            selectorsToAvoid.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    const r = el.getBoundingClientRect();
                    const intersects = !(fabRect.right < r.left || fabRect.left > r.right || fabRect.bottom < r.top || fabRect.top > r.bottom);
                    if (intersects) overlap = true;
                });
            });
            fab.classList.toggle('fab-repositioned', overlap);
        };

        const onResize = () => requestAnimationFrame(checkOverlap);

        // Save handlers for potential removal later
        this._fabHandlers = {
            onScroll,
            onResize,
            onCheckOverlap: () => requestAnimationFrame(checkOverlap)
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', this._fabHandlers.onCheckOverlap, { passive: true });

        // Run once on init
        setTimeout(() => {
            checkOverlap();
            // Also ensure visibility rules based on current view
            this.updateFabVisibilityByView();
        }, 300);
    }

    updateFabVisibilityByView() {
        const appContainer = document.querySelector('.app-container');
        const fabContainer = document.querySelector('.app-container');
        if (!appContainer || !fabContainer) return;

        let fab = document.getElementById('fabButton');
        // If FAB was removed for any reason, recreate it to guarantee availability
        if (!fab) {
            const fabHTML = `
                <button class="fab-button" id="fabButton" title="Adicionar Transação">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            `;
            // Append to the document body to avoid being removed when app-container is replaced
            document.body.insertAdjacentHTML('beforeend', fabHTML);
            fab = document.getElementById('fabButton');
            // Reattach the click listener
            if (fab) fab.addEventListener('click', () => this.showAddTransactionModal());
        }

        if (appContainer.classList.contains('home-view') || appContainer.classList.contains('transactions-view')) {
            // Force visibility and ensure not hidden by scroll class
            fab.style.display = 'flex';
            fab.style.visibility = 'visible';
            fab.classList.remove('fab-hidden');
            // clear inline opacity to let CSS handle hover/focus behavior
            fab.style.opacity = '';
        } else {
            // hide fully in other views
            fab.style.visibility = 'hidden';
            fab.style.display = 'none';
        }
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

    selectPeriod(element) {
        // Remove seleção anterior
        document.querySelectorAll('.period-item').forEach(item => {
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
        
        // Atualiza dados financeiros
        this.updateFinancialData();
        
        // Animação de seleção
        element.style.transform = 'scale(1.1)';
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    }

    updatePeriodCarousel() {
        const carousel = document.getElementById('periodCarousel');
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
        this.setupPeriodEventListeners();
    }

    setupPeriodEventListeners() {
        const periodItems = document.querySelectorAll('.period-item');
        periodItems.forEach(item => {
            item.addEventListener('click', () => this.selectPeriod(item));
        });
    }

    updateFinancialData() {
        // Simula dados baseados no período selecionado
        const month = this.selectedPeriod.month;
        const year = this.selectedPeriod.year;
        
        // Dados mockados (em um app real, viriam de uma API)
        const mockData = this.modules.utils.getMockFinancialData(month, year);
        
        // Atualiza receitas
        const incomeAmount = document.querySelector('.income-amount');
        if (incomeAmount) {
            incomeAmount.textContent = `R$ ${mockData.income.toLocaleString('pt-BR')}`;
        }

        // Atualiza despesas
        const expenseAmount = document.querySelector('.expense-amount');
        if (expenseAmount) {
            expenseAmount.textContent = `R$ ${mockData.expense.toLocaleString('pt-BR')}`;
        }

        // Atualiza saldo
        const balanceAmount = document.querySelector('.amount');
        if (balanceAmount) {
            balanceAmount.textContent = mockData.balance.toLocaleString('pt-BR');
        }

        // Atualiza dados das contas bancárias
        this.modules.dashboard.updateBankAccountsData(mockData);

        // Atualiza dados dos cartões de crédito
        this.modules.dashboard.updateCreditCardsData(mockData);
    }

    async loadUserData() {
        // Carrega nome do usuário
        const userName = localStorage.getItem('coreUserName') || 'Usuário';
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }

        // Carrega foto do usuário
        const userPhoto = localStorage.getItem('coreUserPhoto');
        if (userPhoto) {
            const userPhotoElement = document.querySelector('.user-photo');
            if (userPhotoElement) {
                userPhotoElement.innerHTML = `<img src="${userPhoto}" alt="Foto do perfil" />`;
            }
        }

        // Carrega cor de acento
        const savedAccent = localStorage.getItem('coreAccentColor') || 'indigo';
        if (this.modules.settings) {
            this.modules.settings.applyAccentColor(savedAccent);
        }

        // Carrega tema
        const savedTheme = localStorage.getItem('coreTheme') || 'light';
        this.applyTheme(savedTheme);

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

    applyTheme(theme) {
        const body = document.body;
        const appContainer = document.querySelector('.app-container');
        
        // Remove classes de tema anteriores
        body.className = body.className.replace(/theme-\w+/g, '');
        if (appContainer) {
            appContainer.className = appContainer.className.replace(/theme-\w+/g, '');
        }
        
        // Aplica o novo tema
        body.classList.add(`theme-${theme}`);
        if (appContainer) {
            appContainer.classList.add(`theme-${theme}`);
        }
        
        // Aplica o tema ao CSS
        this.updateCSSVariables(theme);
    }

    updateCSSVariables(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            // Tema escuro premium
            root.style.setProperty('--text-primary', '#e6e7eb');
            root.style.setProperty('--text-secondary', '#a8b0bb');
            root.style.setProperty('--background-primary', '#0f1420');
            root.style.setProperty('--background-secondary', '#0b101a');
            root.style.setProperty('--background-tertiary', '#1a2232');
            
            // Atualiza cor da barra de status para tema escuro
            this.updateThemeColor('#0f1420');
        } else {
            // Tema claro
            root.style.setProperty('--text-primary', '#1f2937');
            root.style.setProperty('--text-secondary', '#6b7280');
            root.style.setProperty('--background-primary', '#ffffff');
            root.style.setProperty('--background-secondary', '#f9fafb');
            root.style.setProperty('--background-tertiary', '#f3f4f6');
            
            // Atualiza cor da barra de status para tema claro
            this.updateThemeColor('#ffffff');
        }
    }

    updateThemeColor(color) {
        // Atualiza meta theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        }
        
        // Atualiza também o manifest se necessário (opcional)
        if ('updateManifest' in document) {
            document.updateManifest();
        }
    }

    handleKeyboardNavigation(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.navigatePeriod(-1);
                break;
            case 'ArrowRight':
                this.navigatePeriod(1);
                break;
            case 'f':
            case 'F':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.toggleFocusMode();
                }
                break;
        }
    }

    navigatePeriod(direction) {
        const currentPeriod = document.querySelector('.period-item.active');
        if (!currentPeriod) return;

        const month = parseInt(currentPeriod.dataset.month);
        const year = parseInt(currentPeriod.dataset.year);
        
        let newMonth = month + direction;
        let newYear = year;
        
        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        // Encontra o item correspondente e clica nele
        const targetItem = document.querySelector(`[data-month="${newMonth}"][data-year="${newYear}"]`);
        if (targetItem) {
            targetItem.click();
        }
    }

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
    // Atualiza visibilidade do FAB após a navegação
    if (typeof this.updateFabVisibilityByView === 'function') this.updateFabVisibilityByView();
    }

    navigateToTabByType(tabType) {
        // Encontra o item da navbar correspondente
        const navItem = document.querySelector(`[data-tab="${tabType}"]`);
        if (navItem) {
            this.navigateToTab(navItem);
        }
    }

    async goBackToHome() {
        // Restaura o conteúdo original da aba inicial
        const mainContent = document.querySelector('.app-container');

        if (mainContent && this.modules.settings && this.modules.settings.originalContent) {
            mainContent.innerHTML = this.modules.settings.originalContent;

            // Adiciona classe home-view
            mainContent.classList.add('home-view');
            mainContent.classList.remove('transactions-view', 'settings-view', 'reports-view');

            // Reanexa os event listeners
            this.setupEventListeners();

            // Atualiza o estado do botão de foco
            this.updateFocusButtonState();

            // Atualiza estado silenciosamente sem animação na navbar
            this.currentTab = 'home';
            localStorage.setItem('coreCurrentTab', 'home');

            // Atualiza navbar visual
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));

            const homeItem = document.querySelector('[data-tab="home"]');
            if (homeItem) {
                homeItem.classList.add('active');
            }

            const navbar = document.querySelector('.navbar');
            if (navbar) {
                // Força a animação resetando o data-active para uma posição intermediária
                navbar.setAttribute('data-active', 'settings'); // Começa da posição de settings
                // Força reflow para garantir que a mudança seja aplicada
                navbar.offsetHeight;
                // Agora anima para home
                requestAnimationFrame(() => {
                    navbar.setAttribute('data-active', 'home');
                });
            }

            // Aplica animações dos cards
            this.applyInitialAnimations();
        } else {
            console.log('Não foi possível restaurar o conteúdo original');
        }
    }

    async loadCurrentTab() {
        const savedTab = localStorage.getItem('coreCurrentTab');
        if (savedTab && savedTab !== 'home') {
            // Garante que o conteúdo original seja salvo antes de navegar
            if (!this.modules.settings.originalContent) {
                const mainContent = document.querySelector('.app-container');
                if (mainContent) {
                    this.modules.settings.originalContent = mainContent.innerHTML;
                    console.log('Conteúdo original salvo em loadCurrentTab');
                }
            }

            // Apenas atualiza o estado visual da navbar sem navegação
            this.currentTab = savedTab;

            // Atualiza classe do container
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

            // Atualiza o estado do botão de foco
            this.updateFocusButtonState();

            // Atualiza navbar visual
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));

            const activeItem = document.querySelector(`[data-tab="${savedTab}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
                const navbar = document.querySelector('.navbar');
                if (navbar) {
                    navbar.setAttribute('data-active', savedTab);
                }
            }

            // Carrega o conteúdo da aba salva
            if (savedTab === 'settings') {
                this.modules.router.showTab('settings');
            } else if (savedTab === 'transactions') {
                this.modules.router.showTab('transactions');
            } else if (savedTab === 'reports') {
                this.modules.router.showTab('reports');
            }
            // Atualiza visibilidade do FAB com base na view carregada
            if (typeof this.updateFabVisibilityByView === 'function') this.updateFabVisibilityByView();
        } else {
            // Garante que home está ativo
            this.currentTab = 'home';
            const appContainer = document.querySelector('.app-container');
            if (appContainer) {
                appContainer.classList.add('home-view');
            }
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.setAttribute('data-active', 'home');
            }
            // Atualiza o estado do botão de foco
            this.updateFocusButtonState();
        }
    }
}

// Exporta a classe para uso global
window.CoreApp = CoreApp;