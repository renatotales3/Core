/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { PlusIcon, MinusIcon, ArrowRightIcon, BarChartIcon } from '../ui/Icons';
import { colors } from '../../design-system/tokens';
import { useResponsive } from '../../hooks/useResponsive';

interface CircularActionButtonProps {
  icon: React.ComponentType<any>;
  title: string;
  onPress: () => void;
  variant: 'income' | 'expense' | 'transfer' | 'reports';
}

const getVariantColors = (variant: CircularActionButtonProps['variant']) => {
  switch (variant) {
    case 'income':
      return {
        backgroundColor: colors.background.secondary,
        iconColor: colors.text.primary,
      };
    case 'expense':
      return {
        backgroundColor: colors.background.secondary,
        iconColor: colors.text.primary,
      };
    case 'transfer':
      return {
        backgroundColor: colors.background.secondary,
        iconColor: colors.text.primary,
      };
    case 'reports':
      return {
        backgroundColor: colors.background.secondary,
        iconColor: colors.text.primary,
      };
  }
};

const CircularActionButton: React.FC<CircularActionButtonProps> = ({
  icon: Icon,
  title,
  onPress,
  variant,
}) => {
  const { getResponsiveValue, getResponsiveFontSize, getResponsiveSpacing } = useResponsive();
  
  const buttonSize = getResponsiveValue({ sm: 56, md: 64, lg: 68, default: 60 });
  const iconSize = getResponsiveValue({ sm: 20, md: 24, lg: 26, default: 22 });
  const titleFontSize = getResponsiveFontSize(12);
  const titleMarginTop = getResponsiveSpacing(8);
  
  const colors_variant = getVariantColors(variant);
  
  return (
    <View style={{
      alignItems: 'center',
      width: buttonSize + getResponsiveSpacing(8),
    }}>
      <TouchableOpacity
        style={{
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor: colors_variant.backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: titleMarginTop,
        }}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Icon 
          size={iconSize} 
          color={colors_variant.iconColor} 
        />
      </TouchableOpacity>
      
      <Text style={{
        fontSize: titleFontSize,
        fontWeight: '500',
        color: colors.text.primary,
        textAlign: 'center',
      }}>
        {title}
      </Text>
    </View>
  );
};

interface QuickActionsRowProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onTransfer: () => void;
  onReports: () => void;
}

export const QuickActionsRow: React.FC<QuickActionsRowProps> = ({
  onAddIncome,
  onAddExpense,
  onTransfer,
  onReports,
}) => {
  const { getResponsiveSpacing } = useResponsive();
  
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: getResponsiveSpacing(8),
      gap: getResponsiveSpacing(8),
    }}>
      <CircularActionButton
        icon={PlusIcon}
        title="Receita"
        variant="income"
        onPress={onAddIncome}
      />
      
      <CircularActionButton
        icon={MinusIcon}
        title="Despesa"
        variant="expense"
        onPress={onAddExpense}
      />
      
      <CircularActionButton
        icon={ArrowRightIcon}
        title="Transferir"
        variant="transfer"
        onPress={onTransfer}
      />
      
      <CircularActionButton
        icon={BarChartIcon}
        title="Relatórios"
        variant="reports"
        onPress={onReports}
      />
    </View>
  );
};