import React from 'react';
import { View, Text, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Button, Card } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function SettingsScreen() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
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
          onPress={handleLogout}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}