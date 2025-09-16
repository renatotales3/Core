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
import { Button, Input, Card } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/constants/theme';
import { registerSchema } from '../../src/utils/validation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function RegisterScreen() {
  const { register } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

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
      await registerSchema.validate(formData, { abortEarly: false });
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

  // Criar conta
  const handleRegister = async () => {
    // Validar formulário
    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      
      if (response.success) {
        // Registro bem-sucedido - navegação será feita automaticamente pelo AuthContext
        router.replace('/');
      } else {
        setErrors({ general: response.error });
      }
    } catch (error) {
      setErrors({ general: 'Erro inesperado. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{
            flex: 1,
            paddingHorizontal: spacing[6],
            paddingTop: spacing[12],
            paddingBottom: spacing[8],
          }}>
            
            {/* Header */}
            <View style={{ marginBottom: spacing[8] }}>
              <Text style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: 'bold',
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: spacing[2],
              }}>
                Criar conta 🚀
              </Text>
              
              <Text style={{
                fontSize: typography.fontSize.lg,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: typography.lineHeight.lg,
              }}>
                Comece sua jornada para organizar suas finanças
              </Text>
            </View>

            {/* Form */}
            <Card padding="lg" style={{ marginBottom: spacing[6] }}>
              {/* Nome */}
              <View style={{
                flexDirection: 'row',
                marginBottom: spacing[4],
                gap: spacing[3],
              }}>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Nome"
                    placeholder="João"
                    value={formData.firstName}
                    onChangeText={(value) => updateField('firstName', value)}
                    error={errors.firstName}
                    autoCapitalize="words"
                    autoComplete="given-name"
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Input
                    label="Sobrenome"
                    placeholder="Silva"
                    value={formData.lastName}
                    onChangeText={(value) => updateField('lastName', value)}
                    error={errors.lastName}
                    autoCapitalize="words"
                    autoComplete="family-name"
                  />
                </View>
              </View>

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
                containerStyle={{ marginBottom: spacing[4] }}
              />

              {/* Senha */}
              <Input
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                error={errors.password}
                isPassword
                autoComplete="new-password"
                containerStyle={{ marginBottom: spacing[4] }}
                helperText="Deve conter: 1 minúscula, 1 maiúscula e 1 número"
              />

              {/* Confirmar Senha */}
              <Input
                label="Confirmar Senha"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChangeText={(value) => updateField('confirmPassword', value)}
                error={errors.confirmPassword}
                isPassword
                autoComplete="new-password"
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

              {/* Botão de Registro */}
              <Button
                title="Criar conta"
                onPress={handleRegister}
                isLoading={isLoading}
                fullWidth
                size="lg"
              />

              {/* Termos */}
              <Text style={{
                fontSize: typography.fontSize.xs,
                color: colors.text.tertiary,
                textAlign: 'center',
                marginTop: spacing[4],
                lineHeight: typography.lineHeight.xs * 1.3,
              }}>
                Ao criar sua conta, você concorda com nossos{' '}
                <Text style={{ color: colors.primary[500] }}>
                  Termos de Uso
                </Text>
                {' '}e{' '}
                <Text style={{ color: colors.primary[500] }}>
                  Política de Privacidade
                </Text>
              </Text>
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
                Já tem uma conta? {' '}
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