import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function MonthBalanceCard({ balance = 2500.50, previousBalance = 2200.00, focusMode = false }) {
  const variation = previousBalance !== null ? ((balance - previousBalance) / Math.abs(previousBalance)) * 100 : null;
  const trend = variation !== null ? (variation > 0 ? 'aumentou' : 'diminuiu') : null;
  const trendColor = variation > 0 ? '#10b981' : '#ef4444'; // success-color e danger-color do CSS
  const insight = variation !== null ? `Seu saldo ${trend} ${Math.abs(variation).toFixed(1)}% em relação ao mês anterior!` : '';

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['#6366f1', '#8b5cf6']} // gradient-primary do CSS
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Efeitos de luz como no CSS */}
        <View style={styles.lightEffect1} />
        <View style={styles.lightEffect2} />

        <View style={styles.header}>
          <Text style={styles.title}>Saldo do Mês</Text>
          <MaterialIcons name="trending-up" size={20} color="rgba(255,255,255,0.8)" />
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.currency}>R$</Text>
          <Text style={styles.amount}>
            {focusMode ? '••••••' : balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {variation !== null && (
          <View style={styles.insights}>
            <View style={styles.insightItem}>
              <Text style={[styles.insightText, { color: trendColor }]}>
                {insight}
              </Text>
            </View>
          </View>
        )}
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
  amountContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  currency: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginRight: 6,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    lineHeight: 36,
  },
  insights: {
    flexDirection: 'column',
    gap: 10,
  },
  insightItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  insightText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
  },
});
