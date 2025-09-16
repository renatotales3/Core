# Google Sign-In - ✅ CONFIGURADO

## Status da Configuração

✅ **Firebase:** Configurado com projeto `core-004587`  
✅ **Web Client ID:** Configurado corretamente  
✅ **Variáveis de Ambiente:** Todas definidas  
✅ **Código:** Implementação completa

## Configuração Atual

```env
# Firebase Project (✅ CONFIGURADO)
EXPO_PUBLIC_FIREBASE_PROJECT_ID=core-004587
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=core-004587.firebaseapp.com

# Google Sign-In (✅ CONFIGURADO)
EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=302465967341-bnf6tdqpn8516kc8qcrvfnhcj12sip7o.apps.googleusercontent.com
```

## Como Funciona

### 🌐 **Web Platform**
- Usa **Firebase Auth** diretamente com `signInWithPopup()`
- Não requer bibliotecas externas pagas
- Pop-up nativo do Google para autenticação
- Totalmente funcional e gratuito

### 📱 **Mobile Platform (iOS/Android)**
- Usa `@react-native-google-signin/google-signin`
- Experiência nativa do Google Sign-In
- Melhor UX em dispositivos móveis
- Funciona com Expo Go e builds nativos

### 🔄 **Detecção Automática**
O código detecta automaticamente a plataforma:
```typescript
if (Platform.OS === 'web') {
  // Firebase Auth com popup
  const result = await signInWithPopup(auth, provider);
} else {
  // Google Sign-In nativo
  const userInfo = await GoogleSignin.signIn();
}
```

### 2. Obter Web Client ID

1. No Firebase Console, vá em **Authentication** → **Sign-in method**
2. Clique em **Google** para configurar
3. Na seção **Web SDK configuration**, você encontrará seu **Web client ID**
4. Copie o Web Client ID (formato: `123456789-abcdef.apps.googleusercontent.com`)

### 3. Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado com suas credenciais:

```env
# Firebase Configuration (✅ CONFIGURADO)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyAoorpUqW829DWpbofJEWdRJqHiHHTOGZw
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=core-004587.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=core-004587
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=core-004587.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=302465967341
EXPO_PUBLIC_FIREBASE_APP_ID=1:302465967341:web:6e85125b2aff0c66d098e4
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-KNDX89VES0

# Google Sign-In (⚠️ CONFIGURE O WEB CLIENT ID)
EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=SEU_WEB_CLIENT_ID_AQUI
```

**IMPORTANTE:** Substitua `SEU_WEB_CLIENT_ID_AQUI` pelo Web Client ID obtido no passo anterior.

### 4. Para Desenvolvimento Web

O Google Sign-In funcionará automaticamente no desenvolvimento web usando o Expo.

### 5. Para Build Nativo (Android/iOS)

#### Android
1. No Firebase Console, adicione seu app Android
2. Baixe o `google-services.json`
3. Configure as fingerprints SHA-1 e SHA-256

#### iOS
1. No Firebase Console, adicione seu app iOS
2. Baixe o `GoogleService-Info.plist`
3. Configure o bundle identifier

## Testando

1. Execute `npx expo start`
2. Abra no navegador ou dispositivo
3. Clique em "Continuar com Google"
4. Faça login com sua conta Google
5. Verifique se o usuário foi criado no Firestore

## Estrutura dos Dados

Quando um usuário faz login com Google, o sistema:

1. Autentica com Firebase Auth usando o token do Google
2. Cria um perfil padrão no Firestore (se não existir)
3. Usa o nome do Google como firstName/lastName
4. Define configurações padrão (moeda: BRL, notificações ativadas)

## Solução de Problemas

### Erro: "Web Client ID não configurado"
- Verifique se a variável `EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID` está definida
- Confirme se o Web Client ID está correto no Firebase Console

### Erro: "Google Play Services não disponível"
- Este erro aparece apenas no Android
- No desenvolvimento web/Expo Go não é um problema

### Erro de domínio não autorizado
- No Firebase Console, vá em Authentication → Settings → Authorized domains
- Adicione os domínios necessários (localhost, seu domínio de produção)

## Arquivos Relacionados

- `src/services/googleAuthService.ts` - Lógica do Google Sign-In
- `src/services/authService.ts` - Integração com Firebase Auth
- `src/context/AuthContext.tsx` - Context para estado de autenticação
- `app/(auth)/login.tsx` - Tela de login com botão do Google