// Script simples para limpar dados via Client SDK
// Este script usa as mesmas credenciais do app

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getAuth, connectAuthEmulator } = require('firebase/auth');
const { getFirestore, connectFirestoreEmulator, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

// Configuração do Firebase (mesma do app)
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanFirestoreData() {
  try {
    console.log('🔄 Limpando dados do Firestore...');
    
    // Deletar todos os documentos da coleção 'users'
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    
    console.log(`📊 Encontrados ${snapshot.size} documentos na coleção 'users'`);
    
    if (snapshot.size === 0) {
      console.log('✅ Nenhum documento encontrado para deletar');
      return;
    }

    // Mostrar documentos antes de deletar
    console.log('\n📄 Documentos que serão deletados:');
    snapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`${index + 1}. Email: ${data.email} (ID: ${doc.id})`);
    });

    console.log('\n⚠️  ATENÇÃO: Esta ação deletará TODOS os documentos de usuários!');
    console.log('💡 Se você quer cancelar, pressione Ctrl+C agora');
    console.log('⏳ Aguardando 3 segundos antes de continuar...\n');
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Deletar documentos
    let deletedCount = 0;
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(doc(db, 'users', docSnapshot.id));
      deletedCount++;
      console.log(`✅ ${deletedCount}/${snapshot.size} documentos deletados`);
    }

    console.log('\n🎉 Limpeza do Firestore concluída!');
    console.log(`📊 ${deletedCount} documentos removidos`);
    console.log('\n⚠️  NOTA: Os usuários ainda existem no Firebase Authentication');
    console.log('   Para removê-los completamente, use o Firebase Console');

  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
  }
}

async function deleteSpecificUser(email) {
  try {
    console.log(`🔍 Procurando usuário com email: ${email}`);
    
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(usersCollection);
    
    let found = false;
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      if (data.email === email) {
        await deleteDoc(doc(db, 'users', docSnapshot.id));
        console.log(`✅ Usuário ${email} removido do Firestore`);
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log(`❌ Usuário com email ${email} não encontrado`);
    }
    
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error);
  }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length > 0) {
  if (args[0] === '--email' && args[1]) {
    deleteSpecificUser(args[1]);
  } else if (args[0] === '--help') {
    console.log('📖 Como usar:');
    console.log('   node scripts/clean-firestore.js                        # Deletar todos os documentos');
    console.log('   node scripts/clean-firestore.js --email user@email.com # Deletar usuário específico');
    console.log('   node scripts/clean-firestore.js --help                 # Mostrar esta ajuda');
  } else {
    console.log('❌ Argumentos inválidos. Use --help para ver as opções');
  }
} else {
  cleanFirestoreData();
}