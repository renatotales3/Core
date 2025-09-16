// Design System - Cores, tipografia e espaçamentos
export const colors = {
  // Cores principais
  primary: {
    50: '#E6FDF7',
    100: '#CCFBEF',
    200: '#99F6E0',
    300: '#66F2D0',
    400: '#33ECC1',
    500: '#00D4AA', // Cor principal
    600: '#00AA88',
    700: '#008066',
    800: '#005544',
    900: '#002B22',
  },
  
  // Escala de cinzas (dark theme)
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  
  // Cores do tema dark
  background: {
    primary: '#0A0A0F',    // Fundo principal
    secondary: '#131318',  // Cards e elementos
    tertiary: '#1C1C23',   // Inputs e modais
  },
  
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    tertiary: '#71717A',
    inverse: '#000000',
  },
  
  border: {
    primary: '#2A2A35',
    secondary: '#404040',
    tertiary: '#525252',
  },
  
  // Cores de estado
  success: {
    50: '#F0FDF4',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
  },
  
  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
  },
  
  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  
  info: {
    50: '#EFF6FF',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
  },
} as const;

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    mono: 'SpaceMono',
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 28,
    '2xl': 32,
    '3xl': 36,
    '4xl': 40,
    '5xl': 56,
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 999,
} as const;

export const shadows = {
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 12,
  },
} as const;