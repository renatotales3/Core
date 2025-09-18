import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Text } from '../../src/components/ui/Text';
import { Header } from '../../src/components/common/Header';
import { colors, spacing } from '../../src/design-system/tokens';

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{
        flex: 1,
        paddingHorizontal: spacing[6],
        paddingTop: spacing[16],
      }}>
        <Header 
          title="Transações" 
        />
        
        <Text style={{
          fontSize: 18,
          color: colors.text.secondary,
          marginBottom: spacing[10],
        }}>
          Suas transações aparecerão aqui.
        </Text>
      </View>
    </SafeAreaView>
  );
}