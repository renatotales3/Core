import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from '../ui/Text';
import { colors, spacing, borderRadius } from '../../design-system/tokens';
import { useResponsive } from '../../hooks/useResponsive';

interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
}

interface ExpensesByCategoryChartProps {
  data: CategoryExpense[];
  totalExpenses: number;
}

const { width: screenWidth } = Dimensions.get('window');

export const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({
  data,
  totalExpenses,
}) => {
  const { getResponsiveValue, getResponsiveFontSize, getResponsiveSpacing } = useResponsive();
  
  // Responsive values
  const containerPadding = getResponsiveSpacing(24);
  const titleFontSize = getResponsiveFontSize(18);
  const categoryLabelWidth = getResponsiveValue({ sm: 60, md: 80, lg: 100, default: 80 });
  const barHeight = getResponsiveValue({ sm: 20, md: 24, lg: 28, default: 24 });
  const categoryFontSize = getResponsiveFontSize(12);
  const valueFontSize = getResponsiveFontSize(12);
  const percentageFontSize = getResponsiveFontSize(10);
  const itemSpacing = getResponsiveSpacing(12);
  const valueWidth = getResponsiveValue({ sm: 50, md: 60, lg: 70, default: 60 });
  const totalFontSize = getResponsiveFontSize(14);
  const totalValueFontSize = getResponsiveFontSize(16);
  
  // Calcular percentuais
  const dataWithPercentages = data.map(item => ({
    ...item,
    percentage: (item.amount / totalExpenses) * 100,
  }));

  // Criar barras horizontais simples
  const renderBars = () => {
    return dataWithPercentages.map((item, index) => (
      <View key={index} style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: itemSpacing,
      }}>
        {/* Categoria */}
        <View style={{ width: categoryLabelWidth }}>
          <Text 
            color="secondary" 
            style={{
              fontSize: categoryFontSize,
              fontWeight: '500',
            }}
          >
            {item.category}
          </Text>
        </View>
        
        {/* Barra */}
        <View style={{
          flex: 1,
          height: barHeight,
          backgroundColor: colors.background.accent,
          borderRadius: borderRadius.md,
          marginHorizontal: getResponsiveSpacing(12),
          overflow: 'hidden',
        }}>
          <View style={{
            width: `${item.percentage}%`,
            height: '100%',
            backgroundColor: item.color,
            borderRadius: borderRadius.md,
          }} />
        </View>
        
        {/* Valor */}
        <View style={{ width: valueWidth, alignItems: 'flex-end' }}>
          <Text style={{
            fontSize: valueFontSize,
            fontWeight: '600',
            color: colors.text.primary,
          }}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 0,
            }).format(item.amount)}
          </Text>
          <Text 
            color="muted"
            style={{
              fontSize: percentageFontSize,
            }}
          >
            {item.percentage.toFixed(1)}%
          </Text>
        </View>
      </View>
    ));
  };

  return (
    <View style={{
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.xl,
      padding: containerPadding,
      marginBottom: getResponsiveSpacing(16),
    }}>
      {/* Título */}
      <Text style={{
        fontSize: titleFontSize,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: getResponsiveSpacing(20),
      }}>
        Gastos por Categoria
      </Text>

      {/* Barras */}
      <View>
        {renderBars()}
      </View>

      {/* Total */}
      <View style={{
        borderTopWidth: 1,
        borderTopColor: colors.border.primary,
        paddingTop: getResponsiveSpacing(16),
        marginTop: getResponsiveSpacing(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: totalFontSize,
          fontWeight: '600',
          color: colors.text.secondary,
        }}>
          Total
        </Text>
        <Text style={{
          fontSize: totalValueFontSize,
          fontWeight: '700',
          color: colors.text.primary,
        }}>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalExpenses)}
        </Text>
      </View>
    </View>
  );
};