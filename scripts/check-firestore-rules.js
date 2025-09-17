#!/usr/bin/env node

/**
 * Script para verificar e aplicar regras do Firestore
 */

const fs = require('fs');
const path = require('path');

// Configuração do projeto
const PROJECT_ID = 'core-004587';
const RULES_FILE = path.join(__dirname, '..', 'firestore.rules');

async function checkFirestoreRules() {
  try {
    console.log('🔍 Verificando regras do Firestore...');
    
    // Ler arquivo de regras
    if (!fs.existsSync(RULES_FILE)) {
      console.error('❌ Arquivo firestore.rules não encontrado!');
      console.log('📝 Execute este script a partir da raiz do projeto.');
      return;
    }
    
    const rulesContent = fs.readFileSync(RULES_FILE, 'utf8');
    console.log('✅ Arquivo de regras encontrado');
    console.log('📄 Conteúdo das regras (primeiras 200 caracteres):');
    console.log(rulesContent.substring(0, 200) + '...');
    
    console.log('\n📋 INSTRUÇÕES PARA APLICAR AS REGRAS:');
    console.log('1. Acesse: https://console.firebase.google.com/');
    console.log(`2. Selecione o projeto: ${PROJECT_ID}`);
    console.log('3. Vá em "Firestore Database" → "Rules"');
    console.log('4. Substitua as regras pelo conteúdo do arquivo firestore.rules');
    console.log('5. Clique em "Publish"');
    
    console.log('\n🔧 REGRAS PARA DESENVOLVIMENTO (temporárias):');
    console.log('Para permitir acesso durante desenvolvimento, use:');
    console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}`);
    
  } catch (error) {
    console.error('❌ Erro ao verificar regras:', error);
  }
}

// Executar verificação
checkFirestoreRules();