// Settings Module - Gerencia a aba de ajustes
class SettingsModule {
    constructor(app) {
        this.app = app;
        this.currentSettings = {};
        this.originalContent = null;
        this.init();
    }

    async init() {
        await this.loadSettings();
        // Garante que o tema escuro seja aplicado no primeiro carregamento
        if (!localStorage.getItem('coreTheme')) {
            this.applyTheme('dark');
        }
    }

    async loadSettings() {
        // Carrega configurações salvas ou usa padrões
        this.currentSettings = {
            userName: localStorage.getItem('coreUserName') || 'Usuário',
            userPhoto: localStorage.getItem('coreUserPhoto') || null,
            theme: localStorage.getItem('coreTheme') || 'dark',
            accentColor: localStorage.getItem('coreAccentColor') || 'indigo',
            security: false // Removido toda a complexidade de criptografia
        };
    }

    getThemeDisplayName(theme) {
        const themes = {
            'light': 'Claro',
            'dark': 'Escuro'
        };
        return themes[theme] || 'Claro';
    }

    getAccentDisplayName(accent) {
        const accents = {
            'indigo': 'Índigo',
            'blue': 'Azul',
            'emerald': 'Esmeralda',
            'purple': 'Roxo',
            'pink': 'Rosa',
            'orange': 'Laranja'
        };
        return accents[accent] || 'Índigo';
    }

    async renderSettingsTab() {
        // Cria a interface da aba de ajustes (lista de cards por categoria)
        const mainContent = document.querySelector('.app-container');
        if (!mainContent) return;

        // Salva o conteúdo original para poder voltar
        if (!this.originalContent) {
            this.originalContent = mainContent.innerHTML;
        }

        const securityStatus = this.currentSettings.security ? 'Protegido com AES-256' : 'Sem criptografia';
        const securityIcon = this.currentSettings.security ? '🔒' : '⚠️';

        const settingsHTML = `
            <div class="settings-container">
                <div class="settings-header">
                    <h1 class="settings-title">Ajustes</h1>
                </div>

                <div class="settings-card" id="cardAppearance">
                    <div class="settings-card-main">
                        <div class="settings-card-title">Aparência</div>
                        <div class="settings-card-description">Personalize seu tema e cor de destaque</div>
                    </div>
                    <div class="settings-card-action">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"/>
                        </svg>
                    </div>
                </div>
            </div>
        `;

        // Substitui apenas a área acima da navbar mantendo o nó da navbar e FAB intactos
        const navbar = mainContent.querySelector('.navbar');
        const fabButton = mainContent.querySelector('.fab-button');
        if (navbar && fabButton) {
            const settingsWrapper = document.createElement('div');
            settingsWrapper.innerHTML = settingsHTML;

            // Insere o conteúdo de ajustes antes da navbar sem recriá-la
            mainContent.insertBefore(settingsWrapper, navbar);

            // Remove quaisquer seções antigas (anteriores à navbar) mantendo navbar e FAB intactos
            const siblings = Array.from(mainContent.children);
            for (const child of siblings) {
                if (child !== navbar && child !== settingsWrapper && child !== fabButton) {
                    mainContent.removeChild(child);
                }
            }
        } else {
            // Fallback: preserva navbar/FAB se existirem
            const navbarHTML = navbar ? navbar.outerHTML : '';
            const fabHTML = fabButton ? fabButton.outerHTML : '';
            mainContent.innerHTML = settingsHTML + navbarHTML + fabHTML;
        }

        // Anexa os event listeners
        this.attachEventListeners();
        // Card handlers
        const cardAppearance = document.getElementById('cardAppearance');
        if (cardAppearance) {
            cardAppearance.addEventListener('click', () => this.renderAppearanceSheet());
        }

        // Reanexa os event listeners da navbar
        this.reattachNavbarEvents();
        
        // Aplica animações padronizadas usando o módulo centralizado
        if (this.app.modules.animations) {
            this.app.modules.animations.applySettingsAnimations();
            // Configura animações de hover após as animações iniciais
            setTimeout(() => {
                this.app.modules.animations.setupHoverAnimations();
            }, 800);
        } else {
            // Fallback para o método original
            this.applySettingsAnimations();
        }
        
        // Scroll para o topo
        window.scrollTo(0, 0);
    }

