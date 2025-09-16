import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Button, Input, Card, Icon } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/constants/theme';
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
        <View style={{
          flex: 1,
          paddingHorizontal: spacing[6],
          justifyContent: 'center',
        }}>
          <Card padding="lg" style={{ alignItems: 'center' }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.success[50],
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing[4],
            }}>
              <Icon name="email" size={40} color={colors.success[600]} />
            </View>
            
            <Text style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: 'bold',
              color: colors.text.primary,
              textAlign: 'center',
              marginBottom: spacing[3],
            }}>
              Email enviado!
            </Text>
            
            <Text style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: 'center',
              lineHeight: typography.lineHeight.base * 1.3,
              marginBottom: spacing[6],
            }}>
              Enviamos um link para redefinir sua senha para{' '}
              <Text style={{ color: colors.primary[500], fontWeight: '600' }}>
                {formData.email}
              </Text>
              . Verifique sua caixa de entrada e spam.
            </Text>
            
            <Button
              title="Voltar ao Login"
              onPress={() => router.replace('/(auth)/login')}
              fullWidth
              variant="secondary"
            />
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{
            flex: 1,
            paddingHorizontal: spacing[6],
            paddingTop: spacing[16],
            paddingBottom: spacing[8],
          }}>
            
            {/* Header */}
            <View style={{ marginBottom: spacing[10] }}>
              <View style={{
                alignItems: 'center',
                marginBottom: spacing[6],
              }}>
                <View style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.primary[50],
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing[4],
                }}>
                  <Icon name="password" size={32} color={colors.primary[500]} />
                </View>
                
                <Text style={{
                  fontSize: typography.fontSize['3xl'],
                  fontWeight: 'bold',
                  color: colors.text.primary,
                  textAlign: 'center',
                  marginBottom: spacing[2],
                }}>
                  Esqueceu a senha?
                </Text>
              </View>
              
              <Text style={{
                fontSize: typography.fontSize.lg,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: typography.lineHeight.lg,
              }}>
                Digite seu email e enviaremos um link para redefinir sua senha
              </Text>
            </View>

            {/* Form */}
            <Card padding="lg" style={{ marginBottom: spacing[6] }}>
              {/* Email */}
              <Input
                label="Email"
                placeholder="seu@email.com"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon={<Icon name="email" size={20} color={colors.text.tertiary} />}
                containerStyle={{ marginBottom: spacing[6] }}
              />

              {/* Erro geral */}
              {errors.general && (
                <View style={{
                  backgroundColor: colors.error[50],
                  padding: spacing[3],
                  borderRadius: 8,
                  marginBottom: spacing[4],
                }}>
                  <Text style={{
                    color: colors.error[700],
                    fontSize: typography.fontSize.sm,
                    textAlign: 'center',
                  }}>
                    {errors.general}
                  </Text>
                </View>
              )}

              {/* Botão de Reset */}
              <Button
                title="Enviar link"
                onPress={handleResetPassword}
                isLoading={isLoading}
                fullWidth
                size="lg"
              />
            </Card>

            {/* Footer */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 'auto',
            }}>
              <Text style={{
                color: colors.text.secondary,
                fontSize: typography.fontSize.base,
              }}>
                Lembrou da senha? {' '}
              </Text>
              
              <Link href="/(auth)/login" asChild>
                <Text style={{
                  color: colors.primary[500],
                  fontSize: typography.fontSize.base,
                  fontWeight: '600',
                }}>
                  Fazer login
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}