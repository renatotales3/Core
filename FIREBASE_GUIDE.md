# 🚀 Guia Visual: Configuração Completa do Firebase

## 📋 Checklist Rápido

- [ ] Criar projeto Firebase
- [ ] Configurar Authentication
- [ ] Configurar Firestore
- [ ] Obter credenciais
- [ ] Configurar .env
- [ ] Testar integração

---

## 🎯 PASSO 1: Criar Projeto Firebase

### 1.1 Acesse o Firebase Console
```
https://console.firebase.google.com/
```

### 1.2 Clique em "Criar um projeto"
- Localize o botão azul "Criar um projeto" ou "Add project"
- Se já tiver projetos, clique no "+" no topo

### 1.3 Configure o projeto
```
Nome do projeto: Core Finance
Google Analytics: Habilitado (recomendado)
```

### 1.4 Aguarde a criação
- O Firebase pode levar 1-2 minutos para criar o projeto
- Você verá uma tela de progresso

---

## 🔐 PASSO 2: Configurar Authentication

### 2.1 Acesse Authentication
- No menu lateral esquerdo, clique em **"Authentication"**

### 2.2 Vá para Sign-in method
- Clique na aba **"Sign-in method"**

### 2.3 Habilite Email/Password
- Na lista de providers, localize **"Email/Password"**
- Clique no botão toggle (desligado → ligado)
- Uma modal aparecerá - clique em **"Enable"**

### 2.4 (Opcional) Configure templates de email
- Ainda na aba "Sign-in method", role para baixo
- Configure templates para:
  - Email verification
  - Password reset
  - Account linking

---

## 🗄️ PASSO 3: Configurar Firestore Database

### 3.1 Acesse Firestore
- No menu lateral, clique em **"Firestore Database"**

### 3.2 Crie o banco de dados
- Clique em **"Criar banco de dados"**

### 3.3 Escolha o modo
- Selecione **"Iniciar no modo de teste"**
- ⚠️ **IMPORTANTE:** Para produção, mude para "Iniciar no modo de produção"

### 3.4 Escolha a localização
```
Para Brasil: southamerica-east1 (São Paulo)
Para outros países: us-central (Iowa) ou europe-west (London)
```

### 3.5 Conclua
- Clique em **"Concluído"**
- Aguarde a criação do banco

---

## 🔑 PASSO 4: Obter Credenciais

### 4.1 Acesse Project Settings
- No menu lateral, clique no ícone ⚙️ **"Project settings"**

### 4.2 Vá para "Your apps"
- Role até a seção **"Your apps"**

### 4.3 Adicione um app web
- Clique em **"Add app"**
- Selecione o ícone **"</>"** (Web app)

### 4.4 Configure o app
```
App nickname: Core Finance Web
Also set up Firebase Hosting: (opcional)
```

### 4.5 Registre o app
- Clique em **"Register app"**

### 4.6 **COPIE AS CREDENCIAIS**
- Uma tela com código JavaScript aparecerá
- **COPIE TODO O CONTEÚDO** do objeto `firebaseConfig`
- Exemplo:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_your_api_key_here",
  authDomain: "core-finance-12345.firebaseapp.com",
  projectId: "core-finance-12345",
  storageBucket: "core-finance-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};
```

### 4.7 Conclua
- Clique em **"Continue to console"**

---

## ⚙️ PASSO 5: Configurar .env

### 5.1 Copie o arquivo de exemplo
```bash
cp .env.example .env
```

### 5.2 Edite o arquivo .env
- Abra o arquivo `.env` no seu editor
- Substitua os valores com as credenciais copiadas:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC_your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=core-finance-12345.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=core-finance-12345
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=core-finance-12345.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

### 5.3 Verifique a configuração
```bash
node scripts/check-firebase.js
```

---

## 🧪 PASSO 6: Testar a Integração

### 6.1 Execute o app
```bash
npm start
```

### 6.2 Teste o fluxo completo
1. **Onboarding**: Clique em "Começar"
2. **Registro**: Crie uma conta
3. **Login**: Faça login
4. **Dashboard**: Verifique se entrou

### 6.3 Verifique o Firebase Console
- Authentication → Users (deve aparecer seu usuário)
- Firestore → Data (devem aparecer as categorias criadas)

---

## 🔧 Configurações Avançadas

### Regras de Segurança (Produção)
Após testar, configure regras mais seguras:

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Apenas usuários autenticados podem ler/escrever
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Analytics (Opcional)
- Vá para Analytics no menu lateral
- Configure eventos personalizados
- Monitore uso do app

---

## 🚨 Solução de Problemas

### ❌ "Firebase: Error (auth/invalid-api-key)"
- Verifique se a API_KEY está correta
- Certifique-se de não ter espaços extras

### ❌ "Firebase: Error (auth/project-not-found)"
- Confirme se o PROJECT_ID está correto
- Verifique se o projeto existe

### ❌ "Missing or insufficient permissions"
- Verifique as regras do Firestore
- Certifique-se de que está logado

### ❌ App não conecta
- Reinicie o Metro: `npm start --clear`
- Verifique se as variáveis começam com `EXPO_PUBLIC_`

---

## 📱 Preparação para Mobile (EAS Build)

### Quando for publicar:

1. **Adicione apps nativos:**
   - Project Settings → Your apps
   - Add app → iOS/Android
   - Use os bundle IDs do `app.json`

2. **Baixe arquivos de configuração:**
   - iOS: `GoogleService-Info.plist`
   - Android: `google-services.json`

3. **Configure no EAS:**
   - Adicione os arquivos aos diretórios corretos
   - Configure credenciais no painel EAS

---

## 🎉 Conclusão

Após seguir todos os passos:

✅ Firebase configurado
✅ Authentication funcionando
✅ Firestore pronto
✅ App integrado
✅ Pronto para desenvolvimento!

**Próximos passos sugeridos:**
1. Implementar dashboard financeiro
2. Sistema de transações
3. Relatórios e gráficos
4. Sincronização offline