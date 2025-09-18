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
import { colors } from '../src/design-system/tokens';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const CoreDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.text.accent,
    background: '#000000', // Preto absoluto AMOLED
    card: '#1A1A1A', // Cards cinza escuro
    text: '#FFFFFF', // Texto branco absoluto
    border: '#3E3E3E', // Bordas cinza médio
    notification: colors.text.accent,
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
      <ThemeProvider value={CoreDarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" backgroundColor={colors.background.primary} />
      </ThemeProvider>
    </AuthProvider>
  );
}