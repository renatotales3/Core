import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from '../ui/Text';
import { IconName } from '../ui/Icons';
import { colors, spacing } from '../../design-system/tokens';

interface HeaderProps {
  title: string;
  icon: React.ComponentType<any>;
  subtitle?: string;
  style?: ViewStyle;
}

export function Header({ title, icon: IconComponent, subtitle, style }: HeaderProps) {
  return (
    <View style={[{
      marginBottom: spacing[6],
    }, style]}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: subtitle ? spacing[2] : 0,
      }}>
        {/* Ícone premium à esquerda */}
        <View style={{ 
          backgroundColor: colors.primary[900], 
          borderRadius: 12, 
          padding: spacing[2],
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing[3],
          shadowColor: colors.primary[500],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 3,
        }}>
          <IconComponent size="lg" color="accent" />
        </View>
        
        {/* Título */}
        <Text variant="h1" color="primary">
          {title}
        </Text>
      </View>
      
      {/* Subtítulo opcional */}
      {subtitle && (
        <Text variant="body" color="secondary" style={{ marginLeft: spacing[10] }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}