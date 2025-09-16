#!/usr/bin/env node

/**
 * Script de verificação da configuração do Firebase
 * Execute com: node scripts/check-firebase.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração do Firebase...\n');

// Verificar se .env existe
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado!');
  console.log('📝 Copie .env.example para .env e configure as credenciais\n');
  process.exit(1);
}

console.log('✅ Arquivo .env encontrado');

// Verificar variáveis de ambiente
require('dotenv').config();

const requiredVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID'
];

let allVarsPresent = true;

console.log('\n🔧 Verificando variáveis de ambiente:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.includes('your-') || value.includes('123456789')) {
    console.log(`❌ ${varName}: Não configurado ou valor padrão`);
    allVarsPresent = false;
  } else {
    console.log(`✅ ${varName}: Configurado`);
  }
});

// Verificar se as dependências estão instaladas
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const requiredDeps = [
    'firebase',
    'yup',
    '@react-native-async-storage/async-storage'
  ];

  console.log('\n📦 Verificando dependências:');
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      console.log(`✅ ${dep}: Instalado`);
    } else {
      console.log(`❌ ${dep}: Não encontrado`);
      allVarsPresent = false;
    }
  });
}

// Verificar arquivos de configuração
const configFiles = [
  'src/services/firebase.ts',
  'src/services/authService.ts',
  'src/services/firestoreService.ts',
  'src/context/AuthContext.tsx',
  'src/types/auth.ts',
  'src/types/firestore.ts'
];

console.log('\n📁 Verificando arquivos de configuração:');
configFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}: Presente`);
  } else {
    console.log(`❌ ${file}: Não encontrado`);
    allVarsPresent = false;
  }
});

// Verificar telas de autenticação
const authScreens = [
  'app/(auth)/_layout.tsx',
  'app/(auth)/login.tsx',
  'app/(auth)/register.tsx',
  'app/(auth)/reset-password.tsx'
];

console.log('\n📱 Verificando telas de autenticação:');
authScreens.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}: Presente`);
  } else {
    console.log(`❌ ${file}: Não encontrado`);
    allVarsPresent = false;
  }
});

// Resultado final
console.log('\n' + '='.repeat(50));
if (allVarsPresent) {
  console.log('🎉 Configuração do Firebase está completa!');
  console.log('🚀 Você pode executar: npm start');
} else {
  console.log('⚠️  Configuração incompleta. Verifique os itens acima.');
  console.log('📖 Consulte FIREBASE_SETUP.md para instruções detalhadas.');
}
console.log('='.repeat(50) + '\n');