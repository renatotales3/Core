# 🧪 Guia de Teste: Autenticação Core Finance

## ✅ Status dos Testes

### 🔗 Conexão Firebase
- ✅ **Firebase inicializado** com sucesso
- ✅ **Authentication** configurado e funcionando
- ✅ **Firestore** pronto para uso

### 🔐 Autenticação
- ✅ **Criação de conta** testada e funcionando
- ✅ **Login** testado e funcionando
- ✅ **Limpeza de dados** automática (contas de teste)

---

## 🚀 Como Testar a Autenticação

### **Passo 1: Iniciar o App**
```bash
npm start
```

### **Passo 2: Abrir no Navegador (Recomendado)**
- Pressione `w` no terminal ou execute:
```bash
npm run web
```

### **Passo 3: Testar o Fluxo Completo**

#### **🏁 Onboarding**
1. Abra o app no navegador
2. Você verá a tela de boas-vindas
3. Clique em **"Começar jornada 🚀"**
4. Isso marca o onboarding como completo

#### **📝 Registro de Conta**
1. Você será redirecionado para **"Criar conta"**
2. Preencha os campos:
   - **Nome:** João Silva
   - **Sobrenome:** Silva
   - **Email:** seu-email-teste@exemplo.com
   - **Senha:** SenhaForte123
   - **Confirmar Senha:** SenhaForte123
3. Clique em **"Criar conta"**
4. Aguarde a criação da conta

#### **🔑 Login**
1. Após criar a conta, você será redirecionado
2. Ou acesse **"Fazer login"**
3. Digite:
   - **Email:** seu-email-teste@exemplo.com
   - **Senha:** SenhaForte123
4. Clique em **"Entrar"**

#### **📊 Dashboard**
1. Após login, você verá o dashboard básico
2. Isso confirma que a autenticação funcionou!

---

## 🧪 Testes Automatizados

### **Verificar Configuração**
```bash
npm run check-firebase
```
✅ Confirma se todas as credenciais estão corretas

### **Testar Conexão Firebase**
```bash
npm run test-firebase
```
✅ Testa inicialização do Firebase, Auth e Firestore

### **Testar Autenticação Completa**
```bash
npm run test-auth
```
✅ Cria conta de teste → Faz login → Remove conta
✅ Confirma que tudo está funcionando

---

## 🔍 O que Acontece nos Bastidores

### **Quando você cria uma conta:**
1. **Firebase Auth** cria o usuário
2. **Firestore** salva o perfil:
   ```json
   {
     "uid": "user-uid",
     "email": "seu-email@exemplo.com",
     "displayName": "João Silva",
     "profile": {
       "firstName": "João",
       "lastName": "Silva",
       "currency": "BRL",
       "theme": "dark"
     }
   }
   ```

3. **Categorias padrão** são criadas automaticamente:
   - Alimentação, Transporte, Moradia
   - Salário, Freelance, Investimentos
   - E muitas outras...

### **Quando você faz login:**
1. **Firebase Auth** valida as credenciais
2. **Context de autenticação** atualiza o estado global
3. **Navegação** redireciona para o dashboard
4. **Dados do usuário** ficam disponíveis em todo o app

---

## 🚨 Possíveis Problemas e Soluções

### **❌ "Erro de rede"**
- **Causa:** Sem conexão com internet
- **Solução:** Verifique sua conexão

### **❌ "Email já em uso"**
- **Causa:** Você já criou uma conta com esse email
- **Solução:** Use um email diferente ou faça login

### **❌ "Senha muito fraca"**
- **Causa:** Senha não atende requisitos
- **Solução:** Use senha com 6+ caracteres, 1 maiúscula, 1 minúscula, 1 número

### **❌ App não carrega**
- **Solução:** Reinicie o Metro bundler
```bash
npm start --clear
```

### **❌ Erro no Firebase Console**
- Execute os testes automáticos:
```bash
npm run check-firebase
npm run test-firebase
npm run test-auth
```

---

## 📱 Teste em Dispositivos

### **Expo Go (Android/iOS)**
1. Instale o app **Expo Go** na Play Store/App Store
2. No terminal, pressione `a` (Android) ou `i` (iOS)
3. Escaneie o QR code com o app Expo Go

### **Navegador Web**
1. Pressione `w` no terminal
2. Ou execute: `npm run web`
3. Teste completo no navegador

---

## 🎯 Resultado Esperado

Após seguir os passos acima, você deve ver:

✅ **Onboarding** → Tela de boas-vindas
✅ **Registro** → Formulário de criação de conta
✅ **Login** → Formulário de acesso
✅ **Dashboard** → Tela principal após login
✅ **Logout** → Botão para sair da conta

---

## 🚀 Próximos Passos

Após testar a autenticação:

1. **Dashboard Financeiro** - Criar interface principal
2. **Sistema de Transações** - Adicionar receitas/despesas
3. **Categorização** - Organizar gastos
4. **Relatórios** - Gráficos e análises

**🎉 Sua autenticação está funcionando perfeitamente!**

Teste agora e me diga se tudo correu bem! 🚀