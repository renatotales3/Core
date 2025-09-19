import React from 'react';
import { View } from 'react-native';
import { Text } from '../ui/Text';
import { TransactionItem } from './TransactionItem';
import { Transaction } from '../../types/financial';
import { colors } from '../../design-system/tokens';
import { useResponsive } from '../../hooks/useResponsive';

interface TransactionTimelineProps {
  transactions: Transaction[];
  onTransactionPress?: (transaction: Transaction) => void;
}

interface GroupedTransactions {
  [date: string]: Transaction[];
}

const formatDateGroup = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const targetDate = new Date(date);
  
  // Reset time to compare only dates
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  
  if (targetDate.getTime() === today.getTime()) {
    return 'Hoje';
  } else if (targetDate.getTime() === yesterday.getTime()) {
    return 'Ontem';
  } else {
    // Check if it's this week
    const daysDiff = Math.floor((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 7) {
      return targetDate.toLocaleDateString('pt-BR', { weekday: 'long' });
    } else {
      return targetDate.toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  }
};

// Type guard for Firestore-like Timestamp objects (have toDate())
const isTimestampLike = (v: unknown): v is { toDate: () => Date } => {
  if (typeof v !== 'object' || v === null) return false;
  const maybe = v as { [k: string]: unknown };
  return typeof maybe.toDate === 'function';
};

const toDate = (value: unknown): Date => {
  if (isTimestampLike(value)) return value.toDate();
  if (value instanceof Date) return value;
  return new Date(String(value));
};

const groupTransactionsByDate = (transactions: Transaction[]): GroupedTransactions => {
  return transactions.reduce((groups, transaction) => {
    const date = toDate((transaction as Transaction).date);
    const dateKey = date.toDateString();

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(transaction);
    return groups;
  }, {} as GroupedTransactions);
};

const DateGroupHeader: React.FC<{ dateString: string }> = ({ dateString }) => {
  const { getResponsiveFontSize, getResponsiveSpacing } = useResponsive();
  
  const date = new Date(dateString);
  const displayText = formatDateGroup(date);
  
  return (
    <View style={{
      paddingVertical: getResponsiveSpacing(8),
      paddingHorizontal: getResponsiveSpacing(16),
      marginTop: getResponsiveSpacing(12),
    }}>
      <Text style={{
        fontSize: getResponsiveFontSize(16),
        fontWeight: '600',
        color: colors.text.primary,
      }}>
        {displayText}
      </Text>
    </View>
  );
};

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({
  transactions,
  onTransactionPress,
}) => {
  const { getResponsiveSpacing } = useResponsive();
  
  if (!transactions || transactions.length === 0) {
    return (
      <View style={{
        paddingVertical: getResponsiveSpacing(32),
        alignItems: 'center',
        paddingHorizontal: getResponsiveSpacing(24),
      }}>
        <Text style={{
          color: colors.text.secondary,
          textAlign: 'center',
          fontSize: 14,
          lineHeight: 20,
        }}>
          Nenhuma transação encontrada.{'\n'}
          Comece adicionando uma receita ou despesa!
        </Text>
      </View>
    );
  }
  
  // Sort transactions by date (most recent first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = toDate(a.date);
    const dateB = toDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  const groupedTransactions = groupTransactionsByDate(sortedTransactions);
  const sortedDateKeys = Object.keys(groupedTransactions).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  return (
    <View>
      {sortedDateKeys.map((dateKey) => (
        <View key={dateKey}>
          <DateGroupHeader dateString={dateKey} />
          
          <View style={{ paddingHorizontal: getResponsiveSpacing(16) }}>
            {groupedTransactions[dateKey].map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() => onTransactionPress?.(transaction)}
                showDate={false} // Não mostrar data individual já que está agrupado
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};