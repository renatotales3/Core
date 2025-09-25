import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../../../shared/ui';
import { theme } from '../../../shared/theme';

export const EmailSentScreen: React.FC = () => {
  const handleNeedHelp = () => {
    console.log('Need help pressed');
  };

  const handleSendAgain = () => {
    console.log('Send again pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.helpButton} onPress={handleNeedHelp}>
            <Text style={styles.helpText}>Need help?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centerContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📧</Text>
          </View>
          
          <Text style={styles.title}>
            We have sent you a link to your e-mail
          </Text>
          
          <Text style={styles.subtitle}>
            We have sent verification message via e-mail much**@example.com this link is only valid for 24 hours.
          </Text>

          <Text style={styles.question}>
            Did you not receive an email?
          </Text>

          <TouchableOpacity style={styles.sendAgainButton} onPress={handleSendAgain}>
            <Text style={styles.sendAgainText}>Send again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  
  backButton: {},
  
  backArrow: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.primary,
  },
  
  helpButton: {},
  
  helpText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textDecorationLine: 'underline',
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: theme.colors.surface.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.surface.border,
  },
  
  icon: {
    fontSize: 40,
  },
  
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 32,
  },
  
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xxl,
  },
  
  question: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  
  sendAgainButton: {
    paddingVertical: theme.spacing.sm,
  },
  
  sendAgainText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent.primary,
    textAlign: 'center',
    fontWeight: theme.fontWeight.medium,
  },
});