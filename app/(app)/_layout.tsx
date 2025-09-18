
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
            height: 70,
            paddingBottom: 10,
            paddingTop: 6,
            paddingHorizontal: 4,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginTop: 0,
            marginBottom: 0,
            lineHeight: 18,
            paddingHorizontal: 2,
          },
          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 0,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
            minWidth: 64,
          },
          // Adicionar animação suave na transição
          animation: 'shift',
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