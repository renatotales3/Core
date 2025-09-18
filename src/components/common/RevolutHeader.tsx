import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '../ui/Text';
import { SearchIcon, BellIcon, SettingsIcon, UserIcon } from '../ui/Icons';
import { colors, spacing, borderRadius } from '../../design-system/tokens';
import { useResponsive } from '../../hooks/useResponsive';

interface RevolutHeaderProps {
  userAvatar?: string;
  userName?: string;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  onAvatarPress?: () => void;
  searchPlaceholder?: string;
}

export const RevolutHeader: React.FC<RevolutHeaderProps> = ({
  userAvatar,
  userName = 'Usuário',
  onSearchPress,
  onNotificationPress,
  onSettingsPress,
  onAvatarPress,
  searchPlaceholder = 'Pesquisar transações...',
}) => {
  const { getResponsiveSpacing, getResponsiveFontSize } = useResponsive();

  const avatarSize = 40;
  const iconSize = 24;
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getResponsiveSpacing(24),
      paddingTop: getResponsiveSpacing(16),
      paddingBottom: getResponsiveSpacing(12),
      backgroundColor: colors.background.primary,
    }}>
      {/* Avatar do Usuário */}
      <TouchableOpacity
        onPress={onAvatarPress}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.primary[600],
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: getResponsiveSpacing(12),
        }}
        activeOpacity={0.8}
      >
        {userAvatar ? (
          // TODO: Implementar Image quando adicionar foto
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        ) : (
          <UserIcon size={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>

      {/* Barra de Pesquisa */}
      <TouchableOpacity
        onPress={onSearchPress}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background.secondary,
          borderRadius: borderRadius.lg,
          paddingHorizontal: getResponsiveSpacing(16),
          paddingVertical: getResponsiveSpacing(12),
          marginRight: getResponsiveSpacing(12),
        }}
        activeOpacity={0.8}
      >
        <SearchIcon 
          size={18} 
          color={colors.text.secondary} 
          style={{ marginRight: getResponsiveSpacing(8) }}
        />
        <Text style={{
          flex: 1,
          fontSize: getResponsiveFontSize(14),
          color: colors.text.secondary,
        }}>
          {searchPlaceholder}
        </Text>
      </TouchableOpacity>

      {/* Ícones de Ação */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: getResponsiveSpacing(8),
      }}>
        {/* Notificações */}
        <TouchableOpacity
          onPress={onNotificationPress}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.background.secondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
        >
          <BellIcon size={iconSize} color={colors.text.secondary} />
        </TouchableOpacity>

        {/* Configurações */}
        <TouchableOpacity
          onPress={onSettingsPress}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.background.secondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
        >
          <SettingsIcon size={iconSize} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};