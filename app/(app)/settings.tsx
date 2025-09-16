import React from 'react';
import { View, Text, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Button, Card } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function SettingsScreen() {
  const { logout, user, resetApp } = useAuth();

  const handleLogout = () => {
    console.log('🔵 Settings - handleLogout chamado');
    console.log('🔵 Settings - logout function available:', typeof logout);
    
    // Teste sem Alert primeiro para debug
    console.log('🔵 Settings - Chamando performLogout diretamente (sem Alert)');
    performLogout();
  };

  const performLogout = async () => {
    console.log('🟢 Settings - performLogout INICIADO');
    try {
      console.log('🔵 Settings - Fazendo logout...');
      console.log('🔵 Settings - Chamando logout()...');
      
      await logout();
      
      console.log('✅ Settings - Logout concluído');
      
      // Forçar navegação para login após logout
      console.log('🚀 Settings - Navegando para login após logout');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('🔴 Settings - Erro no logout:', error);
      console.error('🔴 Settings - Erro stack:', (error as Error)?.stack);
      Alert.alert('Erro', 'Erro ao fazer logout. Tente novamente.');
    }
    console.log('🟢 Settings - performLogout FINALIZADO');
  };

  const handleResetApp = () => {
    console.log('🔵 Settings - handleResetApp chamado');
    console.log('🔵 Settings - resetApp function available:', typeof resetApp);
    
    // Teste sem Alert primeiro para debug
    console.log('🔵 Settings - Chamando performResetApp diretamente (sem Alert)');
    performResetApp();
  };

  const performResetApp = async () => {
    console.log('🟢 Settings - performResetApp INICIADO');
    try {
      console.log('🔵 Settings - Executando resetApp...');
      console.log('🔵 Settings - Chamando resetApp()...');
      
      await resetApp();
      
      console.log('✅ Settings - Reset concluído');
      
      // Forçar navegação para login após reset
      console.log('🚀 Settings - Navegando para login após reset');
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('🔴 Settings - Erro no reset:', error);
      console.error('🔴 Settings - Erro stack:', (error as Error)?.stack);
      Alert.alert('Erro', 'Erro ao resetar app. Tente novamente.');
    }
    console.log('🟢 Settings - performResetApp FINALIZADO');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{
        flex: 1,
        paddingHorizontal: spacing[6],
        paddingTop: spacing[8],
      }}>
        <Text style={{
          fontSize: typography.fontSize['3xl'],
          fontWeight: 'bold',
          color: colors.text.primary,
          marginBottom: spacing[2],
        }}>
          Ajustes ⚙️
        </Text>
        
        <Text style={{
          fontSize: typography.fontSize.lg,
          color: colors.text.secondary,
          marginBottom: spacing[8],
        }}>
          Configurações da sua conta
        </Text>

        {/* Informações do usuário */}
        <Card padding="lg" style={{ marginBottom: spacing[6] }}>
          <Text style={{
            fontSize: typography.fontSize.lg,
            fontWeight: '600',
            color: colors.text.primary,
            marginBottom: spacing[2],
          }}>
            Perfil
          </Text>
          
          <Text style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
            marginBottom: spacing[1],
          }}>
            Nome: {user?.profile?.firstName} {user?.profile?.lastName}
          </Text>
          
          <Text style={{
            fontSize: typography.fontSize.base,
            color: colors.text.secondary,
          }}>
            Email: {user?.email}
          </Text>
        </Card>

        {/* Botão de logout */}
        <Button
          title="Sair da conta"
          variant="danger"
          onPress={() => {
            console.log('🟢 Settings - Botão logout pressionado!');
            handleLogout();
          }}
          fullWidth
          style={{ marginBottom: spacing[4] }}
        />

        {/* Botão de reset (debugging) */}
        <Button
          title="Reset App (Debug)"
          variant="outline"
          onPress={() => {
            console.log('🟢 Settings - Botão reset pressionado!');
            handleResetApp();
          }}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}