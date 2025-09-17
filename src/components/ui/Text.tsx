import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { colors, typography, spacing } from '../../design-system/tokens';

// Variantes de texto predefinidas
type TextVariant =
  | 'display'     // Títulos hero muito grandes
  | 'h1'          // Títulos principais
  | 'h2'          // Títulos de seção
  | 'h3'          // Títulos de subseção
  | 'h4'          // Títulos pequenos
  | 'body'        // Texto padrão
  | 'bodyLarge'   // Texto grande
  | 'bodySmall'   // Texto pequeno
  | 'caption'     // Legendas
  | 'overline'    // Texto de categoria/tag
  | 'label'       // Labels de campos
  | 'button';     // Texto de botões

// Pesos disponíveis
type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

// Cores de texto disponíveis
type TextColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'white';

interface TextProps extends Omit<RNTextProps, 'style'> {
  variant?: TextVariant;
  weight?: FontWeight;
  color?: TextColor;
  align?: 'left' | 'center' | 'right' | 'justify';
  decoration?: 'none' | 'underline' | 'line-through';
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  style?: TextStyle;
  marginBottom?: keyof typeof spacing;
  marginTop?: keyof typeof spacing;
  marginLeft?: keyof typeof spacing;
  marginRight?: keyof typeof spacing;
  margin?: keyof typeof spacing;
}

// Estilos predefinidos para cada variante
const variantStyles: Record<TextVariant, TextStyle> = {
  display: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight * typography.fontSize['5xl'],
    letterSpacing: typography.letterSpacing.tight,
  },
  h1: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight * typography.fontSize['4xl'],
    letterSpacing: typography.letterSpacing.tight,
  },
  h2: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug * typography.fontSize['3xl'],
    letterSpacing: typography.letterSpacing.tight,
  },
  h3: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.snug * typography.fontSize['2xl'],
  },
  h4: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.snug * typography.fontSize.xl,
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal * typography.fontSize.lg,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.wide,
  },
  overline: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal * typography.fontSize.xs,
    letterSpacing: typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal * typography.fontSize.sm,
    letterSpacing: typography.letterSpacing.wide,
  },
  button: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight * typography.fontSize.base,
    letterSpacing: typography.letterSpacing.wide,
  },
};

// Cores de texto disponíveis
const textColors: Record<TextColor, string> = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  muted: colors.text.muted,
  accent: colors.text.accent,
  success: colors.success[500],
  warning: colors.warning[500],
  error: colors.error[500],
  white: colors.neutral[0],
};

export function Text({
  variant = 'body',
  weight,
  color = 'primary',
  align = 'left',
  decoration = 'none',
  transform = 'none',
  style,
  marginBottom,
  marginTop,
  marginLeft,
  marginRight,
  margin,
  children,
  ...props
}: TextProps) {
  // Estilo base da variante
  const variantStyle = variantStyles[variant];

  // Estilo customizado
  const customStyle: TextStyle = {
    ...variantStyle,
    color: textColors[color],
    textAlign: align,
    textDecorationLine: decoration,
    textTransform: transform,
    ...(weight && { fontWeight: typography.fontWeight[weight] }),
    
    // Margens
    ...(margin && { margin: spacing[margin] }),
    ...(marginTop && { marginTop: spacing[marginTop] }),
    ...(marginBottom && { marginBottom: spacing[marginBottom] }),
    ...(marginLeft && { marginLeft: spacing[marginLeft] }),
    ...(marginRight && { marginRight: spacing[marginRight] }),
    
    // Estilo personalizado do usuário
    ...style,
  };

  return (
    <RNText style={customStyle} {...props}>
      {children}
    </RNText>
  );
}

// Componentes específicos para uso comum
export const DisplayText = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="display" {...props} />
);

export const H1 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="h1" {...props} />
);

export const H2 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="h2" {...props} />
);

export const H3 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="h3" {...props} />
);

export const H4 = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="h4" {...props} />
);

export const Body = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="body" {...props} />
);

export const Caption = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="caption" {...props} />
);

export const Label = (props: Omit<TextProps, 'variant'>) => (
  <Text variant="label" {...props} />
);