import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { Text } from './Text';
import { colors, typography, spacing, borderRadius, shadows } from '../../design-system/tokens';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'social' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  socialType?: 'apple' | 'google' | 'facebook';
}

const Button: React.FC<ButtonProps> = ({
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
  socialType,
  onPress,
  ...props
}) => {
  const isDisabledOrLoading = isDisabled || isLoading;

  // Estilos base do botão
  const buttonStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.xl,
    ...getVariantStyles(variant, socialType),
    ...getSizeStyles(size),
    ...(fullWidth && { width: '100%' }),
    ...(variant === 'primary' && shadows.sm),
    ...(isDisabledOrLoading && { opacity: 0.6 }),
    ...style,
  };

  // Estilos do texto
  const textStyles: TextStyle = {
    fontWeight: '600',
    textAlign: 'center',
    ...getTextVariantStyles(variant, socialType),
    ...getTextSizeStyles(size),
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={(event) => {
        console.log('🔵 Button - onPress chamado:', title, 'disabled:', isDisabledOrLoading);
        if (onPress && !isDisabledOrLoading) {
          onPress(event);
        }
      }}
      disabled={isDisabledOrLoading}
      activeOpacity={0.8}
      {...props}
    >
      {/* Ícone à esquerda */}
      {leftIcon && !isLoading && (
        <View style={{ marginRight: spacing[3] }}>
          {leftIcon}
        </View>
      )}

      {/* Loading spinner */}
      {isLoading && (
        <ActivityIndicator
          size="small"
          color={getSpinnerColor(variant, socialType)}
          style={{ marginRight: spacing[2] }}
        />
      )}

      {/* Texto do botão */}
      <Text variant="button" style={textStyles}>{title}</Text>

      {/* Ícone à direita */}
      {rightIcon && !isLoading && (
        <View style={{ marginLeft: spacing[2] }}>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;

// Estilos por variante
function getVariantStyles(variant: ButtonProps['variant'], socialType?: string): ViewStyle {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: colors.text.primary, // Botão branco absoluto
      };
    
    case 'secondary':
      return {
        backgroundColor: colors.background.secondary, // Card cinza 1A1A1A
        borderWidth: 1,
        borderColor: colors.border.primary,
      };
    
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.text.secondary, // Borda cinza 3E3E3E
      };
    
    case 'ghost':
      return {
        backgroundColor: 'transparent',
      };
    
    case 'social':
      switch (socialType) {
        case 'apple':
          return {
            backgroundColor: colors.social.apple,
            borderWidth: 1,
            borderColor: colors.social.apple,
          };
        case 'google':
          return {
            backgroundColor: colors.text.primary, // Botão branco absoluto para Google
            borderWidth: 1,
            borderColor: colors.border.secondary,
          };
        case 'facebook':
          return {
            backgroundColor: colors.social.facebook,
            borderWidth: 1,
            borderColor: colors.social.facebook,
          };
        default:
          return {
            backgroundColor: colors.background.primary,
            borderWidth: 1,
            borderColor: colors.border.secondary,
          };
      }
    
    case 'danger':
      return {
        backgroundColor: colors.error[500],
      };
    
    default:
      return {
        backgroundColor: colors.primary[500],
      };
  }
}

// Estilos de texto por variante
function getTextVariantStyles(variant: ButtonProps['variant'], socialType?: string): TextStyle {
  switch (variant) {
    case 'primary':
      return {
        color: colors.text.inverse, // Texto preto no botão branco absoluto
      };
    
    case 'secondary':
      return {
        color: colors.text.primary, // Texto branco absoluto no card cinza
      };
    
    case 'outline':
      return {
        color: colors.text.primary, // Texto branco absoluto
      };
    
    case 'ghost':
      return {
        color: colors.text.primary, // Texto branco absoluto
      };
    
    case 'social':
      switch (socialType) {
        case 'apple':
          return {
            color: colors.text.inverse,
          };
        case 'google':
          return {
            color: colors.text.inverse, // Texto preto no botão branco do Google
          };
        case 'facebook':
          return {
            color: colors.text.inverse,
          };
        default:
          return {
            color: colors.text.inverse,
          };
      }
    
    case 'danger':
      return {
        color: colors.text.primary, // Texto branco absoluto
      };
    
    default:
      return {
        color: colors.text.inverse,
      };
  }
}

// Estilos por tamanho
function getSizeStyles(size: ButtonProps['size']): ViewStyle {
  switch (size) {
    case 'sm':
      return {
        paddingHorizontal: spacing[4],
        paddingVertical: spacing[2],
        minHeight: 40,
      };
    
    case 'md':
      return {
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[4],
        minHeight: 48,
      };
    
    case 'lg':
      return {
        paddingHorizontal: spacing[8],
        paddingVertical: spacing[5],
        minHeight: 56,
      };
    
    default:
      return {
        paddingHorizontal: spacing[6],
        paddingVertical: spacing[4],
        minHeight: 48,
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
function getSpinnerColor(variant: ButtonProps['variant'], socialType?: string): string {
  switch (variant) {
    case 'primary':
      return colors.text.inverse;
    
    case 'secondary':
    case 'outline':
      return colors.text.primary;
    
    case 'ghost':
      return colors.text.primary;
    
    case 'social':
      switch (socialType) {
        case 'apple':
        case 'facebook':
          return colors.text.inverse;
        case 'google':
        default:
          return colors.text.inverse; // Mudado para escuro no Google
      }
    
    case 'danger':
      return colors.text.inverse;
    
    default:
      return colors.text.inverse;
  }
}