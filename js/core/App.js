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
        this.updatePeriodCarousel();
        this.updateFinancialData();
        this.applyInitialAnimations();
        
        // Inicializa comportamento de scroll do FAB após tudo estar carregado
        setTimeout(() => {
            this.initFabScrollBehavior();
        }, 500);
        
            // Observa remoção da navbar/FAB
            this.setupNavbarAndFabWatcher();
    }
    
        // Observador que reinser navbar e FAB se removidos
        setupNavbarAndFabWatcher() {
            try {
                const container = document.querySelector('.app-container');
                if (!container) return;
                if (this._navbarFabObserver) return;
            
                this._navbarFabObserver = new MutationObserver((mutations) => {
                    for (const m of mutations) {
                        if (m.removedNodes && m.removedNodes.length) {
                            for (const node of m.removedNodes) {
                                if (node && node.classList && node.classList.contains) {
                                    if (node.classList.contains('navbar')) {
                                        // Reinsere a navbar
                                        const navbarHTML = this.getNavbarHTML ? this.getNavbarHTML() : '';
                                        container.insertAdjacentHTML('beforeend', navbarHTML);
                                        this.setupEventListeners();
                                        this.modules.router && this.modules.router.updateActiveTab && this.modules.router.updateActiveTab(this.currentTab || 'home');
                                    }
                                    if (node.classList.contains('fab-button')) {
                                        // Reinsere o FAB
                                        const fabButton = document.getElementById('fabButton');
                                        if (!fabButton) {
                                            const fabHTML = `<button id="fabButton" class="fab-button" type="button"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7H5"/></svg></button>`;
                                            container.insertAdjacentHTML('beforeend', fabHTML);
                                            this.setupEventListeners();
                                            this.initFabScrollBehavior();
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                this._navbarFabObserver.observe(container, { childList: true });
            } catch (e) {
                console.error('setupNavbarAndFabWatcher erro', e);
            }
        }

    applyInitialAnimations() {
        // Usa o módulo centralizado de animações
        this.modules.animations.applyHomeAnimations();
        
        // Configura animações de hover após as animações iniciais
        setTimeout(() => {
            this.modules.animations.setupHoverAnimations();
        }, 800);
    }

    async initializeModules() {
        // Inicializa todos os módulos
        this.modules.animations = new AnimationsModule();
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

        // Botão FAB para adicionar transação
        const fabButton = document.getElementById('fabButton');
        if (fabButton) {
            fabButton.addEventListener('click', () => this.showAddTransactionModal());
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

        // Inicializa comportamento de scroll do FAB
        // this.initFabScrollBehavior(); // Movido para init() após carregamento completo
    }

    // Método auxiliar para reinicializar comportamento do FAB após mudanças no DOM
    reinitializeFabBehavior() {
        const currentTab = this.currentTab || localStorage.getItem('coreCurrentTab') || 'home';
        
        if (currentTab === 'home' || currentTab === 'transactions') {
            // Aguarda o DOM estar pronto e reinicializa
            requestAnimationFrame(() => {
                setTimeout(() => {
                    this.initFabScrollBehavior();
                }, 100);
            });
        }
    }

    initFabScrollBehavior() {
        const fab = document.querySelector('.fab-button');
        if (!fab) {
            setTimeout(() => this.initFabScrollBehavior(), 100);
            return;
        }

        // Remove event listener anterior se existir
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler, { passive: true });
            this.scrollHandler = null;
        }

        // Reset do estado do FAB - sempre começar visível
        fab.classList.remove('fab-scroll-hidden');

        // Inicializar variáveis de controle
        this.lastScrollY = window.scrollY;
        this.isFabHidden = false;

        // Criar nova função de scroll com bind para manter contexto
        this.scrollHandler = this.handleFabScroll.bind(this);

        window.addEventListener('scroll', this.scrollHandler, { passive: true });
        
        console.log('FAB scroll behavior initialized');
    }

    handleFabScroll() {
        const fab = document.querySelector('.fab-button');
        const appContainer = document.querySelector('.app-container');
        
        if (!fab || !appContainer) {
            return;
        }

        // Verifica se estamos nas abas corretas
        const isFabVisible = appContainer.classList.contains('home-view') || 
                           appContainer.classList.contains('transactions-view');

        if (!isFabVisible) {
            return;
        }

        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - this.lastScrollY;

        // Threshold para evitar mudanças muito pequenas
        if (Math.abs(scrollDifference) > 5) {
            if (scrollDifference > 0 && !this.isFabHidden) {
                // Rolar para baixo - ocultar FAB
                fab.classList.add('fab-scroll-hidden');
                this.isFabHidden = true;
                console.log('FAB hidden on scroll down');
            } else if (scrollDifference < 0 && this.isFabHidden) {
                // Rolar para cima - mostrar FAB
                fab.classList.remove('fab-scroll-hidden');
                this.isFabHidden = false;
                console.log('FAB shown on scroll up');
            }
            this.lastScrollY = currentScrollY;
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
        
        // Aplica animação de entrada do modal
        if (this.modules.animations) {
            this.modules.animations.applyModalAnimation('#addTransactionModal');
        }

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
                if (this.modules.animations) {
                    // Aplica animação de saída antes de remover
                    this.modules.animations.applyModalExitAnimation('#addTransactionModal', () => {
                        modal.remove();
                        document.body.classList.remove('modal-open');
                        // Reinicializa comportamento do FAB após fechar modal
                        setTimeout(() => {
                            this.initFabScrollBehavior();
                        }, 100);
                    });
                } else {
                    modal.remove();
                    document.body.classList.remove('modal-open');
                    // Reinicializa comportamento do FAB após fechar modal
                    setTimeout(() => {
                        this.initFabScrollBehavior();
                    }, 100);
                }
            }
        };        closeBtn.addEventListener('click', closeModal);
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
                // Reinicializa FAB após renderizar transações
                this.reinitializeFabBehavior();
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

        // Reinicializa comportamento de scroll do FAB se necessário
        if (tabType === 'home' || tabType === 'transactions') {
            // Usar requestAnimationFrame para garantir que o DOM está pronto
            requestAnimationFrame(() => {
                setTimeout(() => {
                    this.initFabScrollBehavior();
                }, 150);
            });
        }
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
            // Salva o estado atual da navbar antes de restaurar
            const currentNavbar = document.querySelector('.navbar');
            const currentActiveTab = currentNavbar ? currentNavbar.getAttribute('data-active') : 'settings';

            // Preserva navbar e FAB existentes (mesma lógica do SettingsModule)
            const existingNavbar = mainContent.querySelector('.navbar');
            const existingFab = mainContent.querySelector('.fab-button');

            // Cria wrapper com conteúdo original
            const homeWrapper = document.createElement('div');
            homeWrapper.innerHTML = this.modules.settings.originalContent;

            // Remove navbar e FAB do wrapper (eles serão preservados)
            const wrapperNavbar = homeWrapper.querySelector('.navbar');
            const wrapperFab = homeWrapper.querySelector('.fab-button');
            if (wrapperNavbar) wrapperNavbar.remove();
            if (wrapperFab) wrapperFab.remove();

            // Substitui o conteúdo mantendo navbar e FAB intactos
            if (existingNavbar && existingFab) {
                // Insere o conteúdo de home antes da navbar sem recriá-la
                mainContent.insertBefore(homeWrapper, existingNavbar);

                // Remove quaisquer seções antigas (anteriores à navbar) mantendo navbar e FAB intactos
                const siblings = Array.from(mainContent.children);
                for (const child of siblings) {
                    if (child !== existingNavbar && child !== homeWrapper && child !== existingFab) {
                        mainContent.removeChild(child);
                    }
                }
            } else {
                // Fallback: recria tudo se navbar/FAB não existirem
                mainContent.innerHTML = this.modules.settings.originalContent;
            }

            // Adiciona classe home-view
            mainContent.classList.add('home-view');
            mainContent.classList.remove('transactions-view', 'settings-view', 'reports-view');

            // Reanexa os event listeners apenas aos novos elementos (não aos preservados)
            this.setupEventListeners();

            // Atualiza o estado do botão de foco
            this.updateFocusButtonState();

            // Atualiza estado da aba atual
            this.currentTab = 'home';
            localStorage.setItem('coreCurrentTab', 'home');

            // Restaura o estado anterior da navbar para permitir animação
            const restoredNavbar = document.querySelector('.navbar');
            if (restoredNavbar) {
                restoredNavbar.setAttribute('data-active', currentActiveTab);
                // Força reflow
                void restoredNavbar.offsetWidth;
                // Agora anima para home
                requestAnimationFrame(() => {
                    if (this.modules.router && this.modules.router.updateActiveTab) {
                        this.modules.router.updateActiveTab('home');
                    }
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
                // Reinicializa comportamento de scroll do FAB
                setTimeout(() => {
                    this.initFabScrollBehavior();
                }, 100);
            } else if (savedTab === 'reports') {
                this.modules.router.showTab('reports');
            }
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