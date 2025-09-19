import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { auth } from '../services/firebase';
import authService from '../services/authService';
import { getRedirectResult } from 'firebase/auth';
import { AppUser, AuthState, LoginData, RegisterData, AuthResponse } from '../types/auth';

// Constantes para AsyncStorage
const STORAGE_KEYS = {
  HAS_COMPLETED_ONBOARDING: '@core_has_completed_onboarding',
  USER_DATA: '@core_user_data',
} as const;

interface AuthContextType extends AuthState {
  // Métodos de autenticação
  login: (data: LoginData) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  registerOnly: (data: RegisterData) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<AuthResponse>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  
  // Métodos de onboarding
  completeOnboarding: () => Promise<void>;
  
  // Métodos de dados do usuário
  refreshUserData: () => Promise<void>;
  
  // Método de reset (debugging)
  resetApp: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    hasCompletedOnboarding: false,
  });

  // Flag para ignorar onAuthStateChanged durante registro
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Ref para verificar se o componente ainda está montado
  const isMountedRef = React.useRef(true);

  // Cleanup na desmontagem
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Função segura para atualizar estado
  const safeSetState = (updater: (prev: AuthState) => AuthState) => {
    if (isMountedRef.current) {
      setState(updater);
    }
  };

  // Verificar estado de onboarding na inicialização
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        console.log('🔍 AuthContext - Verificando onboarding...');
        
        const hasCompleted = await AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
        console.log('🔍 AuthContext - Onboarding completed:', hasCompleted);
        
        safeSetState(prev => ({
          ...prev,
          hasCompletedOnboarding: hasCompleted === 'true',
        }));
      } catch (error) {
        console.error('🔴 AuthContext - Erro ao verificar status do onboarding:', error);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Verificar resultado de redirecionamento do Google Sign-In (apenas Web)
  useEffect(() => {
    const checkRedirectResult = async () => {
      if (Platform.OS === 'web') {
        try {
          console.log('🔍 AuthContext - Verificando resultado de redirecionamento...');
          const result = await getRedirectResult(auth);
          if (result) {
            console.log('🟢 AuthContext - Login com Google via redirecionamento bem-sucedido');
            // O estado será atualizado pelo onAuthStateChanged
          }
        } catch (error) {
          console.error('🔴 AuthContext - Erro no resultado de redirecionamento:', error);
        }
      }
    };

    checkRedirectResult();
  }, []);

  // Monitor de estado de autenticação do Firebase
  useEffect(() => {
    console.log('🔧 AuthContext - Configurando onAuthStateChanged listener');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        console.log('🔍 AuthContext - onAuthStateChanged chamado:', { 
          uid: firebaseUser?.uid || 'null', 
          email: firebaseUser?.email || 'null',
          isRegistering,
          timestamp: new Date().toISOString()
        });

        // Ignorar mudanças durante o processo de registro
        if (isRegistering) {
          console.log('🟡 AuthContext - Ignorando onAuthStateChanged durante registro');
          return;
        }

        if (firebaseUser) {
          console.log('🔵 AuthContext - Usuário logado detectado pelo onAuthStateChanged, buscando dados...');
          // Usuário logado - buscar dados completos
          const userData = await authService.getCurrentUserData();
          
          if (userData) {
            console.log('🟢 AuthContext - Dados do usuário carregados via onAuthStateChanged:', userData.uid);
            // Salvar dados do usuário localmente
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            
            // Auto-completar onboarding para usuários existentes no login
            // (não para novos registros, apenas logins)
            const currentOnboardingStatus = await AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
            if (currentOnboardingStatus !== 'true') {
              console.log('🟡 AuthContext - Auto-completando onboarding para usuário existente via onAuthStateChanged');
              await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
            }
            
            safeSetState(prev => ({
              ...prev,
              user: userData,
              isAuthenticated: true,
              hasCompletedOnboarding: true, // Sempre true para usuários que fazem login
              isLoading: false,
            }));
            
            console.log('✅ AuthContext - Estado atualizado via onAuthStateChanged');
          } else {
            console.log('🔴 AuthContext - Dados do usuário não encontrados, fazendo logout');
            // Dados não encontrados - fazer logout
            await authService.logout();
          }
        } else {
          console.log('🟡 AuthContext - Usuário não logado detectado, resetando estado');
          
          // Em desenvolvimento, criar usuário mockado para teste
          if (__DEV__) {
            console.log('🧪 AuthContext - Modo desenvolvimento: criando usuário mockado');
            const now = new Date();
            const mockUser = {
              uid: 'dev-user-123',
              email: 'dev@test.com',
              displayName: 'Usuário de Desenvolvimento',
              photoURL: null,
              createdAt: now,
              updatedAt: now,
              profile: {
                firstName: 'Dev',
                lastName: 'User',
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
              },
              providerData: [],
            };
            
            safeSetState(prev => ({
              ...prev,
              user: mockUser as unknown as AppUser,
              isAuthenticated: true,
              hasCompletedOnboarding: true,
              isLoading: false,
            }));
            
            // Salvar dados do usuário mockado localmente
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser));
            await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
            
            console.log('✅ AuthContext - Usuário mockado criado para desenvolvimento');
            return;
          }
          
          // Usuário não logado (produção)
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
          
          safeSetState(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            hasCompletedOnboarding: false, // Resetar também o onboarding
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('🔴 AuthContext - Erro no monitor de autenticação:', error);
        safeSetState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    });

    console.log('✅ AuthContext - onAuthStateChanged listener configurado');
    return unsubscribe;
  }, [isRegistering]);

  // Métodos de autenticação
  const login = async (data: LoginData): Promise<AuthResponse> => {
    safeSetState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('🔵 AuthContext - Iniciando login com dados:', data);
      const response = await authService.login(data);
      console.log('🔵 AuthContext - Resposta do authService:', response);
      
      if (response.success && response.user) {
        console.log('🟢 AuthContext - Login realizado com sucesso, atualizando estado diretamente');
        
        // Auto-completar onboarding para login bem-sucedido
        await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        
        // Atualizar estado diretamente
        safeSetState(prev => ({
          ...prev,
          user: response.user!,
          isAuthenticated: true,
          hasCompletedOnboarding: true,
          isLoading: false,
        }));
        
        console.log('✅ AuthContext - Estado atualizado, usuário logado');
        return response;
      } else {
        console.log('🔴 AuthContext - Falha no login:', response.error);
        safeSetState(prev => ({ ...prev, isLoading: false }));
        return response;
      }
    } catch (error) {
      console.error('🔴 AuthContext - Erro inesperado no login:', error);
      safeSetState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: 'Erro inesperado durante o login',
      };
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    // Para manter compatibilidade, register agora chama registerOnly
    return await registerOnly(data);
  };

  const registerOnly = async (data: RegisterData): Promise<AuthResponse> => {
    safeSetState(prev => ({ ...prev, isLoading: true }));
    setIsRegistering(true); // Sinalizar que estamos registrando

    try {
      console.log('🔵 AuthContext - Iniciando registro (sem login)');
      
      // Garantir que onboarding não está marcado como concluído para novos usuários
      await AsyncStorage.removeItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
      
      const response = await authService.registerOnly(data);

      if (response.success) {
        console.log('🟢 AuthContext - Registro realizado com sucesso (sem login)');
        safeSetState(prev => ({ 
          ...prev, 
          isLoading: false,
          hasCompletedOnboarding: false, // Novos usuários precisam do onboarding
        }));
        return response;
      } else {
        console.log('🔴 AuthContext - Falha no registro:', response.error);
        safeSetState(prev => ({ ...prev, isLoading: false }));
        return response;
      }
    } catch (error) {
      console.error('🔴 AuthContext - Erro inesperado no registro:', error);
      safeSetState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: 'Erro inesperado durante o registro',
      };
    } finally {
      setIsRegistering(false); // Limpar flag de registro
    }
  };

  const logout = async (): Promise<void> => {
    console.log('🟢 AuthContext - logout INICIADO');
    try {
      console.log('🔵 AuthContext - Iniciando logout');
      console.log('🔵 AuthContext - Chamando authService.logout()...');
      
      await authService.logout();
      
      console.log('✅ AuthContext - authService.logout() CONCLUÍDO');
      
      // Resetar status de onboarding no logout para que próximo login vá direto para login
      console.log('🔵 AuthContext - Removendo onboarding e user data do AsyncStorage...');
      await AsyncStorage.removeItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      console.log('🟡 AuthContext - Status de onboarding resetado');
      
      // Forçar atualização do estado imediatamente
      console.log('🔵 AuthContext - Atualizando estado...');
      safeSetState(() => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
      }));
      console.log('🟡 AuthContext - Estado resetado manualmente');
      
      console.log('✅ AuthContext - Logout realizado com sucesso');
    } catch (error) {
      console.error('🔴 AuthContext - Erro no logout:', error);
      throw error;
    }
    console.log('🟢 AuthContext - logout FINALIZADO');
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    return await authService.resetPassword(email);
  };

  const loginWithGoogle = async (): Promise<AuthResponse> => {
    safeSetState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('🔵 AuthContext - Iniciando login com Google');
      const response = await authService.loginWithGoogle();
      
      if (response.success) {
        if (response.redirecting) {
          console.log('🔄 AuthContext - Redirecionando para login com Google...');
          // Para web, retornar sucesso mas não atualizar estado ainda
          // O estado será atualizado quando a página recarregar e o redirecionamento for processado
          return response;
        } else if (response.user) {
          console.log('🟢 AuthContext - Login com Google realizado com sucesso');
          // O estado será atualizado pelo onAuthStateChanged
          return response;
        }
      }
      
      console.log('🔴 AuthContext - Falha no login com Google:', response.error);
      safeSetState(prev => ({ ...prev, isLoading: false }));
      return response;
    } catch (error) {
      console.error('🔴 AuthContext - Erro inesperado no login com Google:', error);
      safeSetState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: 'Erro inesperado durante o login com Google',
      };
    }
  };

  // Métodos de onboarding
  const completeOnboarding = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
      safeSetState(prev => ({
        ...prev,
        hasCompletedOnboarding: true,
      }));
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
    }
  };

  // Atualizar dados do usuário
  const refreshUserData = async (): Promise<void> => {
    if (!state.isAuthenticated) return;

    try {
      const userData = await authService.getCurrentUserData();
      if (userData) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        safeSetState(prev => ({
          ...prev,
          user: userData,
        }));
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  // Função para resetar completamente o app (útil para debugging)
  const resetApp = async (): Promise<void> => {
    console.log('🟢 AuthContext - resetApp INICIADO');
    try {
      console.log('🔄 AuthContext - Resetando app completamente');
      
      // Fazer logout do Firebase
      console.log('🔵 AuthContext - Chamando authService.logout() no reset...');
      await authService.logout();
      console.log('✅ AuthContext - authService.logout() CONCLUÍDO no reset');
      
      // Limpar todo o AsyncStorage
      console.log('🔵 AuthContext - Limpando AsyncStorage...');
      await AsyncStorage.removeItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      console.log('✅ AuthContext - AsyncStorage limpo');
      
      // Resetar estado
      console.log('🔵 AuthContext - Resetando estado...');
      safeSetState(() => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        hasCompletedOnboarding: false,
      }));
      console.log('✅ AuthContext - Estado resetado');
      
      console.log('✅ AuthContext - App resetado com sucesso');
    } catch (error) {
      console.error('🔴 AuthContext - Erro ao resetar app:', error);
      throw error;
    }
    console.log('🟢 AuthContext - resetApp FINALIZADO');
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    registerOnly,
    loginWithGoogle,
    logout,
    resetPassword,
    completeOnboarding,
    refreshUserData,
    resetApp,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
}