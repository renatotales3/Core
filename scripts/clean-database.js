const admin = require('firebase-admin');
const path = require('path');

// Configurar Firebase Admin
const serviceAccountPath = path.join(__dirname, '../firebase-admin-key.json');

// Se você não tem o arquivo de chave do admin, use as variáveis de ambiente
if (require('fs').existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID
  });
} else {
  // Inicializar com variáveis de ambiente (se disponível)
  admin.initializeApp({
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function cleanDatabase() {
  try {
    console.log('🔄 Iniciando limpeza do banco de dados...');

    // 1. Listar todos os usuários do Authentication
    console.log('📋 Listando usuários do Authentication...');
    const listUsersResult = await auth.listUsers();
    const users = listUsersResult.users;
    
    console.log(`📊 Encontrados ${users.length} usuários no Authentication`);

    if (users.length === 0) {
      console.log('✅ Nenhum usuário encontrado para deletar');
      return;
    }

    // Mostrar usuários antes de deletar
    console.log('\n👥 Usuários que serão deletados:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (UID: ${user.uid})`);
    });

    // Confirmar se quer continuar
    console.log('\n⚠️  ATENÇÃO: Esta ação deletará TODOS os usuários e dados!');
    console.log('💡 Se você quer cancelar, pressione Ctrl+C agora');
    console.log('⏳ Aguardando 5 segundos antes de continuar...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 2. Deletar documentos do Firestore
    console.log('🗃️ Deletando documentos do Firestore...');
    const usersBatch = db.batch();
    let deletedDocs = 0;

    for (const user of users) {
      const userDocRef = db.collection('users').doc(user.uid);
      usersBatch.delete(userDocRef);
      deletedDocs++;
    }

    if (deletedDocs > 0) {
      await usersBatch.commit();
      console.log(`✅ ${deletedDocs} documentos deletados do Firestore`);
    }

    // 3. Deletar usuários do Authentication
    console.log('🔐 Deletando usuários do Authentication...');
    const uids = users.map(user => user.uid);
    
    // Deletar em lotes de 1000 (limite do Firebase)
    const batchSize = 1000;
    let deletedUsers = 0;

    for (let i = 0; i < uids.length; i += batchSize) {
      const batch = uids.slice(i, i + batchSize);
      await auth.deleteUsers(batch);
      deletedUsers += batch.length;
      console.log(`✅ ${deletedUsers}/${uids.length} usuários deletados`);
    }

    console.log('\n🎉 Limpeza concluída com sucesso!');
    console.log(`📊 Resumo:`);
    console.log(`   - ${deletedDocs} documentos removidos do Firestore`);
    console.log(`   - ${deletedUsers} usuários removidos do Authentication`);

  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
    
    if (error.code === 'auth/insufficient-permission') {
      console.log('\n💡 Dica: Você precisa de permissões de admin. Verifique:');
      console.log('   1. Se você tem o arquivo firebase-admin-key.json');
      console.log('   2. Se as variáveis de ambiente estão corretas');
      console.log('   3. Se sua conta tem permissões de admin no projeto');
    }
  }
}

// Função para deletar usuário específico
async function deleteSpecificUser(email) {
  try {
    console.log(`🔍 Procurando usuário: ${email}`);
    
    const user = await auth.getUserByEmail(email);
    console.log(`👤 Usuário encontrado: ${user.uid}`);
    
    // Deletar do Firestore
    await db.collection('users').doc(user.uid).delete();
    console.log('✅ Documento deletado do Firestore');
    
    // Deletar do Authentication
    await auth.deleteUser(user.uid);
    console.log('✅ Usuário deletado do Authentication');
    
    console.log(`🎉 Usuário ${email} removido com sucesso!`);
    
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`❌ Usuário ${email} não encontrado`);
    } else {
      console.error('❌ Erro ao deletar usuário:', error);
    }
  }
}

// Verificar argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length > 0) {
  if (args[0] === '--email' && args[1]) {
    // Deletar usuário específico
    deleteSpecificUser(args[1]);
  } else if (args[0] === '--help') {
    console.log('📖 Como usar:');
    console.log('   node scripts/clean-database.js                 # Deletar todos os usuários');
    console.log('   node scripts/clean-database.js --email user@email.com  # Deletar usuário específico');
    console.log('   node scripts/clean-database.js --help          # Mostrar esta ajuda');
  } else {
    console.log('❌ Argumentos inválidos. Use --help para ver as opções');
  }
} else {
  // Deletar todos os usuários
  cleanDatabase();
}