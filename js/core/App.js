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
        await this.loadUserData();
        await this.loadCurrentTab();
        this.updatePeriodCarousel();
        this.updateFinancialData();
        this.applyInitialAnimations();
    }

    applyInitialAnimations() {
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

        // Navega para a aba correspondente
        this.modules.router.showTab(tabType);

        // Persiste aba atual
        this.currentTab = tabType;
        localStorage.setItem('coreCurrentTab', tabType);
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
            
            // Reanexa os event listeners
            this.setupEventListeners();
            
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
        }
    }

    async loadCurrentTab() {
        const savedTab = localStorage.getItem('coreCurrentTab');
        if (savedTab && savedTab !== 'home') {
            // Apenas atualiza o estado visual da navbar sem navegação
            this.currentTab = savedTab;
            
            // Atualiza navbar silenciosamente
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
            
            // Se for settings, carrega o conteúdo
            if (savedTab === 'settings') {
                this.modules.router.showTab('settings');
            }
        } else {
            // Garante que home está ativo
            this.currentTab = 'home';
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.setAttribute('data-active', 'home');
            }
        }
    }
}

// Exporta a classe para uso global
window.CoreApp = CoreApp;