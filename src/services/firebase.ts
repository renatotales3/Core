import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Configuração do Firebase
// IMPORTANTE: Adicione suas credenciais do Firebase Console no arquivo .env
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "your-app-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar Auth com persistência
const auth = getAuth(app);

// Configurar Firestore
const db = getFirestore(app);

// Para desenvolvimento local (opcional)
if (__DEV__) {
  // Descomente para usar emulador local
  // connectFirestoreEmulator(db, 'localhost', 8080);
}

export { auth, db };
export default app;