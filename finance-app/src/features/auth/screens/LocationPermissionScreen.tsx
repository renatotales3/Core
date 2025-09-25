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

export const LocationPermissionScreen: React.FC = () => {
  const handleGrantPermission = () => {
    // Request location permission
    console.log('Requesting location permission...');
  };

  const handleMaybeLater = () => {
    // Skip for now
    console.log('Skip location permission for now');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.centerContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📍</Text>
          </View>
          
          <Text style={styles.title}>Enable Location</Text>
          <Text style={styles.subtitle}>
            To be able to use the service, we require permission to access your location.
          </Text>

          <Button
            title="Grant Permission"
            onPress={handleGrantPermission}
            fullWidth
            style={styles.grantButton}
          />

          <TouchableOpacity
            style={styles.maybeLaterButton}
            onPress={handleMaybeLater}
          >
            <Text style={styles.maybeLaterText}>Maybe Later</Text>
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
    marginBottom: theme.spacing.xl,
  },
  
  backButton: {
    alignSelf: 'flex-start',
  },
  
  backArrow: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.primary,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  
  icon: {
    fontSize: 32,
  },
  
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xxl,
  },
  
  grantButton: {
    marginBottom: theme.spacing.lg,
  },
  
  maybeLaterButton: {
    paddingVertical: theme.spacing.md,
  },
  
  maybeLaterText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontWeight: theme.fontWeight.medium,
  },
});