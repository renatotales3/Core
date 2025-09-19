import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

/* eslint-disable @typescript-eslint/no-explicit-any */
 
// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyAoorpUqW829DWpbofJEWdRJqHiHHTOGZw",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "core-004587.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "core-004587",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "core-004587.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "302465967341",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:302465967341:web:6e85125b2aff0c66d098e4",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-KNDX89VES0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Configurar Auth com persistência
const auth = getAuth(app);

// Configurar Firestore
const db = getFirestore(app);

// Configurar Analytics (apenas em produção e se suportado)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('📊 Firebase Analytics inicializado');
    }
  }).catch((error) => {
    console.log('ℹ️ Firebase Analytics não suportado neste ambiente:', error.message);
  });
}

// Para desenvolvimento local (opcional)
if (__DEV__) {
  // Descomente para usar emulador local
  // connectFirestoreEmulator(db, 'localhost', 8080);
  console.log('🔥 Firebase inicializado em modo desenvolvimento');
}

export { auth, db, analytics };
export default app;