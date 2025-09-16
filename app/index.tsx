import { Redirect } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { colors } from '../src/constants/theme';

export default function Index() {
  const { isLoading, isAuthenticated, hasCompletedOnboarding } = useAuth();

  console.log('🔍 Index - Estado atual:', {
    isLoading,
    isAuthenticated,
    hasCompletedOnboarding
  });

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
  console.log('🎯 Index - Decidindo navegação:', {
    hasCompletedOnboarding,
    isAuthenticated
  });

  // Lógica de navegação baseada no estado
  if (!hasCompletedOnboarding) {
    console.log('🏁 Redirecionando para onboarding');
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    console.log('🔐 Redirecionando para login');
    return <Redirect href="/(auth)/login" />;
  }

  console.log('📱 Redirecionando para app');
  return <Redirect href="/(app)" />;
}