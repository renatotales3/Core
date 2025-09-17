import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Text } from '../../src/components/ui/Text';
import { Header } from '../../src/components/common/Header';
import { BarChartIcon } from '../../src/components/ui/Icons';
import { colors, spacing } from '../../src/design-system/tokens';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <View style={{
        flex: 1,
        paddingHorizontal: spacing[6],
        paddingTop: spacing[16],
      }}>
        <Header 
          title="Dashboard" 
          icon={BarChartIcon}
          subtitle="Visão geral das suas finanças"
        />
        
        <Text style={{
          fontSize: 18,
          color: colors.text.secondary,
          marginBottom: spacing[10],
        }}>
          Bem-vindo ao seu painel financeiro!
        </Text>
      </View>
    </SafeAreaView>
  );
}