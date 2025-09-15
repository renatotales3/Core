import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function OnboardingIndex() {
  return (
    <LinearGradient
      colors={['#0A0A0F', '#131318', '#0A0A0F']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo/Icon Principal */}
        <View className="w-32 h-32 bg-core-primary rounded-full justify-center items-center mb-8">
          <Ionicons name="wallet" size={60} color="#0A0A0F" />
        </View>

        {/* Título Principal */}
        <Text className="text-4xl font-bold text-core-text-primary text-center mb-4">
          Bem-vindo ao Core
        </Text>

        {/* Subtítulo */}
        <Text className="text-xl text-core-text-secondary text-center mb-2">
          No centro das suas finanças
        </Text>

        {/* Descrição */}
        <Text className="text-base text-core-text-muted text-center mb-12 leading-6">
          Controle total sobre seu dinheiro com design moderno e funcionalidades inteligentes
        </Text>

        {/* Botão Começar */}
        <TouchableOpacity
          onPress={() => router.push('/onboarding/step1')}
          className="w-full"
        >
          <LinearGradient
            colors={['#00D4AA', '#6C5CE7']}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 32,
              borderRadius: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text className="text-lg font-semibold text-white mr-2">
              Começar
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Indicador de páginas */}
        <View className="flex-row justify-center mt-8 space-x-2">
          <View className="w-3 h-3 bg-core-primary rounded-full" />
          <View className="w-3 h-3 bg-core-border rounded-full" />
          <View className="w-3 h-3 bg-core-border rounded-full" />
          <View className="w-3 h-3 bg-core-border rounded-full" />
        </View>
      </View>
    </LinearGradient>
  );
}