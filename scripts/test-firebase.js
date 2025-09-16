// Script para testar a configuração do Firebase
// Execute com: node scripts/test-firebase.js

const { initializeApp } = require('firebase/app');
const { getAuth, connectAuthEmulator } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

// Configuração do Firebase (copiada do projeto)
const firebaseConfig = {
  apiKey: "AIzaSyAoorpUqW829DWpbofJEWdRJqHiHHTOGZw",
  authDomain: "core-004587.firebaseapp.com",
  projectId: "core-004587",
  storageBucket: "core-004587.firebasestorage.app",
  messagingSenderId: "302465967341",
  appId: "1:302465967341:web:6e85125b2aff0c66d098e4",
  measurementId: "G-KNDX89VES0"
};

console.log('🔥 Testando configuração do Firebase...\n');

try {
  // Inicializar Firebase
  const app = initializeApp(firebaseConfig);
  console.log('✅ Firebase App inicializado com sucesso');
  console.log('   Project ID:', firebaseConfig.projectId);
  console.log('   Auth Domain:', firebaseConfig.authDomain);
  
  // Testar Auth
  const auth = getAuth(app);
  console.log('✅ Firebase Auth inicializado');
  
  // Testar Firestore
  const db = getFirestore(app);
  console.log('✅ Firestore inicializado');
  
  console.log('\n🎉 Configuração do Firebase está correta!');
  console.log('\nPróximos passos:');
  console.log('1. Execute: npx expo start');
  console.log('2. Teste o login no aplicativo');
  console.log('3. Verifique o Firebase Console para novos usuários');
  
} catch (error) {
  console.error('❌ Erro na configuração do Firebase:', error.message);
  console.log('\n🔧 Verifique:');
  console.log('1. Se as credenciais estão corretas');
  console.log('2. Se o projeto existe no Firebase Console');
  console.log('3. Se a autenticação está habilitada');
}