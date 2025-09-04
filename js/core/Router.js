// Router Module - Gerencia a navegação entre abas
class RouterModule {
    constructor(app) {
        this.app = app;
    }

    showTab(tabType) {
        // Por enquanto, apenas mostra a aba inicial
        // Em implementações futuras, aqui será carregado o conteúdo da aba
        console.log(`Navegando para a aba: ${tabType}`);
        
        // Exemplo de implementação futura:
        switch(tabType) {
            case 'home':
                // Mostra conteúdo da aba inicial (já está visível)
                break;
            case 'transactions':
                // Aqui será implementada a aba de transações
                this.showTransactionsTab();
                break;
            case 'categories':
                // Aqui será implementada a aba de categorias
                this.showCategoriesTab();
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

    showTransactionsTab() {
        // Placeholder para a implementação da aba de transações
        console.log('Aba de transações será implementada aqui');
        // Aqui será criada a interface para adicionar/gerenciar transações
    }

    showCategoriesTab() {
        // Placeholder para a implementação da aba de categorias
        console.log('Aba de categorias será implementada aqui');
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