import React from 'react';
import { View, SafeAreaView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Text, Body } from '../../src/components/ui/Text';
import { Header } from '../../src/components/common/Header';
import Button from '../../src/components/ui/Button';
import Card from '../../src/components/ui/Card';
import { LogoutIcon, UserIcon, ShieldIcon } from '../../src/components/ui/Icons';
import { colors, spacing } from '../../src/design-system/tokens';

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
        paddingTop: spacing[16],
      }}>
        <Header 
          title="Configurações" 
        />

        {/* Informações do usuário */}
        <Card variant="elevated" padding="lg" style={{ marginBottom: spacing[6] }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginBottom: spacing[4] 
          }}>
            <View style={{
              backgroundColor: colors.icon.dot,
              borderRadius: 8,
              padding: spacing[2],
              marginRight: spacing[3]
            }}>
              <UserIcon size="base" color="accent" />
            </View>
            <Text variant="h4" color="primary">
              Perfil
            </Text>
          </View>
          
          <View style={{ marginLeft: spacing[10] }}>
            <Body color="primary" marginBottom={2}>
              <Text weight="medium">Nome:</Text> {user?.profile?.firstName} {user?.profile?.lastName}
            </Body>
            
            <Body color="secondary">
              <Text weight="medium">Email:</Text> {user?.email}
            </Body>
          </View>
        </Card>

        {/* Ações */}
        <View style={{ gap: spacing[4] }}>
          {/* Botão de logout */}
          <Button
            title="Sair da conta"
            variant="danger"
            size="lg"
            leftIcon={<LogoutIcon size="sm" color="white" />}
            onPress={() => {
              console.log('🟢 Settings - Botão logout pressionado!');
              handleLogout();
            }}
            fullWidth
          />

          {/* Botão de reset (debugging) */}
          <Button
            title="Reset App (Debug)"
            variant="outline"
            size="lg"
            leftIcon={<ShieldIcon size="sm" color="accent" />}
            onPress={() => {
              console.log('🟢 Settings - Botão reset pressionado!');
              handleResetApp();
            }}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}