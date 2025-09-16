# 📋 Checklist de Configuração do Firebase - Core Finance
# Siga este guia passo a passo para configurar completamente o Firebase

## ✅ PASSO 1: Criar Projeto no Firebase Console
- [ ] Acesse https://console.firebase.google.com/
- [ ] Clique em "Criar um projeto" ou "Add project"
- [ ] Nome do projeto: "Core Finance" (ou outro nome de sua preferência)
- [ ] Habilite o Google Analytics (opcional, mas recomendado)
- [ ] Escolha uma conta do Google Analytics
- [ ] Clique em "Criar projeto"
- [ ] Aguarde a criação (pode levar alguns minutos)

## ✅ PASSO 2: Configurar Authentication
- [ ] No menu lateral, clique em "Authentication"
- [ ] Clique na aba "Sign-in method"
- [ ] Procure "Email/Password" na lista
- [ ] Clique no botão de toggle para habilitar
- [ ] Confirme clicando em "Enable"
- [ ] (Opcional) Configure outras opções como:
  - Email verification
  - Password reset
  - Account linking

## ✅ PASSO 3: Configurar Firestore Database
- [ ] No menu lateral, clique em "Firestore Database"
- [ ] Clique em "Criar banco de dados"
- [ ] Escolha "Iniciar no modo de teste" (Start in test mode)
- [ ] Selecione a localização do banco:
  - Para usuários brasileiros: "southamerica-east1 (São Paulo)"
  - Para outros: "us-central" ou "europe-west"
- [ ] Clique em "Concluído"

## ✅ PASSO 4: Obter Credenciais do Projeto
- [ ] No menu lateral, clique no ícone de engrenagem ⚙️ "Project settings"
- [ ] Role até a seção "Your apps"
- [ ] Clique em "Add app" e selecione "</>" (Web app)
- [ ] Nome do app: "Core Finance Web"
- [ ] Marque "Also set up Firebase Hosting" (opcional)
- [ ] Clique em "Register app"
- [ ] **IMPORTANTE:** Copie as credenciais que aparecerão
- [ ] Clique em "Continue to console"

## ✅ PASSO 5: Configurar Credenciais no Projeto
- [ ] No seu projeto local, copie o arquivo `.env.example` para `.env`
- [ ] Preencha as variáveis com as credenciais copiadas:

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC... (apiKey)
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=core-finance-xxxx.firebaseapp.com (authDomain)
EXPO_PUBLIC_FIREBASE_PROJECT_ID=core-finance-xxxx (projectId)
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=core-finance-xxxx.appspot.com (storageBucket)
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 (messagingSenderId)
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456 (appId)
```

## ✅ PASSO 6: Testar a Configuração
- [ ] Execute o app: `npm start`
- [ ] Teste o fluxo completo:
  - Onboarding → Registro → Login → Dashboard
- [ ] Verifique se não há erros no console
- [ ] Teste a criação de conta e login

## ✅ PASSO 7: Configurações Avançadas (Opcional)

### Regras de Segurança do Firestore:
- [ ] Vá para "Firestore Database" → "Rules"
- [ ] Atualize as regras para produção:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita apenas para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Regras de Segurança do Storage (se usar):
- [ ] Vá para "Storage" → "Rules"
- [ ] Configure regras similares

### Analytics e Crashlytics:
- [ ] Configure Google Analytics
- [ ] Configure Crashlytics para relatórios de erro

---

## 🔧 Solução de Problemas Comuns

### Erro: "Firebase: Error (auth/invalid-api-key)"
- Verifique se a API_KEY está correta no .env
- Certifique-se de que não há espaços extras

### Erro: "Firebase: Error (auth/project-not-found)"
- Verifique se o PROJECT_ID está correto
- Confirme se o projeto existe no Firebase Console

### Erro: "Firebase: Error (auth/operation-not-allowed)"
- Verifique se o Authentication está habilitado
- Confirme se Email/Password provider está ativo

### Erro: "Missing or insufficient permissions"
- Verifique as regras do Firestore
- Certifique-se de que o usuário está logado

### App não conecta ao Firebase:
- Verifique se o .env está na raiz do projeto
- Confirme se as variáveis começam com EXPO_PUBLIC_
- Reinicie o Metro bundler: `npm start --clear`

---

## 📱 Configurações para Mobile (EAS Build)

Quando for publicar no App Store/Google Play:

1. **Adicione app nativo ao Firebase:**
   - No Firebase Console → Project Settings → Your apps
   - Clique "Add app" → iOS/Android
   - Para iOS: use o bundle identifier do app.json
   - Para Android: use o package name do app.json

2. **Baixe os arquivos de configuração:**
   - iOS: GoogleService-Info.plist
   - Android: google-services.json

3. **Configure no EAS Build:**
   - Adicione os arquivos aos respectivos diretórios
   - Configure as credenciais no EAS

---

## 🚀 Próximos Passos Após Configuração

1. Teste todas as funcionalidades
2. Configure regras de produção no Firestore
3. Implemente backup de dados
4. Configure monitoring e analytics
5. Prepare para deployment com EAS Build