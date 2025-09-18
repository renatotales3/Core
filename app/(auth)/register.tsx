import React, { useState } from 'react';
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
import { UserIcon, MailIcon, LockIcon } from '../../src/components/ui/Icons';
import { colors, spacing, typography, borderRadius } from '../../src/design-system/tokens';
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
  const { registerOnly } = useAuth();
  
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

  // Fazer registro
  const handleRegister = async () => {
    // Limpar erro geral anterior
    setErrors(prev => ({ ...prev, general: undefined }));
    
    // Validar formulário
    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const result = await registerOnly({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success) {
        // Sucesso - navegar para tela de login
        console.log('✅ Registro realizado com sucesso, navegando para login');
        router.replace('/(auth)/login');
        return;
      } else {
        // Erro de autenticação
        setErrors(prev => ({
          ...prev,
          general: result.error || 'Erro ao criar conta',
        }));
      }
    } catch (error) {
      console.error('Erro inesperado no registro:', error);
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
            paddingBottom: spacing[12],
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing[12] }}>
            <View style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: colors.text.accent,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing[4],
            }}>
              <UserIcon size="xl" color="white" />
            </View>
            <Text style={{
              fontSize: typography.fontSize['3xl'],
              fontWeight: '700',
              color: colors.text.primary,
              marginBottom: spacing[1],
            }}>
              Criar conta
            </Text>
            <Text style={{
              fontSize: typography.fontSize.base,
              color: colors.text.secondary,
              textAlign: 'center',
            }}>
              Comece sua jornada para organizar suas finanças
            </Text>
          </View>

          {/* Formulário */}
          <View style={{ marginBottom: spacing[10] }}>
            {/* Nome e Sobrenome */}
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
                  leftIcon={<UserIcon size="sm" color="muted" />}
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
                  leftIcon={<UserIcon size="sm" color="muted" />}
                />
              </View>
            </View>

            {/* Email */}
            <Input
              label="E-mail"
              placeholder="seu@email.com"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<MailIcon size="sm" color="muted" />}
              style={{ marginBottom: spacing[4] }}
            />

            {/* Senha */}
            <Input
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              error={errors.password}
              isPassword
              leftIcon={<LockIcon size="sm" color="muted" />}
              helperText="Deve conter: 1 minúscula, 1 maiúscula e 1 número"
              style={{ marginBottom: spacing[4] }}
            />

            {/* Confirmar Senha */}
            <Input
              label="Confirmar Senha"
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              error={errors.confirmPassword}
              isPassword
              leftIcon={<LockIcon size="sm" color="muted" />}
              style={{ marginBottom: spacing[6] }}
            />

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

            {/* Botão de registro */}
            <Button
              title="Criar conta"
              onPress={handleRegister}
              isLoading={isLoading}
              size="lg"
              style={{ marginBottom: spacing[8] }}
            />
          </View>

          {/* Link para login */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: spacing[8],
          }}>
            <Text style={{
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
            }}>
              Já tem uma conta?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.text.accent,
                  fontWeight: '600',
                }}>
                  Fazer login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Footer de termos */}
          <View style={{
            paddingHorizontal: spacing[4],
          }}>
            <Text style={{
              fontSize: typography.fontSize.xs,
              color: colors.text.muted,
              textAlign: 'center',
              lineHeight: typography.lineHeight.relaxed,
            }}>
              Ao criar uma conta, você concorda com nossos{' '}
              <Text style={{ 
                color: colors.text.accent,
                fontSize: typography.fontSize.xs,
              }}>Termos & Condições</Text>
              {' '}e{' '}
              <Text style={{ 
                color: colors.text.accent,
                fontSize: typography.fontSize.xs,
              }}>Política de Privacidade</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}