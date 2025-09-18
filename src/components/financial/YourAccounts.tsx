import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '../ui/Text';
import { colors, borderRadius } from '../../design-system/tokens';
import { useResponsive } from '../../hooks/useResponsive';

interface AccountCardProps {
  bankName: string;
  accountType: string;
  balance: number;
  color: string;
  onPress?: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  bankName,
  accountType,
  balance,
  color,
  onPress,
}) => {
  const { getResponsiveValue, getResponsiveFontSize, getResponsiveSpacing } = useResponsive();
  
  const cardWidth = getResponsiveValue({ sm: 140, md: 160, lg: 180, default: 150 });
  const cardHeight = getResponsiveValue({ sm: 90, md: 100, lg: 110, default: 95 });
  
  return (
    <TouchableOpacity
      style={{
        width: cardWidth,
        height: cardHeight,
        backgroundColor: colors.background.secondary, // padronizar cor do card
        borderRadius: borderRadius.lg,
        padding: getResponsiveSpacing(12),
        marginRight: getResponsiveSpacing(12),
        justifyContent: 'space-between',
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{
          fontSize: getResponsiveFontSize(14),
          fontWeight: '600',
          color: colors.text.primary,
          width: '100%',
        }}>
          {bankName}
        </Text>
        <Text style={{
          fontSize: getResponsiveFontSize(12),
          color: colors.text.secondary,
          marginTop: 2,
        }}>
          {accountType}
        </Text>
      </View>
      
      <Text style={{
        fontSize: getResponsiveFontSize(16),
        fontWeight: '700',
        color: colors.text.primary,
      }}>
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 0,
        }).format(balance)}
      </Text>
    </TouchableOpacity>
  );
};

interface YourAccountsProps {
  onAccountPress?: (accountId: string) => void;
}

// Dados mockados dos bancos
const mockAccounts = [
  {
    id: 'bb-corrente',
    bankName: 'Banco do Brasil',
    accountType: 'Conta Corrente',
    balance: 5420.50,
    color: '#FBB040', // Amarelo BB
  },
  {
    id: 'nubank-corrente',
    bankName: 'Nubank',
    accountType: 'Conta Corrente',
    balance: 3280.00,
    color: '#8A05BE', // Roxo Nubank
  },
  {
    id: 'itau-poupanca',
    bankName: 'Itaú',
    accountType: 'Poupança',
    balance: 2150.75,
    color: '#EC7000', // Laranja Itaú
  },
  {
    id: 'caixa-poupanca',
    bankName: 'Caixa',
    accountType: 'Poupança',
    balance: 890.20,
    color: '#0070BA', // Azul Caixa
  },
];

export const YourAccounts: React.FC<YourAccountsProps> = ({
  onAccountPress,
}) => {
  const { getResponsiveFontSize, getResponsiveSpacing } = useResponsive();
  
  return (
    <View style={{ marginBottom: getResponsiveSpacing(32) }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: getResponsiveSpacing(16),
        paddingHorizontal: getResponsiveSpacing(24),
      }}>
        <Text style={{
          fontSize: getResponsiveFontSize(18),
          fontWeight: '600',
          color: colors.text.primary,
        }}>
          Suas Contas
        </Text>
        
        <Text style={{
          fontSize: getResponsiveFontSize(14),
          fontWeight: '500',
          color: colors.text.accent,
        }}>
          Ver todas
        </Text>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: getResponsiveSpacing(24),
          alignItems: 'center',
        }}
      >
        {mockAccounts.map((account) => (
          <AccountCard
            key={account.id}
            bankName={account.bankName}
            accountType={account.accountType}
            balance={account.balance}
            // padronizar cor para o design do app (usar token de background para cards)
            color={colors.background.secondary}
            onPress={() => onAccountPress?.(account.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};