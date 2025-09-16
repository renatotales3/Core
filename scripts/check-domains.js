// Script para verificar configuração de domínios autorizados
// Execute com: node scripts/check-domains.js

console.log('🔍 Verificando configuração de domínios...\n');

const currentDomain = 'localhost:8082';
const requiredDomains = [
  'localhost',
  'localhost:8082', 
  '127.0.0.1',
  '127.0.0.1:8082',
  'exp.host',
  'expo.dev'
];

console.log('📋 Domínio atual:', currentDomain);
console.log('🎯 Domínios que devem estar autorizados no Firebase:\n');

requiredDomains.forEach((domain, index) => {
  console.log(`   ${index + 1}. ${domain}`);
});

console.log('\n🔧 Como autorizar domínios:');
console.log('1. Acesse: https://console.firebase.google.com/project/core-004587');
console.log('2. Vá em: Authentication → Settings → Authorized domains');
console.log('3. Clique em "Add domain" para cada domínio acima');
console.log('4. Salve as alterações');

console.log('\n⚠️  Erro comum:');
console.log('   auth/unauthorized-domain = domínio não autorizado');

console.log('\n✅ Após autorizar:');
console.log('   1. Recarregue a página (Ctrl+F5)');
console.log('   2. Teste o Google Sign-In novamente');

console.log('\n🔗 Link direto:');
console.log('   https://console.firebase.google.com/project/core-004587/authentication/settings');

console.log('\n📱 Para testar:');
console.log('   npx expo start --web');
console.log('   Abra: http://localhost:8082');
console.log('   Clique: "Continuar com Google"');