    attachEventListeners() {
        // Em lista de cards, não há listeners específicos aqui
    }

    attachModalOptions() {
        // Opções do modal de tema
        const themeOptions = document.querySelectorAll('#themeModal .modal-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                this.hideModal('themeModal');
                setTimeout(() => {
                    this.updateTheme(value);
                    this.updateThemeButton(value);
                }, 200); // Aplica o tema após o modal fechar
            });
        });

        // Opções de cor de destaque
        const accentOptions = document.querySelectorAll('.accent-color-grid .accent-option');
        accentOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove seleção anterior
                accentOptions.forEach(opt => opt.classList.remove('selected'));
                // Adiciona seleção ao clicado
                option.classList.add('selected');
                
                const accent = option.dataset.accent;
                this.updateAccentColor(accent);
            });
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            document.body.classList.add('modal-open');
            
            // Aplica animação de entrada usando o módulo centralizado
            if (this.app.modules.animations) {
                this.app.modules.animations.applyModalAnimation(`#${modalId}`);
            }
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (this.app.modules.animations) {
                // Aplica animação de saída antes de ocultar
                this.app.modules.animations.applyModalExitAnimation(`#${modalId}`, () => {
                    modal.classList.remove('active');
                    modal.style.display = 'none';
                    // Remove a classe global quando todos os modais estiverem fechados
                    const anyOpen = document.querySelector('.modal-overlay.active');
                    if (!anyOpen) {
                        document.body.classList.remove('modal-open');
                    }
                });
            } else {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                    // Remove a classe global quando todos os modais estiverem fechados
                    const anyOpen = document.querySelector('.modal-overlay.active');
                    if (!anyOpen) {
                        document.body.classList.remove('modal-open');
                    }
                }, 200);
            }
        }
    }

    updateThemeButton(theme) {
        const button = document.getElementById('themeButton');
        if (button) {
            const valueSpan = button.querySelector('.select-value');
            if (valueSpan) {
                valueSpan.textContent = this.getThemeDisplayName(theme);
            }
        }
    }

    // Renderiza o sheet full-screen de Aparência
    renderAppearanceSheet() {
        const mainContent = document.querySelector('.app-container');
        if (!mainContent) return;

        const sheetHTML = `
            <div class="sheet-overlay" id="appearanceSheet">
                <div class="sheet-content">
                    <div class="sheet-header">
                        <button class="sheet-close" id="closeAppearanceSheet">×</button>
                        <h2 class="sheet-title">Aparência</h2>
                    </div>
                    <div class="sheet-body">
                        <div class="settings-section">
                            <h3 class="section-title">Perfil</h3>
                            <div class="profile-section">
                                <div class="profile-photo-container">
                                    <div class="profile-photo" id="profilePhoto">
                                        ${this.currentSettings.userPhoto ? 
                                            `<img src="${this.currentSettings.userPhoto}" alt="Foto do perfil" />` : 
                                            `<svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>`
                                        }
                                    </div>
                                    <button class="change-photo-btn" id="changePhotoBtn">Alterar Foto</button>
                                </div>
                                <div class="profile-info">
                                    <div class="input-group">
                                        <label for="userName">Nome</label>
                                        <input type="text" id="userName" value="${this.currentSettings.userName}" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3 class="section-title">Visual</h3>
                            <div class="input-group">
                                <label for="theme">Modo</label>
                                <button class="select-button" id="themeButton">
                                    <span class="select-value">${this.getThemeDisplayName(this.currentSettings.theme)}</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3 class="section-title">Cor de Destaque</h3>
                            <div class="accent-color-grid">
                                <div class="accent-option ${this.getStoredAccent() === 'indigo' ? 'selected' : ''}" data-accent="indigo">
                                    <div class="accent-color" style="background: #6366f1;"></div>
                                    <span class="accent-name">Índigo</span>
                                </div>
                                <div class="accent-option ${this.getStoredAccent() === 'blue' ? 'selected' : ''}" data-accent="blue">
                                    <div class="accent-color" style="background: #3b82f6;"></div>
                                    <span class="accent-name">Azul</span>
                                </div>
                                <div class="accent-option ${this.getStoredAccent() === 'emerald' ? 'selected' : ''}" data-accent="emerald">
                                    <div class="accent-color" style="background: #10b981;"></div>
                                    <span class="accent-name">Esmeralda</span>
                                </div>
                                <div class="accent-option ${this.getStoredAccent() === 'purple' ? 'selected' : ''}" data-accent="purple">
                                    <div class="accent-color" style="background: #8b5cf6;"></div>
                                    <span class="accent-name">Roxo</span>
                                </div>
                                <div class="accent-option ${this.getStoredAccent() === 'pink' ? 'selected' : ''}" data-accent="pink">
                                    <div class="accent-color" style="background: #ec4899;"></div>
                                    <span class="accent-name">Rosa</span>
                                </div>
                                <div class="accent-option ${this.getStoredAccent() === 'orange' ? 'selected' : ''}" data-accent="orange">
                                    <div class="accent-color" style="background: #f97316;"></div>
                                    <span class="accent-name">Laranja</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Seleção de Modo -->
            <div class="modal-overlay" id="themeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Selecionar Modo</h3>
                        <button class="modal-close" id="closeThemeModal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-option" data-value="light">
                            <div class="option-content">
                                <div class="option-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                                    </svg>
                                </div>
                                <div class="option-text">
                                    <div class="option-title">Claro</div>
                                    <div class="option-description">Visual limpo com alto contraste e fundos claros</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-option" data-value="dark">
                            <div class="option-content">
                                <div class="option-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                    </svg>
                                </div>
                                <div class="option-text">
                                    <div class="option-title">Escuro</div>
                                    <div class="option-description">Conforto visual à noite com fundos escuros suaves</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insere o sheet antes da navbar
        const navbar = mainContent.querySelector('.navbar');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = sheetHTML;
        if (navbar) {
            mainContent.insertBefore(wrapper, navbar);
        } else {
            mainContent.appendChild(wrapper);
        }

        // Oculta navbar enquanto sheet aberto
        document.body.classList.add('modal-open');

        // Listeners do sheet
        const closeBtn = document.getElementById('closeAppearanceSheet');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAppearanceSheet(wrapper));
        }

        // Botão alterar foto
        const changePhotoBtn = document.getElementById('changePhotoBtn');
        if (changePhotoBtn) {
            changePhotoBtn.addEventListener('click', () => this.changePhoto());
        }
        // Input nome (debounce simples)
        const userNameInput = document.getElementById('userName');
        if (userNameInput) {
            userNameInput.addEventListener('input', (e) => this.updateUserName(e.target.value));
        }
        // Tema: abre modal
        const themeButton = document.getElementById('themeButton');
        if (themeButton) {
            themeButton.addEventListener('click', () => this.showModal('themeModal'));
        }
        // Fecha modal tema
        const closeThemeModal = document.getElementById('closeThemeModal');
        if (closeThemeModal) {
            closeThemeModal.addEventListener('click', () => this.hideModal('themeModal'));
        }
        // Opções modal tema
        this.attachModalOptions();

        // Focus ao abrir
        const title = document.querySelector('#appearanceSheet .sheet-title');
        if (title) {
            title.setAttribute('tabindex', '-1');
            title.focus();
        }
    }

    closeAppearanceSheet(wrapper) {
        if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
        }
        // Mostra navbar novamente
        document.body.classList.remove('modal-open');
    }

    reattachNavbarEvents() {
        // Remove event listeners anteriores para evitar conflitos
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
        });

        // Reanexa os event listeners da navbar
        const newNavItems = document.querySelectorAll('.nav-item');
        newNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                if (item.dataset.tab === 'home') {
                    this.app.goBackToHome();
                } else {
                    this.app.navigateToTab(item);
                }
            });
        });
    }

    async updateUserName(name) {
        this.currentSettings.userName = name;
        localStorage.setItem('coreUserName', name);
        // Atualiza o nome na saudação
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = name;
        }
    }

    async changePhoto() {
        // Cria input de arquivo para selecionar foto
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const photoData = e.target.result;
                    this.currentSettings.userPhoto = photoData;
                    localStorage.setItem('coreUserPhoto', photoData);
                    // Atualiza a foto na interface
                    const profilePhoto = document.getElementById('profilePhoto');
                    if (profilePhoto) {
                        profilePhoto.innerHTML = `<img src="${photoData}" alt="Foto do perfil" />`;
                    }
                    // Atualiza a foto na saudação
                    const headerPhoto = document.querySelector('.user-photo');
                    if (headerPhoto) {
                        headerPhoto.innerHTML = `<img src="${photoData}" alt="Foto do perfil" />`;
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    async updateTheme(theme) {
        this.currentSettings.theme = theme;
        localStorage.setItem('coreTheme', theme);
        // Aplica o tema automaticamente
        this.applyTheme(theme);
    }

    async updateAccentColor(accent) {
        this.currentSettings.accentColor = accent;
        localStorage.setItem('coreAccentColor', accent);
        this.applyAccentColor(accent);
    }

    applyAccentColor(accent) {
        const root = document.documentElement;
        const accentColors = {
            'indigo': { 
                main: '#6366f1', 
                light: '#818cf8', 
                dark: '#4f46e5',
                rgb: '99, 102, 241'
            },
            'blue': { 
                main: '#3b82f6', 
                light: '#60a5fa', 
                dark: '#2563eb',
                rgb: '59, 130, 246'
            },
            'emerald': { 
                main: '#10b981', 
                light: '#34d399', 
                dark: '#059669',
                rgb: '16, 185, 129'
            },
            'purple': { 
                main: '#8b5cf6', 
                light: '#a78bfa', 
                dark: '#7c3aed',
                rgb: '139, 92, 246'
            },
            'pink': { 
                main: '#ec4899', 
                light: '#f472b6', 
                dark: '#db2777',
                rgb: '236, 72, 153'
            },
            'orange': { 
                main: '#f97316', 
                light: '#fb923c', 
                dark: '#ea580c',
                rgb: '249, 115, 22'
            }
        };

        const colors = accentColors[accent] || accentColors.indigo;
        
        // Atualiza todas as variáveis de cor de acento
        root.style.setProperty('--accent-color', colors.main);
        root.style.setProperty('--accent-secondary', colors.light);
        root.style.setProperty('--accent-rgb', colors.rgb);
        root.style.setProperty('--primary-color', colors.main);
        root.style.setProperty('--primary-light', colors.light);
        root.style.setProperty('--primary-dark', colors.dark);
        
        // Salva no localStorage
        localStorage.setItem('coreAccentColor', accent);
    }

    // Recupera a cor de acento salva
    getStoredAccent() {
        return localStorage.getItem('coreAccentColor') || 'indigo';
    }

    // Atualiza a cor de acento
    updateAccentColor(accentColor) {
        this.applyAccentColor(accentColor);
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
            // Tema escuro premium (cores consistentes com App.js)
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
    }

    applySettingsAnimations() {
        // Aplica animação JS apenas para os cards, header usa animação CSS slideInLeft
        const card = document.querySelector('.settings-card');
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'none';
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }
        // O header .settings-header já recebe slideInLeft via CSS
    }
}

// Exporta a classe para uso global
window.SettingsModule = SettingsModule;