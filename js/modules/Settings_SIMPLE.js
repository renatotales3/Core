// Settings Module - Versão Simplificada (SEM SecureStorage)
class SettingsModule {
    constructor(app) {
        this.app = app;
        this.init();
    }

    init() {
        console.log('⚙️ Settings Module inicializado');
    }

    updateUserName() {
        const nameInput = document.getElementById('userName');
        if (nameInput && nameInput.value.trim() !== '') {
            const name = nameInput.value.trim();
            window.app.updateUserName(name);
            console.log('📝 Nome atualizado via Settings:', name);
        }
    }

    changePhoto() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const photoData = event.target.result;
                    window.app.updateUserPhoto(photoData);
                    
                    // Atualizar preview nas configurações
                    const preview = document.getElementById('photoPreview');
                    if (preview) {
                        preview.src = photoData;
                        preview.style.display = 'block';
                    }
                    
                    console.log('📸 Foto alterada via Settings');
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    }

    updateTheme(theme) {
        window.app.applyTheme(theme);
        console.log('🎨 Tema atualizado via Settings:', theme);
    }

    // Métodos de renderização mantidos para compatibilidade
    getThemeDisplayName(theme) {
        const themes = {
            'light': 'Claro',
            'dark': 'Escuro'
        };
        return themes[theme] || 'Claro';
    }

    async renderSettingsTab() {
        console.log('🎨 Renderizando aba de configurações...');
        
        const mainContent = document.querySelector('.app-container');
        if (!mainContent) return;

        const userData = window.app.userData;

        const settingsHTML = `
            <div class="settings-container">
                <div class="settings-header">
                    <h1 class="settings-title">Ajustes</h1>
                </div>

                <div class="settings-card" id="cardAppearance">
                    <div class="settings-card-main">
                        <div class="settings-card-title">Aparência</div>
                        <div class="settings-card-description">Foto, nome e visual do app</div>
                    </div>
                    <div class="settings-card-action">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7"/>
                        </svg>
                    </div>
                </div>
            </div>
        `;

        // Inserir antes da navbar
        const navbar = mainContent.querySelector('.navbar');
        if (navbar) {
            const settingsWrapper = document.createElement('div');
            settingsWrapper.innerHTML = settingsHTML;
            mainContent.insertBefore(settingsWrapper, navbar);

            // Remover conteúdo anterior (exceto navbar)
            const siblings = Array.from(mainContent.children);
            for (const child of siblings) {
                if (child !== navbar && child !== settingsWrapper) {
                    mainContent.removeChild(child);
                }
            }
        }

        // Event listeners
        const cardAppearance = document.getElementById('cardAppearance');
        if (cardAppearance) {
            cardAppearance.addEventListener('click', () => this.renderAppearanceSheet());
        }

        this.reattachNavbarEvents();
    }

    renderAppearanceSheet() {
        const mainContent = document.querySelector('.app-container');
        if (!mainContent) return;

        const userData = window.app.userData;

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
                                        ${userData.photo ? 
                                            `<img src="${userData.photo}" alt="Foto do perfil" />` : 
                                            `<svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                            </svg>`
                                    </div>
                                    <button class="change-photo-btn" id="changePhotoBtn">Alterar Foto</button>
                                </div>
                                <div class="profile-info">
                                    <div class="input-group">
                                        <label for="userName">Nome</label>
                                        <input type="text" id="userName" value="${userData.name || ''}" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="settings-section">
                            <h3 class="section-title">Visual</h3>
                            <div class="input-group">
                                <label for="theme">Aparência</label>
                                <button class="select-button" id="themeButton">
                                    <span class="select-value">${this.getThemeDisplayName(userData.theme)}</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de Seleção de Aparência -->
            <div class="modal-overlay" id="themeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Selecionar Aparência</h3>
                        <button class="modal-close" id="closeThemeModal">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-option" data-value="light">
                            <div class="option-content">
                                <div class="option-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="5" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                                    </svg>
                                </div>
                                <div class="option-text">
                                    <div class="option-title">Claro</div>
                                    <div class="option-description">Visual limpo com alto contraste</div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-option" data-value="dark">
                            <div class="option-content">
                                <div class="option-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                    </svg>
                                </div>
                                <div class="option-text">
                                    <div class="option-title">Escuro</div>
                                    <div class="option-description">Conforto visual noturno</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inserir sheet
        const navbar = mainContent.querySelector('.navbar');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = sheetHTML;
        if (navbar) {
            mainContent.insertBefore(wrapper, navbar);
        }

        document.body.classList.add('modal-open');

        // Event listeners
        this.attachSheetListeners(wrapper);
    }

    attachSheetListeners(wrapper) {
        // Fechar sheet
        const closeBtn = document.getElementById('closeAppearanceSheet');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAppearanceSheet(wrapper));
        }

        // Alterar foto
        const changePhotoBtn = document.getElementById('changePhotoBtn');
        if (changePhotoBtn) {
            changePhotoBtn.addEventListener('click', () => this.changePhoto());
        }

        // Input nome
        const userNameInput = document.getElementById('userName');
        if (userNameInput) {
            userNameInput.addEventListener('input', () => this.updateUserName());
        }

        // Botão tema
        const themeButton = document.getElementById('themeButton');
        if (themeButton) {
            themeButton.addEventListener('click', () => this.showModal('themeModal'));
        }

        // Modal tema
        const closeThemeModal = document.getElementById('closeThemeModal');
        if (closeThemeModal) {
            closeThemeModal.addEventListener('click', () => this.hideModal('themeModal'));
        }

        // Opções de tema
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
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
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

    closeAppearanceSheet(wrapper) {
        if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
        }
        document.body.classList.remove('modal-open');
    }

    reattachNavbarEvents() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                if (tab === 'home' || tab === 'dashboard') {
                    window.app.navigateToTab('dashboard');
                } else {
                    window.app.navigateToTab(tab);
                }
            });
        });
    }
}

// Exportar para uso global
window.SettingsModule = SettingsModule;
