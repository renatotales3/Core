# 💰 Finance App - Authentication Flow

App de finanças desenvolvido com React Native + Expo seguindo design system dark customizado.

## 🎨 Design System

O app segue um design system próprio baseado em:
- **Fundo preto absoluto** (`#000000`)
- **Cards contrastantes** (cinza escuro `#1A1A1A`, `#2A2A2A`)
- **Cores de destaque personalizáveis** (azul royal `#4F46E5` como principal)
- **Tipografia hierárquica** clara
- **Componentes reutilizáveis** (Button, Input, Card)

## 🚀 Como Rodar

### Método 1: Scripts NPM
```bash
cd finance-app

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run start        # Servidor completo (mobile + web)
npm run start:web     # Apenas web
npm run start:tunnel  # Com tunnel para acesso externo
```

### Método 2: Script de Desenvolvimento
```bash
cd finance-app

# Usar o script personalizado
./dev.sh start        # Servidor completo
./dev.sh web          # Apenas web  
./dev.sh clear        # Com cache limpo
./dev.sh info         # Ver todos os comandos
```

### Método 3: Expo CLI Direto
```bash
cd finance-app
npx expo start        # Servidor completo
npx expo start --web  # Apenas web
npx expo start --clear # Limpar cache
```

## 🌐 Como Testar

### No Navegador Web
1. Execute `npm run start:web` ou `./dev.sh web`
2. Acesse: **http://localhost:8081**
3. Use a barra debug no topo para navegar entre telas

### No Celular (Expo Go)
1. Execute `npm start` ou `./dev.sh start`
2. Baixe o app **Expo Go** na Play Store/App Store
3. Escaneie o QR code que aparece no terminal
4. O app carregará automaticamente no seu celular

### Emulador Android/iOS
1. Configure um emulador no Android Studio ou Xcode
2. Execute `npm start` 
3. Pressione `a` para Android ou `i` para iOS no terminal

## 📱 Telas Implementadas

### 🔐 Fluxo de Autenticação

1. **LoginScreen** - Tela de login/cadastro
   - Input de email com validação
   - Botão de continuar com loading
   - Opções sociais (Google, Apple)

2. **PersonalInfoScreen** - Informações pessoais  
   - Nome completo e sobrenome
   - Telefone com código do país
   - Gênero (dropdown)
   - Data de nascimento

3. **OTPScreen** - Verificação de código
   - 6 inputs para código OTP
   - Auto-focus entre campos
   - Timer de reenvio (60 segundos)
   - Input destacado (campo ativo)

4. **EmailSentScreen** - Email enviado
   - Confirmação visual de envio
   - Botão "Send again" 
   - Link "Need help?"

5. **LocationPermissionScreen** - Permissão de localização
   - Ícone ilustrativo
   - Explicação clara
   - Botões "Grant Permission" e "Maybe Later"

## 🎯 Funcionalidades de Debug

- **Barra de navegação debug** no topo para testar todas as telas
- **Hot reload** automático ao salvar arquivos
- **Error overlay** mostra erros em tempo real
- **Console logs** aparecem no terminal

## 🏗️ Estrutura do Projeto

```
finance-app/
├── src/
│   ├── features/
│   │   └── auth/
│   │       └── screens/           # Telas de autenticação
│   ├── shared/
│   │   ├── ui/                   # Componentes reutilizáveis  
│   │   └── theme/               # Tokens de design
│   └── types/                   # TypeScript types
├── assets/                      # Imagens e ícones
├── app.json                    # Configuração Expo
├── metro.config.js             # Configuração Metro bundler
└── dev.sh                      # Script de desenvolvimento
```

## 🧩 Componentes Base

### Button
- **3 variantes**: primary, secondary, ghost
- **3 tamanhos**: sm (40px), md (56px), lg (64px)
- **Estados**: loading, disabled, fullWidth
- **Acessibilidade**: touchable feedback, screen reader support

### Input
- **Labels e hints** opcionais
- **Estados de erro** com mensagens
- **Ícones laterais** (esquerda/direita)
- **Focus effects** com destaque visual
- **Validação visual** em tempo real

### Card  
- **3 variantes**: primary, secondary, elevated
- **Sombras adaptativas** (iOS/Android)
- **Padding configurável**
- **Bordas arredondadas** consistentes

## 🎨 Tokens de Design

### Cores Principais
```typescript
colors: {
  background: '#000000',      // Preto absoluto
  surface: '#1A1A1A',        // Cards principais
  elevated: '#2A2A2A',       // Cards em destaque
  accent: '#4F46E5',         // Azul royal (customizável)
  text: {
    primary: '#FFFFFF',       // Texto principal
    secondary: '#B3B3B3',     // Texto secundário
    tertiary: '#808080',      // Placeholders
  }
}
```

### Espaçamentos (Grid 8px)
```typescript
spacing: {
  xs: 4,   sm: 8,   md: 16,
  lg: 24,  xl: 32,  xxl: 48
}
```

### Tipografia
```typescript
fontSize: {
  xs: 12,   sm: 14,   md: 16,   lg: 18,
  xl: 20,   '2xl': 24, '3xl': 32, '4xl': 48
}
```

## 🛠️ Desenvolvimento

### Comandos Úteis
```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Limpar cache Metro
npx expo start --clear

# Build para web
npx expo export --platform web

# Instalar nova dependência
npx expo install <package-name>
```

### Hot Reload
- **Salvou um arquivo?** → Recarrega automaticamente
- **Mudou tema/tokens?** → Todos os componentes atualizam
- **Erro de sintaxe?** → Overlay de erro aparece na tela

### Debug Tips
- **Console.log** aparece no terminal
- **Pressione 'j'** no terminal para abrir debugger
- **Pressione 'r'** para reload manual
- **Pressione 'm'** para menu de desenvolvimento

## ✅ Status do Projeto

### Implementado ✅
- [x] Design system completo com tokens
- [x] Componentes base (Button, Input, Card)
- [x] 5 telas de autenticação funcionais  
- [x] Estados de loading, erro e foco
- [x] Navegação debug para testes
- [x] Layout responsivo + dark theme
- [x] TypeScript com tipagem completa
- [x] Hot reload e development tools

### Em Desenvolvimento 🚧  
- [ ] Navegação real (React Navigation)
- [ ] Validação de formulários (React Hook Form)
- [ ] Estados globais (Context/Zustand)
- [ ] Integração com APIs
- [ ] Testes unitários (Jest)

### Próximas Features 🔮
- [ ] Dashboard principal
- [ ] Transações (CRUD)
- [ ] Gráficos e relatórios
- [ ] Configurações do usuário
- [ ] Notificações push

## 🚨 Troubleshooting

### App não carrega no web?
```bash
./dev.sh clear  # Limpa cache e reinicia
```

### Erro de dependência?
```bash
./dev.sh reset  # Reset completo do projeto
```

### QR Code não funciona no celular?
```bash
./dev.sh tunnel  # Usa tunnel para acesso externo
```

### TypeScript reclamando?
```bash
npx tsc --noEmit  # Verifica erros de tipo
```

---

**🔥 O app está 100% configurado e funcionando!** 

- **Web**: http://localhost:8081
- **Mobile**: Escaneie o QR code
- **Debug**: Navegue pelas telas usando a barra no topo

**Comandos rápidos para começar:**
```bash
cd finance-app
./dev.sh web     # Para testar no navegador
./dev.sh start   # Para mobile + web
./dev.sh info    # Para ver todos os comandos
```