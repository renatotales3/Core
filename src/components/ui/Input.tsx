import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Text } from './Text';
import { EyeIcon, EyeOffIcon } from './Icons';
import { colors, typography, spacing, borderRadius } from '../../design-system/tokens';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  isDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  style?: ViewStyle; // Adicionar esta linha
}

const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  isPassword = false,
  isDisabled = false,
  size = 'md',
  variant = 'default',
  containerStyle,
  inputStyle,
  labelStyle,
  style,
  ...props
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!error;

  // Estilos do container principal
  const mainContainerStyle: ViewStyle = {
    width: '100%',
    ...containerStyle,
    ...style, // Adicionar style aqui
  };

  // Estilos do container do input
  const inputContainerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    ...getVariantStyles(variant),
    ...getSizeStyles(size),
    ...getFocusStyles(isFocused, hasError),
    ...(isDisabled && { opacity: 0.6 }),
  };

  // Estilos do input
  const textInputStyle: TextStyle = {
  flex: 1,
  fontSize: typography.fontSize.base,
  lineHeight: typography.lineHeight.base,
  color: colors.text.primary,
  // Remove qualquer outline visual de foco (web)
  outlineColor: 'transparent',
  ...inputStyle,
  };

  // Estilos do label
  const labelTextStyle: TextStyle = {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.text.secondary,
    marginBottom: spacing[1],
    ...labelStyle,
  };

  // Estilos do texto de ajuda/erro
  const helperTextStyle: TextStyle = {
    fontSize: typography.fontSize.xs,
    marginTop: spacing[1],
    color: hasError ? colors.error[500] : colors.text.muted,
  };

  return (
    <View style={mainContainerStyle}>
      {label && <Text variant="label" style={labelTextStyle}>{label}</Text>}
      
      <View style={inputContainerStyle}>
        {leftIcon && (
          <View style={{ marginRight: spacing[2] }}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          ref={ref}
          style={textInputStyle}
          secureTextEntry={isPassword && !isPasswordVisible}
          editable={!isDisabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.text.muted}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{ marginLeft: spacing[2] }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isPasswordVisible ? (
              <EyeOffIcon size="sm" color="secondary" />
            ) : (
              <EyeIcon size="sm" color="secondary" />
            )}
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && (
          <View style={{ marginLeft: spacing[2] }}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text variant="caption" style={helperTextStyle}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;

// Estilos por variante
function getVariantStyles(variant: InputProps['variant']): ViewStyle {
  switch (variant) {
    case 'filled':
      return {
        backgroundColor: colors.background.tertiary,
        borderColor: colors.border.primary,
      };
    
    case 'default':
    default:
      return {
        backgroundColor: colors.background.secondary,
        borderColor: colors.border.primary,
      };
  }
}

// Estilos por tamanho
function getSizeStyles(size: InputProps['size']): ViewStyle {
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
        paddingHorizontal: spacing[4],
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

// Estilos de foco e erro
function getFocusStyles(isFocused: boolean, hasError: boolean): ViewStyle {
  if (hasError) {
    return {
      borderColor: colors.error[500],
      borderWidth: 2,
    };
  }
  
  if (isFocused) {
    return {
      borderColor: colors.primary[500],
      borderWidth: 2,
    };
  }
  
  return {};
}