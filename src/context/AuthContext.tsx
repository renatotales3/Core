import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebase';
import authService from '../services/authService';
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
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  
  // Métodos de onboarding
  completeOnboarding: () => Promise<void>;
  
  // Métodos de dados do usuário
  refreshUserData: () => Promise<void>;
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

  // Verificar estado de onboarding na inicialização
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasCompleted = await AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
        
        setState(prev => ({
          ...prev,
          hasCompletedOnboarding: hasCompleted === 'true',
        }));
      } catch (error) {
        console.error('Erro ao verificar status do onboarding:', error);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Monitor de estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        console.log('🔍 AuthContext - Mudança de estado Firebase:', { 
          uid: firebaseUser?.uid || 'null', 
          email: firebaseUser?.email || 'null' 
        });

        if (firebaseUser) {
          console.log('🔵 AuthContext - Usuário logado, buscando dados...');
          // Usuário logado - buscar dados completos
          const userData = await authService.getCurrentUserData();
          
          if (userData) {
            console.log('🟢 AuthContext - Dados do usuário carregados:', userData.uid);
            // Salvar dados do usuário localmente
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            
            setState(prev => ({
              ...prev,
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            }));
          } else {
            console.log('🔴 AuthContext - Dados do usuário não encontrados, fazendo logout');
            // Dados não encontrados - fazer logout
            await authService.logout();
          }
        } else {
          console.log('🟡 AuthContext - Usuário não logado');
          // Usuário não logado
          await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
          
          setState(prev => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('🔴 AuthContext - Erro no monitor de autenticação:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    });

    return unsubscribe;
  }, []);

  // Métodos de autenticação
  const login = async (data: LoginData): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('🔵 AuthContext - Iniciando login');
      const response = await authService.login(data);
      
      if (response.success && response.user) {
        console.log('🟢 AuthContext - Login realizado com sucesso');
        // O estado será atualizado pelo onAuthStateChanged
        return response;
      } else {
        console.log('🔴 AuthContext - Falha no login:', response.error);
        setState(prev => ({ ...prev, isLoading: false }));
        return response;
      }
    } catch (error) {
      console.error('🔴 AuthContext - Erro inesperado no login:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: 'Erro inesperado durante o login',
      };
    }
  };

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      console.log('🔵 AuthContext - Iniciando registro');
      const response = await authService.register(data);
      
      if (response.success && response.user) {
        console.log('🟢 AuthContext - Registro realizado com sucesso');
        // O estado será atualizado pelo onAuthStateChanged
        return response;
      } else {
        console.log('🔴 AuthContext - Falha no registro:', response.error);
        setState(prev => ({ ...prev, isLoading: false }));
        return response;
      }
    } catch (error) {
      console.error('🔴 AuthContext - Erro inesperado no registro:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: 'Erro inesperado durante o registro',
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      // O estado será atualizado pelo onAuthStateChanged
    } catch (error) {
      console.error('Erro durante logout:', error);
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    return await authService.resetPassword(email);
  };

  // Métodos de onboarding
  const completeOnboarding = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, 'true');
      setState(prev => ({
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
        setState(prev => ({
          ...prev,
          user: userData,
        }));
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    completeOnboarding,
    refreshUserData,
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