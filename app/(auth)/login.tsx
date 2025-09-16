import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Button, Input, Card } from '../../src/components/ui';
import { colors, spacing, typography } from '../../src/constants/theme';
import { loginSchema } from '../../src/utils/validation';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginScreen() {
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
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
      await loginSchema.validate(formData, { abortEarly: false });
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

  // Fazer login
  const handleLogin = async () => {
    // Validar formulário
    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await login(formData);
      
      if (response.success) {
        // Login bem-sucedido - navegação será feita automaticamente pelo AuthContext
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
        >
          <View style={{
            flex: 1,
            paddingHorizontal: spacing[6],
            paddingTop: spacing[16],
            paddingBottom: spacing[8],
          }}>
            
            {/* Header */}
            <View style={{ marginBottom: spacing[10] }}>
              <Text style={{
                fontSize: typography.fontSize['3xl'],
                fontWeight: 'bold',
                color: colors.text.primary,
                textAlign: 'center',
                marginBottom: spacing[2],
              }}>
                Bem-vindo de volta! 👋
              </Text>
              
              <Text style={{
                fontSize: typography.fontSize.lg,
                color: colors.text.secondary,
                textAlign: 'center',
                lineHeight: typography.lineHeight.lg,
              }}>
                Entre na sua conta para continuar gerenciando suas finanças
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
                containerStyle={{ marginBottom: spacing[4] }}
              />

              {/* Senha */}
              <Input
                label="Senha"
                placeholder="Sua senha"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                error={errors.password}
                isPassword
                autoComplete="password"
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

              {/* Botão de Login */}
              <Button
                title="Entrar"
                onPress={handleLogin}
                isLoading={isLoading}
                fullWidth
                size="lg"
              />

              {/* Link para reset de senha */}
              <View style={{ marginTop: spacing[4], alignItems: 'center' }}>
                <Link href="/(auth)/reset-password" asChild>
                  <Text style={{
                    color: colors.primary[500],
                    fontSize: typography.fontSize.sm,
                    textDecorationLine: 'underline',
                  }}>
                    Esqueceu sua senha?
                  </Text>
                </Link>
              </View>
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
                Não tem uma conta? {' '}
              </Text>
              
              <Link href="/(auth)/register" asChild>
                <Text style={{
                  color: colors.primary[500],
                  fontSize: typography.fontSize.base,
                  fontWeight: '600',
                }}>
                  Criar conta
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}