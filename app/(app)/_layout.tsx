
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HouseIcon, CreditCardIcon, TrendingUpIcon, SettingsIcon } from '../../src/components/ui/Icons';
import { colors } from '../../src/design-system/tokens';
// TabBarBackground removed — usar apenas tabBarStyle para visual

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
            // Igualar a borda ao fundo para evitar seam
            borderTopWidth: 1,
            borderTopColor: colors.background.primary,
            height: 60,
            paddingBottom: 6,
            paddingTop: 4,
            paddingHorizontal: 4,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
            marginTop: 0,
            marginBottom: 0,
            lineHeight: 14,
            paddingHorizontal: 0,
          },
          tabBarIconStyle: {
            marginTop: 0,
            marginBottom: 2,
          },
          tabBarItemStyle: {
            paddingVertical: 2,
            minWidth: 48,
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