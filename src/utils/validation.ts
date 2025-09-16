import * as yup from 'yup';

// Schema de validação para login
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido')
    .lowercase('Email deve estar em minúsculas'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Schema de validação para registro
export const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  lastName: yup
    .string()
    .required('Sobrenome é obrigatório')
    .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'Sobrenome deve ter no máximo 50 caracteres'),
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido')
    .lowercase('Email deve estar em minúsculas'),
  password: yup
    .string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula e 1 número'
    ),
  confirmPassword: yup
    .string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([yup.ref('password')], 'Senhas não coincidem'),
});

// Schema de validação para reset de senha
export const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email é obrigatório')
    .email('Email inválido')
    .lowercase('Email deve estar em minúsculas'),
});