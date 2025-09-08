// Router Module - Gerencia a navegação entre abas
class RouterModule {
    constructor(app) {
        this.app = app;
    }

    showTab(tabType) {
        // Gerencia a navegação entre abas
        console.log(`Navegando para a aba: ${tabType}`);
        
        // Exemplo de implementação futura:
        switch(tabType) {
            case 'home':
                this.app.goBackToHome();
                break;
            case 'transactions':
                // Atualiza o indicador ativo do navbar
                this.updateActiveTab(tabType);
                // Aqui será implementada a aba de transações
                this.showTransactionsTab();
                break;
            case 'reports':
                // Atualiza o indicador ativo do navbar
                this.updateActiveTab(tabType);
                // Aqui será implementada a aba de relatórios
                this.showReportsTab();
                break;
            case 'settings':
                // Atualiza o indicador ativo do navbar
                this.updateActiveTab(tabType);
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
            // Anima o indicador da aba anterior para a nova
            if (navbar) {
                // Descobre a aba anterior
                const previousTab = navbar.getAttribute('data-active') || 'home';
                console.log(`Animando indicador de ${previousTab} para ${activeTab}`);
                // Sempre anima, mesmo se for a mesma aba (para casos de restauração)
                // Primeiro, seta para a aba anterior
                navbar.setAttribute('data-active', previousTab);
                // Força reflow para garantir que a mudança seja aplicada
                void navbar.offsetWidth;
                // Agora anima para a nova aba
                requestAnimationFrame(() => {
                    navbar.setAttribute('data-active', activeTab);
                });
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