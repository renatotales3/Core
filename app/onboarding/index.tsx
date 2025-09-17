import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function OnboardingIndex() {
  const { completeOnboarding, isAuthenticated } = useAuth();

  const handleCompleteOnboarding = async () => {
    await completeOnboarding();
    router.replace('/');
  };

  const handleSkipOnboarding = async () => {
    await completeOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary, colors.background.primary]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: spacing[6],
        }}>
          
          {/* Logo/Icon Principal */}
          <View style={{
            width: 120,
            height: 120,
            backgroundColor: colors.primary[50],
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing[10],
            borderWidth: 2,
            borderColor: colors.primary[100],
          }}>
            <Text style={{ fontSize: 56 }}>💰</Text>
          </View>

          {/* Título Principal */}
          <Text style={{
            fontSize: typography.fontSize['5xl'],
            fontWeight: 'bold',
            color: colors.text.primary,
            textAlign: 'center',
            marginBottom: spacing[4],
          }}>
            {isAuthenticated ? 'Bem-vindo de volta!' : 'Bem-vindo ao Core'}
          </Text>

          {/* Subtítulo */}
          <Text style={{
            fontSize: typography.fontSize['2xl'],
            color: colors.text.secondary,
            textAlign: 'center',
            marginBottom: spacing[4],
          }}>
            {isAuthenticated ? 'Você já está logado' : 'No centro das suas finanças'}
          </Text>

          {/* Descrição */}
          <Text style={{
            fontSize: typography.fontSize.lg,
            color: colors.text.tertiary,
            textAlign: 'center',
            marginBottom: spacing[12],
            lineHeight: typography.lineHeight.lg * 1.2,
          }}>
            {isAuthenticated 
              ? 'Você está logado! Complete o tour rápido para conhecer os recursos ou pule para ir direto ao app.'
              : 'Controle total sobre seu dinheiro com design moderno e funcionalidades inteligentes'
            }
          </Text>

          {/* Funcionalidades - só mostrar para novos usuários */}
          {!isAuthenticated && (
            <View style={{ marginBottom: spacing[12], width: '100%' }}>
              {[
                { icon: '📊', title: 'Dashboard Inteligente', desc: 'Visão completa das suas finanças' },
                { icon: '💳', title: 'Controle de Gastos', desc: 'Organize e categorize transações' },
                { icon: '📈', title: 'Investimentos', desc: 'Acompanhe seu portfólio' },
                { icon: '🎯', title: 'Metas Financeiras', desc: 'Defina e alcance objetivos' },
              ].map((item, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: spacing[6],
                  paddingHorizontal: spacing[4],
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primary[50],
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing[3],
                  }}>
                    <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: '600',
                      color: colors.text.primary,
                      marginBottom: spacing[1],
                    }}>
                      {item.title}
                    </Text>
                    <Text style={{
                      fontSize: typography.fontSize.base,
                      color: colors.text.secondary,
                    }}>
                      {item.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Botões */}
          <View style={{ width: '100%', gap: spacing[3] }}>
            <Button
              title={isAuthenticated ? "Fazer tour rápido" : "Começar jornada 🚀"}
              onPress={handleCompleteOnboarding}
              fullWidth
              size="lg"
            />
            
            {isAuthenticated && (
              <Button
                title="Pular e ir ao app"
                onPress={handleSkipOnboarding}
                variant="outline"
                fullWidth
                size="md"
              />
            )}
          </View>

          {/* Indicador - só mostrar para novos usuários */}
          {!isAuthenticated && (
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: spacing[8],
              gap: spacing[2],
            }}>
              {[0, 1, 2, 3].map((item, index) => (
                <View key={index} style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: index === 0 ? colors.primary[500] : colors.border.primary,
                }} />
              ))}
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}