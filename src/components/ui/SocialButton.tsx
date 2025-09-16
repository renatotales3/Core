import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

export interface SocialButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  provider: 'apple' | 'google' | 'facebook';
  icon?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function SocialButton({
  title,
  provider,
  icon,
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  style,
  textStyle,
  onPress,
  ...props
}: SocialButtonProps) {
  const disabled = isDisabled || isLoading;

  // Estilos do container
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border.primary,
    backgroundColor: colors.background.primary,
    opacity: disabled ? 0.6 : 1,
    ...(fullWidth && { width: '100%' }),
    ...style,
  };

  // Estilos do texto
  const textStyles: TextStyle = {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: icon ? spacing[3] : 0,
    ...textStyle,
  };

  // Ícones padrão se não fornecido
  const getDefaultIcon = () => {
    switch (provider) {
      case 'apple':
        return (
          <View style={{
            width: 20,
            height: 20,
            backgroundColor: colors.social.apple,
            borderRadius: 4,
          }} />
        );
      case 'google':
        return (
          <View style={{
            width: 20,
            height: 20,
            backgroundColor: colors.social.google,
            borderRadius: 10,
          }} />
        );
      case 'facebook':
        return (
          <View style={{
            width: 20,
            height: 20,
            backgroundColor: colors.social.facebook,
            borderRadius: 10,
          }} />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      {icon || getDefaultIcon()}
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
}