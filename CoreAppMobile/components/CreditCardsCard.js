import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

export default function CreditCardsCard({
  creditLimit = 5000.00,
  creditUsed = 1250.75,
  cards = [
    { name: 'Nubank', balance: 750.30, dueDate: '15/09' },
    { name: 'Inter', balance: 500.45, dueDate: '20/09' }
  ],
  focusMode = false
}) {
  const usagePercentage = creditLimit > 0 ? Math.round((creditUsed / creditLimit) * 100) : 0;

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']} // gradient-purple do CSS
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Efeitos de luz como no CSS */}
        <View style={styles.lightEffect1} />
        <View style={styles.lightEffect2} />

        <View style={styles.header}>
          <Text style={styles.title}>Cartões de Crédito</Text>
          <MaterialIcons name="credit-card" size={20} color="rgba(255,255,255,0.8)" />
        </View>

        <View style={styles.summary}>
          <Text style={styles.limitText}>Limite Disponível</Text>
          <Text style={styles.amount}>
            {focusMode ? '••••••' : `R$ ${(creditLimit - creditUsed).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          </Text>
          <Text style={styles.usage}>
            Utilizado: {focusMode ? '••••••' : `R$ ${creditUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${usagePercentage}%)`}
          </Text>
        </View>

        <View style={styles.cardsDetails}>
          {cards.map((card, index) => (
            <View key={index} style={styles.cardItem}>
              <Text style={styles.cardName}>{card.name}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardBalance}>
                  {focusMode ? '••••••' : `R$ ${card.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                </Text>
                <Text style={styles.cardDue}>Vence em {card.dueDate}</Text>
              </View>
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
  summary: {
    marginBottom: 20,
    alignItems: 'center',
  },
  limitText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  amount: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    lineHeight: 32,
    marginBottom: 8,
  },
  usage: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  cardsDetails: {
    flexDirection: 'column',
    gap: 10,
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    backdropFilter: 'blur(10px)',
  },
  cardName: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
  cardInfo: {
    alignItems: 'flex-end',
  },
  cardBalance: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  cardDue: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
  },
});
