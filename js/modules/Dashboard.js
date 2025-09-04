// Dashboard Module - Gerencia a primeira aba (Dashboard)
class DashboardModule {
    constructor(app) {
        this.app = app;
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
}

// Exporta a classe para uso global
window.DashboardModule = DashboardModule;