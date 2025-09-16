import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Button, Input, SocialIcon } from '../../src/components/ui';
import { colors, spacing, typography, borderRadius } from '../../src/constants/theme';
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
      const newErrors: FormErrors = {};
      
      if (error.inner) {
        error.inner.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path as keyof FormErrors] = err.message;
          }
        });
      }
      
      setErrors(newErrors);
      return false;
    }
  };

  // Fazer login
  const handleLogin = async () => {
    // Limpar erro geral anterior
    setErrors(prev => ({ ...prev, general: undefined }));
    
    // Validar formulário
    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const result = await login(formData);
      
      if (result.success) {
        // Sucesso - o AuthContext vai lidar com a navegação
        console.log('✅ Login realizado com sucesso');
      } else {
        // Erro de autenticação
        setErrors(prev => ({
          ...prev,
          general: result.error || 'Erro ao fazer login',
        }));
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Erro inesperado. Tente novamente.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

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
            paddingBottom: spacing[8],
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing[12] }}>
            <Text style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing[2],
            }}>
              Welcome back
            </Text>
            <Text style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: 'center',
            }}>
              Sign in to your account to continue
            </Text>
          </View>

          {/* Formulário */}
          <View style={{ marginBottom: spacing[8] }}>
            {/* Email */}
            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ marginBottom: spacing[4] }}
            />

            {/* Senha */}
            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              isPassword
              style={{ marginBottom: spacing[2] }}
            />

            {/* Link esqueceu senha */}
            <View style={{ alignItems: 'flex-end', marginBottom: spacing[6] }}>
              <Link href="/(auth)/reset-password" asChild>
                <TouchableOpacity>
                  <Text style={{
                    fontSize: typography.fontSize.sm,
                    color: colors.primary[500],
                    fontWeight: '500',
                  }}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>

            {/* Erro geral */}
            {errors.general && (
              <View style={{
                padding: spacing[3],
                backgroundColor: colors.error[50],
                borderRadius: borderRadius.lg,
                marginBottom: spacing[4],
              }}>
                <Text style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.error[600],
                  textAlign: 'center',
                }}>
                  {errors.general}
                </Text>
              </View>
            )}

            {/* Botão de login */}
            <Button
              title="Sign in"
              onPress={handleLogin}
              isLoading={isLoading}
              style={{ marginBottom: spacing[6] }}
            />
          </View>

          {/* Divisor OR */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: spacing[6],
          }}>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.border.primary,
            }} />
            <Text style={{
              marginHorizontal: spacing[4],
              fontSize: typography.fontSize.sm,
              color: colors.text.tertiary,
              fontWeight: '500',
            }}>
              OR
            </Text>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.border.primary,
            }} />
          </View>

          {/* Botões de login social */}
          <View style={{ marginBottom: spacing[8] }}>
            {/* Continue with Apple */}
            <Button
              title="Continue with Apple"
              variant="social"
              socialType="apple"
              leftIcon={<SocialIcon type="apple" />}
              style={{ marginBottom: spacing[3] }}
              onPress={() => {
                // TODO: Implementar login com Apple
                console.log('Login com Apple');
              }}
            />

            {/* Continue with Google */}
            <Button
              title="Continue with Google"
              variant="social"
              socialType="google"
              leftIcon={<SocialIcon type="google" />}
              style={{ marginBottom: spacing[3] }}
              onPress={() => {
                // TODO: Implementar login com Google
                console.log('Login com Google');
              }}
            />

            {/* Continue with Facebook */}
            <Button
              title="Continue with Facebook"
              variant="social"
              socialType="facebook"
              leftIcon={<SocialIcon type="facebook" />}
              onPress={() => {
                // TODO: Implementar login com Facebook
                console.log('Login com Facebook');
              }}
            />
          </View>

          {/* Link para registro */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
            }}>
              Don't have an account?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.primary[500],
                  fontWeight: '600',
                }}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Footer de termos */}
          <View style={{
            marginTop: spacing[10],
            paddingHorizontal: spacing[4],
          }}>
            <Text style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.tertiary,
              textAlign: 'center',
              lineHeight: typography.lineHeight.sm,
            }}>
              By signing in, you agree to our{' '}
              <Text style={{ color: colors.primary[500] }}>Terms & Conditions</Text>
              {' '}and{' '}
              <Text style={{ color: colors.primary[500] }}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}