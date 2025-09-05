// Settings Module - VERSÃO ULTRA SIMPLIFICADA
class SettingsModule {
    constructor() {
        this.userData = {
            name: '',
            photo: '',
            theme: 'light'
        };
        this.loadUserData();
    }

    loadUserData() {
        console.log('📋 Carregando dados do usuário...');
        try {
            const savedData = localStorage.getItem('coreUserData');
            if (savedData) {
                this.userData = { ...this.userData, ...JSON.parse(savedData) };
                console.log('✅ Dados carregados:', this.userData);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
        }
    }

    saveUserData() {
        try {
            localStorage.setItem('coreUserData', JSON.stringify(this.userData));
            console.log('💾 Dados salvos:', this.userData);
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
            return false;
        }
    }

    render() {
        return `
            <div class="settings-container">
                <div class="settings-header">
                    <h1>Configurações</h1>
                </div>
                
                <div class="settings-card">
                    <h3>👤 Perfil</h3>
                    <div class="profile-section">
                        <div class="photo-container">
                            <img id="photoPreview" src="${this.userData.photo || ''}" 
                                 style="width:80px;height:80px;border-radius:50%;object-fit:cover;${!this.userData.photo ? 'display:none' : ''}" />
                            <div id="photoPlaceholder" style="width:80px;height:80px;border-radius:50%;background:#ddd;display:flex;align-items:center;justify-content:center;${this.userData.photo ? 'display:none' : ''}">📷</div>
                        </div>
                        <button onclick="settingsModule.changePhoto()">Alterar Foto</button>
                    </div>
                    
                    <div class="name-section">
                        <label>Nome:</label>
                        <input type="text" id="userName" value="${this.userData.name}" 
                               onchange="settingsModule.updateUserName()" />
                    </div>
                </div>

                <div class="settings-card">
                    <h3>🎨 Aparência</h3>
                    <div class="theme-section">
                        <label>Tema:</label>
                        <select id="themeSelect" onchange="settingsModule.updateTheme()">
                            <option value="light" ${this.userData.theme === 'light' ? 'selected' : ''}>Claro</option>
                            <option value="dark" ${this.userData.theme === 'dark' ? 'selected' : ''}>Escuro</option>
                        </select>
                    </div>
                </div>

                <div class="settings-card">
                    <h3>🔄 Ações</h3>
                    <button onclick="settingsModule.clearAllData()" style="background:red;color:white;">Limpar Todos os Dados</button>
                </div>
            </div>
        `;
    }

    updateUserName() {
        const nameInput = document.getElementById('userName');
        if (nameInput) {
            this.userData.name = nameInput.value.trim();
            this.saveUserData();
            window.app.userData = this.userData; // Sincronizar com App
            console.log('📝 Nome atualizado:', this.userData.name);
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
                    this.userData.photo = photoData;
                    this.saveUserData();
                    window.app.userData = this.userData; // Sincronizar com App
                    
                    // Atualizar preview
                    const preview = document.getElementById('photoPreview');
                    const placeholder = document.getElementById('photoPlaceholder');
                    if (preview && placeholder) {
                        preview.src = photoData;
                        preview.style.display = 'block';
                        placeholder.style.display = 'none';
                    }
                    console.log('📸 Foto atualizada');
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    }

    updateTheme() {
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            this.userData.theme = themeSelect.value;
            this.saveUserData();
            window.app.userData = this.userData; // Sincronizar com App
            window.app.applyTheme(this.userData.theme);
            console.log('🎨 Tema atualizado:', this.userData.theme);
        }
    }

    clearAllData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            localStorage.clear();
            this.userData = { name: '', photo: '', theme: 'light' };
            window.app.userData = this.userData;
            window.app.applyTheme('light');
            location.reload();
        }
    }
}

// Instância global
window.settingsModule = new SettingsModule();
