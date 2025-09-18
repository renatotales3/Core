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
  const { isExtraSmall } = useResponsive();

  const avatarSize = 40;
  const iconSize = 24;
  
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: getResponsiveSpacing(16),
      paddingTop: getResponsiveSpacing(8),
      paddingBottom: getResponsiveSpacing(8),
      backgroundColor: colors.background.primary,
    }}>
      {/* Avatar do Usuário */}
      <TouchableOpacity
        onPress={onAvatarPress}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: colors.icon.dot,
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
          minWidth: isExtraSmall ? 100 : 120,
          maxWidth: '100%',
          flexShrink: 1,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background.secondary,
          borderRadius: borderRadius.lg,
          paddingHorizontal: getResponsiveSpacing(isExtraSmall ? 8 : 12),
          paddingVertical: getResponsiveSpacing(isExtraSmall ? 6 : 8),
          marginRight: getResponsiveSpacing(8),
        }}
        activeOpacity={0.8}
      >
        <View style={{ marginRight: getResponsiveSpacing(8) }}>
          <SearchIcon size={18} color={colors.text.primary} />
        </View>
        <Text numberOfLines={1} ellipsizeMode="tail" style={{
          flex: 1,
          fontSize: getResponsiveFontSize(13),
          color: colors.text.secondary,
          opacity: 0.95,
          // garantir que o texto não force o componente a crescer
          minWidth: 0,
        }}>
          {searchPlaceholder}
        </Text>
      </TouchableOpacity>

      {/* Ícones de Ação */}
        <View style={{
        flexDirection: 'row',
        alignItems: 'center',
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
          <BellIcon size={iconSize} color={colors.text.primary} />
        </TouchableOpacity>

        {/* Espaçamento entre ícones */}
        <View style={{ width: getResponsiveSpacing(6) }} />

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
          <SettingsIcon size={iconSize} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};