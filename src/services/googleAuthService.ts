import { GoogleAuthProvider, signInWithCredential, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from './firebase';
import { Platform } from 'react-native';

// Modules nativos (carregar apenas quando disponível)
type GoogleSigninType = {
  GoogleSignin?: unknown;
  statusCodes?: Record<string | number, unknown>;
  configure?: (opts: Record<string, unknown>) => void;
  hasPlayServices?: () => Promise<void>;
  signIn?: () => Promise<unknown>;
  getTokens?: () => Promise<{ idToken?: string } | null>;
  signOut?: () => Promise<void>;
  hasPreviousSignIn?: () => Promise<boolean>;
  getCurrentUser?: () => Promise<unknown>;
};

let GoogleSignin: GoogleSigninType | null = null;
let statusCodes: Record<string | number, unknown> = {};
if (Platform.OS !== 'web') {
  try {
    // usar require para evitar bundling/import top-level que quebra no web/Expo Go
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const rnGoogle: unknown = require('@react-native-google-signin/google-signin');
    const maybe = rnGoogle as Record<string, unknown>;
    GoogleSignin = (maybe['GoogleSignin'] as GoogleSigninType) || (rnGoogle as GoogleSigninType);
    statusCodes = (maybe['statusCodes'] as Record<string | number, unknown>) || {};
  } catch (err: unknown) {
    console.warn('Módulo @react-native-google-signin/google-signin não disponível:', (err as Error)?.message || String(err));
    GoogleSignin = null;
    statusCodes = {};
  }
}

// Configuração do Google Sign-In
export const configureGoogleSignIn = () => {
  // Configurar apenas para mobile (não web)
  if (Platform.OS !== 'web') {
    const gs = GoogleSignin as GoogleSigninType | null;
    gs?.configure?.({
      // Para Web, use o Web Client ID do Firebase Console
      webClientId: process.env.EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID || '',
      
      // Para desenvolvimento offline
      offlineAccess: true,
      
      // Para pedir o perfil e email do usuário
      scopes: ['profile', 'email'],
    });
  }
};

// Interface para resposta do Google Sign-In
export interface GoogleSignInResult {
  success: boolean;
  user?: unknown;
  error?: string;
  redirecting?: boolean;
}

// Função para fazer login com Google (Híbrida: Web + Mobile)
export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  try {
    if (Platform.OS === 'web') {
      // Para web, primeiro verificar se há resultado de redirecionamento
      const result = await getRedirectResult(auth);
      if (result) {
        return { success: true, user: result.user };
      }
      
      // Se não há resultado de redirecionamento, iniciar o processo
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      await signInWithRedirect(auth, provider);
      // A função retorna aqui, o resultado será processado no próximo carregamento
      return { success: true, user: null, redirecting: true };
    } else {
      // Implementação para MOBILE usando @react-native-google-signin/google-signin
      console.log('📱 Executando Google Sign-In para Mobile');

      if (!GoogleSignin) {
        throw new Error('Google Signin não está disponível no ambiente atual');
      }
      
      // Configurar Google Sign-In se ainda não foi configurado
      configureGoogleSignIn();

      if (!GoogleSignin) {
        throw new Error('Google Signin não está disponível no ambiente atual');
      }

      // Verificar se o Google Play Services está disponível (apenas Android)
      if (Platform.OS === 'android') {
        await GoogleSignin.hasPlayServices?.();
      }

      // Fazer login com Google
    await GoogleSignin.signIn?.();
      
    // Obter o ID token para autenticação no Firebase
    const tokens = await GoogleSignin.getTokens?.();
    const idToken = tokens?.idToken;
      
      if (!idToken) {
        throw new Error('ID Token não recebido do Google');
      }

      // Criar credencial do Firebase com o token do Google
      const googleCredential = GoogleAuthProvider.credential(idToken);
      
      // Fazer login no Firebase com a credencial do Google
      const firebaseUser = await signInWithCredential(auth, googleCredential);
      
      return {
        success: true,
        user: firebaseUser.user,
      };
    }
    
  } catch (error: unknown) {
    console.error('Erro no Google Sign-In:', error);
    
  if (Platform.OS === 'web') {
      // Tratar erros específicos da web
      const e = error as { code?: string | number; message?: string };
      if (e.code === 'auth/popup-closed-by-user') {
        return {
          success: false,
          error: 'Login cancelado pelo usuário',
        };
      } else if (e.code === 'auth/popup-blocked') {
        return {
          success: false,
          error: 'Pop-up bloqueado pelo navegador',
        };
      } else if (e.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error: 'Domínio não autorizado. Configure localhost no Firebase Console → Authentication → Settings → Authorized domains',
        };
      } else {
        return {
          success: false,
          error: e.message || 'Erro inesperado no login com Google',
        };
      }
      } else {
      // Tratar erros específicos do mobile
      const e = error as { code?: string | number; message?: string };
      if (statusCodes && e.code === (statusCodes as Record<string | number, unknown>)['SIGN_IN_CANCELLED']) {
        return {
          success: false,
          error: 'Login cancelado pelo usuário',
        };
      } else if (statusCodes && e.code === (statusCodes as Record<string | number, unknown>)['IN_PROGRESS']) {
        return {
          success: false,
          error: 'Login já em progresso',
        };
      } else if (statusCodes && e.code === (statusCodes as Record<string | number, unknown>)['PLAY_SERVICES_NOT_AVAILABLE']) {
        return {
          success: false,
          error: 'Google Play Services não disponível',
        };
      } else {
        return {
          success: false,
          error: e.message || 'Erro inesperado no login com Google',
        };
      }
    }
  }
};

// Função para fazer logout do Google
export const signOutGoogle = async (): Promise<void> => {
  try {
    if (Platform.OS !== 'web') {
      if (!GoogleSignin) throw new Error('Google Signin não está disponível no ambiente atual');
      await GoogleSignin.signOut?.();
    }
    // Para web, o logout é feito pelo Firebase Auth diretamente
  } catch (error) {
    console.error('Erro ao fazer logout do Google:', error);
  }
};

// Função para verificar se o usuário está logado no Google
export const isSignedInGoogle = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      // Para web, verificar através do Firebase Auth
      return !!auth.currentUser;
    } else {
  if (!GoogleSignin) return false;
  const isSignedIn = await GoogleSignin.hasPreviousSignIn?.();
  return !!isSignedIn;
    }
  } catch (error) {
    console.error('Erro ao verificar status do Google Sign-In:', error);
    return false;
  }
};

// Função para obter informações do usuário atual do Google
export const getCurrentGoogleUser = async () => {
  try {
    if (Platform.OS === 'web') {
      // Para web, retornar dados do Firebase Auth
      return auth.currentUser;
    } else {
  if (!GoogleSignin) return null;
  return await GoogleSignin.getCurrentUser?.();
    }
  } catch (error) {
    console.error('Erro ao obter usuário atual do Google:', error);
    return null;
  }
};