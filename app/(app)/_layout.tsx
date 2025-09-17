
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Icon } from '../../src/components/ui/Icon';
import { colors } from '../../src/constants/theme';

export default function AppLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary[500],
          tabBarInactiveTintColor: colors.text.tertiary,
          tabBarStyle: {
            backgroundColor: colors.background.primary,
            borderTopWidth: 1,
            borderTopColor: colors.border.primary,
            height: 64,
            paddingBottom: 8,
            paddingTop: 4,
          },
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <Icon name="home" size={26} color={color} style={{ opacity: focused ? 1 : 0.7 }} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transações',
            tabBarIcon: ({ color, focused }) => (
              <Icon name="transactions" size={26} color={color} style={{ opacity: focused ? 1 : 0.7 }} />
            ),
          }}
        />
        <Tabs.Screen
          name="investments"
          options={{
            title: 'Investimentos',
            tabBarIcon: ({ color, focused }) => (
              <Icon name="investments" size={26} color={color} style={{ opacity: focused ? 1 : 0.7 }} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Ajustes',
            tabBarIcon: ({ color, focused }) => (
              <Icon name="settings" size={26} color={color} style={{ opacity: focused ? 1 : 0.7 }} />
            ),
          }}
        />
      </Tabs>
      <StatusBar style="light" backgroundColor="#0A0A0F" />
    </>
  );
}