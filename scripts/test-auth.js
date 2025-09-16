#!/usr/bin/env node

/**
 * Script de teste da autenticação Firebase
 * Execute com: node scripts/test-auth.js
 */

require('dotenv').config();

async function testAuth() {
  console.log('🔐 Testando autenticação Firebase...\n');

  try {
    // Importar Firebase Auth
    const { initializeApp } = require('firebase/app');
    const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } = require('firebase/auth');

    // Configuração do Firebase
    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
    };

    console.log('🚀 Inicializando Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    console.log('✅ Firebase inicializado');

    // Gerar email de teste único
    const timestamp = Date.now();
    const testEmail = `test-${timestamp}@corefinance.com`;
    const testPassword = 'Test123456';

    console.log('\n📧 Testando criação de conta...');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Senha: ${testPassword}`);

    // Criar conta de teste
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    const user = userCredential.user;

    console.log('✅ Conta criada com sucesso!');
    console.log(`   UID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email verificado: ${user.emailVerified}`);

    // Testar login
    console.log('\n🔑 Testando login...');
    await auth.signOut(); // Fazer logout primeiro

    const loginCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
    const loggedUser = loginCredential.user;

    console.log('✅ Login realizado com sucesso!');
    console.log(`   UID: ${loggedUser.uid}`);

    // Limpar conta de teste
    console.log('\n🧹 Limpando conta de teste...');
    await deleteUser(loggedUser);
    console.log('✅ Conta de teste removida');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Autenticação funcionando perfeitamente!');
    console.log('📱 O app está pronto para uso.');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Erro na autenticação:');
    console.error(`   Código: ${error.code}`);
    console.error(`   Mensagem: ${error.message}`);

    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se Authentication está habilitado no Firebase Console');
    console.log('2. Confirme se Email/Password provider está ativo');
    console.log('3. Verifique as regras de segurança do Firestore');
    console.log('4. Execute: npm run check-firebase\n');

    process.exit(1);
  }
}

testAuth();