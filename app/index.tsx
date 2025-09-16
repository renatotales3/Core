import { Redirect, router } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { colors } from '../src/constants/theme';
import { useEffect } from 'react';

export default function Index() {
  const { isLoading, isAuthenticated, hasCompletedOnboarding } = useAuth();

  console.log('🔍 Index - Estado atual:', {
    isLoading,
    isAuthenticated,
    hasCompletedOnboarding,
    timestamp: new Date().toISOString()
  });

  // Efeito para forçar navegação quando estado muda
  useEffect(() => {
    if (!isLoading) {
      console.log('🎯 Index - useEffect navegação:', {
        isAuthenticated,
        hasCompletedOnboarding
      });
      
      if (isAuthenticated && hasCompletedOnboarding) {
        console.log('🚀 Index - Forçando navegação para app via router.replace');
        router.replace('/(app)');
      } else if (isAuthenticated && !hasCompletedOnboarding) {
        console.log('🚀 Index - Forçando navegação para onboarding via router.replace');
        router.replace('/onboarding');
      } else if (!isAuthenticated) {
        console.log('🚀 Index - Forçando navegação para login via router.replace');
        router.replace('/(auth)/login');
      }
    }
  }, [isLoading, isAuthenticated, hasCompletedOnboarding]);

  // Mostrar loading enquanto verifica estado de autenticação
  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background.primary,
      }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
        <Text style={{ color: colors.text.primary, marginTop: 16 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  // Debug: mostrar estado atual
  console.log('🎯 Index - Decidindo navegação (fallback):', {
    hasCompletedOnboarding,
    isAuthenticated,
    timestamp: new Date().toISOString()
  });

  // Lógica de navegação baseada no estado (fallback)
  if (!isAuthenticated) {
    console.log('🔐 Redirecionando para login - usuário não autenticado');
    return <Redirect href="/(auth)/login" />;
  }

  if (!hasCompletedOnboarding) {
    console.log('🏁 Redirecionando para onboarding - onboarding não completado');
    return <Redirect href="/onboarding" />;
  }

  console.log('📱 Redirecionando para app - usuário autenticado e onboarding completo');
  return <Redirect href="/(app)" />;
}