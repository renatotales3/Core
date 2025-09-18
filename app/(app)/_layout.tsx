
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HouseIcon, CreditCardIcon, TrendingUpIcon, SettingsIcon } from '../../src/components/ui/Icons';
import { colors } from '../../src/design-system/tokens';

export default function AppLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FFFFFF', // Branco absoluto para aba ativa
          tabBarInactiveTintColor: colors.neutral[400], // Cinza para abas inativas
          tabBarStyle: {
            backgroundColor: colors.background.primary,
            borderTopWidth: 1,
            borderTopColor: colors.border.primary,
            height: 85,
            paddingBottom: 16,
            paddingTop: 8,
            paddingHorizontal: 4,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 2,
            marginBottom: 2,
          },
          tabBarIconStyle: {
            marginTop: 2,
            marginBottom: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          // Adicionar animação suave na transição
          animation: 'shift',
          animationDuration: 300,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <HouseIcon 
                size="sm" 
                color={focused ? '#FFFFFF' : colors.neutral[400]} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transações',
            tabBarIcon: ({ color, focused }) => (
              <CreditCardIcon 
                size="sm" 
                color={focused ? '#FFFFFF' : colors.neutral[400]} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="investments"
          options={{
            title: 'Investimentos',
            tabBarIcon: ({ color, focused }) => (
              <TrendingUpIcon 
                size="sm" 
                color={focused ? '#FFFFFF' : colors.neutral[400]} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ color, focused }) => (
              <SettingsIcon 
                size="sm" 
                color={focused ? '#FFFFFF' : colors.neutral[400]} 
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" backgroundColor={colors.background.primary} />
    </>
  );
}