// Script para limpar usuários do Firebase Authentication via REST API
require('dotenv').config();

const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

async function getIdToken() {
  // Para usar a API, precisamos de um token de administrador
  // Vamos tentar usar um usuário temporário para fazer a limpeza
  console.log('⚠️  NOTA: Este script requer privilégios de administrador');
  console.log('📋 Informações do projeto:');
  console.log(`   Project ID: ${projectId}`);
  console.log(`   API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'não encontrada'}`);
  console.log('');
  
  return null;
}

async function listUsers() {
  try {
    console.log('📋 Para ver usuários do Authentication, siga estes passos:');
    console.log('');
    console.log('1. 🌐 Abra o Firebase Console:');
    console.log(`   https://console.firebase.google.com/project/${projectId}/authentication/users`);
    console.log('');
    console.log('2. 🔍 Veja a lista de usuários registrados');
    console.log('');
    console.log('3. 🗑️  Para deletar usuários:');
    console.log('   - Selecione os usuários (checkbox)');
    console.log('   - Clique no ícone de lixeira');
    console.log('   - Confirme a exclusão');
    console.log('');
    console.log('4. ✅ Após deletar, tente registrar novamente');
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

async function showInstructions() {
  console.log('🧹 COMO LIMPAR USUÁRIOS DO FIREBASE AUTHENTICATION');
  console.log('='.repeat(60));
  console.log('');
  
  console.log('📱 MÉTODO 1 - Firebase Console (Recomendado):');
  console.log('1. Acesse: https://console.firebase.google.com');
  console.log(`2. Selecione o projeto: ${projectId}`);
  console.log('3. Vá em "Authentication" → "Users"');
  console.log('4. Selecione os usuários que quer deletar');
  console.log('5. Clique no ícone de lixeira 🗑️');
  console.log('6. Confirme a exclusão');
  console.log('');
  
  console.log('💻 MÉTODO 2 - Via código (Admin SDK):');
  console.log('Você precisaria do Firebase Admin SDK com credenciais de administrador');
  console.log('');
  
  console.log('🔗 Links diretos:');
  console.log(`   Authentication: https://console.firebase.google.com/project/${projectId}/authentication/users`);
  console.log(`   Firestore: https://console.firebase.google.com/project/${projectId}/firestore/data`);
  console.log('');
  
  console.log('⚡ SOLUÇÃO RÁPIDA:');
  console.log('1. Abra o link do Authentication acima');
  console.log('2. Delete todos os usuários manualmente');
  console.log('3. Tente registrar novamente');
}

// Executar o script
showInstructions();