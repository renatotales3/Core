/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { View } from 'react-native';
import { colors } from '../../design-system/tokens';

export const TabBarBackground: React.FC = () => {
  return (
    <View style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 64,
      backgroundColor: colors.background.primary,
      zIndex: 10,
      // pointerEvents none para não interceptar toques
      pointerEvents: 'none' as any,
    }} />
  );
};

export default TabBarBackground;
