import React, { useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import Button from '../../src/components/ui/Button';
import Input from '../../src/components/ui/Input';
import { Text } from '../../src/components/ui/Text';
import { MailIcon, LockIcon } from '../../src/components/ui/Icons';
import { colors, spacing, typography, borderRadius } from '../../src/design-system/tokens';
import { resetPasswordSchema } from '../../src/utils/validation';

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
  general?: string;
}

export default function ResetPasswordScreen() {
  const { resetPassword } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Atualizar campo do formulário
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro específico do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Validar formulário
  const validateForm = async (): Promise<boolean> => {
    try {
      await resetPasswordSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error: any) {
      const formErrors: FormErrors = {};
      
      error.inner?.forEach((err: any) => {
        if (err.path) {
          formErrors[err.path as keyof FormErrors] = err.message;
        }
      });
      
      setErrors(formErrors);
      return false;
    }
  };

  // Resetar senha
  const handleResetPassword = async () => {
    // Validar formulário
    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await resetPassword(formData.email.trim().toLowerCase());
      
      if (response.success) {
        setIsSuccess(true);
      } else {
        setErrors({ general: response.error });
      }
    } catch (error) {
      setErrors({ general: 'Erro inesperado. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={{ 
        flex: 1, 
        backgroundColor: colors.background.primary 
      }}>
        <View style={{
          flex: 1,
          paddingHorizontal: spacing[6],
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Success Card */}
          <View style={{
            backgroundColor: colors.background.secondary,
            borderRadius: borderRadius['2xl'],
            padding: spacing[8],
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border.primary,
          }}>
            {/* Success Icon */}
            <View style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: colors.text.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing[6],
            }}>
              <MailIcon size="xl" color="white" />
            </View>

            <Text style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: '700',
              color: colors.text.primary,
              textAlign: 'center',
              marginBottom: spacing[2],
            }}>
              Email enviado!
            </Text>

            <Text style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: 'center',
              lineHeight: typography.lineHeight.relaxed,
              marginBottom: spacing[8],
            }}>
              Enviamos um link para redefinir sua senha para{' '}
              <Text style={{ color: colors.text.accent, fontWeight: '600' }}>
                {formData.email}
              </Text>
              . Verifique sua caixa de entrada e spam.
            </Text>

            <Button
              title="Voltar ao Login"
              onPress={() => router.replace('/(auth)/login')}
              variant="secondary"
              size="lg"
              style={{ minWidth: 200 }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: colors.background.primary 
    }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: spacing[6],
            paddingTop: spacing[16],
            paddingBottom: spacing[10],
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing[12] }}>
            <View style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.icon.dot,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing[4],
            }}>
              <LockIcon size="xl" color="white" />
            </View>

            <Text style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: '700',
              color: colors.text.primary,
              textAlign: 'center',
              marginBottom: spacing[2],
            }}>
              Esqueceu a senha?
            </Text>

            <Text style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: 'center',
            }}>
              Digite seu email e enviaremos um link para redefinir sua senha
            </Text>
          </View>

          {/* Form */}
          <View style={{ marginBottom: spacing[10] }}>
            <Input
              label="Email"
              placeholder="seu@email.com"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<MailIcon size="sm" color="muted" />}
              style={{ marginBottom: spacing[6] }}
            />

            {/* Erro geral */}
            {errors.general && (
              <View style={{
                backgroundColor: colors.error[50],
                padding: spacing[3],
                borderRadius: borderRadius.lg,
                marginBottom: spacing[4],
              }}>
                <Text style={{
                  color: colors.error[600],
                  fontSize: typography.fontSize.sm,
                  textAlign: 'center',
                }}>
                  {errors.general}
                </Text>
              </View>
            )}

            <Button
              title="Enviar link"
              onPress={handleResetPassword}
              isLoading={isLoading}
              style={{ marginBottom: spacing[8] }}
            />
          </View>

          {/* Footer */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              color: colors.text.secondary,
              fontSize: typography.fontSize.sm,
            }}>
              Lembrou da senha?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={{
                  color: colors.text.accent,
                  fontSize: typography.fontSize.sm,
                  fontWeight: '600',
                }}>
                  Fazer login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}