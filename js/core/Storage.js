// Storage Module - Gerencia localStorage e dados persistentes
class StorageModule {
    constructor() {
        this.prefix = 'core_';
    }

    setItem(key, value) {
        try {
            const fullKey = this.prefix + key;
            localStorage.setItem(fullKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    getItem(key) {
        try {
            const fullKey = this.prefix + key;
            const item = localStorage.getItem(fullKey);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return null;
        }
    }

    removeItem(key) {
        try {
            const fullKey = this.prefix + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    clear() {
        try {
            // Remove apenas itens com prefixo do Core
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }

    // Métodos específicos para dados do usuário
    setUserName(name) {
        return this.setItem('userName', name);
    }

    getUserName() {
        return this.getItem('userName') || 'Usuário';
    }

    setFocusMode(enabled) {
        return this.setItem('focusMode', enabled);
    }

    getFocusMode() {
        return this.getItem('focusMode') || false;
    }
}

// Exporta a classe para uso global
window.StorageModule = StorageModule;