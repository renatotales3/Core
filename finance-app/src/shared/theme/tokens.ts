export const spacing = {
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 16,   // 16px
  lg: 24,   // 24px
  xl: 32,   // 32px
  xxl: 48,  // 48px
};

export const borderRadius = {
  sm: 8,    // Elementos pequenos
  md: 16,   // Cards padrão
  lg: 24,   // Cards grandes
  xl: 32,   // Elementos especiais
  pill: 999, // Botões pill/circulares
};

export const fontSize = {
  xs: 12,   // Legendas, labels pequenos
  sm: 14,   // Texto corpo, descrições
  md: 16,   // Texto padrão
  lg: 18,   // Subtítulos
  xl: 20,   // Títulos de seção
  '2xl': 24, // Títulos de página
  '3xl': 32, // Valores monetários grandes
  '4xl': 48, // Valores hero/dashboard
};

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const breakpoints = {
  small: 375,   // iPhone SE
  medium: 390,  // iPhone 12/13/14
  large: 430,   // iPhone 12 Pro Max
  tablet: 768,  // iPad
};