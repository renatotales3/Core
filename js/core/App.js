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

    init() {
        this.initializeModules();
        this.setupEventListeners();
        this.loadUserData();
        this.loadCurrentTab();
        this.updatePeriodCarousel();
        this.updateFinancialData();
    }

    initializeModules() {
        // Inicializa todos os módulos
        this.modules.dashboard = new DashboardModule(this);
        this.modules.router = new RouterModule(this);
        this.modules.storage = new StorageModule();
        this.modules.utils = new UtilsModule();
        this.modules.settings = new SettingsModule(this);
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

    toggleFocusMode() {
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
        this.modules.storage.setItem('coreFocusMode', this.focusMode);
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

    loadUserData() {
        // Carrega nome do usuário
        const userName = this.modules.storage.getItem('coreUserName') || 'Renato';
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }

        // Carrega foto do usuário
        const userPhoto = this.modules.storage.getItem('coreUserPhoto');
        if (userPhoto) {
            const userPhotoElement = document.querySelector('.user-photo');
            if (userPhotoElement) {
                userPhotoElement.innerHTML = `<img src="${userPhoto}" alt="Foto do perfil" />`;
            }
        }

        // Carrega tema
        const savedTheme = this.modules.storage.getItem('coreTheme') || 'light';
        this.applyTheme(savedTheme);

        // Carrega modo de foco
        const savedFocusMode = this.modules.storage.getItem('coreFocusMode') === true;
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
            // Tema escuro
            root.style.setProperty('--text-primary', '#f9fafb');
            root.style.setProperty('--text-secondary', '#d1d5db');
            root.style.setProperty('--background-primary', '#1f2937');
            root.style.setProperty('--background-secondary', '#111827');
            root.style.setProperty('--background-tertiary', '#374151');
        } else {
            // Tema claro
            root.style.setProperty('--text-primary', '#1f2937');
            root.style.setProperty('--text-secondary', '#6b7280');
            root.style.setProperty('--background-primary', '#ffffff');
            root.style.setProperty('--background-secondary', '#f9fafb');
            root.style.setProperty('--background-tertiary', '#f3f4f6');
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

    navigateToTab(navItem) {
        // Remove seleção anterior
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona seleção ao item clicado
        navItem.classList.add('active');

        // Obtém o tipo de aba
        const tabType = navItem.dataset.tab;

        // Navega para a aba correspondente
        this.modules.router.showTab(tabType);

        // Persiste aba atual
        this.currentTab = tabType;
        this.modules.storage.setItem('coreCurrentTab', tabType);
    }

    navigateToTabByType(tabType) {
        // Encontra o item da navbar correspondente
        const navItem = document.querySelector(`[data-tab="${tabType}"]`);
        if (navItem) {
            this.navigateToTab(navItem);
        }
    }

    goBackToHome() {
        // Restaura o conteúdo original da aba inicial
        const mainContent = document.querySelector('.app-container');
        if (mainContent && this.modules.settings && this.modules.settings.originalContent) {
            mainContent.innerHTML = this.modules.settings.originalContent;
            
            // Reanexa os event listeners
            this.setupEventListeners();
            
            // Ativa a aba inicial na navbar
            this.navigateToTabByType('home');

            // Persiste aba
            this.currentTab = 'home';
            this.modules.storage.setItem('coreCurrentTab', 'home');
        }
    }

    loadCurrentTab() {
        const savedTab = this.modules.storage.getItem('coreCurrentTab');
        if (savedTab && savedTab !== 'home') {
            // Aguarda o DOM finalizar listeners e módulos
            setTimeout(() => {
                this.navigateToTabByType(savedTab);
            }, 50);
        }
    }
}

// Exporta a classe para uso global
window.CoreApp = CoreApp;