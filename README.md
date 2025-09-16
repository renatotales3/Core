# Core Finance 💰

Aplicativo moderno de gestão financeira pessoal construído com React Native, Expo e Firebase.

## ✨ Funcionalidades

- 🔐 **Autenticação Segura**
  - Login com email/senha
  - Login com Google
  - Reset de senha
  - Registro de novos usuários

- 📊 **Gestão Financeira**
  - Controle de receitas e despesas
  - Categorização de transações
  - Relatórios e análises
  - Metas financeiras

- 🎨 **Interface Moderna**
  - Design system profissional
  - Ícones vetoriais (Feather, MaterialIcons)
  - Tema responsivo
  - Animações suaves

## 🚀 Configuração

### 1. Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Conta no Firebase

### 2. Instalação

```bash
# Clone o repositório
git clone https://github.com/renatotales3/Core.git
cd Core

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

### 3. Configuração do Firebase

O projeto já está configurado com as credenciais do Firebase:

```env
# Firebase Configuration (✅ CONFIGURADO)
Project ID: core-004587
Auth Domain: core-004587.firebaseapp.com
```

#### Para habilitar Google Sign-In:

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Authentication** → **Sign-in method**
3. Habilite **Google** e copie o **Web Client ID**
4. No arquivo `.env`, substitua:

```env
EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=SEU_WEB_CLIENT_ID_AQUI
```

📖 **Documentação completa:** [docs/GOOGLE_SIGNIN_SETUP.md](docs/GOOGLE_SIGNIN_SETUP.md)

## 🛠 Tecnologias

- **Frontend:** React Native + Expo SDK 54
- **Navegação:** Expo Router (file-based routing)
- **Estado:** React Context API
- **Backend:** Firebase Auth + Firestore
- **Ícones:** @expo/vector-icons (Feather, MaterialIcons, AntDesign)
- **Tipagem:** TypeScript
- **Validação:** Yup
- **Autenticação Social:** @react-native-google-signin/google-signin

## 📱 Plataformas Suportadas

- ✅ **Web** (desenvolvimento e produção)
- ✅ **iOS** (Expo Go e build nativo)
- ✅ **Android** (Expo Go e build nativo)

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o Expo Metro Bundler
npm run web           # Inicia apenas para web
npm run ios           # Inicia para iOS (requer Xcode)
npm run android       # Inicia para Android (requer Android Studio)

# Testes
npm run test          # Executa testes
npm run type-check    # Verifica tipos TypeScript
node scripts/test-firebase.js  # Testa configuração do Firebase

# Build
npm run build         # Build para produção
```

## 📂 Estrutura do Projeto

```
Core/
├── app/                    # Telas (Expo Router)
│   ├── (auth)/            # Autenticação
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── reset-password.tsx
│   ├── (tabs)/            # Navegação principal
│   └── _layout.tsx
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── ui/           # Sistema de design
│   │   └── forms/        # Componentes de formulário
│   ├── context/          # React Context
│   ├── services/         # APIs e serviços
│   │   ├── firebase.ts   # Configuração Firebase
│   │   ├── authService.ts
│   │   └── googleAuthService.ts
│   ├── constants/        # Tema e constantes
│   ├── types/           # Tipos TypeScript
│   └── utils/           # Utilitários
├── docs/               # Documentação
└── scripts/           # Scripts de automação
```

## 🎨 Design System

### Cores Principais
- **Primary:** #0EA5E9 (Azul moderno)
- **Success:** #10B981 (Verde)
- **Error:** #EF4444 (Vermelho)
- **Background:** #FFFFFF (Branco)

### Componentes UI
- `Button` - Botões com variantes (primary, secondary, social)
- `Input` - Inputs com ícones e validação
- `Icon` - Sistema centralizado de ícones
- `Card` - Containers com sombra e border-radius

## 🔒 Segurança

- ✅ Validação client-side com Yup
- ✅ Autenticação Firebase Auth
- ✅ Regras de segurança Firestore
- ✅ Sanitização de inputs
- ✅ Headers de segurança

## 📊 Status do Projeto

- ✅ **Autenticação:** Login, registro, Google Sign-In
- ✅ **UI/UX:** Design system moderno
- ✅ **Navegação:** Expo Router configurado
- 🚧 **Dashboard:** Em desenvolvimento
- 🚧 **Transações:** Planejado
- 🚧 **Relatórios:** Planejado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Renato Tales**
- GitHub: [@renatotales3](https://github.com/renatotales3)
- LinkedIn: [Renato Tales](https://linkedin.com/in/renato-tales)

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!