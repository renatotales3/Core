import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{
        flex: 1,
        paddingHorizontal: spacing[10],
        paddingTop: spacing[16],
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: spacing[6],
        }}>
          <Text style={{
            fontSize: typography.fontSize['4xl'],
            fontWeight: 'bold',
            color: colors.text.primary,
            marginRight: spacing[3],
          }}>
            Dashboard
          </Text>
          {/* Ícone premium */}
          <View style={{ backgroundColor: colors.primary[50], borderRadius: 16, padding: spacing[2] }}>
            <Text style={{ fontSize: 28 }}>📊</Text>
          </View>
        </View>
        <Text style={{
          fontSize: typography.fontSize.xl,
          color: colors.text.secondary,
          marginBottom: spacing[10],
        }}>
          Bem-vindo ao seu painel financeiro!
        </Text>
      </View>
    </SafeAreaView>
  );
}