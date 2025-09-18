import { Dimensions } from 'react-native';
import { breakpoints } from '../design-system/tokens';

/**
 * Hook para responsividade baseado em breakpoints
 */
export const useResponsive = () => {
  const { width, height } = Dimensions.get('window');
  
  // Determinar o breakpoint atual
  const isSmall = width < breakpoints.sm;
  const isExtraSmall = width <= 320; // celulares muito estreitos
  const isMedium = width >= breakpoints.sm && width < breakpoints.md;
  const isLarge = width >= breakpoints.md && width < breakpoints.lg;
  const isXLarge = width >= breakpoints.lg;
  
  // Utilitários responsivos
  const getResponsiveValue = <T>(values: {
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    default: T;
  }): T => {
    if (isXLarge && values.xl !== undefined) return values.xl;
    if (isLarge && values.lg !== undefined) return values.lg;
    if (isMedium && values.md !== undefined) return values.md;
    if (isSmall && values.sm !== undefined) return values.sm;
    return values.default;
  };
  
  // Espaçamentos responsivos
  const getResponsiveSpacing = (base: number) => {
    return getResponsiveValue({
      // Ajustes menos agressivos para evitar "zoom" visual em alguns dispositivos
      sm: Math.max(base * 0.85, base - 6),  // levemente menor em telas pequenas
      md: base,                               // Valor base para médio
      lg: Math.min(base * 1.12, base + 8),    // ligeiramente maior em telas grandes
      xl: Math.min(base * 1.22, base + 14),   // tamanho controlado em telas extra grandes
      default: base,
    });
  };
  
  // Fonte responsiva
  const getResponsiveFontSize = (base: number) => {
    return getResponsiveValue({
      // Font scaling suavizada para evitar que títulos aumentem/desapareçam entre dispositivos
      sm: Math.max(base * 0.95, 12),
      md: base,
      lg: Math.min(base * 1.06, base + 2),
      xl: Math.min(base * 1.12, base + 4),
      default: base,
    });
  };
  
  // Grid columns responsivo
  const getGridColumns = () => {
    return getResponsiveValue({
      sm: 1,    // 1 coluna em telas pequenas
      md: 2,    // 2 colunas em telas médias
      lg: 3,    // 3 colunas em telas grandes
      xl: 4,    // 4 colunas em telas extra grandes
      default: 2,
    });
  };
  
  return {
    // Informações da tela
    width,
    height,
    
    // Breakpoints
    isSmall,
    isExtraSmall,
    isMedium,
    isLarge,
    isXLarge,
    
    // Utilitários
    getResponsiveValue,
    getResponsiveSpacing,
    getResponsiveFontSize,
    getGridColumns,
    
    // Predefinidos comuns
    padding: getResponsiveSpacing(24),      // Padding principal
    margin: getResponsiveSpacing(16),       // Margin principal
    fontSize: {
      xs: getResponsiveFontSize(12),
      sm: getResponsiveFontSize(14),
      base: getResponsiveFontSize(16),
      lg: getResponsiveFontSize(18),
      xl: getResponsiveFontSize(20),
      '2xl': getResponsiveFontSize(24),
      '3xl': getResponsiveFontSize(30),
      '4xl': getResponsiveFontSize(36),
    },
  };
};