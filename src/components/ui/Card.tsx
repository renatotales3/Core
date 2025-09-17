import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../../design-system/tokens';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  style,
}: CardProps) {
  const cardStyle: ViewStyle = {
    borderRadius: borderRadius.xl,
    ...getVariantStyles(variant),
    ...getPaddingStyles(padding),
    ...style,
  };

  return <View style={cardStyle}>{children}</View>;
}

// Estilos por variante
function getVariantStyles(variant: CardProps['variant']): ViewStyle {
  switch (variant) {
    case 'elevated':
      return {
        backgroundColor: colors.background.secondary,
        ...shadows.lg,
        shadowColor: '#000000',
      };
    
    case 'outlined':
      return {
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border.primary,
      };
    
    case 'default':
    default:
      return {
        backgroundColor: colors.background.secondary,
      };
  }
}

// Estilos de padding
function getPaddingStyles(padding: CardProps['padding']): ViewStyle {
  switch (padding) {
    case 'none':
      return {};
    
    case 'sm':
      return {
        padding: spacing[3],
      };
    
    case 'md':
      return {
        padding: spacing[4],
      };
    
    case 'lg':
      return {
        padding: spacing[6],
      };
    
    case 'xl':
      return {
        padding: spacing[8],
      };
    
    default:
      return {
        padding: spacing[4],
      };
  }
}