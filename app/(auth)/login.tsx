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
import { Button, Input, Icon, SocialIcon } from '../../src/components/ui';
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
  const { login, loginWithGoogle, isLoading: authIsLoading } = useAuth();
  
  console.log('🔍 LoginScreen - AuthContext isLoading:', authIsLoading);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  console.log('🔍 LoginScreen - Estado atual:', { isLoading, formData, errors });

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
    console.log('🔵 LoginScreen - validateForm chamado');
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      console.log('🟢 LoginScreen - Validação passou');
      setErrors({});
      return true;
    } catch (error: any) {
      console.log('🔴 LoginScreen - Erro na validação:', error);
      const newErrors: FormErrors = {};
      
      if (error.inner) {
        error.inner.forEach((err: any) => {
          console.log('🔴 LoginScreen - Erro específico:', err.path, err.message);
          if (err.path) {
            newErrors[err.path as keyof FormErrors] = err.message;
          }
        });
      }
      
      setErrors(newErrors);
      return false;
    }
  };

  // Fazer login com Google
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrors(prev => ({ ...prev, general: undefined }));
      
      const result = await loginWithGoogle();
      
      if (result.success) {
        console.log('✅ Login com Google realizado com sucesso');
      } else {
        setErrors(prev => ({
          ...prev,
          general: result.error || 'Erro ao fazer login com Google',
        }));
      }
    } catch (error) {
      console.error('Erro inesperado no login com Google:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Erro inesperado. Tente novamente.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Fazer login
  const handleLogin = async () => {
    console.log('🔵 LoginScreen - handleLogin chamado');
    console.log('🔵 LoginScreen - Form data:', formData);
    
    // Limpar erro geral anterior
    setErrors(prev => ({ ...prev, general: undefined }));
    
    // Validar formulário
    const isValid = await validateForm();
    console.log('🔵 LoginScreen - Validação:', isValid);
    
    if (!isValid) {
      console.log('🔴 LoginScreen - Validação falhou');
      return;
    }

    console.log('🔵 LoginScreen - Iniciando login...');
    setIsLoading(true);

    try {
      const result = await login(formData);
      console.log('🔵 LoginScreen - Resultado do login:', result);
      
      if (result.success) {
        // Sucesso - navegar diretamente para o app
        console.log('✅ LoginScreen - Login realizado com sucesso, navegando para app');
        
        // Aguardar um momento para o estado ser atualizado
        setTimeout(() => {
          router.replace('/(app)');
        }, 500);
        
        return;
      } else {
        // Erro de autenticação
        console.log('🔴 LoginScreen - Erro no login:', result.error);
        setErrors(prev => ({
          ...prev,
          general: result.error || 'Erro ao fazer login',
        }));
      }
    } catch (error) {
      console.error('🔴 LoginScreen - Erro inesperado no login:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Erro inesperado. Tente novamente.',
      }));
    } finally {
      console.log('🔵 LoginScreen - Finalizando loading');
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
                {errors.general.includes('não encontrado') && (
                  <Text style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.error[500],
                    textAlign: 'center',
                    marginTop: spacing[1],
                  }}>
                    Verifique se o email está correto ou cadastre-se primeiro.
                  </Text>
                )}
                {errors.general.includes('incorreta') && (
                  <Text style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.error[500],
                    textAlign: 'center',
                    marginTop: spacing[1],
                  }}>
                    Verifique se a senha está correta.
                  </Text>
                )}
              </View>
            )}

            {/* Botão de login */}
            <Button
              title="Entrar"
              onPress={() => {
                console.log('🔵 Botão pressionado!');
                handleLogin();
              }}
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

          {/* Botão de login social */}
          <View style={{ marginBottom: spacing[8] }}>
            {/* Continue with Google */}
            <Button
              title="Continuar com Google"
              variant="social"
              socialType="google"
              leftIcon={<SocialIcon type="google" color={colors.text.primary} />}
              onPress={handleGoogleLogin}
              isLoading={isLoading}
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