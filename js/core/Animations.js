// Animations Module - Gerencia animações padronizadas para toda a aplicação
class AnimationsModule {
    constructor() {
        this.defaultOptions = {
            duration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            staggerDelay: 100,
            initialTransform: 'translateY(20px)'
        };
    }

    /**
     * Aplica animações staggered para elementos da página
     * @param {Array} elements - Array de elementos DOM ou seletores
     * @param {Object} options - Opções de animação personalizadas
     */
    applyStaggeredAnimation(elements, options = {}) {
        const config = { ...this.defaultOptions, ...options };
        
        // Converte seletores em elementos
        const elementsArray = elements.map(el => 
            typeof el === 'string' ? document.querySelector(el) : el
        ).filter(el => el); // Remove elementos null
        
        if (elementsArray.length === 0) return;
        
        // Reset inicial para garantir estado consistente
        elementsArray.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = config.initialTransform;
            element.style.transition = 'none';
        });
        
        // Aplicar animações com timing staggered
        elementsArray.forEach((element, index) => {
            setTimeout(() => {
                element.style.transition = `all ${config.duration}ms ${config.easing}`;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * config.staggerDelay);
        });
    }

    /**
     * Aplica animações para a tela inicial
     */
    applyHomeAnimations() {
        const elements = [
            '.app-header',
            '.period-filter',
            '.financial-cards .card:nth-child(1)',
            '.financial-cards .card:nth-child(2)',
            '.month-balance-card',
            '.bank-accounts-card',
            '.credit-cards-card',
            '.fab-button'
        ];
        
        this.applyStaggeredAnimation(elements);
    }

    /**
     * Aplica animações para a tela de ajustes
     */
    applySettingsAnimations() {
        const elements = [
            '.settings-header',
            '.settings-card'
        ];
        
        this.applyStaggeredAnimation(elements);
    }

    /**
     * Aplica animações para a tela de transações
     */
    applyTransactionsAnimations() {
        const elements = [
            '.app-header',
            '.period-filter',
            '.transactions-toolbar',
            '.transactions-summary-card',
            '.transactions-message'
        ];
        
        this.applyStaggeredAnimation(elements);
    }

    /**
     * Aplica animações para modais
     * @param {string} modalSelector - Seletor do modal
     */
    applyModalAnimation(modalSelector) {
        const modal = document.querySelector(modalSelector);
        if (!modal) return;

        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9) translateY(20px)';
        modal.style.transition = 'none';

        setTimeout(() => {
            modal.style.transition = `all ${this.defaultOptions.duration}ms ${this.defaultOptions.easing}`;
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1) translateY(0)';
        }, 50);
    }

    /**
     * Aplica animação de saída para modais
     * @param {string} modalSelector - Seletor do modal
     * @param {Function} callback - Função chamada após a animação
     */
    applyModalExitAnimation(modalSelector, callback) {
        const modal = document.querySelector(modalSelector);
        if (!modal) {
            if (callback) callback();
            return;
        }

        modal.style.transition = `all ${this.defaultOptions.duration}ms ${this.defaultOptions.easing}`;
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9) translateY(20px)';

        setTimeout(() => {
            if (callback) callback();
        }, this.defaultOptions.duration);
    }

    /**
     * Aplica animação de pulso para feedback visual
     * @param {string|Element} element - Elemento ou seletor
     */
    applyPulseAnimation(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.style.transform = 'scale(1.05)';
        el.style.transition = 'transform 0.2s ease-out';

        setTimeout(() => {
            el.style.transform = 'scale(1)';
        }, 200);
    }

    /**
     * Aplica animação personalizada para elementos específicos
     * @param {string|Element} element - Elemento ou seletor
     * @param {Object} fromStyles - Estilos iniciais
     * @param {Object} toStyles - Estilos finais
     * @param {Object} options - Opções de animação
     */
    applyCustomAnimation(element, fromStyles, toStyles, options = {}) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        const config = { ...this.defaultOptions, ...options };

        // Aplica estilos iniciais
        Object.assign(el.style, fromStyles);
        el.style.transition = 'none';

        setTimeout(() => {
            el.style.transition = `all ${config.duration}ms ${config.easing}`;
            Object.assign(el.style, toStyles);
        }, 50);
    }

    /**
     * Reset de todos os estilos de animação de um elemento
     * @param {string|Element} element - Elemento ou seletor
     */
    resetElement(element) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;

        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
    }

    /**
     * Configura animações de hover para elementos interativos
     */
    setupHoverAnimations() {
        // Cards interativos
        document.querySelectorAll('.card, .settings-card, .nav-item, .period-item').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = element.style.transform.replace('translateY(0)', 'translateY(-2px)');
                element.style.transition = 'all 0.3s ease-out';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = element.style.transform.replace('translateY(-2px)', 'translateY(0)');
            });
        });

        // Botões
        document.querySelectorAll('.fab-button, .focus-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
                button.style.transition = 'all 0.2s ease-out';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
            });
        });
    }

    /**
     * Aplica animações genéricas baseadas na view atual
     * @param {string} viewType - Tipo da view (home, settings, transactions, etc.)
     */
    applyViewAnimations(viewType) {
        switch (viewType) {
            case 'home':
                this.applyHomeAnimations();
                break;
            case 'settings':
                this.applySettingsAnimations();
                break;
            case 'transactions':
                this.applyTransactionsAnimations();
                break;
            default:
                // Animação genérica para views não especificadas
                const genericElements = document.querySelectorAll(
                    '.app-header, .period-filter, .card, .settings-card, .toolbar'
                );
                this.applyStaggeredAnimation(Array.from(genericElements));
                break;
        }
        
        // Sempre configura animações de hover após aplicar as animações principais
        setTimeout(() => {
            this.setupHoverAnimations();
        }, 1000); // Aguarda todas as animações de entrada terminarem
    }
}

// Exporta a classe para uso global
window.AnimationsModule = AnimationsModule;
