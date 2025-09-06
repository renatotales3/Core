// Router Module - Gerencia a navegação entre abas
class RouterModule {
    constructor(app) {
        this.app = app;
    }

    showTab(tabType) {
        // Atualiza o indicador ativo do navbar
        this.updateActiveTab(tabType);
        
        // Gerencia a navegação entre abas
        console.log(`Navegando para a aba: ${tabType}`);
        
        // Exemplo de implementação futura:
        switch(tabType) {
            case 'home':
                this.app.goBackToHome();
                break;
            case 'transactions':
                // Aqui será implementada a aba de transações
                this.showTransactionsTab();
                break;
            case 'reports':
                // Aqui será implementada a aba de relatórios
                this.showReportsTab();
                break;
            case 'settings':
                // Aqui será implementada a aba de ajustes
                this.showSettingsTab();
                break;
        }
    }

    updateActiveTab(activeTab) {
        const navItems = document.querySelectorAll('.nav-item');
        const navbar = document.querySelector('.navbar');
        
        // Remove classe ativa de todos os itens
        navItems.forEach(item => item.classList.remove('active'));
        
        // Adiciona classe ativa ao item correto
        const activeItem = document.querySelector(`[data-tab="${activeTab}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            
            // Atualiza o indicador animado
            if (navbar) {
                navbar.setAttribute('data-active', activeTab);
            }
        }
    }

    showTransactionsTab() {
        // Mostra a aba de transações
        if (this.app.modules.transactions) {
            this.app.modules.transactions.renderTransactionsTab();
        } else {
            console.log('Módulo de transações não encontrado');
        }
    }

    showReportsTab() {
        // Placeholder para a implementação da aba de relatórios
        console.log('Aba de relatórios será implementada aqui');
    }

    showSettingsTab() {
        // Mostra a aba de ajustes
        if (this.app.modules.settings) {
            this.app.modules.settings.renderSettingsTab();
        } else {
            console.log('Módulo de ajustes não encontrado');
        }
    }
}

// Exporta a classe para uso global
window.RouterModule = RouterModule;