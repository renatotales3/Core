// Teste da configuração do Google Sign-In
// Execute com: node scripts/test-google-signin.js

console.log('🔍 Testando configuração do Google Sign-In...\n');

// Verificar variáveis de ambiente
const webClientId = '302465967341-bnf6tdqpn8516kc8qcrvfnhcj12sip7o.apps.googleusercontent.com';

console.log('📋 Configurações encontradas:');
console.log('   Web Client ID:', webClientId);
console.log('   Formato válido:', webClientId.includes('.apps.googleusercontent.com') ? '✅' : '❌');
console.log('   Project Number:', webClientId.split('-')[0]);

// Verificar se o formato está correto
if (webClientId.includes('.apps.googleusercontent.com')) {
  console.log('\n✅ Web Client ID está no formato correto!');
  
  console.log('\n🎯 Próximos passos para testar:');
  console.log('1. Reinicie o Expo: npx expo start');
  console.log('2. Abra no navegador: http://localhost:8082');
  console.log('3. Clique em "Continuar com Google"');
  console.log('4. Faça login com sua conta Google');
  console.log('5. Verifique se o usuário aparece no Firebase Console');
  
  console.log('\n📱 Para testar no mobile:');
  console.log('1. Escaneie o QR code com Expo Go');
  console.log('2. O Google Sign-In funcionará automaticamente');
  
} else {
  console.log('\n❌ Web Client ID parece estar incorreto');
  console.log('Verifique se você copiou corretamente do Firebase Console');
}

console.log('\n🔗 Links úteis:');
console.log('   Firebase Console: https://console.firebase.google.com/');
console.log('   Projeto: https://console.firebase.google.com/project/core-004587');
console.log('   Authentication: https://console.firebase.google.com/project/core-004587/authentication/providers');