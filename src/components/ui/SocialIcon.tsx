import React from 'react';
import { Text } from 'react-native';

interface SocialIconProps {
  type: 'apple' | 'google' | 'facebook';
  size?: number;
}

const SocialIcon: React.FC<SocialIconProps> = ({ type, size = 20 }) => {
  const getIcon = () => {
    switch (type) {
      case 'apple':
        return '🍎';
      case 'google':
        return 'G';
      case 'facebook':
        return 'f';
      default:
        return '🔗';
    }
  };

  return (
    <Text style={{ fontSize: size, fontWeight: 'bold' }}>
      {getIcon()}
    </Text>
  );
};

export default SocialIcon;