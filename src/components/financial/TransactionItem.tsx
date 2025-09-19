/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { colors, borderRadius } from '../../design-system/tokens';
import { Transaction, TransactionType } from '../../types/financial';
import { useResponsive } from '../../hooks/useResponsive';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
  showDate?: boolean;
}

const getCategoryIcon = (category: string): string => {
  // Mapear categorias para ícones - por enquanto retorna emoji
  const categoryIcons: Record<string, string> = {
    salary: '💰',
    freelance: '💼',
    business: '🏢',
    food: '🍽️',
    transport: '🚗',
    entertainment: '🎬',
    health: '🏥',
    education: '📚',
    shopping: '🛍️',
    bills: '📄',
    rent: '🏠',
    investment: '📈',
  };
  
  return categoryIcons[category] || '💳';
};

const getCategoryName = (category: string): string => {
  const categoryNames: Record<string, string> = {
    salary: 'Salário',
    freelance: 'Freelance',
    business: 'Negócios',
    food: 'Alimentação',
    transport: 'Transporte',
    entertainment: 'Entretenimento',
    health: 'Saúde',
    education: 'Educação',
    shopping: 'Compras',
    bills: 'Contas',
    rent: 'Aluguel',
    investment: 'Investimento',
    other_income: 'Outras Receitas',
    other_expense: 'Outras Despesas',
  };
  
  return categoryNames[category] || category;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

const formatDate = (timestamp: any): string => {
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(date);
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  showDate = true,
}) => {
  const { getResponsiveValue, getResponsiveFontSize, getResponsiveSpacing } = useResponsive();
  
  // Responsive values
  const containerPadding = getResponsiveSpacing(16);
  const containerMarginBottom = getResponsiveSpacing(12);
  const iconSize = getResponsiveValue({ sm: 36, md: 40, lg: 44, default: 40 });
  const iconFontSize = getResponsiveValue({ sm: 16, md: 18, lg: 20, default: 18 });
  const iconMarginRight = getResponsiveSpacing(12);
  const titleFontSize = getResponsiveFontSize(16);
  const titleMarginBottom = getResponsiveSpacing(4);
  const metaFontSize = getResponsiveFontSize(12);
  const metaSpacing = getResponsiveSpacing(8);
  const amountFontSize = getResponsiveFontSize(16);
  
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? colors.text.accent : colors.error[500];
  const amountSign = isIncome ? '+' : '-';

  const content = (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.secondary,
      borderRadius: borderRadius.lg,
      padding: containerPadding,
      marginBottom: containerMarginBottom,
      minHeight: 76,
    }}>
      {/* Ícone da categoria */}
      <View style={{
        width: iconSize,
        height: iconSize,
        borderRadius: borderRadius.full,
        backgroundColor: colors.icon.dot,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: iconMarginRight,
      }}>
        <Text style={{ fontSize: iconFontSize }}>
          {getCategoryIcon(transaction.category)}
        </Text>
      </View>

      {/* Informações da transação */}
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{
          fontSize: titleFontSize,
          fontWeight: '600',
          color: colors.text.primary,
          marginBottom: titleMarginBottom,
          maxWidth: '100%',
        }}>
          {transaction.description}
        </Text>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Text 
            color="secondary"
            style={{
              fontSize: metaFontSize,
              marginRight: metaSpacing,
            }}
          >
            {getCategoryName(transaction.category)}
          </Text>
          
          {showDate && (
            <>
              <View style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.text.secondary,
                marginRight: metaSpacing,
              }} />
              
              <Text 
                color="secondary"
                style={{
                  fontSize: metaFontSize,
                }}
              >
                {formatDate(transaction.date)}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Valor da transação */}
      <View style={{ width: 110, alignItems: 'flex-end' }}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{
          fontSize: amountFontSize,
          fontWeight: '700',
          color: amountColor,
        }}>
          {amountSign}{formatCurrency(Math.abs(transaction.amount))}
        </Text>
      </View>
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