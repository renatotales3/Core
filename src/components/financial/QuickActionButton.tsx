import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from '../ui/Text';
import { colors, spacing, shadows, borderRadius } from '../../design-system/tokens';
import { useResponsive } from '../../hooks/useResponsive';

interface QuickActionButtonProps {
  title: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
  variant: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
}

const getVariantStyles = (variant: QuickActionButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: colors.text.primary, // Botão branco absoluto
        iconColor: colors.text.inverse, // Ícone preto
        textColor: colors.text.inverse, // Texto preto
      };
    case 'secondary':
      return {
        backgroundColor: colors.background.secondary, // Card cinza 1A1A1A
        iconColor: colors.text.primary, // Ícone branco absoluto
        textColor: colors.text.primary, // Texto branco absoluto
      };
    case 'success':
      return {
        backgroundColor: colors.background.secondary, // Card cinza 1A1A1A
        iconColor: colors.success[500], // Ícone verde
        textColor: colors.text.secondary, // Texto cinza 3E3E3E
      };
    case 'danger':
      return {
        backgroundColor: colors.background.secondary, // Card cinza 1A1A1A
        iconColor: colors.error[500], // Ícone vermelho
        textColor: colors.text.secondary, // Texto cinza 3E3E3E
      };
  }
};

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  icon: Icon,
  onPress,
  variant,
  disabled = false,
}) => {
  const { getResponsiveValue, getResponsiveFontSize, getResponsiveSpacing } = useResponsive();
  
  // Responsive values
  const buttonHeight = getResponsiveValue({ sm: 70, md: 80, lg: 90, default: 80 });
  const buttonPadding = getResponsiveSpacing(16);
  const iconContainerSize = getResponsiveValue({ sm: 28, md: 32, lg: 36, default: 32 });
  const iconSize = getResponsiveValue({ sm: 14, md: 16, lg: 18, default: 16 });
  const textFontSize = getResponsiveFontSize(12);
  const iconMarginBottom = getResponsiveSpacing(8);
  const horizontalMargin = getResponsiveSpacing(8);
  
  const styles = getVariantStyles(variant);
  
  const buttonStyle: ViewStyle = {
    backgroundColor: disabled ? colors.neutral[200] : styles.backgroundColor,
    borderRadius: borderRadius.xl,
    padding: buttonPadding,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: buttonHeight,
    flex: 1,
    marginHorizontal: horizontalMargin,
    ...shadows.sm,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={{
        width: iconContainerSize,
        height: iconContainerSize,
        borderRadius: borderRadius.full,
        backgroundColor: disabled ? colors.neutral[300] : 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: iconMarginBottom,
      }}>
        <Icon 
          size={iconSize} 
          color={disabled ? colors.neutral[500] : styles.iconColor} 
        />
      </View>
      
      <Text style={{
        fontSize: textFontSize,
        fontWeight: '600',
        color: disabled ? colors.neutral[500] : styles.textColor,
        textAlign: 'center',
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};