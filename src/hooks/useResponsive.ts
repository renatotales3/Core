import { Dimensions } from 'react-native';
import { breakpoints } from '../design-system/tokens';

/**
 * Hook para responsividade baseado em breakpoints
 */
export const useResponsive = () => {
  const { width, height } = Dimensions.get('window');
  
  // Determinar o breakpoint atual
  const isSmall = width < breakpoints.sm;
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
      sm: base * 0.75,  // 25% menor em telas pequenas
      md: base,         // Valor base para médio
      lg: base * 1.25,  // 25% maior em telas grandes
      xl: base * 1.5,   // 50% maior em telas extra grandes
      default: base,
    });
  };
  
  // Fonte responsiva
  const getResponsiveFontSize = (base: number) => {
    return getResponsiveValue({
      sm: Math.max(base * 0.9, 12),  // No mínimo 12px
      md: base,
      lg: base * 1.1,
      xl: base * 1.2,
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