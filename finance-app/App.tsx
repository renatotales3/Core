import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { 
  LoginScreen, 
  PersonalInfoScreen, 
  OTPScreen, 
  LocationPermissionScreen,
  EmailSentScreen 
} from './src/features/auth/screens';
import { theme } from './src/shared/theme';

type Screen = 'login' | 'personalInfo' | 'otp' | 'location' | 'emailSent';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen />;
      case 'personalInfo':
        return <PersonalInfoScreen />;
      case 'otp':
        return <OTPScreen />;
      case 'location':
        return <LocationPermissionScreen />;
      case 'emailSent':
        return <EmailSentScreen />;
      default:
        return <LoginScreen />;
    }
  };

  const screens: Screen[] = ['login', 'personalInfo', 'otp', 'location', 'emailSent'];

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={theme.colors.background.primary} />
      
      {/* Screen Navigation Debug */}
      <View style={styles.debugNav}>
        {screens.map((screen) => (
          <TouchableOpacity
            key={screen}
            style={[
              styles.navButton,
              currentScreen === screen && styles.activeNavButton
            ]}
            onPress={() => setCurrentScreen(screen)}
          >
            <Text style={[
              styles.navText,
              currentScreen === screen && styles.activeNavText
            ]}>
              {screen}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  debugNav: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.surface.primary,
    flexWrap: 'wrap',
    gap: 4,
  },
  
  navButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.surface.secondary,
  },
  
  activeNavButton: {
    backgroundColor: theme.colors.accent.primary,
  },
  
  navText: {
    fontSize: 10,
    color: theme.colors.text.secondary,
  },
  
  activeNavText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
