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

1. **Instalar dependências**:
   ```bash
   cd finance-app
   npm install
   ```

2. **Iniciar o servidor**:
   ```bash
   npm start
   ```

3. **Testar em diferentes plataformas**:
   - **Web**: Pressione `w` no terminal ou acesse http://localhost:19006
   - **Android**: Pressione `a` (precisa ter emulador)
   - **iOS**: Pressione `i` (apenas no macOS)
   - **Expo Go**: Escaneie o QR code no app Expo Go

## 📱 Telas Implementadas

### 🔐 Fluxo de Autenticação

1. **LoginScreen** - Tela de login/cadastro
   - Input de email
   - Botão de continuar
   - Opções sociais (Google, Apple)

2. **PersonalInfoScreen** - Informações pessoais  
   - Nome completo
   - Sobrenome
   - Telefone (com código do país)
   - Gênero (dropdown)
   - Data de nascimento

3. **OTPScreen** - Verificação de código
   - 6 inputs para código OTP
   - Timer de reenvio (60 segundos)
   - Auto-focus entre campos

4. **EmailSentScreen** - Email enviado
   - Confirmação de envio
   - Botão "Send again"
   - Link "Need help?"

5. **LocationPermissionScreen** - Permissão de localização
   - Ícone ilustrativo
   - Botões "Grant Permission" e "Maybe Later"

## 🎯 Navegação Debug

O app inclui uma barra de navegação debug no topo para testar todas as telas rapidamente.

## 🏗️ Estrutura do Projeto

```
src/
├── features/
│   └── auth/
│       └── screens/           # Telas de autenticação
├── shared/
│   ├── ui/                   # Componentes reutilizáveis
│   └── theme/               # Tokens de design
└── types/                   # TypeScript types
```

## 🧩 Componentes Base

- **Button**: 3 variantes (primary, secondary, ghost), loading states
- **Input**: Labels, erros, hints, ícones laterais, focus states
- **Card**: 3 variantes (primary, secondary, elevated)

## 🎨 Tokens de Design

### Cores
- **Background**: `#000000` (preto absoluto)
- **Cards**: `#1A1A1A` (primary), `#2A2A2A` (elevated)
- **Texto**: `#FFFFFF` (primary), `#B3B3B3` (secondary)
- **Accent**: `#4F46E5` (azul royal)

### Espaçamentos
- Base de 8px: `4, 8, 16, 24, 32, 48`

### Border Radius
- `8px` (pequeno), `16px` (padrão), `24px` (grande)

## ✅ Features Implementadas

- [x] Design system completo com tokens
- [x] Componentes base reutilizáveis
- [x] 5 telas de autenticação funcionais
- [x] Estados de loading e foco
- [x] Navegação debug para testes
- [x] Layout responsivo
- [x] TypeScript completo

## 🔜 Próximos Passos

1. **Navegação real** (React Navigation)
2. **Validação de formulários** (React Hook Form + Yup)
3. **Estados globais** (Zustand)
4. **API integration**
5. **Testes unitários** (Jest + Testing Library)

---

**🔥 O app está pronto para desenvolvimento das próximas features seguindo o design system estabelecido!**