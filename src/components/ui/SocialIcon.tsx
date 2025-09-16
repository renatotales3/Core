import React from 'react';
import { Icon } from './Icon';

interface SocialIconProps {
  type: 'apple' | 'google' | 'facebook';
  size?: number;
  color?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ type, size = 20, color }) => {
  return <Icon name={type} size={size} color={color} />;
};

export default SocialIcon;