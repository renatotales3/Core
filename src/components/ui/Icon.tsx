/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Feather, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export type IconName = 
  // Auth
  | 'email' | 'password' | 'user' | 'phone' | 'eye' | 'eye-off'
  // Social
  | 'apple' | 'google' | 'facebook'
  // Navigation
  | 'home' | 'transactions' | 'investments' | 'settings' | 'back'
  // Actions
  | 'edit' | 'delete' | 'save' | 'check' | 'close' | 'search'
  // Finance
  | 'dollar' | 'credit-card' | 'pie-chart' | 'trending-up' | 'trending-down'
  // Interface
  | 'bell' | 'star' | 'heart' | 'share' | 'download' | 'upload'
  | 'calendar' | 'clock' | 'map-pin' | 'camera' | 'image'
  // Arrows
  | 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right'
  | 'chevron-up' | 'chevron-down' | 'chevron-left' | 'chevron-right';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: any;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = colors.text.primary,
  style 
}) => {
  const iconProps = { size, color, style };

  switch (name) {
    // Auth icons
    case 'email':
      return <MaterialIcons name="email" {...iconProps} />;
    case 'password':
      return <Feather name="lock" {...iconProps} />;
    case 'user':
      return <Feather name="user" {...iconProps} />;
    case 'phone':
      return <Feather name="phone" {...iconProps} />;
    case 'eye':
      return <Feather name="eye" {...iconProps} />;
    case 'eye-off':
      return <Feather name="eye-off" {...iconProps} />;

    // Social icons
    case 'apple':
      return <MaterialIcons name="apple" {...iconProps} />;
    case 'google':
      return <AntDesign name="google" {...iconProps} />;
    case 'facebook':
      return <MaterialIcons name="facebook" {...iconProps} />;

    // Navigation icons
    case 'home':
      return <Feather name="home" {...iconProps} />;
    case 'transactions':
      return <Feather name="list" {...iconProps} />;
    case 'investments':
      return <Feather name="trending-up" {...iconProps} />;
    case 'settings':
      return <Feather name="settings" {...iconProps} />;
    case 'back':
      return <Feather name="arrow-left" {...iconProps} />;

    // Action icons
    case 'edit':
      return <Feather name="edit" {...iconProps} />;
    case 'delete':
      return <Feather name="trash-2" {...iconProps} />;
    case 'save':
      return <Feather name="save" {...iconProps} />;
    case 'check':
      return <Feather name="check" {...iconProps} />;
    case 'close':
      return <Feather name="x" {...iconProps} />;
    case 'search':
      return <Feather name="search" {...iconProps} />;

    // Finance icons
    case 'dollar':
      return <Feather name="dollar-sign" {...iconProps} />;
    case 'credit-card':
      return <Feather name="credit-card" {...iconProps} />;
    case 'pie-chart':
      return <Feather name="pie-chart" {...iconProps} />;
    case 'trending-up':
      return <Feather name="trending-up" {...iconProps} />;
    case 'trending-down':
      return <Feather name="trending-down" {...iconProps} />;

    // Interface icons
    case 'bell':
      return <Feather name="bell" {...iconProps} />;
    case 'star':
      return <Feather name="star" {...iconProps} />;
    case 'heart':
      return <Feather name="heart" {...iconProps} />;
    case 'share':
      return <Feather name="share" {...iconProps} />;
    case 'download':
      return <Feather name="download" {...iconProps} />;
    case 'upload':
      return <Feather name="upload" {...iconProps} />;
    case 'calendar':
      return <Feather name="calendar" {...iconProps} />;
    case 'clock':
      return <Feather name="clock" {...iconProps} />;
    case 'map-pin':
      return <Feather name="map-pin" {...iconProps} />;
    case 'camera':
      return <Feather name="camera" {...iconProps} />;
    case 'image':
      return <Feather name="image" {...iconProps} />;

    // Arrow icons
    case 'arrow-up':
      return <Feather name="arrow-up" {...iconProps} />;
    case 'arrow-down':
      return <Feather name="arrow-down" {...iconProps} />;
    case 'arrow-left':
      return <Feather name="arrow-left" {...iconProps} />;
    case 'arrow-right':
      return <Feather name="arrow-right" {...iconProps} />;
    case 'chevron-up':
      return <Feather name="chevron-up" {...iconProps} />;
    case 'chevron-down':
      return <Feather name="chevron-down" {...iconProps} />;
    case 'chevron-left':
      return <Feather name="chevron-left" {...iconProps} />;
    case 'chevron-right':
      return <Feather name="chevron-right" {...iconProps} />;

    default:
      return <Feather name="help-circle" {...iconProps} />;
  }
};