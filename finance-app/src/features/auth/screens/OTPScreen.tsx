import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Button } from '../../../shared/ui';
import { theme } from '../../../shared/theme';

export const OTPScreen: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to next screen
    }, 2000);
  };

  const handleResendCode = () => {
    setTimeLeft(60);
    // Resend OTP logic
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Enter OTP Code</Text>
          <Text style={styles.subtitle}>
            Check your SMS! We've send you the verification code to +63 323 123 124. Enter the code below to verify your account.
          </Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit && styles.filledOtpInput,
                index === 2 && styles.highlightedInput, // Highlight the "4" as in reference
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <Text style={styles.timerText}>
          You can resend the code in {timeLeft} seconds.
        </Text>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendCode}
          disabled={timeLeft > 0}
        >
          <Text style={[styles.resendText, timeLeft > 0 && styles.disabledResendText]}>
            Resend code
          </Text>
        </TouchableOpacity>

        <Button
          title="Verify"
          onPress={handleContinue}
          loading={isLoading}
          fullWidth
          style={styles.verifyButton}
        />
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
    marginBottom: theme.spacing.xxl,
  },
  
  backButton: {
    marginBottom: theme.spacing.lg,
  },
  
  backArrow: {
    fontSize: theme.fontSize.lg,
    color: theme.colors.text.primary,
  },
  
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: theme.colors.surface.primary,
    borderWidth: 1,
    borderColor: theme.colors.surface.border,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  
  filledOtpInput: {
    borderColor: theme.colors.accent.primary,
    backgroundColor: theme.colors.surface.elevated,
  },
  
  highlightedInput: {
    borderColor: theme.colors.accent.primary,
    backgroundColor: theme.colors.accent.primary,
    color: '#000',
  },
  
  timerText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  
  resendButton: {
    alignSelf: 'center',
    marginBottom: theme.spacing.xxl,
  },
  
  resendText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent.primary,
    fontWeight: theme.fontWeight.medium,
  },
  
  disabledResendText: {
    color: theme.colors.text.disabled,
  },
  
  verifyButton: {
    marginTop: 'auto',
    marginBottom: theme.spacing.lg,
  },
});