import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Input } from '../../../shared/ui';
import { theme } from '../../../shared/theme';

export const PersonalInfoScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    surname: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to next step
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={styles.step}>Step 2 of 3</Text>
              <Text style={styles.title}>Personal Information</Text>
            </View>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange('fullName', value)}
              placeholder="Muhammad ali"
            />

            <Input
              label="Surname"
              value={formData.surname}
              onChangeText={(value) => handleInputChange('surname', value)}
              placeholder="muhammad@example.com"
            />

            <View style={styles.row}>
              <View style={styles.phoneContainer}>
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  placeholder="+63"
                  keyboardType="phone-pad"
                  containerStyle={styles.phonePrefix}
                />
              </View>
              <View style={styles.phoneNumberContainer}>
                <Input
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  placeholder="323 123 124"
                  keyboardType="phone-pad"
                  containerStyle={styles.phoneNumber}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.inputLabel}>Gender</Text>
                <TouchableOpacity style={styles.dropdown}>
                  <Text style={styles.dropdownText}>
                    {formData.gender || 'male'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Input
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              placeholder="DD-MM-YYYY"
            />

            <Button
              title="Continue"
              onPress={handleContinue}
              loading={isLoading}
              fullWidth
              style={styles.continueButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  keyboardView: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  
  backButton: {
    marginRight: theme.spacing.md,
  },
  
  backArrow: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.primary,
  },
  
  headerContent: {
    flex: 1,
  },
  
  step: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  
  form: {
    flex: 1,
  },
  
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  
  phoneContainer: {
    flex: 1,
  },
  
  phoneNumberContainer: {
    flex: 2,
  },
  
  phonePrefix: {
    marginBottom: 0,
  },
  
  phoneNumber: {
    marginBottom: 0,
  },
  
  halfWidth: {
    flex: 1,
  },
  
  inputLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  
  dropdown: {
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  
  dropdownText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
  },
  
  dropdownArrow: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.tertiary,
  },
  
  continueButton: {
    marginTop: theme.spacing.lg,
  },
});