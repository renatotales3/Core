// Script para limpar dados locais do navegador
// Execute no console do navegador (F12 → Console)

console.log('🔄 Limpando dados locais do navegador...');

// Limpar localStorage
const localStorageKeys = Object.keys(localStorage);
console.log(`📊 Encontradas ${localStorageKeys.length} chaves no localStorage`);

localStorageKeys.forEach(key => {
  if (key.includes('@core_') || key.includes('firebase') || key.includes('expo')) {
    localStorage.removeItem(key);
    console.log(`✅ Removido: ${key}`);
  }
});

// Limpar sessionStorage
const sessionStorageKeys = Object.keys(sessionStorage);
console.log(`📊 Encontradas ${sessionStorageKeys.length} chaves no sessionStorage`);

sessionStorageKeys.forEach(key => {
  if (key.includes('@core_') || key.includes('firebase') || key.includes('expo')) {
    sessionStorage.removeItem(key);
    console.log(`✅ Removido: ${key}`);
  }
});

// Limpar indexedDB (usado pelo Firebase)
if ('indexedDB' in window) {
  indexedDB.databases().then(databases => {
    databases.forEach(db => {
      if (db.name && (db.name.includes('firebase') || db.name.includes('firebaseLocalStorage'))) {
        indexedDB.deleteDatabase(db.name);
        console.log(`✅ Removido IndexedDB: ${db.name}`);
      }
    });
  });
}

console.log('🎉 Limpeza local concluída! Recarregue a página.');