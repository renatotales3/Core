// Settings Module - Gerencia a aba de ajustes
class SettingsModule {
    constructor(app) {
        this.app = app;
        this.currentSettings = {};
        this.originalContent = null;
        this.init();
    }

    init() {
        this.loadSettings();
    }

    loadSettings() {
        // Carrega configurações salvas ou usa padrões
        this.currentSettings = {
            userName: this.app.modules.storage.getItem('coreUserName') || 'Renato',
            userPhoto: this.app.modules.storage.getItem('coreUserPhoto') || null,
            theme: this.app.modules.storage.getItem('coreTheme') || 'light'
        };
    }

    getThemeDisplayName(theme) {
        const themes = {
            'light': 'Claro',
            'dark': 'Escuro'
        };
        return themes[theme] || 'Claro';
    }

    renderSettingsTab() {
        // Cria a interface da aba de ajustes
        const mainContent = document.querySelector('.app-container');
        if (!mainContent) return;

        // Salva o conteúdo original para poder voltar
        if (!this.originalContent) {
            this.originalContent = mainContent.innerHTML;
        }

        const settingsHTML = `
            <div class="settings-container">
                <!-- Header da aba de ajustes -->
                <div class="settings-header">
                    <h1 class="settings-title">Ajustes</h1>
                </div>

                <!-- Seção de Perfil -->
                <div class="settings-section">
                    <h2 class="section-title">Perfil</h2>
                    
                    <div class="profile-section">
                        <div class="profile-photo-container">
                            <div class="profile-photo" id="profilePhoto">
                                ${this.currentSettings.userPhoto ? 
                                    `<img src="${this.currentSettings.userPhoto}" alt="Foto do perfil" />` : 
                                    `<svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                                    </svg>`
                                }
                            </div>
                            <button class="change-photo-btn" id="changePhotoBtn">
                                Alterar Foto
                            </button>
                        </div>
                        
                        <div class="profile-info">
                            <div class="input-group">
                                <label for="userName">Nome</label>
                                <input type="text" id="userName" value="${this.currentSettings.userName}" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Seção de Aparência -->
                <div class="settings-section">
                    <h2 class="section-title">Aparência</h2>
                    
                    <div class="input-group">
                        <label for="theme">Tema</label>
                        <button class="select-button" id="themeButton">
                            <span class="select-value">${this.getThemeDisplayName(this.currentSettings.theme)}</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal de Seleção de Tema -->
            <div class="modal-overlay" id="themeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Selecionar Tema</h3>
                        <button class="modal-close" id="closeThemeModal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-option" data-value="light">
                            <div class="option-content">
                                <div class="option-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                </div>
                                <div class="option-text">
                                    <div class="option-title">Claro</div>
                                    <div class="option-description">Tema claro padrão</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-option" data-value="dark">
                            <div class="option-content">
                                <div class="option-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2"/>
                                    </svg>
                                </div>
                                <div class="option-text">
                                    <div class="option-title">Escuro</div>
                                    <div class="option-description">Tema escuro</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Substitui apenas a área acima da navbar mantendo o nó da navbar intacto
        const navbar = mainContent.querySelector('.navbar');
        if (navbar) {
            const settingsWrapper = document.createElement('div');
            settingsWrapper.innerHTML = settingsHTML;

            // Insere o conteúdo de ajustes antes da navbar sem recriá-la
            mainContent.insertBefore(settingsWrapper, navbar);

            // Remove quaisquer seções antigas (anteriores à navbar) mantendo a navbar intacta
            const siblings = Array.from(mainContent.children);
            for (const child of siblings) {
                if (child !== navbar && child !== settingsWrapper) {
                    mainContent.removeChild(child);
                }
            }
        } else {
            mainContent.innerHTML = settingsHTML;
        }

        // Anexa os event listeners
        this.attachEventListeners();
        
        // Scroll para o topo
        window.scrollTo(0, 0);
    }

    attachEventListeners() {
        // Botão alterar foto
        const changePhotoBtn = document.getElementById('changePhotoBtn');
        if (changePhotoBtn) {
            changePhotoBtn.addEventListener('click', () => this.changePhoto());
        }

        // Input nome
        const userNameInput = document.getElementById('userName');
        if (userNameInput) {
            userNameInput.addEventListener('change', (e) => this.updateUserName(e.target.value));
        }

        // Botão de seleção de tema
        const themeButton = document.getElementById('themeButton');
        if (themeButton) {
            themeButton.addEventListener('click', () => this.showModal('themeModal'));
        }

        // Botão de fechar modal
        const closeThemeModal = document.getElementById('closeThemeModal');
        if (closeThemeModal) {
            closeThemeModal.addEventListener('click', () => this.hideModal('themeModal'));
        }

        // Opções do modal
        this.attachModalOptions();
    }

    attachModalOptions() {
        // Opções do modal de tema
        const themeOptions = document.querySelectorAll('#themeModal .modal-option');
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                this.updateTheme(value);
                this.hideModal('themeModal');
                this.updateThemeButton(value);
            });
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            document.body.classList.add('modal-open');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
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

    updateThemeButton(theme) {
        const button = document.getElementById('themeButton');
        if (button) {
            const valueSpan = button.querySelector('.select-value');
            if (valueSpan) {
                valueSpan.textContent = this.getThemeDisplayName(theme);
            }
        }
    }

    reattachNavbarEvents() {
        // A navbar já existe e mantém event listeners. Nada a fazer aqui.
    }

    updateUserName(name) {
        this.currentSettings.userName = name;
        this.app.modules.storage.setItem('coreUserName', name);
        
        // Atualiza o nome na saudação
        const userNameElement = document.querySelector('.user-name');
        if (userNameElement) {
            userNameElement.textContent = name;
        }
    }

    changePhoto() {
        // Cria input de arquivo para selecionar foto
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const photoData = e.target.result;
                    this.currentSettings.userPhoto = photoData;
                    this.app.modules.storage.setItem('coreUserPhoto', photoData);
                    
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

    updateTheme(theme) {
        this.currentSettings.theme = theme;
        this.app.modules.storage.setItem('coreTheme', theme);
        
        // Aplica o tema automaticamente
        this.applyTheme(theme);
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
            // Tema escuro
            root.style.setProperty('--text-primary', '#f9fafb');
            root.style.setProperty('--text-secondary', '#d1d5db');
            root.style.setProperty('--background-primary', '#1f2937');
            root.style.setProperty('--background-secondary', '#111827');
            root.style.setProperty('--background-tertiary', '#374151');
        } else {
            // Tema claro
            root.style.setProperty('--text-primary', '#1f2937');
            root.style.setProperty('--text-secondary', '#6b7280');
            root.style.setProperty('--background-primary', '#ffffff');
            root.style.setProperty('--background-secondary', '#f9fafb');
            root.style.setProperty('--background-tertiary', '#f3f4f6');
        }
    }
}

// Exporta a classe para uso global
window.SettingsModule = SettingsModule;