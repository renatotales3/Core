import { colors } from './colors';
import { spacing, borderRadius, fontSize, fontWeight, breakpoints } from './tokens';

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  breakpoints,
};

export type Theme = typeof theme;