import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from '../ui/Text';
import { colors, spacing, shadows, borderRadius } from '../../design-system/tokens';
import { useResponsive } from '../../hooks/useResponsive';

interface FinancialSummaryCardProps {
  title: string;
  amount: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
  variant: 'balance' | 'income' | 'expense';
  onPress?: () => void;
}

const getVariantStyles = (variant: FinancialSummaryCardProps['variant']) => {
  switch (variant) {
    case 'balance':
      return {
        backgroundColor: colors.primary[600],
        iconColor: colors.text.primary,
        titleColor: colors.primary[200],
        amountColor: colors.text.primary,
      };
    case 'income':
      return {
        backgroundColor: colors.background.secondary,
        iconColor: colors.success[500],
        titleColor: colors.text.secondary,
        amountColor: colors.success[500],
      };
    case 'expense':
      return {
        backgroundColor: colors.background.secondary,
        iconColor: colors.error[500],
        titleColor: colors.text.secondary,
        amountColor: colors.error[500],
      };
  }
};

const getChangeColor = (changeType: FinancialSummaryCardProps['changeType']) => {
  switch (changeType) {
    case 'increase':
      return colors.success[500];
    case 'decrease':
      return colors.error[500];
    case 'neutral':
    default:
      return colors.text.secondary;
  }
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

const formatPercentage = (value: number): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  title,
  amount,
  change,
  changeType = 'neutral',
  icon: Icon,
  variant,
  onPress,
}) => {
  const styles = getVariantStyles(variant);
  const responsive = useResponsive();
  
  const cardStyle: ViewStyle = {
    backgroundColor: styles.backgroundColor,
    borderRadius: borderRadius.xl,
    padding: responsive.padding,
    marginBottom: responsive.getResponsiveSpacing(16),
    ...shadows.md,
    // Responsivo: altura mínima para evitar "achatamento"
    minHeight: responsive.getResponsiveValue({
      sm: 120,
      md: 140,
      lg: 160,
      default: 140,
    }),
  };

  const content = (
    <View style={cardStyle}>
      {/* Header com título e ícone */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: responsive.getResponsiveSpacing(16),
      }}>
        <Text style={{
          fontSize: responsive.fontSize.sm,
          fontWeight: '500',
          color: styles.titleColor,
          flex: 1,
          marginRight: spacing[2],
        }}>
          {title}
        </Text>
        
        <View style={{
          width: responsive.getResponsiveValue({ sm: 28, md: 32, lg: 36, default: 32 }),
          height: responsive.getResponsiveValue({ sm: 28, md: 32, lg: 36, default: 32 }),
          borderRadius: borderRadius.full,
          backgroundColor: variant === 'balance' ? colors.primary[500] : colors.neutral[0],
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon 
            size={responsive.getResponsiveValue({ sm: 14, md: 16, lg: 18, default: 16 })} 
            color={styles.iconColor} 
          />
        </View>
      </View>

      {/* Valor principal */}
      <Text style={{
        fontSize: responsive.getResponsiveValue({
          sm: 20,
          md: 24,
          lg: 28,
          default: 24,
        }),
        fontWeight: '700',
        color: styles.amountColor,
        marginBottom: change !== undefined ? responsive.getResponsiveSpacing(8) : 0,
        lineHeight: responsive.getResponsiveValue({
          sm: 24,
          md: 28,
          lg: 32,
          default: 28,
        }),
      }}>
        {formatCurrency(amount)}
      </Text>

      {/* Mudança percentual */}
      {change !== undefined && (
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <Text style={{
            fontSize: responsive.fontSize.xs,
            fontWeight: '500',
            color: getChangeColor(changeType),
            lineHeight: responsive.getResponsiveValue({
              sm: 14,
              md: 16,
              lg: 18,
              default: 16,
            }),
          }}>
            {formatPercentage(change)} em relação ao mês anterior
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};