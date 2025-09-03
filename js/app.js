// Core App - JavaScript Principal
class CoreApp {
    constructor() {
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.focusMode = false;
        this.selectedPeriod = {
            month: this.currentMonth,
            year: this.currentYear
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.updatePeriodDisplay();
        this.updateFinancialData();
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

        // Navegação por teclado
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
    }

    toggleFocusMode() {
        this.focusMode = !this.focusMode;
        const appContainer = document.querySelector('.app-container');
        const focusButton = document.getElementById('focusButton');
        
        if (this.focusMode) {
            appContainer.classList.add('focus-mode');
            focusButton.classList.add('focused');
        } else {
            appContainer.classList.remove('focus-mode');
            focusButton.classList.remove('focused');
        }

        // Salvar preferência
        localStorage.setItem('coreFocusMode', this.focusMode);
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
        const mockData = this.getMockFinancialData(month, year);
        
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
        this.updateBankAccountsData(mockData);

        // Atualiza dados dos cartões de crédito
        this.updateCreditCardsData(mockData);
    }



    updateBankAccountsData(data) {
        // Simula dados das contas bancárias
        const totalBalance = data.income * 3; // Saldo total estimado
        
        const totalAmountElement = document.querySelector('.total-amount');
        if (totalAmountElement) {
            totalAmountElement.textContent = totalBalance.toLocaleString('pt-BR');
        }
    }

    updateCreditCardsData(data) {
        // Simula dados dos cartões de crédito
        const creditLimit = data.income * 2.4; // Limite baseado na renda
        const creditUsed = data.expense * 1.1; // Utilização baseada nos gastos
        const usagePercentage = Math.round((creditUsed / creditLimit) * 100);
        
        const creditAmountElement = document.querySelector('.credit-amount');
        const creditUsageElement = document.querySelector('.credit-usage');
        
        if (creditAmountElement) {
            creditAmountElement.textContent = `R$ ${creditLimit.toLocaleString('pt-BR')}`;
        }
        
        if (creditUsageElement) {
            creditUsageElement.textContent = `Utilizado: ${usagePercentage}%`;
        }
    }

    getMockFinancialData(month, year) {
        // Dados simulados baseados no período
        const baseIncome = 5000 + (month * 100);
        const baseExpense = 3800 + (month * 80);
        
        return {
            income: baseIncome,
            expense: baseExpense,
            balance: baseIncome - baseExpense,
            incomeChange: Math.floor(Math.random() * 30) - 10, // -10% a +20%
            expenseChange: Math.floor(Math.random() * 25) - 5,  // -5% a +20%
            month: month,
            year: year
        };
    }

    getMonthName(month) {
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return monthNames[month < 0 ? month + 12 : month];
    }

    updateInsights(data) {
        const insightsContainer = document.querySelector('.balance-insights');
        if (!insightsContainer) return;

        const insights = this.generateInsights(data);
        
        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <span class="insight-text">${insight.text}</span>
            </div>
        `).join('');
    }

    generateInsights(data) {
        const insights = [];
        
        // Insight baseado no saldo
        if (data.balance > 0) {
            insights.push({
                text: `Você economizou R$ ${data.balance.toLocaleString('pt-BR')} este mês!`
            });
        } else {
            insights.push({
                text: `Atenção: gastos R$ ${Math.abs(data.balance).toLocaleString('pt-BR')} acima da receita`
            });
        }

        // Insight baseado na comparação
        if (data.expenseChange > 15) {
            insights.push({
                text: `Gastos aumentaram ${data.expenseChange}% vs mês anterior`
            });
        } else if (data.expenseChange < -10) {
            insights.push({
                text: `Parabéns! Gastos reduziram ${Math.abs(data.expenseChange)}%`
            });
        }

        // Se não temos insights suficientes, adiciona insights padrão
        if (insights.length < 2) {
            if (data.income > 5000) {
                insights.push({
                    text: `Receita acima da média mensal!`
                });
            } else if (data.expense < 3000) {
                insights.push({
                    text: `Excelente controle de gastos!`
                });
            } else {
                insights.push({
                    text: `Continue monitorando suas finanças!`
                });
            }
        }

        return insights.slice(0, 2); // Máximo 2 insights
    }

    loadUserData() {
        // Carrega nome do usuário
        const userName = localStorage.getItem('coreUserName') || 'Renato';
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }

        // Carrega modo de foco
        const savedFocusMode = localStorage.getItem('coreFocusMode') === 'true';
        if (savedFocusMode) {
            this.focusMode = true;
            const appContainer = document.querySelector('.app-container');
            const focusButton = document.getElementById('focusButton');
            if (appContainer && focusButton) {
                appContainer.classList.add('focus-mode');
                focusButton.classList.add('focused');
            }
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


}

// Inicializa o app quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new CoreApp();
});

// Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}