// Utils Module - Funções auxiliares e dados mockados
class UtilsModule {
    constructor() {
        // Dados mockados para simulação
        this.mockData = {
            baseIncome: 5000,
            baseExpense: 3800,
            monthVariation: 100
        };
    }

    getMockFinancialData(month, year) {
        // Dados simulados baseados no período
        const baseIncome = this.mockData.baseIncome + (month * this.mockData.monthVariation);
        const baseExpense = this.mockData.baseExpense + (month * (this.mockData.monthVariation * 0.8));
        
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
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return monthNames[month < 0 ? month + 12 : month];
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatPercentage(value) {
        return `${value > 0 ? '+' : ''}${value}%`;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Validações
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidAmount(amount) {
        return typeof amount === 'number' && amount >= 0 && isFinite(amount);
    }

    isValidDate(date) {
        return date instanceof Date && !isNaN(date);
    }
}

// Exporta a classe para uso global
window.UtilsModule = UtilsModule;