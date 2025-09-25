import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';
import { theme } from '../../theme';

interface CardProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'elevated';
  padding?: keyof typeof theme.spacing;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'primary',
  padding = 'lg',
  children,
  style,
  ...props
}) => {
  const cardStyle: ViewStyle = [
    styles.base,
    styles[variant],
    { padding: theme.spacing[padding] },
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
  },
  
  primary: {
    backgroundColor: theme.colors.surface.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  
  secondary: {
    backgroundColor: theme.colors.surface.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  
  elevated: {
    backgroundColor: theme.colors.surface.elevated,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});