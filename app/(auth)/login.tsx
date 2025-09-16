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
import { Button, Input, SocialIcon, Icon } from '../../src/components/ui';
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
              Bem-vindo de volta
            </Text>
            <Text style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: 'center',
            }}>
              Entre na sua conta para continuar
            </Text>
          </View>

          {/* Formulário */}
          <View style={{ marginBottom: spacing[8] }}>
            {/* Email */}
            <Input
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Icon name="email" size={20} color={colors.text.tertiary} />}
              style={{ marginBottom: spacing[4] }}
            />

            {/* Senha */}
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              isPassword
              leftIcon={<Icon name="password" size={20} color={colors.text.tertiary} />}
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
                    Esqueceu a senha?
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
              title="Entrar"
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
              OU
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
              title="Continuar com Apple"
              variant="social"
              socialType="apple"
              leftIcon={<SocialIcon type="apple" color={colors.text.inverse} />}
              style={{ marginBottom: spacing[3] }}
              onPress={() => {
                // TODO: Implementar login com Apple
                console.log('Login com Apple');
              }}
            />

            {/* Continue with Google */}
            <Button
              title="Continuar com Google"
              variant="social"
              socialType="google"
              leftIcon={<SocialIcon type="google" color={colors.text.primary} />}
              style={{ marginBottom: spacing[3] }}
              onPress={() => {
                // TODO: Implementar login com Google
                console.log('Login com Google');
              }}
            />

            {/* Continue with Facebook */}
            <Button
              title="Continuar com Facebook"
              variant="social"
              socialType="facebook"
              leftIcon={<SocialIcon type="facebook" color={colors.text.inverse} />}
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
              Não tem uma conta?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.primary[500],
                  fontWeight: '600',
                }}>
                  Cadastre-se
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
              Ao entrar, você concorda com nossos{' '}
              <Text style={{ color: colors.primary[500] }}>Termos & Condições</Text>
              {' '}e{' '}
              <Text style={{ color: colors.primary[500] }}>Política de Privacidade</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}