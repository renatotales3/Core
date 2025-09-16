import 'react-native-reanimated';
import 'react-native-gesture-handler';
import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '../src/context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const CoreLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0EA5E9',
    background: '#FFFFFF',
    card: '#F8FAFC',
    text: '#0F172A',
    border: '#E2E8F0',
    notification: '#0EA5E9',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Removido carregamento de fonte inexistente
  // const [loaded] = useFonts({
  //   SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });

  useEffect(() => {
    // Sempre esconder splash screen imediatamente
    SplashScreen.hideAsync();
  }, []);

  // Removida condição de carregamento de fonte
  // if (!loaded) {
  //   return null;
  // }

  return (
    <AuthProvider>
      <ThemeProvider value={CoreLightTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" backgroundColor="#FFFFFF" />
      </ThemeProvider>
    </AuthProvider>
  );
}