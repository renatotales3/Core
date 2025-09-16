import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AppLayout() {
  return (
    <>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'Dashboard',
            tabBarIcon: () => '📊',
          }} 
        />
        <Tabs.Screen 
          name="transactions" 
          options={{ 
            title: 'Transações',
            tabBarIcon: () => '💳',
          }} 
        />
        <Tabs.Screen 
          name="investments" 
          options={{ 
            title: 'Investimentos',
            tabBarIcon: () => '📈',
          }} 
        />
        <Tabs.Screen 
          name="settings" 
          options={{ 
            title: 'Ajustes',
            tabBarIcon: () => '⚙️',
          }} 
        />
      </Tabs>
      <StatusBar style="light" backgroundColor="#0A0A0F" />
    </>
  );
}