import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Text } from '../../src/components/ui/Text';
import { Header } from '../../src/components/common/Header';
import { TrendingUpIcon } from '../../src/components/ui/Icons';
import { colors, spacing } from '../../src/design-system/tokens';

export default function InvestmentsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{
        flex: 1,
        paddingHorizontal: spacing[6],
        paddingTop: spacing[16],
      }}>
        <Header 
          title="Investimentos" 
          icon={TrendingUpIcon}
          subtitle="Acompanhe seu portfólio"
        />
        
        <Text style={{
          fontSize: 18,
          color: colors.text.secondary,
          marginBottom: spacing[10],
        }}>
          Seu portfólio aparecerá aqui.
        </Text>
      </View>
    </SafeAreaView>
  );
}