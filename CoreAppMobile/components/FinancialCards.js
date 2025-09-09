import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function FinancialCards({
  income = 4520.30,
  expense = 3210.75,
  balance = 1309.55,
  focusMode = false
}) {
  const valueOrHidden = (value) => focusMode ? '••••••' : `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <View style={styles.cardsContainer}>
      <View style={[styles.card, styles.incomeCard]}>
        <View style={styles.cardIcon}>
          <MaterialCommunityIcons name="cash-plus" size={40} color="#10b981" />
        </View>
        <Text style={styles.cardTitle}>RECEITAS</Text>
        <Text style={[styles.cardAmount, { color: '#10b981' }]}>
          {valueOrHidden(income)}
        </Text>
      </View>

      <View style={[styles.card, styles.expenseCard]}>
        <View style={styles.cardIcon}>
          <MaterialCommunityIcons name="cash-minus" size={40} color="#ef4444" />
        </View>
        <Text style={styles.cardTitle}>DESPESAS</Text>
        <Text style={[styles.cardAmount, { color: '#ef4444' }]}>
          {valueOrHidden(expense)}
        </Text>
      </View>

      <View style={[styles.card, styles.balanceCard]}>
        <View style={styles.cardIcon}>
          <MaterialIcons name="account-balance-wallet" size={40} color="#6366f1" />
        </View>
        <Text style={styles.cardTitle}>SALDO</Text>
        <Text style={[styles.cardAmount, { color: balance >= 0 ? '#10b981' : '#ef4444' }]}>
          {valueOrHidden(balance)}
        </Text>
      </View>

      <View style={[styles.card, styles.savingsCard]}>
        <View style={styles.cardIcon}>
          <MaterialCommunityIcons name="piggy-bank" size={40} color="#f59e0b" />
        </View>
        <Text style={styles.cardTitle}>POUPANÇA</Text>
        <Text style={[styles.cardAmount, { color: '#f59e0b' }]}>
          {valueOrHidden(2500.00)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    width: '48%', // Para grid 2x2
    backgroundColor: '#ffffff',
    borderRadius: 12, // border-radius
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  incomeCard: {
    // Sem gradiente, apenas ícone verde
  },
  expenseCard: {
    // Sem gradiente, apenas ícone vermelho
  },
  balanceCard: {
    // Sem gradiente, apenas ícone azul
  },
  savingsCard: {
    // Sem gradiente, apenas ícone amarelo
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#f8fafc',
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
});
