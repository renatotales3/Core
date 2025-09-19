import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from '../ui/Text';
import { spacing } from '../../design-system/tokens';

interface HeaderProps {
  title: string;
  style?: ViewStyle;
}

export function Header({ title, style }: HeaderProps) {
  return (
    <View style={[{
      marginBottom: spacing[4], // Reduzido de 6 para 4
    }, style]}>
      {/* Apenas título, menor e mais limpo */}
      <Text variant="h2" color="primary">
        {title}
      </Text>
    </View>
  );
}