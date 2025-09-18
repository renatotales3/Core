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
        amountColor: colors.success[500], // Valor verde
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
  const responsive = useResponsive();

  // Função para determinar cor do valor baseada no tipo e esquema AMOLED
  const getValueColor = (): string => {
    switch (variant) {
      case 'income':
        return colors.success[500]; // Verde para receitas
      case 'expense':
        return colors.error[500]; // Vermelho para despesas  
      case 'balance':
      default:
        // Para balanço, usar branco (#FFFFFF) se positivo, vermelho se negativo
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
    padding: responsive.getResponsiveSpacing(24), // Aumentado o padding
    marginBottom: responsive.getResponsiveSpacing(16),
    marginTop: responsive.getResponsiveSpacing(8), // Melhor margem superior
    ...shadows.md,
    // Responsivo: altura mínima aumentada
    minHeight: responsive.getResponsiveValue({
      sm: 150,
      md: 170,
      lg: 190,
      default: 170,
    }),
  };

  const content = (
    <View style={cardStyle}>
      {/* Header com ícone À ESQUERDA e título */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.getResponsiveSpacing(20), // Mais espaço
      }}>
        {/* Ícone à esquerda - 60% maior */}
        <View style={{
          width: responsive.getResponsiveValue({ sm: 45, md: 52, lg: 58, default: 52 }), // 60% maior
          height: responsive.getResponsiveValue({ sm: 45, md: 52, lg: 58, default: 52 }), // 60% maior
          borderRadius: borderRadius.full,
          backgroundColor: colors.background.accent, // Cinza 3E3E3E para contrastar com o card
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: responsive.getResponsiveSpacing(16), // Espaço entre ícone e título
        }}>
          <Icon 
            size={responsive.getResponsiveValue({ sm: 22, md: 26, lg: 30, default: 26 })} // 60% maior
            color={colors.text.primary} // Ícone branco absoluto
          />
        </View>
        
        {/* Título */}
        <Text style={{
          fontSize: responsive.getResponsiveValue({ sm: 16, md: 18, lg: 20, default: 18 }), // Maior
          fontWeight: '600',
          color: colors.text.primary, // BRANCO ABSOLUTO para títulos
          flex: 1,
        }}>
          {title}
        </Text>
      </View>

      {/* Valor principal */}
      <Text style={{
        fontSize: responsive.getResponsiveValue({ sm: 22, md: 28, lg: 32, default: 28 }), // Maior
        fontWeight: '700', // Mais bold
        color: getValueColor(), // Função que define a cor AMOLED correta
        marginBottom: responsive.getResponsiveSpacing(4),
      }}>
        {formattedValue}
      </Text>

      {/* Subtítulo (se houver) */}
      {subtitle && (
        <Text 
          color="muted" 
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