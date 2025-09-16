import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  onPress,
  ...props
}: ButtonProps) {
  const disabled = isDisabled || isLoading;

  // Estilos do container
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    ...getVariantStyles(variant, disabled),
    ...getSizeStyles(size),
    ...(fullWidth && { width: '100%' }),
    ...style,
  };

  // Estilos do texto
  const titleStyle: TextStyle = {
    fontWeight: '600',
    ...getTextVariantStyles(variant, disabled),
    ...getTextSizeStyles(size),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      {leftIcon && !isLoading && (
        <Text style={{ marginRight: spacing[2] }}>{leftIcon}</Text>
      )}
      
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={getSpinnerColor(variant)}
          style={{ marginRight: leftIcon || rightIcon ? spacing[2] : 0 }}
        />
      ) : null}
      
      <Text style={titleStyle}>{title}</Text>
      
      {rightIcon && !isLoading && (
        <Text style={{ marginLeft: spacing[2] }}>{rightIcon}</Text>
      )}
    </TouchableOpacity>
  );
}

// Estilos por variante
function getVariantStyles(variant: ButtonProps['variant'], disabled: boolean): ViewStyle {
  const baseStyle: ViewStyle = {
    opacity: disabled ? 0.6 : 1,
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: colors.primary[500],
      };
    
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: colors.background.secondary,
        borderWidth: 1,
        borderColor: colors.border.primary,
      };
    
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary[500],
      };
    
    case 'ghost':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
      };
    
    case 'danger':
      return {
        ...baseStyle,
        backgroundColor: colors.error[500],
      };
    
    default:
      return baseStyle;
  }
}

// Estilos de texto por variante
function getTextVariantStyles(variant: ButtonProps['variant'], disabled: boolean): TextStyle {
  switch (variant) {
    case 'primary':
      return {
        color: colors.text.inverse,
      };
    
    case 'secondary':
      return {
        color: colors.text.primary,
      };
    
    case 'outline':
      return {
        color: colors.primary[500],
      };
    
    case 'ghost':
      return {
        color: colors.text.primary,
      };
    
    case 'danger':
      return {
        color: colors.text.primary,
      };
    
    default:
      return {
        color: colors.text.primary,
      };
  }
}

// Estilos por tamanho
function getSizeStyles(size: ButtonProps['size']): ViewStyle {
  switch (size) {
    case 'sm':
      return {
        paddingHorizontal: spacing[3],
        paddingVertical: spacing[2],
        minHeight: 36,
      };
    
    case 'md':
      return {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        minHeight: 44,
      };
    
    case 'lg':
      return {
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[4],
        minHeight: 52,
      };
    
    default:
      return {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[3],
        minHeight: 44,
      };
  }
}

// Estilos de texto por tamanho
function getTextSizeStyles(size: ButtonProps['size']): TextStyle {
  switch (size) {
    case 'sm':
      return {
        fontSize: typography.fontSize.sm,
        lineHeight: typography.lineHeight.sm,
      };
    
    case 'md':
      return {
        fontSize: typography.fontSize.base,
        lineHeight: typography.lineHeight.base,
      };
    
    case 'lg':
      return {
        fontSize: typography.fontSize.lg,
        lineHeight: typography.lineHeight.lg,
      };
    
    default:
      return {
        fontSize: typography.fontSize.base,
        lineHeight: typography.lineHeight.base,
      };
  }
}

// Cor do spinner por variante
function getSpinnerColor(variant: ButtonProps['variant']): string {
  switch (variant) {
    case 'primary':
    case 'danger':
      return colors.text.primary;
    
    case 'secondary':
    case 'ghost':
      return colors.text.primary;
    
    case 'outline':
      return colors.primary[500];
    
    default:
      return colors.text.primary;
  }
}