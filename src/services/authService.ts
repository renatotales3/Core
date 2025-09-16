import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  AuthError,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase';
import firestoreService from './firestoreService';
import { signInWithGoogle } from './googleAuthService';
import { AppUser, RegisterData, LoginData, AuthResponse, UserProfile } from '../types/auth';

class AuthService {
  /**
   * Registrar novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🔵 AuthService - Iniciando registro:', { email: data.email });
      
      const { email, password, firstName, lastName } = data;
      
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('🟢 AuthService - Usuário criado no Firebase:', firebaseUser.uid);

      // Atualizar nome de exibição
      const fullName = `${firstName} ${lastName}`;
      await updateProfile(firebaseUser, {
        displayName: fullName,
      });
      
      console.log('🟡 AuthService - Profile atualizado');

      // Configurar perfil padrão
      const defaultProfile: UserProfile = {
        firstName,
        lastName,
        currency: 'BRL',
        monthlyIncome: 0,
        financialGoals: [],
        notifications: {
          dailyReminder: true,
          weeklyReport: true,
          goalMilestones: true,
          expenseAlerts: true,
          investmentUpdates: true,
        },
        theme: 'dark',
      };

      // Salvar dados do usuário no Firestore
      const appUser: AppUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || null,
        photoURL: firebaseUser.photoURL || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: defaultProfile,
      };

      console.log('🟡 AuthService - Salvando no Firestore:', { uid: appUser.uid });

      // Preparar dados para o Firestore (remover campos undefined)
      const firestoreData = {
        uid: appUser.uid,
        email: appUser.email,
        ...(appUser.displayName && { displayName: appUser.displayName }),
        ...(appUser.photoURL && { photoURL: appUser.photoURL }),
        profile: defaultProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), firestoreData);

      console.log('🟢 AuthService - Dados salvos no Firestore');

      // Criar categorias padrão para o usuário
      try {
        await firestoreService.createDefaultCategories(firebaseUser.uid);
        console.log('🟢 AuthService - Categorias padrão criadas');
      } catch (categoriesError) {
        console.error('🔴 Erro ao criar categorias padrão:', categoriesError);
        // Não falhar o registro por causa das categorias
      }

      return {
        success: true,
        user: appUser,
      };
    } catch (error) {
      console.error('🔴 AuthService - Erro no registro:', error);
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getErrorMessage(authError.code),
      };
    }
  }

  /**
   * Fazer login
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔵 AuthService - Iniciando login:', { email: data.email });
      
      const { email, password } = data;
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('🟢 AuthService - Login no Firebase realizado:', firebaseUser.uid);

      // Buscar dados do usuário no Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        console.error('🔴 AuthService - Dados do usuário não encontrados no Firestore');
        throw new Error('Dados do usuário não encontrados');
      }

      console.log('🟢 AuthService - Dados encontrados no Firestore');

      const userData = userDoc.data();
      const appUser: AppUser = {
        ...userData,
        createdAt: (userData.createdAt as Timestamp).toDate(),
        updatedAt: (userData.updatedAt as Timestamp).toDate(),
      } as AppUser;

      console.log('🟢 AuthService - Login concluído com sucesso');

      return {
        success: true,
        user: appUser,
      };
    } catch (error) {
      console.error('🔴 AuthService - Erro no login:', error);
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getErrorMessage(authError.code),
      };
    }
  }

  /**
   * Fazer logout
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  }

  /**
   * Resetar senha
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: this.getErrorMessage(authError.code),
      };
    }
  }

  /**
   * Buscar dados do usuário atual
   */
  async getCurrentUserData(): Promise<AppUser | null> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) return null;

      const userData = userDoc.data();
      return {
        ...userData,
        createdAt: (userData.createdAt as Timestamp).toDate(),
        updatedAt: (userData.updatedAt as Timestamp).toDate(),
      } as AppUser;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        profile: updates,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  }

  /**
   * Login com Google
   */
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      console.log('🔵 AuthService - Iniciando login com Google');
      
      const result = await signInWithGoogle();
      
      if (!result.success) {
        console.log('🔴 AuthService - Falha no login com Google:', result.error);
        return {
          success: false,
          error: result.error || 'Erro no login com Google',
        };
      }

      // Verificar se é redirecionamento (web)
      if (result.redirecting) {
        console.log('🔄 AuthService - Redirecionando para Google...');
        return {
          success: true,
          redirecting: true,
        };
      }

      if (!result.user) {
        return {
          success: false,
          error: 'Usuário não recebido do Google',
        };
      }

      const firebaseUser = result.user;
      console.log('🟢 AuthService - Login com Google realizado:', firebaseUser.uid);

      // Verificar se o usuário já existe no Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        console.log('🟡 AuthService - Criando perfil para usuário do Google');
        
        // Criar perfil padrão para usuário do Google
        const displayName = firebaseUser.displayName || '';
        const [firstName = '', lastName = ''] = displayName.split(' ');
        
        const defaultProfile: UserProfile = {
          firstName: firstName || 'Usuário',
          lastName: lastName || 'Google',
          currency: 'BRL',
          monthlyIncome: 0,
          notifications: {
            dailyReminder: true,
            weeklyReport: true,
            goalMilestones: true,
            expenseAlerts: true,
            investmentUpdates: true,
          },
          theme: 'system' as const,
        };

        const userData: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          profile: defaultProfile,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);
        console.log('🟢 AuthService - Perfil criado para usuário do Google');
        
        return {
          success: true,
          user: userData,
        };
      } else {
        // Usuário já existe, buscar dados completos
        const userData = await this.getCurrentUserData();
        
        if (!userData) {
          console.log('🔴 AuthService - Erro ao buscar dados do usuário');
          return {
            success: false,
            error: 'Erro ao carregar dados do usuário',
          };
        }

        console.log('🟢 AuthService - Login com Google concluído');
        return {
          success: true,
          user: userData,
        };
      }
    } catch (error: any) {
      console.error('🔴 AuthService - Erro no login com Google:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  }

  /**
   * Converter códigos de erro para mensagens amigáveis
   */
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email já está sendo usado por outra conta.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-not-found':
        return 'Usuário não encontrado.';
      case 'auth/wrong-password':
        return 'Senha incorreta.';
      case 'auth/invalid-credential':
        return 'Credenciais inválidas.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet.';
      default:
        return 'Erro inesperado. Tente novamente.';
    }
  }
}

export default new AuthService();