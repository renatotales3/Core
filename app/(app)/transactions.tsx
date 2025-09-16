import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { colors, spacing, typography } from '../../src/constants/theme';

export default function TransactionsScreen() {
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
          Transações 💳
        </Text>
        
        <Text style={{
          fontSize: typography.fontSize.lg,
          color: colors.text.secondary,
        }}>
          Suas transações aparecerão aqui.
        </Text>
      </View>
    </SafeAreaView>
  );
}