import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function BankAccountsCard({
  totalBalance = 15420.50,
  accounts = [
    { name: 'Conta Corrente', balance: 8750.30 },
    { name: 'Poupança', balance: 6670.20 }
  ],
  focusMode = false
}) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']} // gradient-blue do CSS
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Efeitos de luz como no CSS */}
        <View style={styles.lightEffect1} />
        <View style={styles.lightEffect2} />

        <View style={styles.header}>
          <Text style={styles.title}>Contas Bancárias</Text>
          <MaterialIcons name="account-balance" size={20} color="rgba(255,255,255,0.8)" />
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.currency}>R$</Text>
          <Text style={styles.totalAmount}>
            {focusMode ? '••••••' : totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.accountsList}>
          {accounts.map((account, index) => (
            <View key={index} style={styles.accountItem}>
              <Text style={styles.accountName}>{account.name}</Text>
              <Text style={styles.accountBalance}>
                {focusMode ? '••••••' : `R$ ${account.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16, // border-radius-lg
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
    position: 'relative',
  },
  lightEffect1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 100,
  },
  lightEffect2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 150,
    height: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  currency: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginRight: 6,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    lineHeight: 36,
  },
  accountsList: {
    flexDirection: 'column',
    gap: 10,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    backdropFilter: 'blur(10px)',
  },
  accountName: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  accountBalance: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
});
