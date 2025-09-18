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
        backgroundColor: colors.background.secondary, // Card cinza 1A1A1A
        iconColor: colors.text.primary, // Ícone branco absoluto
        titleColor: colors.text.primary, // Título BRANCO ABSOLUTO
        amountColor: colors.text.primary, // Valor branco absoluto
      };
    case 'income':
      return {
        backgroundColor: colors.background.secondary, // Card cinza 1A1A1A
        iconColor: colors.text.primary, // Ícone branco absoluto
        titleColor: colors.text.primary, // Título BRANCO ABSOLUTO
          amountColor: colors.text.accent, // Valor em destaque branco (remover verde)
      };
    case 'expense':
      return {
        backgroundColor: colors.background.secondary, // Card cinza 1A1A1A
        iconColor: colors.text.primary, // Ícone branco absoluto
        titleColor: colors.text.primary, // Título BRANCO ABSOLUTO
        amountColor: colors.error[500], // Valor vermelho
      };
  }
};

const getChangeColor = (changeType: FinancialSummaryCardProps['changeType']) => {
  switch (changeType) {
    case 'increase':
      return colors.text.accent;
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
  const responsive = useResponsive();

  // Função para determinar cor do valor baseada no tipo e esquema AMOLED
  const getValueColor = (): string => {
    switch (variant) {
      case 'income':
        return colors.text.accent; // Destaque branco para valores (não usar verde)
      case 'expense':
        return colors.error[500]; // Vermelho para despesas
      case 'balance':
      default:
        return amount >= 0 ? colors.text.primary : colors.error[500];
    }
  };

  const styles = getVariantStyles(variant);
  
  // Formatação do valor
  const formattedValue = formatCurrency(amount);

  // Subtítulo com mudança (se houver)
  const subtitle = change ? 
    `${formatPercentage(change)} este mês` : 
    undefined;
  
  const cardStyle: ViewStyle = {
    backgroundColor: styles.backgroundColor,
    borderRadius: borderRadius.xl,
    padding: responsive.getResponsiveSpacing(16),
    marginBottom: responsive.getResponsiveSpacing(12),
    marginTop: responsive.getResponsiveSpacing(6),
    ...shadows.md,
    // Responsivo: altura mínima aumentada
    minHeight: responsive.getResponsiveValue({
      sm: 110,
      md: 120,
      lg: 140,
      default: 120,
    }),
    width: '100%',
  };

  const content = (
    <View style={cardStyle}>
      {/* Header com ícone À ESQUERDA e título */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.getResponsiveSpacing(12),
      }}>
        {/* Ícone à esquerda - 60% maior */}
        <View style={{
          width: responsive.getResponsiveValue({ sm: 36, md: 42, lg: 48, default: 40 }),
          height: responsive.getResponsiveValue({ sm: 36, md: 42, lg: 48, default: 40 }),
          borderRadius: borderRadius.full,
          backgroundColor: colors.icon.dot, // usar token icon.dot para contraste apropriado
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: responsive.getResponsiveSpacing(12),
        }}>
          <Icon 
            size={responsive.getResponsiveValue({ sm: 22, md: 26, lg: 30, default: 26 })} // 60% maior
            color={colors.text.primary} // Ícone branco absoluto
          />
        </View>
        
        {/* Título */}
        <Text numberOfLines={1} ellipsizeMode="tail" style={{
          fontSize: responsive.getResponsiveValue({ sm: 14, md: 16, lg: 18, default: 16 }),
          fontWeight: '600',
          color: colors.text.primary, // BRANCO ABSOLUTO para títulos
          flex: 1,
          minWidth: 60,
        }}>
          {title}
        </Text>
      </View>

      {/* Valor principal */}
      <Text style={{
        fontSize: responsive.getResponsiveValue({ sm: 18, md: 22, lg: 26, default: 22 }),
        fontWeight: '700', // Mais bold
        color: getValueColor(), // Função que define a cor AMOLED correta
        marginBottom: responsive.getResponsiveSpacing(2),
      }} numberOfLines={1} ellipsizeMode="tail">
        {formattedValue}
      </Text>

      {/* Subtítulo (se houver) */}
      {subtitle && (
        <Text 
          color="iconDot" 
          style={{
            fontSize: responsive.getResponsiveValue({ sm: 13, md: 14, lg: 15, default: 14 }),
            fontWeight: '400',
          }}
        >
          {subtitle}
        </Text>
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