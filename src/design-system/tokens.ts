/**
 * Design Tokens - Core Finance App
 * Sistema de design premium com tokens consistentes
 */

// ==================== CORES ====================
export const colors = {
  // Cores Primárias
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6', // Primary principal
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
  },

  // Cores Secundárias (Azul escuro elegante)
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Cores de Fundo (AMOLED Premium)
  background: {
    primary: '#000000',    // Fundo principal - preto absoluto (AMOLED)
    secondary: '#181818',   // Cards - cor pedida #181818
    tertiary: '#2A2A2A',   // Fundo terciário - modais
    accent: '#181818',     // Mantém accent alinhado com cards por padrão
  },

  // Cores específicas para ícones/bolinhas
  icon: {
    dot: '#30322F', // nova cor para bolinhas e textos secundários
  },

  // Cores de Texto (AMOLED Premium)
  text: {
    primary: '#FFFFFF',     // Texto principal - branco absoluto
    secondary: '#30322F',   // Subtextos e complementares - nova cor pedida
    muted: '#30322F',       // Texto sutil - mesma cor dos secundários
    accent: '#FFFFFF',      // Texto de destaque - branco absoluto
    inverse: '#000000',     // Texto inverso (preto sobre fundo branco)
  },

  // Cores de Status
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Cores de Bordas
  border: {
    primary: '#3E3E3E',
    secondary: '#2A2A2A',
    accent: '#FFFFFF',
  },

  // Cores Neutras Premium
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Cores Sociais
  social: {
    apple: '#000000',
    google: '#FFFFFF',
    facebook: '#1877F2',
  },
} as const;

// ==================== TIPOGRAFIA ====================
export const typography = {
  // Famílias de Fonte
  fontFamily: {
    sans: 'Inter', // Fonte principal premium
    mono: 'JetBrains Mono', // Fonte monoespaçada
  },

  // Tamanhos de Fonte (Sistema consistente)
  fontSize: {
    xs: 12,     // Legendas pequenas
    sm: 14,     // Texto pequeno
    base: 16,   // Texto padrão
    lg: 18,     // Texto grande
    xl: 20,     // Títulos pequenos
    '2xl': 24,  // Títulos médios
    '3xl': 30,  // Títulos grandes
    '4xl': 36,  // Títulos principais
    '5xl': 48,  // Títulos hero
    '6xl': 60,  // Display
  },

  // Pesos de Fonte
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },

  // Altura de Linha
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
    // Compatibilidade com valores antigos
    sm: 1.375,
    base: 1.5,
    lg: 1.625,
  },

  // Espaçamento de Letras
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

// ==================== ESPAÇAMENTOS ====================
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
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
} as const;

// ==================== RAIOS DE BORDA ====================
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// ==================== SOMBRAS ====================
export const shadows = {
  // Sombras para Dark Mode
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 12,
  },
  // Sombra com accent color
  accent: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

// ==================== BREAKPOINTS ====================
export const breakpoints = {
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

// ==================== ANIMAÇÕES ====================
export const animations = {
  // Durações
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Easings
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// ==================== GRADES E LAYOUT ====================
export const layout = {
  // Container máximo
  container: {
    maxWidth: 1200,
    padding: spacing[6],
  },
  
  // Header height
  header: {
    height: 64,
  },
  
  // Bottom tab height
  bottomTab: {
    height: 80,
  },
} as const;

// Tipo para autocomplete
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;