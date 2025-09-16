# 🔧 Correção: Firebase Unauthorized Domain

## ❌ Erro Atual
```
Firebase: Error (auth/unauthorized-domain)
```

## 🎯 Causa
O domínio `localhost:8082` não está autorizado no Firebase Console para autenticação.

## ✅ Solução - Passo a Passo

### 1. Acesse o Firebase Console
🔗 [https://console.firebase.google.com/project/core-004587/authentication/settings](https://console.firebase.google.com/project/core-004587/authentication/settings)

### 2. Vá para Authorized Domains
1. No menu lateral, clique em **Authentication**
2. Clique na aba **Settings**
3. Role até a seção **Authorized domains**

### 3. Adicione os Domínios Necessários
Clique em **Add domain** e adicione:

```
localhost
```

```
localhost:8082
```

```
127.0.0.1
```

```
127.0.0.1:8082
```

### 4. Para Expo/Desenvolvimento
Também adicione se necessário:
```
exp.host
```

```
expo.dev
```

### 5. Salve as Alterações
Clique em **Save** ou **Salvar**

## 🚀 Teste Novamente

Após autorizar os domínios:

1. **Recarregue a página:** `Ctrl+F5` ou `Cmd+R`
2. **Teste o login:** Clique "Continuar com Google"
3. **Deve funcionar:** Pop-up do Google aparecerá normalmente

## 📋 Lista de Domínios Recomendados

Para desenvolvimento completo, adicione todos estes:

- ✅ `localhost`
- ✅ `localhost:8082`
- ✅ `127.0.0.1`
- ✅ `127.0.0.1:8082`
- ✅ `exp.host` (para Expo)
- ✅ `expo.dev` (para Expo)

## 🔗 Links Diretos

- **Firebase Console:** https://console.firebase.google.com/
- **Seu Projeto:** https://console.firebase.google.com/project/core-004587
- **Auth Settings:** https://console.firebase.google.com/project/core-004587/authentication/settings

---

**⚡ Após adicionar os domínios, o Google Sign-In funcionará perfeitamente!**