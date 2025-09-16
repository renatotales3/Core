import React from 'react';
import { View, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows } from '../../constants/theme';

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
        padding: 12,
      };
    
    case 'md':
      return {
        padding: 16,
      };
    
    case 'lg':
      return {
        padding: 20,
      };
    
    case 'xl':
      return {
        padding: 24,
      };
    
    default:
      return {
        padding: 16,
      };
  }
}