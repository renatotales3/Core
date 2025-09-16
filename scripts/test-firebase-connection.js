#!/usr/bin/env node

/**
 * Script de teste da conexão Firebase
 * Execute com: node scripts/test-firebase-connection.js
 */

require('dotenv').config();

async function testFirebaseConnection() {
  console.log('🔗 Testando conexão com Firebase...\n');

  try {
    // Importar Firebase
    const { initializeApp } = require('firebase/app');
    const { getAuth, connectAuthEmulator } = require('firebase/auth');
    const { getFirestore, connectFirestoreEmulator } = require('firebase/firestore');

    // Configuração do Firebase
    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
    };

    console.log('📋 Configuração encontrada:');
    console.log(`   Project ID: ${firebaseConfig.projectId}`);
    console.log(`   Auth Domain: ${firebaseConfig.authDomain}`);
    console.log(`   API Key: ${firebaseConfig.apiKey ? '✅ Presente' : '❌ Ausente'}`);
    console.log('');

    // Inicializar Firebase
    console.log('🚀 Inicializando Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado com sucesso');

    // Testar Auth
    console.log('🔐 Testando Authentication...');
    const auth = getAuth(app);
    console.log('✅ Authentication configurado');

    // Testar Firestore
    console.log('🗄️  Testando Firestore...');
    const db = getFirestore(app);
    console.log('✅ Firestore configurado');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Conexão com Firebase estabelecida com sucesso!');
    console.log('📱 O app está pronto para uso.');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Erro na conexão com Firebase:');
    console.error(error.message);

    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se as credenciais no .env estão corretas');
    console.log('2. Confirme se o projeto Firebase existe');
    console.log('3. Verifique se Authentication e Firestore estão habilitados');
    console.log('4. Execute: npm run check-firebase\n');

    process.exit(1);
  }
}

testFirebaseConnection();